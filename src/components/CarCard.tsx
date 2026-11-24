import Link from "next/link";
import { ArrowRight, Briefcase, Cog, Users } from "lucide-react";
import { CarArt } from "./CarArt";
import { getCategory, type Car } from "@/data/cars";
import { brl } from "@/lib/pricing";

export function CarCard({ car }: { car: Car }) {
  return (
    <article className="group flex flex-col border border-mist-200 bg-white transition-shadow hover:shadow-xl hover:shadow-navy-900/5">
      <div className="relative bg-gradient-to-b from-mist-100 to-white px-6 pt-10 pb-4">
        <span className="eyebrow absolute top-4 left-4 bg-navy-900 px-2.5 py-1 text-[10px] text-sky-300">
          {getCategory(car.category).name}
        </span>
        <CarArt body={car.body} color={car.color} className="mx-auto w-full max-w-[280px] transition-transform duration-300 group-hover:-translate-y-1" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold text-navy-900">{car.name}</h3>
        <p className="text-sm text-slate-500">{car.similar}</p>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
          <li className="flex items-center gap-1.5"><Users className="size-3.5" />{car.seats} lugares</li>
          <li className="flex items-center gap-1.5"><Briefcase className="size-3.5" />{car.bags} malas</li>
          <li className="flex items-center gap-1.5"><Cog className="size-3.5" />{car.transmission === "automatico" ? "Automático" : "Manual"}</li>
        </ul>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-mist-100 pt-5">
          <div>
            <span className="block text-[11px] text-slate-500">a partir de</span>
            <span className="font-display text-2xl font-extrabold text-navy-900">{brl(car.dailyRate)}</span>
            <span className="text-xs text-slate-500">/dia</span>
          </div>
          <Link
            href={`/frota/${car.id}`}
            className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-sky-600 uppercase hover:text-navy-900"
          >
            Detalhes <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
