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

const getSafeRedirectPath = (nextPath?: string) =>
  nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string; next?: string }>;
}) {
  const { expired, next } = await searchParams;

  return (
    <Container className="py-12">
      <LoginPanel redirectPath={getSafeRedirectPath(next)} sessionExpired={expired === "1"} />
    </Container>
  );
}
