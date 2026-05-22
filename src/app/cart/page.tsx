import { Container } from "@/components/shared/container";
import { CartView } from "@/components/views/cart-view";

export default function CartPage() {
  return (
    <Container className="py-12">
      <CartView />
    </Container>
  );
}
