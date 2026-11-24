export type CategoryId = "economico" | "compacto" | "sedan" | "suv" | "executivo" | "utilitario";
export type BodyType = "hatch" | "sedan" | "suv" | "van";

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
};

export type Car = {
  id: string;
  name: string;
  /** Ex.: "Fiat Mobi ou similar" — locadoras garantem a categoria, não o modelo exato. */
  similar: string;
  category: CategoryId;
  body: BodyType;
  color: string;
  transmission: "manual" | "automatico";
  seats: number;
  bags: number;
  doors: number;
  fuel: string;
  dailyRate: number;
  /** Valor mensal próprio. Sem ele, o simulador usa diária × 30 × fatorMensal (src/config/simulador.ts). */
  monthlyRate?: number;
  features: string[];
  highlight?: boolean;
};

export const categories: Category[] = [
  { id: "economico", name: "Econômico", description: "Baixo consumo para o dia a dia na cidade." },
  { id: "compacto", name: "Compacto", description: "Mais espaço e conforto sem perder a economia." },
  { id: "sedan", name: "Sedan", description: "Porta-malas amplo para viagens e família." },
  { id: "suv", name: "SUV", description: "Posição de dirigir elevada e versatilidade." },
  { id: "executivo", name: "Executivo", description: "Conforto premium para compromissos importantes." },
  { id: "utilitario", name: "Utilitário", description: "Carga e mudanças com praticidade." },
];

export const cars: Car[] = [
  {
    id: "mobi",
    name: "Grupo A · Econômico",
    similar: "Fiat Mobi ou similar",
    category: "economico",
    body: "hatch",
    color: "#c8d3e2",
    transmission: "manual",
    seats: 5,
    bags: 1,
    doors: 4,
    fuel: "Flex",
    dailyRate: 109,
    features: ["Ar-condicionado", "Direção elétrica", "Vidros elétricos"],
  },
  {
    id: "kwid",
    name: "Grupo A2 · Econômico",
    similar: "Renault Kwid ou similar",
    category: "economico",
    body: "hatch",
    color: "#e6e9ee",
    transmission: "manual",
    seats: 5,
    bags: 1,
    doors: 4,
    fuel: "Flex",
    dailyRate: 115,
    features: ["Ar-condicionado", "Direção elétrica", "Central multimídia"],
  },
  {
    id: "hb20",
    name: "Grupo B · Compacto",
    similar: "Hyundai HB20 ou similar",
    category: "compacto",
    body: "hatch",
    color: "#7cb8f7",
    transmission: "manual",
    seats: 5,
    bags: 2,
    doors: 4,
    fuel: "Flex",
    dailyRate: 139,
    features: ["Ar-condicionado", "Bluetooth", "Câmera de ré"],
    highlight: true,
  },
  {
    id: "onix-at",
    name: "Grupo C · Compacto automático",
    similar: "Chevrolet Onix AT ou similar",
    category: "compacto",
    body: "hatch",
    color: "#93a3b8",
    transmission: "automatico",
    seats: 5,
    bags: 2,
    doors: 4,
    fuel: "Flex",
    dailyRate: 159,
    features: ["Câmbio automático", "Apple CarPlay / Android Auto", "Sensor de estacionamento"],
  },
  {
    id: "virtus",
    name: "Grupo D · Sedan",
    similar: "VW Virtus ou similar",
    category: "sedan",
    body: "sedan",
    color: "#1f3b66",
    transmission: "automatico",
    seats: 5,
    bags: 3,
    doors: 4,
    fuel: "Flex",
    dailyRate: 189,
    features: ["Câmbio automático", "Porta-malas de 521 L", "Piloto automático"],
    highlight: true,
  },
  {
    id: "tcross",
    name: "Grupo E · SUV",
    similar: "VW T-Cross ou similar",
    category: "suv",
    body: "suv",
    color: "#e4e7ec",
    transmission: "automatico",
    seats: 5,
    bags: 3,
    doors: 4,
    fuel: "Flex",
    dailyRate: 229,
    features: ["Câmbio automático", "Motor turbo", "Ar digital"],
    highlight: true,
  },
  {
    id: "compass",
    name: "Grupo F · SUV médio",
    similar: "Jeep Compass ou similar",
    category: "suv",
    body: "suv",
    color: "#2b3442",
    transmission: "automatico",
    seats: 5,
    bags: 4,
    doors: 4,
    fuel: "Flex",
    dailyRate: 289,
    features: ["Câmbio automático", "Bancos em couro", "Assistente de faixa"],
  },
  {
    id: "corolla",
    name: "Grupo X · Executivo",
    similar: "Toyota Corolla ou similar",
    category: "executivo",
    body: "sedan",
    color: "#0e1a2e",
    transmission: "automatico",
    seats: 5,
    bags: 3,
    doors: 4,
    fuel: "Híbrido",
    dailyRate: 339,
    features: ["Motor híbrido", "Bancos em couro", "Ar digital dual zone"],
  },
  {
    id: "fiorino",
    name: "Grupo U · Utilitário",
    similar: "Fiat Fiorino ou similar",
    category: "utilitario",
    body: "van",
    color: "#f1f3f6",
    transmission: "manual",
    seats: 2,
    bags: 0,
    doors: 2,
    fuel: "Flex",
    dailyRate: 199,
    features: ["Compartimento de carga de 3.300 L", "Até 650 kg de carga", "Ar-condicionado"],
  },
];

export const getCar = (id: string | null | undefined) => cars.find((c) => c.id === id);
export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;
