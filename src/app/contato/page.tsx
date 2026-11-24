import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { LocationSection } from "@/components/LocationSection";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Metropolitana Locações pelo WhatsApp ou visite nossa loja.",
};

export default function ContatoPage() {
  return (
    <>
      <PageHero eyebrow="Contato" title="Fale com a gente." text="Reservas, planos mensais para você ou sua empresa, ou qualquer dúvida: respondemos pelo WhatsApp." />
      <section className="py-14 lg:py-20">
        <div className="container-x max-w-3xl">
          <ContactForm />
        </div>
      </section>
      <LocationSection />
    </>
  );
}
