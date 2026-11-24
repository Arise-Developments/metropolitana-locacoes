/**
 * Regras do simulador de orçamento (/reserva).
 *
 * A lógica de cálculo segue o simulador de locarmetropolitana.com.br/simulador.html.
 * Os valores marcados com "EXEMPLO" não aparecem no código público daquele site
 * (vêm do banco de dados deles) e precisam ser conferidos antes de publicar.
 */
import type { CategoryId } from "@/data/cars";

export type ProtecaoSlug = "intermediaria" | "premium";

export type Adicional = {
  id: string;
  name: string;
  description: string;
  price: number;
  /** true = cobrado por diária; false = valor único por locação. */
  perDay: boolean;
};

export type PlanoMensal = { id: string; name: string; months: number; discount: number; minDays: number };
export type KmMensal = { id: string; name: string; km: number; extra: number; extraPerKm: number; badge?: string; description?: string };
export type Temporada = { nome: string; inicio: string; fim: string; multiplicador: number };

export const simulador = {
  loja: { nome: "LOJA MATRIZ" },

  /* ------------------------------------------------------------------ */
  /* LOCAÇÃO POR DIÁRIA                                                  */
  /* ------------------------------------------------------------------ */

  /** Desconto progressivo sobre a diária (texto da home do site de referência). */
  descontosDuracao: [
    { minDias: 3, pct: 5 },
    { minDias: 7, pct: 10 },
    { minDias: 15, pct: 15 },
    { minDias: 30, pct: 20 },
  ],

  /** Acréscimo na diária de sábados e domingos (padrão do site de referência: 17%). */
  acrescimoFimDeSemana: 0.17,

  /**
   * Fração de diária quando a devolução é DEPOIS do horário da retirada.
   * Até 4h = 25%, até 8h = 50%, até 12h = 75%, acima disso = diária completa.
   */
  fracoes: [
    { ateHoras: 4, pct: 25 },
    { ateHoras: 8, pct: 50 },
    { ateHoras: 12, pct: 75 },
  ],

  /** Alta temporada: multiplica a diária quando a retirada cai no período (datas AAAA-MM-DD). */
  temporadas: [] as Temporada[],

  km: {
    economicaKmDia: 200,
    excedentePorKm: 0.45,
    /** Km ilimitado, por diária. */
    ilimitadoPorDia: 30,
    ilimitadoPorDiaExecutivo: 70,
  },

  /** Proteção por diária, por categoria (tabela padrão do site de referência). */
  protecaoDiaria: {
    economico: { intermediaria: 69.9, premium: 99.9 },
    compacto: { intermediaria: 76.9, premium: 109.9 },
    sedan: { intermediaria: 79.9, premium: 114.9 },
    suv: { intermediaria: 84.9, premium: 119.9 },
    executivo: { intermediaria: 109.9, premium: 154.9 },
    utilitario: { intermediaria: 76.9, premium: 109.9 },
  } satisfies Record<CategoryId, Record<ProtecaoSlug, number>>,

  protecoes: [
    {
      slug: "intermediaria" as const,
      name: "Proteção Intermediária",
      badge: "Recomendado",
      description: "Cobertura contra colisão, roubo e furto, com proteção a terceiros.",
      note: "Melhor custo-benefício. Cobre terceiros e inclui assistência 24h.",
    },
    {
      slug: "premium" as const,
      name: "Proteção Premium",
      badge: "Completo",
      description: "Cobertura completa, sem participação em caso de sinistro.",
      note: "Tranquilidade total. Participação zero — ideal para viagens e uso intenso.",
    },
  ],

  /** EXEMPLO — confira nomes e preços. */
  servicos: [
    { id: "condutor", name: "Condutor adicional", description: "Mais uma pessoa autorizada a dirigir.", price: 15, perDay: true },
    { id: "entrega", name: "Entrega e retirada no endereço", description: "Levamos e buscamos o carro onde você estiver.", price: 60, perDay: false },
    { id: "lavagem", name: "Devolução sem lavagem", description: "Devolva o carro sem precisar lavar.", price: 40, perDay: false },
  ] as Adicional[],

  /** EXEMPLO — confira nomes e preços. */
  itens: [
    { id: "cadeirinha", name: "Cadeirinha infantil", description: "Bebê conforto ou assento de elevação.", price: 12, perDay: true },
    { id: "gps", name: "Suporte veicular para celular", description: "Para usar o GPS do celular com segurança.", price: 5, perDay: true },
  ] as Adicional[],

  /* ------------------------------------------------------------------ */
  /* LOCAÇÃO MENSAL                                                      */
  /* ------------------------------------------------------------------ */

  /** Mensal sem valor próprio no carro = diária × 30 × fator. */
  fatorMensal: 0.58,

  /** EXEMPLO — confira meses e descontos. */
  planosMensais: [
    { id: "m1", name: "Mensal", months: 1, discount: 0, minDays: 30 },
    { id: "m3", name: "Trimestral", months: 3, discount: 0.05, minDays: 90 },
    { id: "m6", name: "Semestral", months: 6, discount: 0.1, minDays: 180 },
    { id: "m12", name: "Anual", months: 12, discount: 0.2, minDays: 360 },
  ] as PlanoMensal[],

  /** EXEMPLO — confira franquias e valores. */
  kmMensal: [
    { id: "k2", name: "Básica", km: 2000, extra: 0, extraPerKm: 0.45 },
    { id: "k3", name: "Intermediária", km: 3000, extra: 250, extraPerKm: 0.4, badge: "Mais escolhida" },
    { id: "k5", name: "Ampliada", km: 5000, extra: 600, extraPerKm: 0.35 },
  ] as KmMensal[],

  /** Proteção mensal, por categoria (tabela padrão do site de referência). */
  protecaoMensal: {
    economico: { intermediaria: 1258, premium: 1798 },
    compacto: { intermediaria: 1384, premium: 1978 },
    sedan: { intermediaria: 1438, premium: 2068 },
    suv: { intermediaria: 1528, premium: 2158 },
    executivo: { intermediaria: 1978, premium: 2788 },
    utilitario: { intermediaria: 1384, premium: 1978 },
  } satisfies Record<CategoryId, Record<ProtecaoSlug, number>>,

  /** EXEMPLO */
  servicosMensais: [
    { id: "condutor", name: "Condutor adicional", description: "Mais uma pessoa autorizada a dirigir.", price: 150, perDay: false },
  ] as Adicional[],

  /** EXEMPLO */
  itensMensais: [
    { id: "cadeirinha", name: "Cadeirinha infantil", description: "Bebê conforto ou assento de elevação.", price: 90, perDay: false },
  ] as Adicional[],

  /* ------------------------------------------------------------------ */
  /* AMBOS                                                               */
  /* ------------------------------------------------------------------ */

  /** Taxa de locação em % sobre o total (0 = não cobra). */
  taxaLocacaoPct: 0,

  /** Texto "Informações importantes" do orçamento por diária (texto do site de referência). */
  condicoesDiaria: [
    "Documentos na retirada: CNH válida + RG + cartão de crédito + comprovante de residência",
    "Idade mínima: 18 anos (condutores de 18 a 21 anos pagam taxa adicional)",
    "Combustível: veículo entregue com tanque cheio, devolver com tanque cheio",
    "Multas de trânsito são responsabilidade do locatário",
    "IPVA e licenciamento inclusos no valor",
    "Valores sujeitos a confirmação de disponibilidade",
  ],

  /** Texto "Condições do contrato" do orçamento mensal (texto do site de referência). */
  condicoesMensal: [
    "Documentos: CNH válida + RG + cartão de crédito + comprovante de residência",
    "Idade mínima: 18 anos (condutores de 18 a 21 anos pagam taxa adicional)",
    "Pagamento via cartão de crédito (recorrente) ou boleto",
    "Combustível: devolver com tanque cheio",
    "Revisões preventivas por conta da locadora",
    "IPVA e licenciamento inclusos",
    "Multas de trânsito são responsabilidade do locatário",
    "Não permitido uso em aplicativos de transporte",
    "Devolução antes de 30 dias: tarifa convertida para diária",
    "Valores sujeitos a confirmação de disponibilidade",
  ],
  /** Só aparece em planos com mais de 1 mês. */
  multaRescisoria: "Multa rescisória: 50% das mensalidades restantes",

  /** Caução por categoria, exibida no orçamento (0 = não mostra). */
  caucao: {
    economico: 0,
    compacto: 0,
    sedan: 0,
    suv: 0,
    executivo: 0,
    utilitario: 0,
  } satisfies Record<CategoryId, number>,
};
