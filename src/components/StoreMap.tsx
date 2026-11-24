"use client";

import dynamic from "next/dynamic";

// Leaflet acessa `window`, então só é carregado no navegador.
const StoreMapInner = dynamic(() => import("./StoreMapInner"), {
  ssr: false,
  loading: () => <div className="grid h-full w-full place-items-center bg-mist-100 text-sm text-slate-500">Carregando mapa…</div>,
});

export function StoreMap() {
  return <StoreMapInner />;
}
