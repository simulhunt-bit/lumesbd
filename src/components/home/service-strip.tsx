import { Headphones, Package, ShieldCheck, ThumbsUp } from "lucide-react";
import { Container } from "@/components/shared/container";

const services = [
  {
    title: "Premium Quality",
    text: "Carefully selected premium materials",
    icon: ShieldCheck,
  },
  {
    title: "Modern Design",
    text: "Trendy designs for every lifestyle",
    icon: ThumbsUp,
  },
  {
    title: "Easy Returns",
    text: "Hassle-free returns within 7 days",
    icon: Package,
  },
  {
    title: "24/7 Support",
    text: "We're here to help anytime",
    icon: Headphones,
  },
];

export function ServiceStrip() {
  return (
    <section className="bg-[#f8fbff] py-4">
      <Container>
        <div className="grid overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_20px_48px_-36px_rgba(24,24,27,0.55)] sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="flex min-h-28 items-center gap-5 border-zinc-100 px-6 py-5 sm:px-8 lg:border-l first:lg:border-l-0"
              >
                <Icon className="h-12 w-12 shrink-0 text-[#01aeea]" strokeWidth={1.8} />
                <div>
                  <h2 className="text-base font-bold text-zinc-950">{service.title}</h2>
                  <p className="mt-1.5 max-w-40 text-sm leading-6 text-zinc-600">{service.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
