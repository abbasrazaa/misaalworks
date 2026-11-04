import Link from "next/link";
import { Scissors, ShoppingBag, Briefcase, MapPin, Camera, FileText } from "lucide-react";
import { btn, btnLine } from "@/components/ui";

const models = [
  { icon: Scissors, title: "Bespoke Atelier", line: "Made for you.", body: "Custom garments and artisan pieces made around your measurements and specifications.", href: "/bespoke", cta: "Explore Bespoke" },
  { icon: ShoppingBag, title: "Brand Concierge", line: "You find it. We get it.", body: "Send us a link from a Pakistani brand. We check availability, quote in CAD, purchase, inspect and ship to Canada.", href: "/concierge", cta: "Request a Piece" },
  { icon: Briefcase, title: "B2B Sourcing", line: "Built around your brief.", body: "Corporate gifting, custom production and institutional procurement for Canadian businesses.", href: "/b2b", cta: "Discuss a Project" },
];
const trust = [
  { icon: FileText, t: "Clarity before commitment", d: "Itemised CAD quotations. Nothing is purchased or produced until you approve and payment is verified." },
  { icon: Camera, t: "Inspection in Lahore", d: "Our Lahore team inspects each item against your specification and documents its condition." },
  { icon: MapPin, t: "Canadian-facing service", d: "Communication, quotations and order coordination handled for Canadian clients." },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-5 pb-20 pt-20 text-center sm:pt-32">
        <p className="text-[11px] uppercase tracking-[0.3em] text-taupe">Lahore Craft × Toronto Care</p>
        <h1 className="mt-6 text-5xl leading-[1.05] sm:text-7xl">Pakistan, within reach.</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/80">Bespoke pieces made to your specifications, your favourite Pakistani brands purchased on your behalf, and tailored sourcing for business.</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="#services" className={btn}>Explore Our Services</Link>
          <Link href="/concierge" className={btnLine}>Request a Piece</Link>
        </div>
      </section>

      <section id="services" className="mx-auto grid max-w-6xl gap-5 px-5 md:grid-cols-3">
        {models.map(({ icon: Icon, ...m }) => (
          <article key={m.title} className="flex flex-col border border-taupe/40 bg-soft p-8">
            <Icon size={22} className="text-taupe" />
            <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-taupe">{m.title}</p>
            <h2 className="mt-2 text-3xl">{m.line}</h2>
            <p className="mt-4 flex-1 leading-relaxed text-charcoal/80">{m.body}</p>
            <Link href={m.href} className={`${btnLine} mt-8`}>{m.cta}</Link>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5">
        <h2 className="text-center text-4xl sm:text-5xl">Two hubs. One considered experience.</h2>
        <div className="mt-10 grid gap-px bg-taupe/40 md:grid-cols-2">
          <div className="bg-soft p-10"><p className="text-[11px] uppercase tracking-[0.2em] text-taupe">Lahore</p><p className="mt-3 font-serif text-2xl">Production, sourcing, inspection</p><p className="mt-3 text-charcoal/80">Maker and supplier relationships, purchasing, quality control and packaging preparation.</p></div>
          <div className="bg-soft p-10"><p className="text-[11px] uppercase tracking-[0.2em] text-taupe">Toronto</p><p className="mt-3 font-serif text-2xl">Client service and coordination</p><p className="mt-3 text-charcoal/80">Customer communication, CAD quotations, order coordination and support.</p></div>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {trust.map(({ icon: Icon, t, d }) => (
            <div key={t}><Icon size={20} className="text-taupe" /><h3 className="mt-3 text-2xl">{t}</h3><p className="mt-2 text-charcoal/80">{d}</p></div>
          ))}
        </div>
      </section>
    </>
  );
}
