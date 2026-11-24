import { site, type ExtraId } from "@/config/site";
import type { Car } from "@/data/cars";

const DAY_MS = 24 * 60 * 60 * 1000;

export const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Diárias cobradas: cada 24h iniciadas conta como uma diária (mínimo 1). */
export function countDays(pickup: Date, dropoff: Date) {
  const diff = dropoff.getTime() - pickup.getTime();
  if (!Number.isFinite(diff) || diff <= 0) return 0;
  return Math.max(1, Math.ceil(diff / DAY_MS));
}

export function discountFor(days: number) {
  if (days >= 30) return { rate: site.pricing.monthlyDiscount, label: "Plano mensal" };
  if (days >= 7) return { rate: site.pricing.weeklyDiscount, label: "Plano semanal" };
  return { rate: 0, label: "" };
}

export type Quote = {
  days: number;
  base: number;
  discount: number;
  discountLabel: string;
  extras: { id: ExtraId; name: string; total: number }[];
  delivery: number;
  total: number;
};

export function quote(car: Car, days: number, extraIds: ExtraId[], delivery: boolean): Quote {
  const base = car.dailyRate * days;
  const d = discountFor(days);
  const discount = base * d.rate;
  const extras = site.extras
    .filter((e) => extraIds.includes(e.id))
    .map((e) => ({ id: e.id, name: e.name, total: e.pricePerDay * days }));
  const deliveryFee = delivery ? site.pricing.deliveryFee : 0;
  const total = base - discount + extras.reduce((s, e) => s + e.total, 0) + deliveryFee;
  return { days, base, discount, discountLabel: d.label, extras, delivery: deliveryFee, total };
}

/** Preço por diária já com o desconto do período aplicado. */
export const effectiveDaily = (car: Car, days: number) => car.dailyRate * (1 - discountFor(days).rate);
