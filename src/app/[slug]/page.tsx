import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/shared/container";
import { TrackOrderView } from "@/components/views/track-order-view";
import { buildMetadata, keywords } from "@/lib/seo";

type InfoPageContent = {
  title: string;
  description: string;
  body: string;
  pageKeywords: string[];
  sections?: Array<{ title: string; body: string }>;
};

const pages: Record<string, InfoPageContent> = {
  "track-order": {
    title: "Track Order",
    description: "Track your LUMES BD jersey order online with the order or tracking ID sent after confirmation.",
    body: "Follow your premium jersey order from confirmation to pickup and completion with the same order or tracking ID we sent by email.",
    pageKeywords: ["track LUMES BD order", "jersey order tracking Bangladesh", "track jersey delivery BD", "LUMES BD delivery status"],
  },
  about: {
    title: "About Us",
    description: "Learn about LUMES BD, a Bangladesh online shop for premium jerseys, fanwear, and modern sports fashion.",
    body: "LUMES BD curates premium jerseys, original copy football kits, flag fanwear, and modern sports fashion for men and women, with quality, comfort, and Bangladesh-wide delivery at the center of the store.",
    pageKeywords: ["about LUMES BD", "Bangladesh jersey brand", "premium jersey shop Bangladesh", "online fanwear store BD"],
  },
  contact: {
    title: "Contact Us",
    description: "Contact LUMES BD for jersey sizing, delivery, payment, product, or order support in Bangladesh.",
    body: "Need help with jersey sizing, delivery, payment, product availability, or an order? Reach out through our social channels or support inbox and the LUMES BD team will help.",
    pageKeywords: ["contact LUMES BD", "jersey support Bangladesh", "football jersey order help BD", "LUMES BD customer support"],
  },
  "how-to-order": {
    title: "How to Order",
    description: "Learn how to order football jerseys from LUMES BD online with size, color, cart, and delivery details.",
    body: "Choose your football jersey, select size and color, add it to cart, and complete checkout with your Bangladesh delivery information.",
    pageKeywords: ["how to order jersey online BD", "buy jersey from LUMES BD", "football jersey checkout Bangladesh", "order jersey online Bangladesh"],
  },
  "shipping-policy": {
    title: "Shipping Policy",
    description: "Read LUMES BD shipping details for football jersey delivery across Dhaka and Bangladesh.",
    body: "We deliver premium jerseys across Bangladesh. Delivery timing and charge can vary by location, courier availability, and order confirmation time.",
    pageKeywords: ["jersey delivery Bangladesh", "LUMES BD shipping", "football jersey delivery Dhaka", "courier delivery jersey BD"],
  },
  "return-refund": {
    title: "Return & Refund",
    description: "Review LUMES BD return and refund rules for unused football jerseys and eligible fashion items.",
    body: "Eligible jersey and fashion items can be returned within 7 days when they are unused, unworn, and in original condition.",
    pageKeywords: ["LUMES BD return policy", "jersey refund Bangladesh", "football jersey exchange BD", "online jersey return policy"],
    sections: [
      {
        title: "Customized jerseys",
        body: "Jerseys with a custom name, number, or personalized printing are made to order and cannot be returned or refunded unless the product arrives damaged, defective, or the customization does not match the details submitted by the customer.",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    description: "Read the LUMES BD store terms for jersey orders, payments, delivery, returns, and customer details.",
    body: "By shopping with LUMES BD, customers agree to provide accurate order details and follow the store policies for delivery, returns, and payments.",
    pageKeywords: ["LUMES BD terms", "jersey store terms Bangladesh", "online shop terms BD", "football jersey order terms"],
  },
  privacy: {
    title: "Privacy Policy",
    description: "See how LUMES BD uses customer information for jersey orders, support, delivery, and shopping improvements.",
    body: "Customer information is used to process jersey orders, provide support, coordinate delivery, and improve the shopping experience.",
    pageKeywords: ["LUMES BD privacy", "Bangladesh ecommerce privacy", "jersey order data policy", "online shop privacy BD"],
  },
  faq: {
    title: "FAQ",
    description: "Find answers about LUMES BD jersey sizing, prices, delivery, ordering, returns, and product availability.",
    body: "For quick help, contact support with your product name, size question, order number, delivery area, or preferred jersey style.",
    pageKeywords: ["LUMES BD FAQ", "jersey size Bangladesh", "football jersey questions BD", "jersey delivery FAQ"],
  },
};

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
    pageKeywords: keywords(page.pageKeywords),
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
          {page.sections?.length ? (
            <div className="mt-8 space-y-4">
              {page.sections.map((section) => (
                <section key={section.title} className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_24px_70px_-54px_rgba(24,24,27,0.28)] sm:p-6">
                  <h2 className="text-2xl font-semibold text-zinc-950">{section.title}</h2>
                  <p className="mt-3 text-base leading-8 text-zinc-600">{section.body}</p>
                </section>
              ))}
            </div>
          ) : null}
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
