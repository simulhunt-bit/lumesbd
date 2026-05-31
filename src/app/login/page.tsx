import type { Metadata } from "next";
import { LoginPanel } from "@/components/auth/login-panel";
import { Container } from "@/components/shared/container";
import { buildMetadata, keywords } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Login | LUMES BD",
  description: "Sign in to your LUMES BD account to manage orders, saved jerseys, addresses, and shopping details.",
  path: "/login",
  noIndex: true,
  pageKeywords: keywords([
    "LUMES BD login",
    "customer account",
    "jersey order account",
    "manage LUMES orders",
    "Bangladesh fashion account",
  ]),
});

export default function LoginPage() {
  return (
    <Container className="py-12">
      <LoginPanel />
    </Container>
  );
}
