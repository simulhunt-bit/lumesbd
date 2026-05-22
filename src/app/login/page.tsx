import { LoginPanel } from "@/components/auth/login-panel";
import { Container } from "@/components/shared/container";

export default function LoginPage() {
  return (
    <Container className="py-12">
      <LoginPanel />
    </Container>
  );
}
