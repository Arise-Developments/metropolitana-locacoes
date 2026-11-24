import Link from "next/link";
import { CarArt } from "@/components/CarArt";

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-navy-900 px-4 py-16 text-center text-white">
      <div className="max-w-md">
        <CarArt body="hatch" color="#7cb8f7" className="mx-auto w-56 opacity-90" />
        <p className="eyebrow mt-8 text-sky-400">Erro 404</p>
        <h1 className="font-display mt-3 text-4xl font-extrabold">Essa rua não tem saída.</h1>
        <p className="mt-3 text-white/70">A página que você procurou não existe ou mudou de endereço.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">Voltar ao início</Link>
          <Link href="/frota" className="btn-outline-light">Ver frota</Link>
        </div>
      </div>
    </section>
  );
}
