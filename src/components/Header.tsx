"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { site } from "@/config/site";

const nav = [
  { href: "/", label: "Início" },
  { href: "/frota", label: "Frota" },
  { href: "/#planos", label: "Planos" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-900/95 backdrop-blur">
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[13px] font-medium transition-colors ${
                isActive(item.href) ? "text-sky-400" : "text-white/75 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="eyebrow hidden border-l border-white/15 pl-5 text-white/60 xl:block">{site.tagline}</span>
          <Link href="/reserva" className="btn-primary hidden !px-5 !py-3 sm:inline-flex">
            Reservar
          </Link>
          <Link
            href="/entrar"
            aria-label="Área do cliente"
            className="grid size-11 place-items-center border border-white/25 text-white transition-colors hover:border-sky-400 hover:text-sky-400"
          >
            <User className="size-5" strokeWidth={1.6} />
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center text-white lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="h-[calc(100dvh-5rem)] border-t border-white/10 bg-navy-900 lg:hidden" aria-label="Menu móvel">
          <ul className="container-x flex flex-col py-6">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-display block border-b border-white/10 py-4 text-2xl font-bold text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-6">
              <Link href="/reserva" className="btn-primary w-full">
                Reservar agora
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
