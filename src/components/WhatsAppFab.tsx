import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed right-5 bottom-5 z-40 flex items-center gap-3 rounded-full bg-wa p-4 text-white shadow-lg ring-4 ring-white/70 transition-transform hover:scale-105"
    >
      <MessageCircle className="size-7" strokeWidth={1.8} />
      <span className="hidden pr-1 text-sm font-semibold group-hover:inline">Fale conosco</span>
    </a>
  );
}
