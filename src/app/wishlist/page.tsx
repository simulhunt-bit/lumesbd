import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { WishlistView } from "@/components/views/wishlist-view";
import { buildMetadata, keywords } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Wishlist | LUMES BD",
  description: "Save favorite LUMES BD jerseys and fanwear items to compare sizes, prices, and future purchases.",
  path: "/wishlist",
  noIndex: true,
  pageKeywords: keywords([
    "LUMES BD wishlist",
    "saved jerseys",
    "favorite football jerseys",
    "jersey wishlist Bangladesh",
    "fanwear wishlist",
  ]),
});

export default function WishlistPage() {
  return (
    <Container className="py-8 sm:py-12">
      <WishlistView />
    </Container>
  );
}
