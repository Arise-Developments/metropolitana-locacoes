import { simulador as cfg, type Adicional, type KmMensal, type PlanoMensal, type ProtecaoSlug } from "@/config/simulador";
import type { Car } from "@/data/cars";

export const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const pad = (n: number) => String(n).padStart(2, "0");
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/* ==================================================================== */
/* PERÍODO                                                               */
/* ==================================================================== */

export type Periodo = {
  start: Date;
  end: Date;
  /** Diárias inteiras (diferença entre as datas). */
  days: number;
  weekendDays: number;
  weekdayDays: number;
  /** Fração de diária pela hora extra (0, 0.25, 0.5, 0.75 ou 1). */
  fraction: number;
  fractionLabel: string;
  season: string | null;
  seasonMult: number;
};

/**
 * Mesma regra do simulador de referência: as diárias são contadas pelas datas;
 * se a devolução for depois do horário da retirada, cobra-se uma fração da diária
 * conforme as horas extras. Devolver antes do horário não gera desconto.
 */
export function calcPeriodo(dateStart: string, timeStart: string, dateEnd: string, timeEnd: string): Periodo | null {
  if (!dateStart || !dateEnd) return null;
  const start = new Date(`${dateStart}T${timeStart || "09:00"}:00`);
  const end = new Date(`${dateEnd}T${timeEnd || "09:00"}:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return null;

  const d0 = new Date(`${dateStart}T00:00:00`);
  const d1 = new Date(`${dateEnd}T00:00:00`);
  // Mínimo de 1 diária (retirada e devolução no mesmo dia).
  const days = Math.max(1, Math.round((d1.getTime() - d0.getTime()) / 86_400_000));

  let fraction = 0;
  let fractionLabel = "";
  const extraMin = end.getHours() * 60 + end.getMinutes() - (start.getHours() * 60 + start.getMinutes());
  if (extraMin > 0 && d1 > d0) {
    const h = extraMin / 60;
    const f = [...cfg.fracoes].sort((a, b) => a.ateHoras - b.ateHoras).find((x) => h <= x.ateHoras);
    fraction = f ? f.pct / 100 : 1;
    fractionLabel = `+${Math.ceil(h)}h extra (${f ? `${f.pct}% da diária` : "diária completa"})`;
  }

  let weekendDays = 0;
  const cur = new Date(d0);
  for (let i = 0; i < days; i++) {
    const wd = cur.getDay();
    if (wd === 0 || wd === 6) weekendDays++;
    cur.setDate(cur.getDate() + 1);
  }

  const startIso = isoDate(start);
  const temp = cfg.temporadas.find((t) => t.inicio && t.fim && startIso >= t.inicio && startIso <= t.fim);
  const seasonMult = temp && temp.multiplicador > 0 ? temp.multiplicador : 1;

  return { start, end, days, weekendDays, weekdayDays: days - weekendDays, fraction, fractionLabel, season: temp?.nome ?? null, seasonMult };
}

export const seasonLabel = (p: Periodo) => p.season ?? "Temporada Normal";

/* ==================================================================== */
/* DIÁRIA                                                                */
/* ==================================================================== */

export function durationDiscount(days: number) {
  const tier = [...cfg.descontosDuracao].sort((a, b) => b.minDias - a.minDias).find((t) => days >= t.minDias);
  return tier ? { pct: tier.pct / 100, label: `${tier.pct}% de desconto` } : { pct: 0, label: "" };
}

/** Diária do carro já com temporada e desconto por duração (sem acréscimo de fim de semana). */
export const adjustedDaily = (car: Car, days: number, seasonMult = 1) =>
  car.dailyRate * seasonMult * (1 - durationDiscount(days).pct);

/** Mantido para a página do carro: diária com o desconto do período. */
export const effectiveDaily = (car: Car, days: number) => adjustedDaily(car, days);

export const kmIlimitadoPorDia = (car: Car) =>
  car.category === "executivo" ? cfg.km.ilimitadoPorDiaExecutivo : cfg.km.ilimitadoPorDia;

export const protecaoDiaria = (car: Car, slug: ProtecaoSlug) => cfg.protecaoDiaria[car.category][slug];

export type KmDiaria = "eco" | "ilimitado";

const addTotal = (list: Adicional[], ids: string[], units: number) =>
  list.filter((a) => ids.includes(a.id)).map((a) => ({ ...a, total: a.perDay ? a.price * units : a.price }));

export type QuoteDiaria = ReturnType<typeof quoteDiaria>;

export function quoteDiaria(
  car: Car,
  p: Periodo,
  km: KmDiaria,
  protecao: ProtecaoSlug,
  servicos: string[],
  itens: string[],
) {
  const dur = durationDiscount(p.days);
  const baseDaily = car.dailyRate * p.seasonMult * (1 - dur.pct);
  const weekdayTotal = baseDaily * p.weekdayDays;
  const weekendTotal = baseDaily * (1 + cfg.acrescimoFimDeSemana) * p.weekendDays;
  const weekendExtra = weekendTotal - baseDaily * p.weekendDays;
  const fractionTotal = baseDaily * p.fraction;
  const vehicleTotal = weekdayTotal + weekendTotal + fractionTotal;

  const kmDia = kmIlimitadoPorDia(car);
  const kmTotal = km === "ilimitado" ? kmDia * p.days : 0;

  const units = p.days + p.fraction;
  const protDaily = protecaoDiaria(car, protecao);
  const protTotal = protDaily * units;

  const servicosSel = addTotal(cfg.servicos, servicos, units);
  const itensSel = addTotal(cfg.itens, itens, units);
  const adicionaisTotal = [...servicosSel, ...itensSel].reduce((s, a) => s + a.total, 0);

  const subtotal = vehicleTotal + kmTotal + protTotal + adicionaisTotal;
  const taxaValor = subtotal * (cfg.taxaLocacaoPct / 100);
  const total = subtotal + taxaValor;

  return {
    dur, baseDaily, weekendExtra, fractionTotal, vehicleTotal,
    kmDia, kmTotal, protDaily, protTotal,
    servicosSel, itensSel, taxaPct: cfg.taxaLocacaoPct, taxaValor, total,
    mediaDiaria: total / p.days,
    custoPorKm: km === "eco" ? total / (cfg.km.economicaKmDia * p.days) : null,
    caucao: cfg.caucao[car.category],
  };
}

/* ==================================================================== */
/* MENSAL                                                                */
/* ==================================================================== */

export function monthlyRate(car: Car, plan?: PlanoMensal) {
  let base = car.monthlyRate && car.monthlyRate > 0 ? car.monthlyRate : Math.round(car.dailyRate * 30 * cfg.fatorMensal);
  if (plan && plan.discount > 0) base = Math.round(base * (1 - plan.discount));
  return base;
}

export const protecaoMensal = (car: Car, slug: ProtecaoSlug) => cfg.protecaoMensal[car.category][slug];

export type QuoteMensal = ReturnType<typeof quoteMensal>;

export function quoteMensal(car: Car, plan: PlanoMensal, km: KmMensal, protecao: ProtecaoSlug, servicos: string[], itens: string[]) {
  const vehicle = monthlyRate(car, plan);
  const prot = protecaoMensal(car, protecao);
  const servicosSel = addTotal(cfg.servicosMensais, servicos, 1);
  const itensSel = addTotal(cfg.itensMensais, itens, 1);
  const subtotal = vehicle + km.extra + prot + [...servicosSel, ...itensSel].reduce((s, a) => s + a.total, 0);
  const taxaValor = subtotal * (cfg.taxaLocacaoPct / 100);
  const mensalidade = subtotal + taxaValor;
  return {
    vehicle, kmExtra: km.extra, prot, servicosSel, itensSel,
    taxaPct: cfg.taxaLocacaoPct, taxaValor, mensalidade,
    totalContrato: mensalidade * plan.months,
    caucao: cfg.caucao[car.category],
  };
}
