"use client";
import { useState } from "react";
import { Field, PageHead, input, btn, sendMail, validEmail, checkFile, NoEmail, FileNote } from "@/components/ui";

const BANDS = ["10–25", "26–50", "51–100", "101–250", "251–500", "500+"];
const CATS = ["Corporate gifts", "Branded leather / accessories", "Promotional merchandise", "Uniforms", "Hospitality textiles", "Custom packaging", "Private label", "Other custom manufacturing"];

export default function B2B() {
  const [f, setF] = useState({ contact: "", company: "", email: "", phone: "", website: "", industry: "", category: CATS[0], band: BANDS[0], budget: "", brief: "", materials: "", branding: "", destination: "", date: "" });
  const [file, setFile] = useState<File>();
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [noEmail, setNoEmail] = useState(false);
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const t = (k: keyof typeof f, label: string, extra?: string) => (
    <Field label={label} error={errs[k]}><input className={input} value={f[k]} onChange={(e) => set(k, e.target.value)} {...(extra ? { type: extra } : {})} /></Field>
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.contact.trim()) er.contact = "Required";
    if (!f.company.trim()) er.company = "Required";
    if (!validEmail(f.email)) er.email = "Enter a valid work email";
    if (!f.brief.trim()) er.brief = "Please describe the project";
    const fe = checkFile(file, ["application/pdf", "image/jpeg", "image/png", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"], 10);
    if (fe) er.file = fe;
    setErrs(er);
    if (Object.keys(er).length) return;
    const ok = sendMail(`B2B project brief — ${f.company}`, [
      `Contact: ${f.contact}`, `Company: ${f.company}`, `Email: ${f.email}`, `Phone: ${f.phone}`, `Website: ${f.website}`, `Industry: ${f.industry}`,
      `Category: ${f.category}`, `Estimated quantity band: ${f.band} (indicative, not an MOQ)`, `Target budget (CAD): ${f.budget || "n/a"}`,
      `Materials: ${f.materials}`, `Branding / packaging: ${f.branding}`, `Destination: ${f.destination}`, `Needed by: ${f.date}`,
      `Spec sheet: ${file ? file.name + " (to be sent by reply)" : "none"}`, "", `Brief: ${f.brief}`,
    ]);
    setNoEmail(!ok);
  }

  return (
    <>
      <PageHead kicker="B2B Sourcing" title="Sourcing and production, built around your brief." body="From branded corporate gifts to custom manufacturing and institutional requirements, we connect Canadian businesses with sourcing and production capabilities in Pakistan. Projects are quotation-led; quantity bands below are indicative, not guaranteed minimum order quantities." />
      <form onSubmit={submit} noValidate className="mx-auto max-w-3xl space-y-6 px-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {t("contact", "Contact name")}{t("company", "Company")}{t("email", "Work email", "email")}{t("phone", "Phone")}{t("website", "Website (optional)")}{t("industry", "Industry")}
          <Field label="Project category"><select className={input} value={f.category} onChange={(e) => set("category", e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Estimated quantity (units)"><select className={input} value={f.band} onChange={(e) => set("band", e.target.value)}>{BANDS.map((b) => <option key={b}>{b}</option>)}</select></Field>
          {t("budget", "Target budget (CAD)")}{t("date", "Desired delivery date")}{t("materials", "Materials")}{t("branding", "Branding & packaging")}
        </div>
        {t("destination", "Delivery destination")}
        <Field label="Project brief and specifications" error={errs.brief}><textarea rows={6} className={input} value={f.brief} onChange={(e) => set("brief", e.target.value)} /></Field>
        <Field label="Spec sheet or reference (PDF, JPG, PNG, XLSX, max 10 MB)" error={errs.file}><input type="file" accept=".pdf,.jpg,.jpeg,.png,.xlsx" className={input} onChange={(e) => setFile(e.target.files?.[0])} /></Field>
        <FileNote />
        <button className={`${btn} w-full sm:w-auto`}>Submit Your Project Brief</button>
        {noEmail && <NoEmail />}
      </form>
    </>
  );
}
