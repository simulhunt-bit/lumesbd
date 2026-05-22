import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Container } from "@/components/shared/container";

export default function DashboardPage() {
  return (
    <Container className="py-12">
      <DashboardShell />
    </Container>
  );
}
