/**
 * Configuração central do site.
 * Tudo que é "dado da empresa" fica aqui — preencha antes de publicar.
 */
export type ExtraId = "protecao" | "condutor" | "cadeirinha";

type SiteConfig = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  contact: { whatsapp: string; phone: string; email: string; hours: { days: string; time: string }[] };
  store: { address: string; city: string; location: { lat: number; lng: number; configured: boolean } };
  pricing: { weeklyDiscount: number; monthlyDiscount: number; deliveryFee: number };
  extras: { id: ExtraId; name: string; description: string; pricePerDay: number }[];
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

  /** Regras comerciais usadas no simulador de reserva (valores de exemplo). */
  pricing: {
    weeklyDiscount: 0.1, // a partir de 7 diárias
    monthlyDiscount: 0.25, // a partir de 30 diárias
    deliveryFee: 60, // entrega/retirada no endereço do cliente
  },

  extras: [
    { id: "protecao", name: "Proteção completa", description: "Reduz a coparticipação em caso de sinistro.", pricePerDay: 39.9 },
    { id: "condutor", name: "Condutor adicional", description: "Mais uma pessoa autorizada a dirigir.", pricePerDay: 15 },
    { id: "cadeirinha", name: "Cadeirinha infantil", description: "Bebê conforto ou assento de elevação.", pricePerDay: 12 },
  ],
};
