"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { formatPhone, onlyDigits, whatsappLink } from "@/lib/whatsapp";

const subjects = ["Reserva", "Plano mensal / empresas", "Dúvida sobre locação em andamento", "Outro assunto"];

export function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", subject: subjects[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: k === "phone" ? formatPhone(e.target.value) : e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Informe seu nome.";
    if (onlyDigits(form.phone).length < 10) errs.phone = "Informe um telefone com DDD.";
    if (form.message.trim().length < 5) errs.message = "Escreva sua mensagem.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const text = `*${form.subject}*\n\n${form.message}\n\n— ${form.name} · ${form.phone}`;
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5 border border-mist-200 bg-white p-7 sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="label">Nome</span>
          <input className="field" autoComplete="name" value={form.name} onChange={update("name")} />
          {errors.name && <span role="alert" className="mt-1 block text-sm text-red-600">{errors.name}</span>}
        </label>
        <label className="block">
          <span className="label">Telefone</span>
          <input className="field" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" value={form.phone} onChange={update("phone")} />
          {errors.phone && <span role="alert" className="mt-1 block text-sm text-red-600">{errors.phone}</span>}
        </label>
      </div>
      <label className="block">
        <span className="label">Assunto</span>
        <select className="field" value={form.subject} onChange={update("subject")}>
          {subjects.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="label">Mensagem</span>
        <textarea className="field min-h-32" value={form.message} onChange={update("message")} />
        {errors.message && <span role="alert" className="mt-1 block text-sm text-red-600">{errors.message}</span>}
      </label>
      <button type="submit" className="btn-wa w-full sm:w-auto">
        <MessageCircle className="size-4" /> Enviar pelo WhatsApp
      </button>
    </form>
  );
}
