import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { CartView } from "@/components/views/cart-view";
import { buildMetadata, keywords } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shopping Cart | LUMES BD",
  description: "Review selected jerseys, sizes, prices, and checkout details in your LUMES BD shopping cart.",
  path: "/cart",
  noIndex: true,
  pageKeywords: keywords([
    "LUMES BD cart",
    "jersey shopping cart",
    "checkout jerseys Bangladesh",
    "football jersey order",
    "cart review",
  ]),
});

export default function CartPage() {
  return (
    <Container className="py-8 sm:py-12">
      <CartView />
    </Container>
  );
}
