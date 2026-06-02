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
    <section className="bg-[#060c24] py-4">
      <Container>
        <div className="grid overflow-hidden rounded-2xl border border-cyan-400/16 bg-[#08112d] shadow-[0_26px_80px_-58px_rgba(1,197,250,0.52)] sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="flex min-h-28 items-center gap-5 border-cyan-400/12 px-6 py-5 sm:px-8 lg:border-l first:lg:border-l-0"
              >
                <Icon className="h-12 w-12 shrink-0 text-[#01aeea]" strokeWidth={1.8} />
                <div>
                  <h2 className="text-base font-bold text-white">{service.title}</h2>
                  <p className="mt-1.5 max-w-40 text-sm leading-6 text-cyan-50/68">{service.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
