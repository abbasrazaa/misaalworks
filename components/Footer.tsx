import Link from "next/link";
import { EMAIL } from "./ui";

export default function Footer() {
  return (
    <footer className="mt-24 bg-charcoal text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
        <div>
          <p className="font-serif text-2xl tracking-[0.2em]">MISAAL WORKS</p>
          <p className="mt-3 text-sm text-ivory/70">Pakistani craftsmanship. Considered sourcing. Canadian-facing service.</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-taupe">Services</p>
          <Link className="block hover:text-taupe" href="/bespoke">Bespoke</Link>
          <Link className="block hover:text-taupe" href="/concierge">Personal Shopping</Link>
          <Link className="block hover:text-taupe" href="/b2b">B2B Sourcing</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-taupe">Contact</p>
          {EMAIL ? <a className="block hover:text-taupe" href={`mailto:${EMAIL}`}>{EMAIL}</a> : <p className="text-ivory/60">Email coming soon</p>}
        </div>
      </div>
      <p className="border-t border-ivory/10 py-5 text-center text-[11px] uppercase tracking-[0.2em] text-ivory/50">© 2026 MISAAL WORKS</p>
    </footer>
  );
}
