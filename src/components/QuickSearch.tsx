"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { categories } from "@/data/cars";
import { defaultPeriod, parseLocalInput } from "@/lib/dates";

export function QuickSearch() {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  // Datas padrão só no cliente, para não divergir do HTML gerado no servidor.
  useEffect(() => {
    const d = defaultPeriod();
    setPickup(d.pickup);
    setDropoff(d.dropoff);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = parseLocalInput(pickup);
    const d = parseLocalInput(dropoff);
    if (!p || !d) return setError("Informe as datas de retirada e devolução.");
    if (d <= p) return setError("A devolução precisa ser depois da retirada.");
    setError("");
    const qs = new URLSearchParams({ retirada: pickup, devolucao: dropoff });
    if (category) qs.set("categoria", category);
    router.push(`/reserva?${qs}`);
  }

  return (
    <form onSubmit={submit} className="border border-white/10 bg-navy-800/80 p-5 backdrop-blur sm:p-6" aria-label="Busca rápida">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
        <label className="block">
          <span className="eyebrow mb-2 block text-sky-300">Retirada</span>
          <input type="datetime-local" className="field-dark" value={pickup} onChange={(e) => setPickup(e.target.value)} required />
        </label>
        <label className="block">
          <span className="eyebrow mb-2 block text-sky-300">Devolução</span>
          <input type="datetime-local" className="field-dark" value={dropoff} min={pickup} onChange={(e) => setDropoff(e.target.value)} required />
        </label>
        <label className="block">
          <span className="eyebrow mb-2 block text-sky-300">Categoria</span>
          <select className="field-dark" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="" className="text-ink">Todas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="text-ink">{c.name}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn-primary h-[46px]">
          <Search className="size-4" /> Ver carros
        </button>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
    </form>
  );
}
