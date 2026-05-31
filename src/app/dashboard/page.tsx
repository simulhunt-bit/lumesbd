import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Container } from "@/components/shared/container";
import { buildMetadata, keywords } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Dashboard | LUMES BD",
  description: "Manage your LUMES BD profile, delivery addresses, and jersey order information from one dashboard.",
  path: "/dashboard",
  noIndex: true,
  pageKeywords: keywords([
    "LUMES BD dashboard",
    "customer dashboard",
    "manage jersey orders",
    "delivery address Bangladesh",
    "fashion store account",
  ]),
});

export default function DashboardPage() {
  return (
    <Container className="py-12">
      <DashboardShell />
    </Container>
  );
}
