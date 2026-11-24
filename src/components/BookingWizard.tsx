"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, ArrowRight, CalendarDays, Check, Clock, FileDown, Link2, MapPin, MessageCircle, RotateCcw, Sun, X,
} from "lucide-react";
import { CarArt } from "./CarArt";
import { cars, categories, getCar, type Car, type CategoryId } from "@/data/cars";
import { site } from "@/config/site";
import { simulador as cfg, type Adicional, type ProtecaoSlug } from "@/config/simulador";
import {
  adjustedDaily, brl, calcPeriodo, kmIlimitadoPorDia, monthlyRate, protecaoDiaria, protecaoMensal,
  quoteDiaria, quoteMensal, seasonLabel, type KmDiaria, type Periodo,
} from "@/lib/pricing";
import { formatPhone, onlyDigits, whatsappLink } from "@/lib/whatsapp";

type Mode = "diaria" | "mensal";
const STEPS_D = ["Período", "Veículo", "Km", "Proteção", "Adicionais", "Orçamento"] as const;
const STEPS_M = ["Plano", "Veículo", "Km", "Proteção", "Adicionais", "Orçamento"] as const;
const PROT_SLUGS: ProtecaoSlug[] = ["intermediaria", "premium"];

const fmtD = (d: Date) => d.toLocaleDateString("pt-BR");
const fmtT = (d: Date) => d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
const split = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
const plural = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`;

export function BookingWizard() {
  const params = useSearchParams();
  const [today, setToday] = useState("");

  const [mode, setMode] = useState<Mode>(params.get("modo") === "mensal" ? "mensal" : "diaria");
  const [catFilter, setCatFilter] = useState<CategoryId | "">((params.get("categoria") as CategoryId) ?? "");

  /* ---------- diária ---------- */
  const [step, setStep] = useState(1);
  const [ds, setDs] = useState("");
  const [ts, setTs] = useState("09:00");
  const [de, setDe] = useState("");
  const [te, setTe] = useState("09:00");
  const [carId, setCarId] = useState("");
  const [km, setKm] = useState<KmDiaria | "">("");
  const [prot, setProt] = useState<ProtecaoSlug | "">("");
  const [svc, setSvc] = useState<string[]>([]);
  const [itm, setItm] = useState<string[]>([]);

  /* ---------- mensal ---------- */
  const [mStep, setMStep] = useState(1);
  const [planId, setPlanId] = useState("");
  const [mCarId, setMCarId] = useState("");
  const [mKmId, setMKmId] = useState("");
  const [mProt, setMProt] = useState<ProtecaoSlug | "">("");
  const [mSvc, setMSvc] = useState<string[]>([]);
  const [mItm, setMItm] = useState<string[]>([]);

  /* ---------- lead / ações ---------- */
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadErr, setLeadErr] = useState<{ name?: string; phone?: string }>({});
  const [linkMsg, setLinkMsg] = useState("");

  // Lê a URL uma vez: busca rápida da home (retirada/devolucao/categoria/carro) ou link compartilhado.
  useEffect(() => {
    const now = new Date();
    setToday(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`);

    const [rd, rt] = (params.get("retirada") ?? "").split("T");
    const [dd, dt] = (params.get("devolucao") ?? "").split("T");
    const qDs = params.get("ds") ?? rd ?? "";
    const qTs = params.get("ts") ?? rt ?? "09:00";
    const qDe = params.get("de") ?? dd ?? "";
    const qTe = params.get("te") ?? dt ?? "09:00";
    setDs(qDs); setTs(qTs || "09:00"); setDe(qDe); setTe(qTe || "09:00");

    const qCar = getCar(params.get("carro"))?.id ?? "";
    if (params.get("modo") === "mensal") {
      const qPlan = cfg.planosMensais.find((p) => p.id === params.get("plano"))?.id ?? "";
      const qKm = cfg.kmMensal.find((k) => k.id === params.get("km"))?.id ?? "";
      const qProt = PROT_SLUGS.find((s) => s === params.get("prot")) ?? "";
      setPlanId(qPlan); setMCarId(qCar); setMKmId(qKm); setMProt(qProt);
      setMSvc(split(params.get("svc"))); setMItm(split(params.get("itm")));
      if (qPlan && qCar && qKm && qProt) setMStep(6);
    } else {
      const qKm = params.get("km") === "eco" || params.get("km") === "ilimitado" ? (params.get("km") as KmDiaria) : "";
      const qProt = PROT_SLUGS.find((s) => s === params.get("prot")) ?? "";
      setCarId(qCar); setKm(qKm); setProt(qProt);
      setSvc(split(params.get("svc"))); setItm(split(params.get("itm")));
      if (qDs && qDe && qCar && qKm && qProt) setStep(6);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const periodo = useMemo(() => calcPeriodo(ds, ts, de, te), [ds, ts, de, te]);
  const car = getCar(carId);
  const qD = periodo && car && km && prot ? quoteDiaria(car, periodo, km, prot, svc, itm) : null;

  const plan = cfg.planosMensais.find((p) => p.id === planId);
  const mCar = getCar(mCarId);
  const mKm = cfg.kmMensal.find((k) => k.id === mKmId);
  const qM = plan && mCar && mKm && mProt ? quoteMensal(mCar, plan, mKm, mProt, mSvc, mItm) : null;

  const carList = useMemo(() => cars.filter((c) => !catFilter || c.category === catFilter), [catFilter]);

  /* ---------- navegação (mesmas travas do simulador de referência) ---------- */
  const canD = (s: number) =>
    s <= 1 || (!!periodo && (s <= 2 || (!!car && (s <= 3 || (!!km && (s <= 4 || !!prot))))));
  const canM = (s: number) =>
    s <= 1 || (!!plan && (s <= 2 || (!!mCar && (s <= 3 || (!!mKm && (s <= 4 || !!mProt))))));

  function go(s: number) {
    if (!canD(s)) return;
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function goM(s: number) {
    if (!canM(s)) return;
    setMStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pickCar(id: string) {
    if (id !== carId) { setKm(""); setProt(""); }
    setCarId(id);
  }

  function resetAll() {
    if (mode === "diaria") {
      setDs(""); setTs("09:00"); setDe(""); setTe("09:00");
      setCarId(""); setKm(""); setProt(""); setSvc([]); setItm([]); setStep(1);
    } else {
      setPlanId(""); setMCarId(""); setMKmId(""); setMProt(""); setMSvc([]); setMItm([]); setMStep(1);
    }
    setLinkMsg("");
    window.history.replaceState(null, "", "/reserva");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- mensagem do WhatsApp (mesmo formato do simulador de referência) ---------- */
  function buildMessage(contact?: { name: string; phone: string }) {
    const L: string[] = [`*ORÇAMENTO - ${site.name.toUpperCase()}*`];
    if (mode === "diaria" && qD && car && periodo && prot) {
      const p = periodo;
      L.push("*Modalidade: Locação por Diária*", "");
      L.push(`*Veículo:* ${car.name} (${car.similar})`);
      L.push(`*Período:* ${fmtD(p.start)} ${fmtT(p.start)} a ${fmtD(p.end)} ${fmtT(p.end)} (${plural(p.days, "diária", "diárias")}${p.fraction > 0 ? " + fração" : ""})`);
      L.push(`*Temporada:* ${seasonLabel(p)}`);
      if (qD.dur.pct > 0) L.push(`*Desconto por duração:* ${qD.dur.label}`);
      if (p.fraction > 0) L.push(`*Hora extra:* ${p.fractionLabel}`);
      if (p.weekendDays > 0) L.push(`*Fins de semana:* ${p.weekendDays} dia(s) com acréscimo de ${Math.round(cfg.acrescimoFimDeSemana * 100)}%`);
      L.push(`*Km:* ${km === "eco" ? `Econômica (${cfg.km.economicaKmDia}km/dia)` : "Ilimitado"}`);
      L.push(`*Proteção:* ${cfg.protecoes.find((x) => x.slug === prot)!.name} (${brl(qD.protDaily)}/dia)`);
      if (qD.taxaPct > 0) L.push(`*Taxa de Locação:* ${qD.taxaPct}% (${brl(qD.taxaValor)})`);
      if (qD.servicosSel.length) L.push(`*Serviços:* ${qD.servicosSel.map((x) => x.name).join(", ")}`);
      if (qD.itensSel.length) L.push(`*Itens:* ${qD.itensSel.map((x) => x.name).join(", ")}`);
      L.push("", `*TOTAL: ${brl(qD.total)}*`, `_Média de ${brl(qD.mediaDiaria)} por diária_`);
      if (qD.caucao > 0) L.push(`_Caução: ${brl(qD.caucao)}_`);
    } else if (mode === "mensal" && qM && plan && mCar && mKm && mProt) {
      L.push("*Modalidade: Locação Mensal*", "");
      L.push(`*Plano:* ${plan.name}${plan.discount > 0 ? ` (${Math.round(plan.discount * 100)}% de desconto)` : ""}`);
      L.push(`*Veículo:* ${mCar.name} (${mCar.similar})`);
      L.push(`*Km:* ${mKm.name} - ${mKm.km.toLocaleString("pt-BR")} km/mês`);
      L.push(`*Proteção:* ${cfg.protecoes.find((x) => x.slug === mProt)!.name} (${brl(qM.prot)}/mês)`);
      if (qM.taxaPct > 0) L.push(`*Taxa de Locação:* ${qM.taxaPct}% (${brl(qM.taxaValor)}/mês)`);
      if (qM.servicosSel.length) L.push(`*Serviços:* ${qM.servicosSel.map((x) => x.name).join(", ")}`);
      if (qM.itensSel.length) L.push(`*Itens:* ${qM.itensSel.map((x) => x.name).join(", ")}`);
      L.push("", `*MENSALIDADE: ${brl(qM.mensalidade)}*`);
      if (plan.months > 1) L.push(`*TOTAL DO CONTRATO (${plan.months}x): ${brl(qM.totalContrato)}*`);
      if (qM.caucao > 0) L.push(`_Caução: ${brl(qM.caucao)}_`);
    }
    if (contact && (contact.name || contact.phone)) {
      L.push("");
      if (contact.name) L.push(`*Nome:* ${contact.name}`);
      if (contact.phone) L.push(`*Telefone:* ${contact.phone}`);
    }
    return L.join("\n");
  }

  function openLead() {
    setLeadErr({});
    setLeadOpen(true);
  }

  function sendWhatsApp(withContact: boolean) {
    if (withContact) {
      const e: typeof leadErr = {};
      if (leadName.trim().length > 0 && leadName.trim().length < 2) e.name = "Digite pelo menos 2 caracteres";
      if (leadPhone.trim().length > 0 && onlyDigits(leadPhone).length < 10) e.phone = "Digite um telefone válido com DDD (mínimo 10 dígitos)";
      setLeadErr(e);
      if (Object.keys(e).length) return;
    }
    const msg = buildMessage(withContact ? { name: leadName.trim(), phone: leadPhone.trim() } : undefined);
    setLeadOpen(false);
    window.open(whatsappLink(msg), "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    const q = new URLSearchParams({ modo: mode });
    if (mode === "diaria") {
      Object.entries({ ds, ts, de, te, carro: carId, km, prot }).forEach(([k, v]) => v && q.set(k, v));
      if (svc.length) q.set("svc", svc.join(","));
      if (itm.length) q.set("itm", itm.join(","));
    } else {
      Object.entries({ plano: planId, carro: mCarId, km: mKmId, prot: mProt }).forEach(([k, v]) => v && q.set(k, v));
      if (mSvc.length) q.set("svc", mSvc.join(","));
      if (mItm.length) q.set("itm", mItm.join(","));
    }
    const link = `${window.location.origin}/reserva?${q}`;
    try {
      await navigator.clipboard.writeText(link);
      setLinkMsg("Link copiado!");
    } catch {
      window.prompt("Copie o link do orçamento:", link);
      setLinkMsg("Link gerado!");
    }
    setTimeout(() => setLinkMsg(""), 4000);
  }

  const steps = mode === "diaria" ? STEPS_D : STEPS_M;
  const cur = mode === "diaria" ? step : mStep;
  const can = mode === "diaria" ? canD : canM;
  const nav = mode === "diaria" ? go : goM;

  return (
    <div className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_340px] lg:py-16">
      <div>
        {/* Modalidade */}
        <div role="tablist" aria-label="Modalidade" className="mb-8 grid grid-cols-2 border border-mist-200 bg-white p-1 print:hidden">
          {(["diaria", "mensal"] as const).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
              className={`py-3 text-sm font-semibold transition-colors ${mode === m ? "bg-navy-900 text-white" : "text-slate-600 hover:text-navy-900"}`}>
              {m === "diaria" ? "Locação por Diária" : "Locação Mensal"}
            </button>
          ))}
        </div>

        {/* Etapas */}
        <ol className="mb-10 grid grid-cols-6 gap-1.5 print:hidden">
          {steps.map((label, i) => {
            const s = i + 1;
            return (
              <li key={label}>
                <button type="button" onClick={() => nav(s)} disabled={!can(s)} className="w-full text-left disabled:cursor-not-allowed" aria-current={cur === s ? "step" : undefined}>
                  <span className={`block h-1 ${s <= cur ? "bg-sky-500" : "bg-mist-200"}`} />
                  <span className={`mt-3 flex items-center gap-2 text-xs font-semibold ${s === cur ? "text-navy-900" : "text-slate-400"}`}>
                    <span className={`grid size-6 shrink-0 place-items-center text-[11px] ${s < cur ? "bg-sky-500 text-white" : s === cur ? "bg-navy-900 text-white" : "bg-mist-200 text-slate-500"}`}>
                      {s < cur ? <Check className="size-3.5" /> : s}
                    </span>
                    <span className="hidden md:inline">{label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {mode === "diaria" ? (
          <>
            {step === 1 && (
              <div className="space-y-6">
                <LocCard title="Local de Retirada e Devolução" />
                <Card title="Período da Locação" icon={<CalendarDays className="size-4" />}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Data de Retirada"><input type="date" className="field" min={today} value={ds} onChange={(e) => { setDs(e.target.value); if (de && e.target.value > de) setDe(""); }} /></Field>
                    <Field label="Horário"><input type="time" className="field" value={ts} onChange={(e) => setTs(e.target.value)} /></Field>
                    <Field label="Data de Devolução"><input type="date" className="field" min={ds || today} value={de} onChange={(e) => setDe(e.target.value)} /></Field>
                    <Field label="Horário"><input type="time" className="field" value={te} onChange={(e) => setTe(e.target.value)} /></Field>
                  </div>
                  {ds && de && !periodo && <p role="alert" className="mt-4 text-sm text-red-600">A devolução precisa ser depois da retirada.</p>}
                  {periodo && <DaysInfo p={periodo} />}
                </Card>
                <Next onClick={() => go(2)} disabled={!periodo}>Selecionar Veículo</Next>
              </div>
            )}

            {step === 2 && periodo && (
              <div className="space-y-6">
                <Card title="Escolha o Grupo de Veículo">
                  <CategoryChips value={catFilter} onChange={setCatFilter} />
                  <VehicleGrid list={carList} selected={carId} onSelect={pickCar}
                    price={(c) => <>{brl(adjustedDaily(c, periodo.days, periodo.seasonMult))}<small className="font-normal text-slate-500">/dia</small></>} />
                </Card>
                <Next onClick={() => go(3)} disabled={!car}>Selecionar Quilometragem</Next>
                <Back onClick={() => go(1)} />
              </div>
            )}

            {step === 3 && car && (
              <div className="space-y-6">
                <Card title="Franquia de Quilometragem">
                  <div className="space-y-3">
                    <Option selected={km === "eco"} onClick={() => setKm("eco")} title={`Econômica (${cfg.km.economicaKmDia} km/dia)`}
                      desc={`Franquia de ${cfg.km.economicaKmDia} km por diária. Km excedente: ${brl(cfg.km.excedentePorKm)}/km`} price="Incluso" />
                    <Option selected={km === "ilimitado"} onClick={() => setKm("ilimitado")} title="Km Ilimitado"
                      desc="Sem limite de quilometragem durante a locação" price={`+ ${brl(kmIlimitadoPorDia(car))}/dia`} />
                  </div>
                </Card>
                <Next onClick={() => go(4)} disabled={!km}>Selecionar Proteção</Next>
                <Back onClick={() => go(2)} />
              </div>
            )}

            {step === 4 && car && (
              <div className="space-y-6">
                <Card title="Proteção Veicular">
                  <div className="space-y-3">
                    {cfg.protecoes.map((p) => (
                      <Option key={p.slug} selected={prot === p.slug} onClick={() => setProt(p.slug)} title={p.name} badge={p.badge}
                        desc={p.description} note={p.note} price={`${brl(protecaoDiaria(car, p.slug))}/dia`} />
                    ))}
                  </div>
                </Card>
                <Next onClick={() => go(5)} disabled={!prot}>Serviços e Itens</Next>
                <Back onClick={() => go(3)} />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <Card title="Serviços Adicionais"><Checklist list={cfg.servicos} value={svc} onToggle={(id) => setSvc((l) => toggle(l, id))} unit="/dia" /></Card>
                <Card title="Itens Adicionais"><Checklist list={cfg.itens} value={itm} onToggle={(id) => setItm((l) => toggle(l, id))} unit="/dia" /></Card>
                <Next onClick={() => go(6)}>Ver Orçamento</Next>
                <Back onClick={() => go(4)} />
              </div>
            )}

            {step === 6 && qD && car && periodo && prot && (
              <div className="space-y-3">
                <div className="border border-mist-200 bg-white p-6 sm:p-8">
                  <QuoteHeader title="Locação por Diária" />
                  <Sec title="Veículo">
                    <SRow k={`${car.name} (${car.similar})`} v={brl(qD.vehicleTotal)} strong />
                    <SRow sub k={`${plural(periodo.days, "diária", "diárias")} × ${brl(qD.baseDaily)}`} v={seasonLabel(periodo)} />
                    {periodo.fraction > 0 && <SRow sub k={`⏱ ${periodo.fractionLabel}`} v={`+ ${brl(qD.fractionTotal)}`} />}
                    {qD.dur.pct > 0 && <SRow sub accent k={`Desconto por duração: ${qD.dur.label}`} />}
                    {periodo.weekendDays > 0 && (
                      <SRow sub k={`${periodo.weekendDays} dia(s) de fim de semana (+${Math.round(cfg.acrescimoFimDeSemana * 100)}%)`} v={`+ ${brl(qD.weekendExtra)}`} />
                    )}
                  </Sec>
                  <Sec title="Quilometragem">
                    <SRow k={km === "eco" ? `Econômica (${cfg.km.economicaKmDia} km/dia)` : "Km Ilimitado"} v={qD.kmTotal > 0 ? brl(qD.kmTotal) : "Incluso"} strong />
                  </Sec>
                  <Sec title="Proteção">
                    <SRow k={cfg.protecoes.find((x) => x.slug === prot)!.name} v={brl(qD.protTotal)} strong />
                    <SRow sub k={`${plural(periodo.days, "dia", "dias")} × ${brl(qD.protDaily)}`} />
                  </Sec>
                  {(qD.servicosSel.length > 0 || qD.itensSel.length > 0) && (
                    <Sec title="Adicionais">
                      {[...qD.servicosSel, ...qD.itensSel].map((a) => <SRow key={a.id} k={a.name} v={brl(a.total)} strong />)}
                    </Sec>
                  )}
                  {qD.taxaPct > 0 && <Sec title="Taxa de Locação"><SRow k={`Taxa de ${qD.taxaPct}%`} v={brl(qD.taxaValor)} strong /></Sec>}
                  <Total label="TOTAL" value={brl(qD.total)} />
                  <div className={`mt-4 grid gap-3 ${qD.caucao > 0 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                    <Highlight k="Média por diária" v={brl(qD.mediaDiaria)} />
                    {qD.custoPorKm != null ? <Highlight k="Custo estimado por km" v={brl(qD.custoPorKm)} /> : <Highlight k="Km Ilimitado" v="Sem limite" />}
                    {qD.caucao > 0 && <Highlight k="Caução (reembolsável)" v={brl(qD.caucao)} />}
                  </div>
                  <Conditions title="Informações importantes:" items={cfg.condicoesDiaria} />
                </div>
                <Actions onWhats={openLead} onLink={copyLink} linkMsg={linkMsg} onBack={() => go(5)} onReset={resetAll} />
              </div>
            )}
          </>
        ) : (
          <>
            {mStep === 1 && (
              <div className="space-y-6">
                <Card title="Escolha o Plano Mensal">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {cfg.planosMensais.map((p) => {
                      const sel = p.id === planId;
                      const pct = Math.round(p.discount * 100);
                      return (
                        <button key={p.id} type="button" onClick={() => setPlanId(p.id)} aria-pressed={sel}
                          className={`border p-4 text-center transition-colors ${sel ? "border-navy-900 bg-mist-50 ring-1 ring-navy-900" : "border-mist-200 bg-white hover:border-slate-400"}`}>
                          <span className="font-display block text-3xl font-extrabold text-navy-900">{p.months}</span>
                          <span className="block text-xs text-slate-500">{p.months === 1 ? "mês" : "meses"}</span>
                          <span className={`mt-2 block text-xs font-semibold ${pct ? "text-wa" : "text-slate-400"}`}>{pct ? `${pct}% de desconto` : "Sem desconto"}</span>
                        </button>
                      );
                    })}
                  </div>
                </Card>
                <LocCard title="Local de Retirada" />
                <Next onClick={() => goM(2)} disabled={!plan}>Selecionar Veículo</Next>
              </div>
            )}

            {mStep === 2 && plan && (
              <div className="space-y-6">
                <Card title="Escolha o Grupo de Veículo">
                  <CategoryChips value={catFilter} onChange={setCatFilter} />
                  <VehicleGrid list={carList} selected={mCarId} onSelect={setMCarId}
                    price={(c) => <>{brl(monthlyRate(c, plan))}<small className="font-normal text-slate-500">/mês</small></>} />
                </Card>
                <Next onClick={() => goM(3)} disabled={!mCar}>Selecionar Quilometragem</Next>
                <Back onClick={() => goM(1)} />
              </div>
            )}

            {mStep === 3 && (
              <div className="space-y-6">
                <Card title="Franquia de Quilometragem Mensal">
                  <div className="space-y-3">
                    {cfg.kmMensal.map((k) => (
                      <Option key={k.id} selected={k.id === mKmId} onClick={() => setMKmId(k.id)} badge={k.badge}
                        title={`${k.name} - ${k.km.toLocaleString("pt-BR")} km/mês`}
                        desc={[k.description, `Km excedente: ${brl(k.extraPerKm)}/km`].filter(Boolean).join(" · ")}
                        price={k.extra > 0 ? `+ ${brl(k.extra)}/mês` : "Incluso no plano"} />
                    ))}
                  </div>
                </Card>
                <Next onClick={() => goM(4)} disabled={!mKm}>Selecionar Proteção</Next>
                <Back onClick={() => goM(2)} />
              </div>
            )}

            {mStep === 4 && mCar && (
              <div className="space-y-6">
                <Card title="Proteção Mensal">
                  <div className="space-y-3">
                    {cfg.protecoes.map((p) => (
                      <Option key={p.slug} selected={mProt === p.slug} onClick={() => setMProt(p.slug)} title={p.name} badge={p.badge}
                        desc={p.description} price={`${brl(protecaoMensal(mCar, p.slug))}/mês`} />
                    ))}
                  </div>
                </Card>
                <Next onClick={() => goM(5)} disabled={!mProt}>Serviços e Itens</Next>
                <Back onClick={() => goM(3)} />
              </div>
            )}

            {mStep === 5 && (
              <div className="space-y-6">
                <Card title="Serviços Adicionais"><Checklist list={cfg.servicosMensais} value={mSvc} onToggle={(id) => setMSvc((l) => toggle(l, id))} unit="/mês" monthly /></Card>
                <Card title="Itens Adicionais"><Checklist list={cfg.itensMensais} value={mItm} onToggle={(id) => setMItm((l) => toggle(l, id))} unit="/mês" monthly /></Card>
                <Next onClick={() => goM(6)}>Ver Orçamento</Next>
                <Back onClick={() => goM(4)} />
              </div>
            )}

            {mStep === 6 && qM && plan && mCar && mKm && mProt && (
              <div className="space-y-3">
                <div className="border border-mist-200 bg-white p-6 sm:p-8">
                  <QuoteHeader title="Plano Mensal" sub={`${plan.name}${plan.discount > 0 ? ` · ${Math.round(plan.discount * 100)}% de desconto` : ""}`} />
                  <Sec title="Veículo"><SRow k={`${mCar.name} (${mCar.similar})`} v={`${brl(qM.vehicle)}/mês`} strong /></Sec>
                  <Sec title="Quilometragem">
                    <SRow k={`${mKm.name} - ${mKm.km.toLocaleString("pt-BR")} km/mês`} v={qM.kmExtra > 0 ? `${brl(qM.kmExtra)}/mês` : "Incluso"} strong />
                    <SRow sub k={`Km excedente: ${brl(mKm.extraPerKm)}/km`} />
                  </Sec>
                  <Sec title="Proteção"><SRow k={cfg.protecoes.find((x) => x.slug === mProt)!.name} v={`${brl(qM.prot)}/mês`} strong /></Sec>
                  {(qM.servicosSel.length > 0 || qM.itensSel.length > 0) && (
                    <Sec title="Adicionais">
                      {[...qM.servicosSel, ...qM.itensSel].map((a) => <SRow key={a.id} k={a.name} v={`${brl(a.total)}/mês`} strong />)}
                    </Sec>
                  )}
                  {qM.taxaPct > 0 && <Sec title="Taxa de Locação"><SRow k={`Taxa de ${qM.taxaPct}%`} v={`${brl(qM.taxaValor)}/mês`} strong /></Sec>}
                  <Total label="MENSALIDADE" value={brl(qM.mensalidade)} />
                  {(plan.months > 1 || qM.caucao > 0) && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {plan.months > 1 && <Highlight k={`Total do contrato (${plan.months}x)`} v={brl(qM.totalContrato)} />}
                      {qM.caucao > 0 && <Highlight k="Caução (reembolsável)" v={brl(qM.caucao)} />}
                    </div>
                  )}
                  <Conditions title="Condições do contrato:" items={[
                    ...cfg.condicoesMensal.slice(0, 2),
                    `Contrato mínimo de ${plan.minDays} dias`,
                    ...(qM.caucao > 0 ? [`Caução de ${brl(qM.caucao)} (devolvida ao final)`] : []),
                    ...cfg.condicoesMensal.slice(2),
                    ...(plan.months > 1 ? [cfg.multaRescisoria] : []),
                  ]} />
                </div>
                <Actions onWhats={openLead} onLink={copyLink} linkMsg={linkMsg} onBack={() => goM(5)} onReset={resetAll} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Resumo lateral */}
      <aside className="h-fit bg-navy-900 p-7 text-white lg:sticky lg:top-28 print:hidden" aria-label="Resumo do orçamento">
        <h2 className="eyebrow text-sky-400">Resumo · {mode === "diaria" ? "Diária" : "Mensal"}</h2>
        {(() => {
          const c = mode === "diaria" ? car : mCar;
          return c ? (
            <div className="mt-5 border-b border-white/10 pb-5">
              <CarArt body={c.body} color={c.color} className="h-20 w-auto" />
              <p className="mt-3 font-semibold">{c.name}</p>
              <p className="text-sm text-white/60">{c.similar}</p>
            </div>
          ) : (
            <p className="mt-5 border-b border-white/10 pb-5 text-sm text-white/50">Nenhum veículo selecionado.</p>
          );
        })()}
        <dl className="space-y-3 py-5 text-sm">
          {mode === "diaria" ? (
            <>
              <ARow k="Retirada" v={periodo ? `${fmtD(periodo.start)} ${fmtT(periodo.start)}` : "—"} />
              <ARow k="Devolução" v={periodo ? `${fmtD(periodo.end)} ${fmtT(periodo.end)}` : "—"} />
              <ARow k="Diárias" v={periodo ? `${periodo.days}${periodo.fraction > 0 ? " + fração" : ""}` : "—"} />
              <ARow k="Km" v={km === "eco" ? "Econômica" : km === "ilimitado" ? "Ilimitado" : "—"} />
              <ARow k="Proteção" v={prot ? cfg.protecoes.find((x) => x.slug === prot)!.name.replace("Proteção ", "") : "—"} />
            </>
          ) : (
            <>
              <ARow k="Plano" v={plan ? plan.name : "—"} />
              <ARow k="Km" v={mKm ? `${mKm.km.toLocaleString("pt-BR")} km/mês` : "—"} />
              <ARow k="Proteção" v={mProt ? cfg.protecoes.find((x) => x.slug === mProt)!.name.replace("Proteção ", "") : "—"} />
            </>
          )}
        </dl>
        {(mode === "diaria" ? qD : qM) && (
          <div className="flex items-baseline justify-between border-t border-white/10 pt-5">
            <span className="font-semibold">{mode === "diaria" ? "Total estimado" : "Mensalidade"}</span>
            <span className="font-display text-2xl font-extrabold text-sky-400">{brl(mode === "diaria" ? qD!.total : qM!.mensalidade)}</span>
          </div>
        )}
      </aside>

      {/* Captura de contato antes do WhatsApp */}
      {leadOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="lead-title" className="fixed inset-0 z-[70] grid place-items-center bg-navy-950/70 p-4"
          onClick={(e) => e.target === e.currentTarget && setLeadOpen(false)} onKeyDown={(e) => e.key === "Escape" && setLeadOpen(false)}>
          <div className="relative w-full max-w-md bg-white p-7">
            <button type="button" onClick={() => setLeadOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-navy-900" aria-label="Fechar">
              <X className="size-5" />
            </button>
            <h3 id="lead-title" className="font-display text-2xl font-bold text-navy-900">Quase lá! 🎉</h3>
            <p className="mt-1 text-sm text-slate-600">Deixe seu contato para receber seu orçamento personalizado</p>
            <div className="mt-6 space-y-4">
              <Field label="Seu nome" error={leadErr.name}>
                <input autoFocus className="field" autoComplete="name" placeholder="Como podemos te chamar?" value={leadName} onChange={(e) => setLeadName(e.target.value)} />
              </Field>
              <Field label="WhatsApp / Telefone" error={leadErr.phone}>
                <input className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="(31) 99999-9999" value={leadPhone} onChange={(e) => setLeadPhone(formatPhone(e.target.value))} />
              </Field>
            </div>
            <button type="button" onClick={() => sendWhatsApp(true)} className="btn-wa mt-6 w-full"><MessageCircle className="size-4" /> Enviar pelo WhatsApp</button>
            <button type="button" onClick={() => sendWhatsApp(false)} className="mt-3 w-full text-center text-sm text-slate-500 underline-offset-2 hover:text-navy-900 hover:underline">
              Pular e enviar sem contato
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================================================================== */
/* PEÇAS                                                                 */
/* ==================================================================== */

function Card({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="border border-mist-200 bg-white p-6">
      <h2 className="font-display mb-5 flex items-center gap-2 text-lg font-bold text-navy-900">
        {icon && <span className="grid size-7 place-items-center bg-mist-100 text-sky-600">{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}

function LocCard({ title }: { title: string }) {
  const addr = [site.store.address, site.store.city].filter(Boolean).join(" - ");
  return (
    <Card title={title} icon={<MapPin className="size-4" />}>
      <div className="flex items-center gap-3 bg-mist-50 px-4 py-3">
        <MapPin className="size-5 shrink-0 text-sky-600" />
        <div>
          <p className="text-sm font-semibold text-navy-900">{cfg.loja.nome}</p>
          <p className="text-xs text-slate-500">{addr || "Endereço em breve"}</p>
        </div>
      </div>
    </Card>
  );
}

function DaysInfo({ p }: { p: Periodo }) {
  return (
    <div className="mt-5">
      <div className="grid grid-cols-3 gap-3">
        {[[p.days, "Diárias"], [p.weekdayDays, "Dias úteis"], [p.weekendDays, "Fim de sem."]].map(([n, l]) => (
          <div key={l} className="bg-mist-50 py-3 text-center">
            <p className="font-display text-2xl font-extrabold text-navy-900">{n}</p>
            <p className="text-[11px] tracking-wide text-slate-500 uppercase">{l}</p>
          </div>
        ))}
      </div>
      {p.fractionLabel && <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-sky-600"><Clock className="size-3.5" />{p.fractionLabel}</p>}
      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        {p.season && <Sun className="size-3.5" />}
        {seasonLabel(p)}
        {p.weekendDays > 0 && ` • Acréscimo de ${Math.round(cfg.acrescimoFimDeSemana * 100)}% nos fins de semana`}
      </p>
    </div>
  );
}

function CategoryChips({ value, onChange }: { value: CategoryId | ""; onChange: (v: CategoryId | "") => void }) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {[{ id: "", name: "Todos" }, ...categories].map((c) => (
        <button key={c.id} type="button" onClick={() => onChange(c.id as CategoryId | "")} aria-pressed={value === c.id}
          className={`border px-3 py-1.5 text-xs font-medium ${value === c.id ? "border-navy-900 bg-navy-900 text-white" : "border-mist-200 bg-white text-slate-600 hover:border-navy-900"}`}>
          {c.name}
        </button>
      ))}
    </div>
  );
}

function VehicleGrid({ list, selected, onSelect, price }: { list: Car[]; selected: string; onSelect: (id: string) => void; price: (c: Car) => React.ReactNode }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {list.map((c) => {
        const sel = c.id === selected;
        return (
          <button key={c.id} type="button" onClick={() => onSelect(c.id)} aria-pressed={sel}
            className={`relative flex flex-col border bg-white p-5 text-left transition-colors ${sel ? "border-navy-900 ring-1 ring-navy-900" : "border-mist-200 hover:border-slate-400"}`}>
            {sel && <Check className="absolute top-4 right-4 size-5 text-sky-600" />}
            <CarArt body={c.body} color={c.color} className="h-16 w-auto self-start" />
            <span className="mt-3 font-semibold text-navy-900">{c.name}</span>
            <span className="text-sm text-slate-500">{c.similar} · {c.transmission === "automatico" ? "Automático" : "Manual"}</span>
            <span className="font-display mt-3 text-lg font-extrabold text-navy-900">{price(c)}</span>
          </button>
        );
      })}
    </div>
  );
}

function Option({ selected, onClick, title, desc, note, price, badge }: {
  selected: boolean; onClick: () => void; title: string; desc?: string; note?: string; price: string; badge?: string;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected}
      className={`flex w-full items-start justify-between gap-4 border p-5 text-left transition-colors ${selected ? "border-navy-900 bg-mist-50 ring-1 ring-navy-900" : "border-mist-200 bg-white hover:border-slate-400"}`}>
      <span>
        <span className="flex flex-wrap items-center gap-2 font-semibold text-navy-900">
          {title}
          {badge && <span className="bg-sky-400/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-sky-700 uppercase">{badge}</span>}
        </span>
        {desc && <span className="mt-1 block text-sm text-slate-500">{desc}</span>}
        {note && <span className="mt-1 block text-xs text-sky-700 italic">💡 {note}</span>}
      </span>
      <span className="shrink-0 text-sm font-bold whitespace-nowrap text-navy-900">{price}</span>
    </button>
  );
}

function Checklist({ list, value, onToggle, unit, monthly }: { list: Adicional[]; value: string[]; onToggle: (id: string) => void; unit: string; monthly?: boolean }) {
  if (!list.length) return <p className="text-sm text-slate-500">Nenhuma opção disponível.</p>;
  return (
    <div className="space-y-3">
      {list.map((a) => {
        const on = value.includes(a.id);
        return (
          <label key={a.id} className={`flex cursor-pointer items-start gap-4 border p-4 ${on ? "border-navy-900 bg-mist-50" : "border-mist-200 bg-white"}`}>
            <input type="checkbox" className="mt-1 size-4 accent-navy-900" checked={on} onChange={() => onToggle(a.id)} />
            <span className="flex-1">
              <span className="block font-semibold text-navy-900">{a.name}</span>
              <span className="text-sm text-slate-500">{a.description}</span>
            </span>
            <span className="text-sm font-semibold whitespace-nowrap text-navy-900">{brl(a.price)}{monthly || a.perDay ? unit : ""}</span>
          </label>
        );
      })}
    </div>
  );
}

function Next({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="btn-dark w-full">{children} <ArrowRight className="size-4" /></button>;
}
function Back({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} className="btn-outline w-full"><ArrowLeft className="size-4" /> Voltar</button>;
}

function QuoteHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6 border-b border-mist-200 pb-5 text-center">
      <p className="eyebrow text-sky-600">Orçamento · {site.name}</p>
      <p className="font-display mt-1 text-2xl font-bold text-navy-900">{title}</p>
      {sub && <p className="text-sm text-slate-500">{sub}</p>}
    </div>
  );
}
function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-mist-100 py-4">
      <p className="eyebrow mb-2 text-slate-400">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
function SRow({ k, v, sub, strong, accent }: { k: string; v?: string; sub?: boolean; strong?: boolean; accent?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${sub ? "text-xs text-slate-500" : "text-sm text-slate-700"} ${accent ? "!text-wa font-semibold" : ""}`}>
      <span>{k}</span>
      {v && <span className={`text-right whitespace-nowrap ${strong ? "font-semibold text-navy-900" : ""}`}>{v}</span>}
    </div>
  );
}
function Total({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4 flex items-baseline justify-between bg-navy-900 px-5 py-4 text-white">
      <span className="font-bold tracking-wider">{label}</span>
      <span className="font-display text-2xl font-extrabold text-sky-400">{value}</span>
    </div>
  );
}
function Highlight({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-mist-50 p-4 text-center">
      <p className="text-xs text-slate-500">{k}</p>
      <p className="font-display mt-1 text-lg font-extrabold text-navy-900">{v}</p>
    </div>
  );
}
function Conditions({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5 border-l-2 border-sky-400 bg-mist-50 p-4 text-xs leading-relaxed text-slate-600">
      <strong className="text-navy-900">{title}</strong>
      <ul className="mt-1 space-y-0.5">{items.map((i) => <li key={i}>• {i}</li>)}</ul>
    </div>
  );
}
function Actions({ onWhats, onLink, linkMsg, onBack, onReset }: { onWhats: () => void; onLink: () => void; linkMsg: string; onBack: () => void; onReset: () => void }) {
  return (
    <div className="space-y-3 print:hidden">
      <button type="button" onClick={onWhats} className="btn-wa w-full"><MessageCircle className="size-4" /> Enviar Orçamento pelo WhatsApp</button>
      <button type="button" onClick={() => window.print()} className="btn-dark w-full"><FileDown className="size-4" /> Baixar Orçamento em PDF</button>
      <button type="button" onClick={onLink} className="btn-outline w-full"><Link2 className="size-4" /> {linkMsg || "Gerar Link Compartilhável"}</button>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={onBack} className="btn-outline"><ArrowLeft className="size-4" /> Voltar</button>
        <button type="button" onClick={onReset} className="btn-outline"><RotateCcw className="size-4" /> Novo Orçamento</button>
      </div>
    </div>
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
function ARow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-white/60">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  );
}
