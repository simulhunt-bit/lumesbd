import { Container } from "@/components/shared/container";
import { WishlistView } from "@/components/views/wishlist-view";

export default function WishlistPage() {
  return (
    <Container className="py-8 sm:py-12">
      <WishlistView />
    </Container>
  );
}
