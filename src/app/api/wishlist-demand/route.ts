import { NextResponse } from "next/server";
import { sendWishlistDemandEmail } from "@/lib/email";
import { getProducts } from "@/lib/catalog";
import { isPurchasableSize } from "@/lib/product-availability";

const DEMAND_MILESTONES = [10, 50, 150, 200] as const;
const MAX_BODY_BYTES = 10_000;

type DemandUser = {
  displayName: string;
  email: string;
  addedAt: string;
};

type DemandRecord = {
  productName: string;
  size: string;
  users?: Record<string, DemandUser>;
  milestonesSent?: Record<string, boolean>;
};

const encodeKey = (value: string) => Buffer.from(value, "utf8").toString("base64url");

const databaseUrl = () => process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL?.replace(/\/$/, "");

const verifyFirebaseToken = async (idToken: string) => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("Firebase API key is not configured.");
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );
  const result = (await response.json()) as {
    users?: Array<{ localId: string; email?: string; displayName?: string }>;
    error?: { message?: string };
  };

  if (!response.ok || !result.users?.[0]) {
    throw new Error(result.error?.message ?? "Invalid wishlist demand session.");
  }

  return result.users[0];
};

const firebaseRest = async <T>(path: string, idToken: string, init?: RequestInit) => {
  const baseUrl = databaseUrl();
  if (!baseUrl) {
    throw new Error("Firebase Realtime Database URL is not configured.");
  }

  const response = await fetch(`${baseUrl}/${path}.json?auth=${encodeURIComponent(idToken)}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error("Could not update wishlist demand.");
  }

  return (await response.json()) as T;
};

const readJsonBody = async (req: Request) => {
  const body = await req.text();
  if (body.length > MAX_BODY_BYTES) {
    throw new Error("Wishlist demand request is too large.");
  }

  return JSON.parse(body) as {
    idToken?: string;
    productSlug?: string;
    size?: string;
    displayName?: string;
    email?: string;
  };
};

export async function POST(req: Request) {
  try {
    const body = await readJsonBody(req);
    const idToken = body.idToken?.trim();
    const productSlug = body.productSlug?.trim();
    const size = body.size?.trim();

    if (!idToken || !productSlug || !size) {
      return NextResponse.json({ error: "Product, size, and login session are required." }, { status: 400 });
    }

    const product = getProducts().find((entry) => entry.slug === productSlug);
    if (!product || !product.sizes.includes(size as (typeof product.sizes)[number])) {
      return NextResponse.json({ error: "Product size variation was not found." }, { status: 404 });
    }

    if (isPurchasableSize(product, size)) {
      return NextResponse.json({ tracked: false, reason: "Size is currently purchasable." });
    }

    const firebaseUser = await verifyFirebaseToken(idToken);
    const uid = firebaseUser.localId;
    const demandPath = `wishlistDemand/${encodeKey(product.slug)}/${encodeKey(size)}`;
    const user: DemandUser = {
      displayName: body.displayName?.trim() || firebaseUser.displayName || "LUMES Customer",
      email: body.email?.trim() || firebaseUser.email || "",
      addedAt: new Date().toISOString(),
    };

    await firebaseRest(`${demandPath}/users/${encodeKey(uid)}`, idToken, {
      method: "PUT",
      body: JSON.stringify(user),
    });
    await firebaseRest(`${demandPath}/productName`, idToken, {
      method: "PUT",
      body: JSON.stringify(product.name),
    });
    await firebaseRest(`${demandPath}/size`, idToken, {
      method: "PUT",
      body: JSON.stringify(size),
    });

    const demand = await firebaseRest<DemandRecord | null>(demandPath, idToken);
    const users = Object.values(demand?.users ?? {});
    const totalCount = users.length;
    const milestonesSent = demand?.milestonesSent ?? {};
    const milestone = DEMAND_MILESTONES.find(
      (entry) => totalCount >= entry && !milestonesSent[String(entry)],
    );

    if (milestone) {
      await sendWishlistDemandEmail({
        productName: product.name,
        size,
        totalCount,
        milestone,
        users,
      });
      await firebaseRest(`${demandPath}/milestonesSent/${milestone}`, idToken, {
        method: "PUT",
        body: JSON.stringify(true),
      });
    }

    return NextResponse.json({ tracked: true, totalCount, milestoneNotified: milestone ?? null });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not track wishlist demand." },
      { status: 400 },
    );
  }
}
