import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/shared/container";
import { TrackOrderView } from "@/components/views/track-order-view";
import { buildMetadata } from "@/lib/seo";

const pages = {
  "track-order": {
    title: "Track Order",
    description: "Check the latest status of your LUMES BD order.",
    body: "After your order is picked up, we will email your courier tracking ID. Use that tracking ID with our support team to check the latest delivery status.",
  },
  about: {
    title: "About Us",
    description: "Learn more about LUMES BD.",
    body: "LUMES BD curates premium jerseys and modern fashion wear for men and women, with quality, comfort, and Bangladesh-wide delivery at the center of the store.",
  },
  contact: {
    title: "Contact Us",
    description: "Get support from LUMES BD.",
    body: "Need help with sizing, delivery, or an order? Reach out through our social channels or support inbox and the LUMES BD team will help.",
  },
  "how-to-order": {
    title: "How to Order",
    description: "How to place an order at LUMES BD.",
    body: "Choose your product, select size and color, add it to cart, and complete checkout with your delivery information.",
  },
  "shipping-policy": {
    title: "Shipping Policy",
    description: "LUMES BD shipping information.",
    body: "We deliver across Bangladesh. Delivery timing and charge can vary by location and courier availability.",
  },
  "return-refund": {
    title: "Return & Refund",
    description: "LUMES BD return and refund policy.",
    body: "Eligible items can be returned within 7 days when they are unused, unworn, and in original condition.",
  },
  terms: {
    title: "Terms & Conditions",
    description: "LUMES BD store terms.",
    body: "By shopping with LUMES BD, customers agree to provide accurate order details and follow the store policies for delivery, returns, and payments.",
  },
  privacy: {
    title: "Privacy Policy",
    description: "How LUMES BD handles customer information.",
    body: "Customer information is used to process orders, provide support, and improve the shopping experience.",
  },
  faq: {
    title: "FAQ",
    description: "Frequently asked LUMES BD questions.",
    body: "For quick help, contact support with your product name, size question, order number, or delivery area.",
  },
} satisfies Record<string, { title: string; description: string; body: string }>;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug as keyof typeof pages];

  if (!page) {
    return {};
  }

  return buildMetadata({
    title: `${page.title} | LUMES BD`,
    description: page.description,
    path: `/${slug}`,
  });
}

export default async function InfoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = pages[slug as keyof typeof pages];

  if (!page) {
    notFound();
  }

  return (
    <section className="bg-[#f8fbff] py-16 text-zinc-950 sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#01aeea]">LUMES BD</p>
          <h1 className="mt-4 text-4xl font-bold tracking-normal text-zinc-950 sm:text-5xl">{page.title}</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-600">{page.body}</p>
          {slug === "track-order" && (
            <Suspense fallback={<p className="mt-10 text-sm text-zinc-600">Loading tracking tools...</p>}>
              <TrackOrderView />
            </Suspense>
          )}
        </div>
      </Container>
    </section>
  );
}
