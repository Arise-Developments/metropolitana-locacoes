import { Clock, ExternalLink, MapPin, MessageCircle } from "lucide-react";
import { StoreMap } from "./StoreMap";
import { site } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";

export function LocationSection() {
  const { store, contact } = site;
  const mapsUrl = store.location.configured
    ? `https://www.google.com/maps/dir/?api=1&destination=${store.location.lat},${store.location.lng}`
    : null;

  return (
    <section id="localizacao" className="bg-mist-100 py-20 lg:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div className="border-l-2 border-sky-500 pl-6 lg:pl-8">
          <p className="eyebrow text-sky-600">Encontre a Metropolitana</p>
          <h2 className="font-display mt-4 text-4xl leading-[1.08] font-bold tracking-tight text-navy-900 sm:text-5xl">
            A sua próxima viagem começa aqui.
          </h2>
          <span className="mt-6 block h-0.5 w-16 bg-sky-500" />

          <ul className="mt-8 space-y-5 text-slate-600">
            <li className="flex gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-sky-600" />
              <div>
                <p className="font-semibold text-navy-900">Endereço</p>
                <p>{store.address || "Endereço em breve — fale com a gente pelo WhatsApp para combinar a retirada."}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-sky-600" />
              <div>
                <p className="font-semibold text-navy-900">Horário de atendimento</p>
                {contact.hours.map((h) => (
                  <p key={h.days}>{h.days}: {h.time}</p>
                ))}
              </div>
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-wa">
              <MessageCircle className="size-4" /> Falar no WhatsApp
            </a>
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Como chegar <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 bg-mist-200" aria-hidden />
          <div className="relative h-[380px] border-8 border-white bg-white shadow-sm sm:h-[440px]">
            <StoreMap />
          </div>
        </div>
      </div>
    </section>
  );
}
