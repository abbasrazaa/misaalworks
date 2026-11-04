"use client";
import { useState } from "react";
import { Field, PageHead, input, btn, sendMail, validEmail, checkFile, NoEmail, FileNote } from "@/components/ui";

const GARMENTS: Record<string, string[]> = {
  "Kurta / Shalwar Kameez": ["Chest", "Shoulder", "Sleeve length", "Armhole", "Waist", "Hip", "Garment length", "Trouser length"],
  "Suit / Blazer": ["Chest", "Shoulder", "Sleeve length", "Waist", "Hip", "Jacket length", "Neck"],
  "Trousers": ["Waist", "Hip", "Inseam", "Trouser length"],
  "Women's dress / Kameez": ["Bust", "Shoulder", "Sleeve length", "Armhole", "Waist", "Hip", "Garment length"],
};
const STEPS = ["Quote & 50% deposit", "Production (typically 3–4 weeks)", "Quality control", "Balance & dispatch"];
const cad = (n: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

export default function Bespoke() {
  const [garment, setGarment] = useState(Object.keys(GARMENTS)[0]);
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [vals, setVals] = useState<Record<string, string>>({});
  const [f, setF] = useState({ name: "", email: "", height: "", fit: "Regular", notes: "", total: "" });
  const [confirm, setConfirm] = useState(false);
  const [photo, setPhoto] = useState<File>();
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [noEmail, setNoEmail] = useState(false);

  const total = parseFloat(f.total) || 0;
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = "Required";
    if (!validEmail(f.email)) er.email = "Enter a valid email";
    GARMENTS[garment].forEach((m) => { if (!(parseFloat(vals[m]) > 0)) er[m] = "Required"; });
    if (!confirm) er.confirm = "Please confirm your measurements";
    const pe = checkFile(photo, ["image/jpeg", "image/png", "image/webp"], 5);
    if (pe) er.photo = pe;
    setErrs(er);
    if (Object.keys(er).length) return;
    const toCm = (v: string) => (unit === "in" ? (parseFloat(v) * 2.54).toFixed(1) : parseFloat(v).toFixed(1));
    const ok = sendMail(`Bespoke enquiry — ${garment}`, [
      `Name: ${f.name}`, `Email: ${f.email}`, `Garment: ${garment}`, `Fit: ${f.fit}`, `Height (cm): ${f.height || "n/a"}`,
      "Measurements (cm):", ...GARMENTS[garment].map((m) => `  ${m}: ${toCm(vals[m])}`),
      `Reference photo: ${photo ? photo.name + " (to be sent by reply)" : "none"}`, `Notes: ${f.notes || "none"}`,
    ]);
    setNoEmail(!ok);
  }

  return (
    <>
      <PageHead kicker="Bespoke Atelier" title="Made for you." body="Custom garments and artisan pieces, made around your measurements. Submitting this form is an enquiry, not an order: production begins only after you approve a quotation and your 50% deposit is verified." />
      <section className="mx-auto max-w-3xl px-5">
        <ol className="grid gap-px bg-taupe/40 sm:grid-cols-4">
          {STEPS.map((s, i) => <li key={s} className="bg-soft p-4 text-sm"><span className="text-taupe">0{i + 1}</span><br />{s}</li>)}
        </ol>
        <p className="mt-2 text-sm text-charcoal/70">Lead times are confirmed individually in your quotation.</p>

        <form onSubmit={submit} className="mt-10 space-y-6" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errs.name}><input className={input} value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Email" error={errs.email}><input type="email" className={input} value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field label="Garment"><select className={input} value={garment} onChange={(e) => { setGarment(e.target.value); setErrs({}); }}>{Object.keys(GARMENTS).map((g) => <option key={g}>{g}</option>)}</select></Field>
            <Field label="Fit preference"><select className={input} value={f.fit} onChange={(e) => set("fit", e.target.value)}>{["Slim", "Regular", "Relaxed"].map((x) => <option key={x}>{x}</option>)}</select></Field>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl">Measurements</h2>
              <div className="flex border border-taupe/60">{(["cm", "in"] as const).map((u) => <button type="button" key={u} onClick={() => setUnit(u)} className={`min-h-10 px-4 text-xs uppercase tracking-widest ${unit === u ? "bg-charcoal text-ivory" : ""}`}>{u}</button>)}</div>
            </div>
            <p className="mt-1 text-sm text-charcoal/70">Measure over fitted clothing, relaxed, with a soft tape. Accurate measurements are the customer&apos;s responsibility; our team reviews them before production where feasible. Stored in centimetres.</p>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {GARMENTS[garment].map((m) => (
                <Field key={m} label={`${m} (${unit})`} error={errs[m]}>
                  <input inputMode="decimal" className={input} value={vals[m] ?? ""} onChange={(e) => setVals((v) => ({ ...v, [m]: e.target.value }))} />
                </Field>
              ))}
              <Field label="Height (cm, optional)"><input inputMode="decimal" className={input} value={f.height} onChange={(e) => set("height", e.target.value)} /></Field>
            </div>
          </div>

          <Field label="Reference photo (JPG, PNG, WebP, max 5 MB)" error={errs.photo}><input type="file" accept="image/jpeg,image/png,image/webp" className={input} onChange={(e) => setPhoto(e.target.files?.[0])} /></Field>
          <FileNote />
          <Field label="Design, material and other notes"><textarea rows={4} className={input} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></Field>

          <div className="border border-taupe/40 bg-soft p-5">
            <h3 className="text-xl">Deposit estimator</h3>
            <p className="text-sm text-charcoal/70">Enter an approved quotation total to see how payment splits. Your quotation states the final amounts.</p>
            <div className="mt-3 max-w-xs"><Field label="Approved total (CAD)"><input inputMode="decimal" className={input} value={f.total} onChange={(e) => set("total", e.target.value)} /></Field></div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-sm"><div><dt className="text-charcoal/60">Total</dt><dd className="font-medium">{cad(total)}</dd></div><div><dt className="text-charcoal/60">Deposit (50%)</dt><dd className="font-medium">{cad(total / 2)}</dd></div><div><dt className="text-charcoal/60">Balance before dispatch</dt><dd className="font-medium">{cad(total / 2)}</dd></div></dl>
          </div>

          <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-5 w-5" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} />I confirm these measurements are accurate to the best of my knowledge.</label>
          {errs.confirm && <p className="text-sm text-[#8a3b2e]">{errs.confirm}</p>}
          <button className={`${btn} w-full sm:w-auto`}>Commission Your Piece</button>
          {noEmail && <NoEmail />}
        </form>
      </section>
    </>
  );
}
