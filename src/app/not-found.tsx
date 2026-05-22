import Link from "next/link";
import { Container } from "@/components/shared/container";

export default function NotFound() {
  return (
    <Container className="py-24">
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-600">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-zinc-950">Page not found</h1>
        <p className="mt-4 text-zinc-600">The page you requested is not available in this static export.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white">
          Back Home
        </Link>
      </div>
    </Container>
  );
}
