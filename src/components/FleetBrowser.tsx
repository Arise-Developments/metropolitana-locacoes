"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CarCard } from "./CarCard";
import { cars, categories, type CategoryId } from "@/data/cars";
import { brl } from "@/lib/pricing";

const sorts = {
  "preco-asc": { label: "Menor preço", fn: (a: number, b: number) => a - b },
  "preco-desc": { label: "Maior preço", fn: (a: number, b: number) => b - a },
} as const;
type SortKey = keyof typeof sorts;

const maxRate = Math.max(...cars.map((c) => c.dailyRate));

export function FleetBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // Filtros vivem na URL: dá para compartilhar o link e o "voltar" do navegador funciona.
  const q = params.get("q") ?? "";
  const category = (params.get("categoria") ?? "") as CategoryId | "";
  const transmission = params.get("cambio") ?? "";
  const max = Number(params.get("max")) || maxRate;
  const sort = (params.get("ordem") as SortKey) in sorts ? (params.get("ordem") as SortKey) : "preco-asc";

  function set(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next}`, { scroll: false });
  }

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return cars
      .filter((c) => !category || c.category === category)
      .filter((c) => !transmission || c.transmission === transmission)
      .filter((c) => c.dailyRate <= max)
      .filter((c) => !term || `${c.name} ${c.similar} ${c.features.join(" ")}`.toLowerCase().includes(term))
      .sort((a, b) => sorts[sort].fn(a.dailyRate, b.dailyRate));
  }, [q, category, transmission, max, sort]);

  const hasFilters = q || category || transmission || max < maxRate;

  return (
    <div className="container-x grid gap-10 py-12 lg:grid-cols-[280px_1fr] lg:py-16">
      <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start" aria-label="Filtros">
        <div className="flex items-center justify-between">
          <h2 className="eyebrow flex items-center gap-2 text-navy-900"><SlidersHorizontal className="size-4" /> Filtros</h2>
          {hasFilters && (
            <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-navy-900">
              <X className="size-3.5" /> Limpar
            </button>
          )}
        </div>

        <label className="relative block">
          <span className="sr-only">Buscar modelo</span>
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
          <input type="search" className="field pl-10" placeholder="Buscar modelo ou item" defaultValue={q} onChange={(e) => set("q", e.target.value)} />
        </label>

        <fieldset>
          <legend className="label">Categoria</legend>
          <div className="flex flex-wrap gap-2">
            {[{ id: "", name: "Todas" }, ...categories].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => set("categoria", c.id)}
                aria-pressed={category === c.id}
                className={`border px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === c.id ? "border-navy-900 bg-navy-900 text-white" : "border-mist-200 bg-white text-slate-600 hover:border-navy-900"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label">Câmbio</legend>
          <div className="grid grid-cols-3 border border-mist-200 bg-white text-xs">
            {[["", "Todos"], ["manual", "Manual"], ["automatico", "Automático"]].map(([v, l]) => (
              <button key={v} type="button" onClick={() => set("cambio", v)} aria-pressed={transmission === v}
                className={`py-2.5 font-medium ${transmission === v ? "bg-navy-900 text-white" : "text-slate-600 hover:bg-mist-100"}`}>
                {l}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="label flex justify-between">Diária máxima <span className="font-normal text-slate-500">{brl(max)}</span></span>
          <input type="range" min={100} max={maxRate} step={10} value={max} onChange={(e) => set("max", e.target.value === String(maxRate) ? "" : e.target.value)} className="w-full accent-sky-600" />
        </label>
      </aside>

      <section aria-live="polite">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-600"><strong className="text-navy-900">{results.length}</strong> {results.length === 1 ? "opção encontrada" : "opções encontradas"}</p>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Ordenar por
            <select className="field !w-auto !py-2" value={sort} onChange={(e) => set("ordem", e.target.value)}>
              {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </label>
        </div>

        {results.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        ) : (
          <div className="border border-dashed border-mist-200 bg-white p-12 text-center">
            <p className="font-display text-xl font-bold text-navy-900">Nenhum carro com esses filtros.</p>
            <p className="mt-2 text-sm text-slate-600">Tente ampliar a faixa de preço ou trocar a categoria.</p>
            <button type="button" onClick={() => router.replace(pathname)} className="btn-dark mt-6">Limpar filtros</button>
          </div>
        )}
      </section>
    </div>
  );
}
