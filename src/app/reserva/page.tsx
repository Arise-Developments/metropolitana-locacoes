import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { BookingWizard } from "@/components/BookingWizard";

export const metadata: Metadata = {
  title: "Simule sua locação",
  description: "Orçamento online em 2 minutos — sem cadastro, sem compromisso. Locação por diária ou mensal.",
};

export default function ReservaPage() {
  return (
    <>
      <div className="print:hidden">
        <PageHero eyebrow="Simulador" title="Simule sua locação" text="Orçamento online em 2 minutos — sem cadastro, sem compromisso." />
      </div>
      <Suspense fallback={<div className="container-x py-16 text-slate-500">Carregando…</div>}>
        <BookingWizard />
      </Suspense>
    </>
  );
}
