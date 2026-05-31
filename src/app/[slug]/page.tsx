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
    body: "Follow your order from confirmation to pickup and completion with the same order or tracking ID we sent by email.",
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
    <section className={`${slug === "track-order" ? "bg-[#060c24] text-white" : "bg-[#f8fbff] text-zinc-950"} py-16 sm:py-24`}>
      <Container>
        <div className={`mx-auto ${slug === "track-order" ? "max-w-5xl" : "max-w-3xl"}`}>
          <p className={`text-sm font-bold uppercase tracking-[0.28em] ${slug === "track-order" ? "text-cyan-200" : "text-[#01aeea]"}`}>LUMES BD</p>
          <h1 className={`mt-4 text-4xl font-bold tracking-normal sm:text-5xl ${slug === "track-order" ? "text-white" : "text-zinc-950"}`}>{page.title}</h1>
          <p className={`mt-5 text-lg leading-8 ${slug === "track-order" ? "max-w-3xl text-cyan-50/72" : "text-zinc-600"}`}>{page.body}</p>
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
