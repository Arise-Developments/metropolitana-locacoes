import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { FleetBrowser } from "@/components/FleetBrowser";

export const metadata: Metadata = {
  title: "Frota",
  description: "Conheça a frota da Metropolitana Locações: econômicos, sedans, SUVs, executivos e utilitários.",
};

export default function FrotaPage() {
  return (
    <>
      <PageHero eyebrow="Nossa frota" title="Encontre o carro certo para o seu trajeto." text="Filtre por categoria, câmbio e preço. Os valores são por diária e diminuem em planos semanais e mensais." />
      <Suspense fallback={<div className="container-x py-16 text-slate-500">Carregando frota…</div>}>
        <FleetBrowser />
      </Suspense>
    </>
  );
}
