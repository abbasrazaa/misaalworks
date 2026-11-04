"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, PageHead, input, btn, btnLine, sendMail, validEmail, validUrl, checkFile, NoEmail, FileNote } from "@/components/ui";

type Item = { retailer: string; url: string; name: string; size: string; colour: string; qty: string; pkr: string; file?: File };
const blank = (): Item => ({ retailer: "", url: "", name: "", size: "", colour: "", qty: "1", pkr: "" });
const FX = parseFloat(process.env.NEXT_PUBLIC_FX_PKR_PER_CAD ?? "200");
const FEE = parseFloat(process.env.NEXT_PUBLIC_FEE_PCT ?? "15");
const FREIGHT = parseFloat(process.env.NEXT_PUBLIC_FREIGHT_CAD ?? "30");
const cad = (n: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

export default function Concierge() {
  const [items, setItems] = useState<Item[]>([blank()]);
  const [c, setC] = useState({ name: "", email: "", city: "", province: "", postal: "", budget: "", timing: "", notes: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [noEmail, setNoEmail] = useState(false);
  const upd = (i: number, k: keyof Item, v: string | File | undefined) => setItems((a) => a.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const setField = (k: string, v: string) => setC((s) => ({ ...s, [k]: v }));

  const pkrTotal = items.reduce((s, it) => s + (parseFloat(it.pkr) || 0) * (parseInt(it.qty) || 1), 0);
  const product = pkrTotal / FX, fee = product * (FEE / 100), freight = pkrTotal > 0 ? FREIGHT : 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!c.name.trim()) er.name = "Required";
    if (!validEmail(c.email)) er.email = "Enter a valid email";
    if (!c.city.trim()) er.city = "Required";
    items.forEach((it, i) => {
      if (!validUrl(it.url)) er[`url${i}`] = "Paste a full link starting with https://";
      if (!it.name.trim()) er[`name${i}`] = "Required";
      if (!(parseInt(it.qty) > 0)) er[`qty${i}`] = "Min 1";
      const fe = checkFile(it.file, ["image/jpeg", "image/png", "image/webp"], 5);
      if (fe) er[`file${i}`] = fe;
    });
    setErrs(er);
    if (Object.keys(er).length) return;
    const ok = sendMail(`Personal shopping request (${items.length} item${items.length > 1 ? "s" : ""})`, [
      `Name: ${c.name}`, `Email: ${c.email}`, `Delivery: ${c.city}, ${c.province} ${c.postal}, Canada`,
      `Budget (CAD): ${c.budget || "n/a"}`, `Timing: ${c.timing || "n/a"}`, `Notes: ${c.notes || "none"}`, "",
      ...items.flatMap((it, i) => [`ITEM ${i + 1}: ${it.name}`, `  Retailer: ${it.retailer}`, `  URL: ${it.url}`, `  Size: ${it.size} | Colour: ${it.colour} | Qty: ${it.qty}`, `  Screenshot: ${it.file ? it.file.name + " (to be sent by reply)" : "none"}`]),
    ]);
    setNoEmail(!ok);
  }

  return (
    <>
      <PageHead kicker="Brand Concierge" title="Seen it in Pakistan. Want it in Canada?" body="Send us the link. Our Lahore team checks availability and sends an itemised CAD quotation. Nothing is purchased until you approve it and payment is verified. We are an independent purchasing service, not affiliated with the brands you request." />
      <form onSubmit={submit} noValidate className="mx-auto max-w-3xl space-y-8 px-5">
        {items.map((it, i) => (
          <fieldset key={i} className="space-y-4 border border-taupe/40 bg-soft p-5">
            <div className="flex items-center justify-between"><legend className="font-serif text-2xl">Piece {i + 1}</legend>
              {items.length > 1 && <button type="button" aria-label="Remove piece" onClick={() => setItems((a) => a.filter((_, j) => j !== i))} className="p-2"><Trash2 size={18} /></button>}</div>
            <Field label="Product link" error={errs[`url${i}`]}><input type="url" inputMode="url" placeholder="https://" className={input} value={it.url} onChange={(e) => upd(i, "url", e.target.value.trim())} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Brand / retailer"><input className={input} value={it.retailer} onChange={(e) => upd(i, "retailer", e.target.value)} /></Field>
              <Field label="Product name" error={errs[`name${i}`]}><input className={input} value={it.name} onChange={(e) => upd(i, "name", e.target.value)} /></Field>
              <Field label="Size"><input className={input} value={it.size} onChange={(e) => upd(i, "size", e.target.value)} /></Field>
              <Field label="Colour"><input className={input} value={it.colour} onChange={(e) => upd(i, "colour", e.target.value)} /></Field>
              <Field label="Quantity" error={errs[`qty${i}`]}><input inputMode="numeric" className={input} value={it.qty} onChange={(e) => upd(i, "qty", e.target.value)} /></Field>
              <Field label="Listed price (PKR, optional)"><input inputMode="decimal" className={input} value={it.pkr} onChange={(e) => upd(i, "pkr", e.target.value)} /></Field>
            </div>
            <Field label="Screenshot (JPG, PNG, WebP, max 5 MB)" error={errs[`file${i}`]}><input type="file" accept="image/jpeg,image/png,image/webp" className={input} onChange={(e) => upd(i, "file", e.target.files?.[0])} /></Field>
          </fieldset>
        ))}
        <button type="button" onClick={() => setItems((a) => [...a, blank()])} className={btnLine}><Plus size={16} className="mr-2" />Add another piece</button>
        <FileNote />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={errs.name}><input className={input} value={c.name} onChange={(e) => setField("name", e.target.value)} /></Field>
          <Field label="Email" error={errs.email}><input type="email" className={input} value={c.email} onChange={(e) => setField("email", e.target.value)} /></Field>
          <Field label="Delivery city" error={errs.city}><input className={input} value={c.city} onChange={(e) => setField("city", e.target.value)} /></Field>
          <Field label="Province"><input className={input} value={c.province} onChange={(e) => setField("province", e.target.value)} /></Field>
          <Field label="Postal code"><input className={input} value={c.postal} onChange={(e) => setField("postal", e.target.value)} /></Field>
          <Field label="Budget (CAD, optional)"><input inputMode="decimal" className={input} value={c.budget} onChange={(e) => setField("budget", e.target.value)} /></Field>
          <Field label="Needed by (optional)"><input className={input} value={c.timing} onChange={(e) => setField("timing", e.target.value)} /></Field>
        </div>
        <Field label="Notes, alternative sizes or colours"><textarea rows={3} className={input} value={c.notes} onChange={(e) => setField("notes", e.target.value)} /></Field>

        <div className="border border-taupe/40 bg-soft p-5">
          <h2 className="text-2xl">How your quote is built</h2>
          <p className="text-sm text-charcoal/70">Illustrative only. Your quotation states the actual exchange rate, fee, freight and any duties or taxes before you pay.</p>
          <dl className="mt-4 space-y-2 text-sm">
            {[["Retail price (PKR)", pkrTotal ? `PKR ${pkrTotal.toLocaleString()}` : "—"], [`Converted at PKR ${FX} / CAD`, pkrTotal ? cad(product) : "—"], [`Concierge fee (${FEE}%)`, pkrTotal ? cad(fee) : "—"], ["International freight", pkrTotal ? cad(freight) : "—"]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-taupe/20 pb-2"><dt>{k}</dt><dd>{v}</dd></div>))}
            <div className="flex justify-between pt-1 font-medium"><dt>Estimated total (excl. duties &amp; taxes)</dt><dd>{pkrTotal ? cad(product + fee + freight) : "—"}</dd></div>
          </dl>
        </div>
        <button className={`${btn} w-full sm:w-auto`}>Submit Your Request</button>
        {noEmail && <NoEmail />}
      </form>
    </>
  );
}
