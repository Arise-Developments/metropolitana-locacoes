import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { BookingWizard } from "@/components/BookingWizard";

export const metadata: Metadata = {
  title: "Reserva",
  description: "Simule e solicite sua reserva de carro em poucos passos.",
};

export default function ReservaPage() {
  return (
    <>
      <PageHero eyebrow="Reserva" title="Monte sua locação em 4 passos." text="Veja o valor estimado na hora e envie o pedido direto para o nosso WhatsApp." />
      <Suspense fallback={<div className="container-x py-16 text-slate-500">Carregando…</div>}>
        <BookingWizard />
      </Suspense>
    </>
  );
}
