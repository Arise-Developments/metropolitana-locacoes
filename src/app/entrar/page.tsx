import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, User } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Área do cliente", robots: { index: false } };

/**
 * O ícone de usuário do modelo leva para cá.
 * A área logada depende de um back-end (reservas, documentos, pagamentos) — por enquanto
 * a página explica isso e direciona o cliente para o atendimento.
 */
export default function EntrarPage() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-navy-900 px-4 py-16">
      <div className="w-full max-w-md border border-white/10 bg-navy-800 p-8 text-white sm:p-10">
        <span className="grid size-12 place-items-center border-2 border-sky-400"><User className="size-6" strokeWidth={1.6} /></span>
        <h1 className="font-display mt-6 text-3xl font-bold">Área do cliente</h1>
        <p className="mt-3 text-white/70">
          Em breve você poderá acompanhar reservas, contratos e pagamentos por aqui. Enquanto isso, nossa equipe resolve
          tudo pelo WhatsApp.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <a href={whatsappLink("Olá! Gostaria de consultar minha reserva.")} target="_blank" rel="noopener noreferrer" className="btn-wa">
            <MessageCircle className="size-4" /> Consultar minha reserva
          </a>
          <Link href="/reserva" className="btn-outline-light">Fazer nova reserva</Link>
        </div>
      </div>
    </section>
  );
}
