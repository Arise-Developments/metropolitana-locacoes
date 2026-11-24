"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, MessageCircle } from "lucide-react";
import { CarArt } from "./CarArt";
import { cars, categories, getCar, type CategoryId } from "@/data/cars";
import { site, type ExtraId } from "@/config/site";
import { brl, countDays, quote } from "@/lib/pricing";
import { defaultPeriod, formatDateTime, parseLocalInput } from "@/lib/dates";
import { formatPhone, onlyDigits, whatsappLink } from "@/lib/whatsapp";

const STEPS = ["Período", "Veículo", "Extras", "Seus dados"] as const;
type Errors = Partial<Record<string, string>>;

export function BookingWizard() {
  const params = useSearchParams();

  const [step, setStep] = useState(0);
  const [pickup, setPickup] = useState(params.get("retirada") ?? "");
  const [dropoff, setDropoff] = useState(params.get("devolucao") ?? "");
  const [delivery, setDelivery] = useState(false);
  const [address, setAddress] = useState("");
  const [carId, setCarId] = useState(getCar(params.get("carro"))?.id ?? "");
  const [catFilter, setCatFilter] = useState<CategoryId | "">((params.get("categoria") as CategoryId) ?? "");
  const [extras, setExtras] = useState<ExtraId[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sentLink, setSentLink] = useState<string | null>(null);

  useEffect(() => {
    if (!pickup || !dropoff) {
      const d = defaultPeriod();
      setPickup((p) => p || d.pickup);
      setDropoff((v) => v || d.dropoff);
    }
  }, []);

  const p = parseLocalInput(pickup);
  const d = parseLocalInput(dropoff);
  const days = p && d ? countDays(p, d) : 0;
  const car = getCar(carId);
  const q = car && days ? quote(car, days, extras, delivery) : null;
  const carList = useMemo(() => cars.filter((c) => !catFilter || c.category === catFilter), [catFilter]);

  function validate(s: number): Errors {
    const e: Errors = {};
    if (s === 0) {
      if (!p) e.pickup = "Informe a data de retirada.";
      else if (p.getTime() < Date.now() - 5 * 60 * 1000) e.pickup = "A retirada não pode ser no passado.";
      if (!d) e.dropoff = "Informe a data de devolução.";
      else if (p && d <= p) e.dropoff = "A devolução precisa ser depois da retirada.";
      if (delivery && address.trim().length < 8) e.address = "Informe o endereço completo para entrega.";
    }
    if (s === 1 && !car) e.car = "Selecione um veículo para continuar.";
    if (s === 3) {
      if (name.trim().split(/\s+/).length < 2) e.name = "Informe nome e sobrenome.";
      if (onlyDigits(phone).length < 10) e.phone = "Informe um telefone com DDD.";
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "E-mail inválido.";
      if (!accepted) e.accepted = "Confirme que possui CNH válida.";
    }
    return e;
  }

  function next() {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goTo(i: number) {
    // Só permite pular para etapas anteriores ou para a próxima se as anteriores estiverem válidas.
    for (let s = 0; s < i; s++) {
      const e = validate(s);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(s);
        return;
      }
    }
    setErrors({});
    setStep(i);
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const all = { ...validate(0), ...validate(1), ...validate(3) };
    setErrors(all);
    if (Object.keys(all).length || !car || !q || !p || !d) return;

    const lines = [
      `*Pedido de reserva — ${site.name}*`,
      "",
      `*Veículo:* ${car.name} (${car.similar})`,
      `*Retirada:* ${formatDateTime(p)}`,
      `*Devolução:* ${formatDateTime(d)}`,
      `*Diárias:* ${q.days}`,
      `*Local:* ${delivery ? `Entrega em ${address}` : "Retirada na loja"}`,
      q.extras.length ? `*Extras:* ${q.extras.map((x) => x.name).join(", ")}` : "",
      `*Valor estimado:* ${brl(q.total)}`,
      "",
      `*Nome:* ${name}`,
      `*Telefone:* ${phone}`,
      email ? `*E-mail:* ${email}` : "",
      notes ? `*Observações:* ${notes}` : "",
    ].filter((l, i, arr) => l !== "" || arr[i - 1] !== "");

    const link = whatsappLink(lines.join("\n"));
    setSentLink(link);
    window.open(link, "_blank", "noopener,noreferrer");
  }

  if (sentLink && car && q) {
    return (
      <div className="container-x py-20">
        <div className="mx-auto max-w-xl border border-mist-200 bg-white p-10 text-center">
          <CheckCircle2 className="mx-auto size-14 text-wa" strokeWidth={1.5} />
          <h2 className="font-display mt-5 text-3xl font-bold text-navy-900">Pedido pronto para envio!</h2>
          <p className="mt-3 text-slate-600">
            Abrimos o WhatsApp com o resumo da sua reserva. Envie a mensagem para nossa equipe confirmar a disponibilidade
            do <strong>{car.similar}</strong>.
          </p>
          <p className="font-display mt-6 text-2xl font-extrabold text-navy-900">{brl(q.total)}</p>
          <p className="text-xs text-slate-500">valor estimado · sujeito à confirmação</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href={sentLink} target="_blank" rel="noopener noreferrer" className="btn-wa">
              <MessageCircle className="size-4" /> Abrir WhatsApp novamente
            </a>
            <Link href="/" className="btn-outline">Voltar ao início</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_360px] lg:py-16">
      <div>
        {/* Stepper */}
        <ol className="mb-10 grid grid-cols-4 gap-2">
          {STEPS.map((label, i) => (
            <li key={label}>
              <button type="button" onClick={() => goTo(i)} className="group w-full text-left" aria-current={step === i ? "step" : undefined}>
                <span className={`block h-1 ${i <= step ? "bg-sky-500" : "bg-mist-200"}`} />
                <span className={`mt-3 flex items-center gap-2 text-xs font-semibold sm:text-sm ${i === step ? "text-navy-900" : "text-slate-400"}`}>
                  <span className={`grid size-6 shrink-0 place-items-center text-[11px] ${i < step ? "bg-sky-500 text-white" : i === step ? "bg-navy-900 text-white" : "bg-mist-200 text-slate-500"}`}>
                    {i < step ? <Check className="size-3.5" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <fieldset className="space-y-6">
            <legend className="font-display mb-6 text-2xl font-bold text-navy-900">Quando você precisa do carro?</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Retirada" error={errors.pickup}>
                <input type="datetime-local" className="field" value={pickup} onChange={(e) => setPickup(e.target.value)} />
              </Field>
              <Field label="Devolução" error={errors.dropoff}>
                <input type="datetime-local" className="field" value={dropoff} min={pickup} onChange={(e) => setDropoff(e.target.value)} />
              </Field>
            </div>
            {days > 0 && (
              <p className="bg-mist-100 px-4 py-3 text-sm text-slate-700">
                <strong>{days} {days === 1 ? "diária" : "diárias"}</strong>
                {days >= 30 ? ` · desconto do plano mensal (${site.pricing.monthlyDiscount * 100}%)` : days >= 7 ? ` · desconto do plano semanal (${site.pricing.weeklyDiscount * 100}%)` : days >= 4 ? " · com 7 diárias você ganha desconto do plano semanal" : ""}
              </p>
            )}
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="font-display mb-6 text-2xl font-bold text-navy-900">Escolha o veículo</legend>
            <div className="mb-6 flex flex-wrap gap-2">
              {[{ id: "", name: "Todas" }, ...categories].map((c) => (
                <button key={c.id} type="button" onClick={() => setCatFilter(c.id as CategoryId | "")} aria-pressed={catFilter === c.id}
                  className={`border px-3 py-1.5 text-xs font-medium ${catFilter === c.id ? "border-navy-900 bg-navy-900 text-white" : "border-mist-200 bg-white text-slate-600 hover:border-navy-900"}`}>
                  {c.name}
                </button>
              ))}
            </div>
            {errors.car && <p role="alert" className="mb-4 text-sm text-red-600">{errors.car}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              {carList.map((c) => {
                const selected = c.id === carId;
                const est = days ? quote(c, days, [], false).total : c.dailyRate;
                return (
                  <label key={c.id} className={`relative flex cursor-pointer flex-col border bg-white p-5 transition-colors ${selected ? "border-navy-900 ring-1 ring-navy-900" : "border-mist-200 hover:border-slate-400"}`}>
                    <input type="radio" name="car" className="sr-only" checked={selected} onChange={() => setCarId(c.id)} />
                    {selected && <Check className="absolute top-4 right-4 size-5 text-sky-600" />}
                    <CarArt body={c.body} color={c.color} className="h-20 w-auto self-start" />
                    <span className="mt-3 font-semibold text-navy-900">{c.name}</span>
                    <span className="text-sm text-slate-500">{c.similar} · {c.transmission === "automatico" ? "Automático" : "Manual"}</span>
                    <span className="mt-3 text-sm">
                      <strong className="text-navy-900">{brl(est)}</strong>
                      <span className="text-slate-500"> {days ? `por ${days} ${days === 1 ? "diária" : "diárias"}` : "/dia"}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="font-display mb-2 text-2xl font-bold text-navy-900">Proteção e extras</legend>
            <p className="mb-6 text-sm text-slate-600">Opcionais, cobrados por diária.</p>
            <div className="space-y-3">
              {site.extras.map((x) => {
                const on = extras.includes(x.id);
                return (
                  <label key={x.id} className={`flex cursor-pointer items-start gap-4 border bg-white p-5 ${on ? "border-navy-900" : "border-mist-200"}`}>
                    <input type="checkbox" className="mt-1 size-4 accent-navy-900" checked={on}
                      onChange={() => setExtras((list) => (on ? list.filter((i) => i !== x.id) : [...list, x.id]))} />
                    <span className="flex-1">
                      <span className="block font-semibold text-navy-900">{x.name}</span>
                      <span className="text-sm text-slate-500">{x.description}</span>
                    </span>
                    <span className="text-sm font-semibold whitespace-nowrap text-navy-900">+ {brl(x.pricePerDay)}<span className="font-normal text-slate-500">/dia</span></span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="space-y-5">
            <legend className="font-display mb-6 text-2xl font-bold text-navy-900">Seus dados</legend>
            <Field label="Nome completo" error={errors.name}>
              <input className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="WhatsApp / telefone" error={errors.phone}>
                <input className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} />
              </Field>
              <Field label="E-mail (opcional)" error={errors.email}>
                <input className="field" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
            </div>
            <Field label="Observações (opcional)">
              <textarea className="field min-h-24" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Voo de chegada, preferência de cor, etc." />
            </Field>
            <div>
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <input type="checkbox" className="mt-0.5 size-4 accent-navy-900" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                Declaro possuir CNH válida e estou ciente de que o valor é uma estimativa sujeita à confirmação de disponibilidade.
              </label>
              {errors.accepted && <p role="alert" className="mt-1 text-sm text-red-600">{errors.accepted}</p>}
            </div>
          </fieldset>
        )}

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-mist-200 pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => { setErrors({}); setStep((s) => s - 1); }} className="btn-outline">
              <ArrowLeft className="size-4" /> Voltar
            </button>
          ) : <span />}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-dark">Continuar <ArrowRight className="size-4" /></button>
          ) : (
            <button type="submit" className="btn-wa"><MessageCircle className="size-4" /> Enviar pedido pelo WhatsApp</button>
          )}
        </div>
      </div>

      {/* Resumo sempre visível */}
      <aside className="h-fit bg-navy-900 p-7 text-white lg:sticky lg:top-28" aria-label="Resumo da reserva">
        <h2 className="eyebrow text-sky-400">Resumo</h2>
        {car ? (
          <div className="mt-5 border-b border-white/10 pb-5">
            <CarArt body={car.body} color={car.color} className="h-20 w-auto" />
            <p className="mt-3 font-semibold">{car.name}</p>
            <p className="text-sm text-white/60">{car.similar}</p>
          </div>
        ) : (
          <p className="mt-5 border-b border-white/10 pb-5 text-sm text-white/50">Nenhum veículo selecionado.</p>
        )}
        <dl className="space-y-3 py-5 text-sm">
          <Row k="Retirada" v={p ? formatDateTime(p) : "—"} />
          <Row k="Devolução" v={d ? formatDateTime(d) : "—"} />
          <Row k="Local" v={delivery ? "Entrega no endereço" : "Na loja"} />
        </dl>
        {q && (
          <dl className="space-y-2 border-t border-white/10 pt-5 text-sm">
            <Row k={`${q.days} × ${brl(car!.dailyRate)}`} v={brl(q.base)} />
            {q.discount > 0 && <Row k={q.discountLabel} v={`- ${brl(q.discount)}`} accent />}
            {q.extras.map((x) => <Row key={x.id} k={x.name} v={brl(x.total)} />)}
            {q.delivery > 0 && <Row k="Entrega" v={brl(q.delivery)} />}
            <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
              <dt className="font-semibold">Total estimado</dt>
              <dd className="font-display text-2xl font-extrabold text-sky-400">{brl(q.total)}</dd>
            </div>
          </dl>
        )}
      </aside>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {error && <span role="alert" className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-white/60">{k}</dt>
      <dd className={`text-right ${accent ? "text-sky-400" : ""}`}>{v}</dd>
    </div>
  );
}
