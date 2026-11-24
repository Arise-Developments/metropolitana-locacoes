import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { site } from "@/config/site";
import { categories } from "@/data/cars";

export function Footer() {
  const { contact, store } = site;
  return (
    <footer className="bg-navy-950 text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed">{site.description}</p>
        </div>

        <div>
          <h3 className="eyebrow mb-5 text-sky-400">Navegação</h3>
          <ul className="space-y-3 text-sm">
            <li><Link className="hover:text-white" href="/frota">Frota</Link></li>
            <li><Link className="hover:text-white" href="/reserva">Fazer reserva</Link></li>
            <li><Link className="hover:text-white" href="/#planos">Planos</Link></li>
            <li><Link className="hover:text-white" href="/#perguntas">Perguntas frequentes</Link></li>
            <li><Link className="hover:text-white" href="/contato">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-5 text-sky-400">Categorias</h3>
          <ul className="space-y-3 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link className="hover:text-white" href={`/frota?categoria=${c.id}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-5 text-sky-400">Atendimento</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sky-400" />
              <span>{store.address || "Endereço em breve"}</span>
            </li>
            {contact.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-sky-400" />
                <a className="hover:text-white" href={`tel:${contact.phone.replace(/\D/g, "")}`}>{contact.phone}</a>
              </li>
            )}
            {contact.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-sky-400" />
                <a className="hover:text-white" href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
            )}
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-sky-400" />
              <span>
                {contact.hours.map((h) => (
                  <span key={h.days} className="block">{h.days}: {h.time}</span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {site.name}. Todos os direitos reservados.</span>
          <span>Seu caminho começa com uma boa escolha.</span>
        </div>
      </div>
    </footer>
  );
}
