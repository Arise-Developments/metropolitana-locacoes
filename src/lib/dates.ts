const pad = (n: number) => String(n).padStart(2, "0");

/** Formato aceito por <input type="datetime-local"> (horário local). */
export function toLocalInput(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function parseLocalInput(v: string | null | undefined) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Retirada amanhã às 10h, devolução 3 dias depois. */
export function defaultPeriod() {
  const pickup = new Date();
  pickup.setDate(pickup.getDate() + 1);
  pickup.setHours(10, 0, 0, 0);
  const dropoff = new Date(pickup);
  dropoff.setDate(dropoff.getDate() + 3);
  return { pickup: toLocalInput(pickup), dropoff: toLocalInput(dropoff) };
}

export const formatDateTime = (d: Date) =>
  d.toLocaleString("pt-BR", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
