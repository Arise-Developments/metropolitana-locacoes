import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Briefcase, Check, Cog, DoorOpen, Fuel, MessageCircle, Users } from "lucide-react";
import { CarArt } from "@/components/CarArt";
import { CarCard } from "@/components/CarCard";
import { cars, getCar, getCategory } from "@/data/cars";
import { brl, effectiveDaily } from "@/lib/pricing";
import { whatsappLink } from "@/lib/whatsapp";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return cars.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const car = getCar((await params).id);
  if (!car) return { title: "Carro não encontrado" };
  return { title: `${car.name} — ${car.similar}`, description: `Alugue ${car.similar} a partir de ${brl(car.dailyRate)} por dia.` };
}

export default async function CarPage({ params }: Props) {
  const car = getCar((await params).id);
  if (!car) notFound();

  const category = getCategory(car.category);
  const similar = cars.filter((c) => c.id !== car.id && c.category === car.category).concat(cars.filter((c) => c.category !== car.category)).slice(0, 3);
  const specs = [
    { icon: Users, label: "Lugares", value: car.seats },
    { icon: Briefcase, label: "Malas", value: car.bags },
    { icon: DoorOpen, label: "Portas", value: car.doors },
    { icon: Cog, label: "Câmbio", value: car.transmission === "automatico" ? "Automático" : "Manual" },
    { icon: Fuel, label: "Combustível", value: car.fuel },
  ];
  const plans = [
    { label: "1 a 2 diárias", days: 1 },
    { label: "3 a 6 diárias", days: 3 },
    { label: "7 a 14 diárias", days: 7 },
    { label: "15 a 29 diárias", days: 15 },
    { label: "30 diárias ou mais", days: 30 },
  ];

  return (
    <>
      <section className="bg-navy-900 pb-16">
        <div className="container-x pt-8">
          <Link href="/frota" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="size-4" /> Voltar para a frota
          </Link>
        </div>
        <div className="container-x mt-8 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-sky-400">{category.name}</p>
            <h1 className="font-display mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{car.name}</h1>
            <p className="mt-2 text-lg text-white/70">{car.similar}</p>
            <p className="mt-4 max-w-md text-sm text-white/50">
              O modelo exato pode variar dentro da categoria, mantendo as mesmas características e o mesmo valor.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_center,rgba(124,184,247,0.25),transparent_70%)]" />
            <CarArt body={car.body} color={car.color} title={car.similar} className="relative w-full" />
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-12">
            <div>
              <h2 className="eyebrow text-sky-600">Ficha técnica</h2>
              <dl className="mt-5 grid grid-cols-2 gap-px border border-mist-200 bg-mist-200 sm:grid-cols-5">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white p-5">
                    <Icon className="size-5 text-sky-600" strokeWidth={1.6} />
                    <dt className="mt-3 text-xs text-slate-500">{label}</dt>
                    <dd className="font-semibold text-navy-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h2 className="eyebrow text-sky-600">Itens de série</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {["Ar-condicionado", ...car.features.filter((f) => f !== "Ar-condicionado"), "Higienização completa", "Assistência durante a locação"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-700"><Check className="size-4 text-sky-600" />{f}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="h-fit border border-mist-200 bg-white p-7 lg:sticky lg:top-28">
            <h2 className="eyebrow text-sky-600">Valores</h2>
            <ul className="mt-5 divide-y divide-mist-100">
              {plans.map((p) => (
                <li key={p.label} className="flex items-baseline justify-between py-3">
                  <span className="text-sm text-slate-600">{p.label}</span>
                  <span>
                    <strong className="font-display text-xl text-navy-900">{brl(effectiveDaily(car, p.days))}</strong>
                    <span className="text-xs text-slate-500">/dia</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href={`/reserva?carro=${car.id}`} className="btn-primary mt-6 w-full">
              Reservar este carro <ArrowRight className="size-4" />
            </Link>
            <a
              href={whatsappLink(`Olá! Tenho interesse no ${car.name} (${car.similar}). Pode me passar a disponibilidade?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa mt-3 w-full"
            >
              <MessageCircle className="size-4" /> Tirar dúvidas
            </a>
          </aside>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-x">
          <h2 className="font-display text-2xl font-bold text-navy-900">Você também pode gostar</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((c) => <CarCard key={c.id} car={c} />)}
          </div>
        </div>
      </section>
    </>
  );
}
