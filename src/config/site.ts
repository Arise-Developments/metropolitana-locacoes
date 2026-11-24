/**
 * Configuração central do site.
 * Tudo que é "dado da empresa" fica aqui — preencha antes de publicar.
 */
type SiteConfig = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  contact: { whatsapp: string; phone: string; email: string; hours: { days: string; time: string }[] };
  store: { address: string; city: string; location: { lat: number; lng: number; configured: boolean } };
};

export const site: SiteConfig = {
  name: "Metropolitana Locações",
  shortName: "Metropolitana",
  tagline: "Seu destino, no seu ritmo.",
  description:
    "Aluguel de carros por dia, semana ou mês. Escolha o período, encontre sua categoria e siga no seu ritmo.",
  url: "https://www.metropolitanalocacoes.com.br",

  contact: {
    /** Somente dígitos, com DDI e DDD. Ex.: "5511999999999". Vazio = WhatsApp abre sem número definido. */
    whatsapp: "",
    phone: "",
    email: "",
    hours: [
      { days: "Segunda a sexta", time: "08h às 18h" },
      { days: "Sábado", time: "08h às 12h" },
    ],
  },

  store: {
    /** Endereço exibido no site. Vazio = mostra "Endereço em breve". */
    address: "",
    city: "",
    /**
     * Coordenadas da loja. Enquanto `configured` for false, o mapa mostra o Brasil
     * sem marcador (no modelo original havia um marcador ilustrativo que podia confundir o cliente).
     */
    location: { lat: -15.7801, lng: -47.9292, configured: false },
  },

  // Preços e regras do simulador de orçamento: src/config/simulador.ts
};
