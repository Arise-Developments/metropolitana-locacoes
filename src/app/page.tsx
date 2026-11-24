import Link from "next/link";
import { ArrowRight, CalendarDays, CarFront, Check, ChevronDown, KeyRound, MessageCircle, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { HeroArt } from "@/components/HeroArt";
import { QuickSearch } from "@/components/QuickSearch";
import { SectionHeading } from "@/components/SectionHeading";
import { CarCard } from "@/components/CarCard";
import { CarArt } from "@/components/CarArt";
import { LocationSection } from "@/components/LocationSection";
import { cars, categories } from "@/data/cars";
import { site } from "@/config/site";
import { brl } from "@/lib/pricing";
import { whatsappLink } from "@/lib/whatsapp";

const benefits = [
  { icon: ShieldCheck, title: "Carros revisados", text: "Manutenção preventiva e higienização a cada locação." },
  { icon: CalendarDays, title: "Do dia ao mês", text: "Diárias avulsas ou planos com desconto progressivo." },
  { icon: Wrench, title: "Assistência", text: "Suporte durante toda a locação, quando você precisar." },
  { icon: Sparkles, title: "Sem burocracia", text: "Reserva simples e atendimento direto pelo WhatsApp." },
];

const steps = [
  { icon: CalendarDays, title: "Escolha o período", text: "Informe as datas de retirada e devolução." },
  { icon: CarFront, title: "Selecione o carro", text: "Compare categorias, câmbio e valores." },
  { icon: MessageCircle, title: "Confirme a reserva", text: "Enviamos o resumo e confirmamos pelo WhatsApp." },
  { icon: KeyRound, title: "Retire e siga", text: "Apresente CNH e documento e pegue a chave." },
];

const faq = [
  { q: "Quais documentos preciso para alugar?", a: "CNH válida (definitiva), documento com foto e cartão de crédito em nome do condutor para a caução. Confirme as regras atuais com nosso atendimento." },
  { q: "Existe idade mínima?", a: "Sim. Consulte nosso atendimento para conhecer as regras de idade e tempo de habilitação de cada categoria." },
  { q: "Posso devolver o carro antes?", a: "Pode. A diferença de valores é calculada conforme a política vigente — fale com a gente antes da devolução." },
  { q: "Como funcionam os planos semanal e mensal?", a: `Locações a partir de 7 diárias têm ${site.pricing.weeklyDiscount * 100}% de desconto, e a partir de 30 diárias, ${site.pricing.monthlyDiscount * 100}%. O desconto é aplicado automaticamente no simulador.` },
  { q: "Vocês entregam o carro no meu endereço?", a: `Sim, mediante taxa de ${brl(site.pricing.deliveryFee)} e disponibilidade na região. Selecione a opção na reserva.` },
];

export default function HomePage() {
  const featured = cars.filter((c) => c.highlight);
  const minRate = Math.min(...cars.map((c) => c.dailyRate));

  return (
    <>
      {/* HERO — mantém o texto e a composição do modelo (texto à esquerda, imagem à direita) */}
      <section className="relative bg-navy-900">
        <div className="grid lg:min-h-[min(calc(100dvh-5rem),820px)] lg:grid-cols-2">
          <div className="container-x flex flex-col justify-center py-16 lg:max-w-none lg:py-20 lg:pr-12 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            <p className="eyebrow flex items-center gap-3 text-sky-400">
              <span className="h-px w-10 bg-sky-400" /> Metropolitana / Locações
            </p>
            <h1 className="font-display mt-6 text-5xl leading-[0.98] font-extrabold tracking-[-0.035em] text-white sm:text-6xl xl:text-7xl">
              A cidade muda.
              <span className="block text-sky-400">Seu caminho é você quem faz.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/75">
              Um carro para o compromisso de hoje ou para os planos do mês inteiro. Escolha o período, encontre sua
              categoria e siga no seu ritmo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/reserva" className="btn-primary">
                Alugar carro <ArrowRight className="size-4" />
              </Link>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-outline-light">
                <MessageCircle className="size-4" /> Falar no WhatsApp
              </a>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6">
              <span className="eyebrow text-white/50">M / 01 · Seu trajeto começa aqui</span>
              <span className="text-sm text-white/70">
                Diárias a partir de <strong className="text-white">{brl(minRate)}</strong>
              </span>
            </div>
          </div>
          <div className="border-white/10 lg:border-l">
            <HeroArt />
          </div>
        </div>
      </section>

      {/* BUSCA RÁPIDA — nova */}
      <section className="bg-navy-900 pb-14">
        <div className="container-x">
          <QuickSearch />
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="border-b border-mist-200 bg-white">
        <div className="container-x grid divide-mist-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 py-8 lg:px-6 lg:first:pl-0">
              <Icon className="size-6 shrink-0 text-sky-600" strokeWidth={1.6} />
              <div>
                <h3 className="font-semibold text-navy-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Categorias" title="Um carro para cada caminho." text="Do econômico para a rotina ao SUV para a estrada. Escolha a categoria que combina com o seu trajeto." />
            <Link href="/frota" className="btn-outline shrink-0">Ver frota completa <ArrowRight className="size-4" /></Link>
          </div>
          <div className="mt-12 grid gap-px border border-mist-200 bg-mist-200 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const list = cars.filter((c) => c.category === cat.id);
              const sample = list[0];
              const from = Math.min(...list.map((c) => c.dailyRate));
              return (
                <Link key={cat.id} href={`/frota?categoria=${cat.id}`} className="group flex flex-col bg-white p-7 transition-colors hover:bg-navy-900">
                  <CarArt body={sample.body} color={sample.color} className="h-24 w-auto self-start transition-transform group-hover:translate-x-2" />
                  <h3 className="font-display mt-5 text-xl font-bold text-navy-900 group-hover:text-white">{cat.name}</h3>
                  <p className="mt-1 text-sm text-slate-600 group-hover:text-white/65">{cat.description}</p>
                  <p className="mt-5 flex items-center justify-between text-sm text-slate-500 group-hover:text-white/60">
                    <span>a partir de <strong className="text-navy-900 group-hover:text-sky-400">{brl(from)}/dia</strong></span>
                    <ArrowRight className="size-4 text-sky-600 group-hover:text-sky-400" />
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="scroll-mt-20 bg-navy-900 py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading tone="dark" eyebrow="Planos" title="Pague pelo tempo que você precisa." text="Quanto mais dias, menor o valor da diária. O desconto é aplicado automaticamente na sua reserva." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: "Diária", tag: "1 a 6 dias", discount: 0, text: "Para compromissos, viagens curtas e imprevistos.", items: ["Retirada no mesmo dia", "Sem fidelidade", "Proteção opcional"] },
              { name: "Semanal", tag: "7 a 29 dias", discount: site.pricing.weeklyDiscount, text: "Para férias, viagens de trabalho e temporadas.", items: ["Diária reduzida", "Troca de veículo sob consulta", "Proteção opcional"], featured: true },
              { name: "Mensal", tag: "30 dias ou mais", discount: site.pricing.monthlyDiscount, text: "Para quem precisa de carro todo dia sem comprar um.", items: ["Maior desconto", "Manutenção inclusa", "Ideal para apps e empresas"] },
            ].map((plan) => (
              <div key={plan.name} className={`relative flex flex-col border p-8 ${plan.featured ? "border-sky-400 bg-navy-800" : "border-white/10"}`}>
                {plan.featured && <span className="eyebrow absolute -top-3 left-8 bg-sky-400 px-3 py-1 text-[10px] text-navy-900">Mais escolhido</span>}
                <p className="eyebrow text-sky-400">{plan.tag}</p>
                <h3 className="font-display mt-3 text-3xl font-bold text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-white/60">{plan.text}</p>
                <p className="font-display mt-6 text-4xl font-extrabold text-white">
                  {plan.discount ? `-${plan.discount * 100}%` : "Tarifa cheia"}
                </p>
                <p className="text-xs text-white/50">{plan.discount ? "sobre o valor da diária" : "valor padrão da categoria"}</p>
                <ul className="mt-6 flex-1 space-y-3 text-sm text-white/80">
                  {plan.items.map((i) => (
                    <li key={i} className="flex gap-2"><Check className="size-4 shrink-0 text-sky-400" />{i}</li>
                  ))}
                </ul>
                <Link href="/reserva" className={`mt-8 ${plan.featured ? "btn-primary" : "btn-outline-light"}`}>Simular</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="scroll-mt-20 py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading align="center" eyebrow="Como funciona" title="Da reserva à chave na mão em 4 passos." />
          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative">
                <span className="font-display text-6xl font-extrabold text-mist-200">0{i + 1}</span>
                <Icon className="mt-2 size-7 text-sky-600" strokeWidth={1.6} />
                <h3 className="font-display mt-4 text-lg font-bold text-navy-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FROTA EM DESTAQUE */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Frota em destaque" title="Os mais procurados da semana." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="perguntas" className="scroll-mt-20 py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[2fr_3fr]">
          <SectionHeading eyebrow="Dúvidas" title="Perguntas frequentes" text="Não encontrou o que procurava? Nosso time responde pelo WhatsApp." />
          <div className="divide-y divide-mist-200 border-y border-mist-200">
            {faq.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown className="size-5 shrink-0 text-sky-600 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <LocationSection />
    </>
  );
}
