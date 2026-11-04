"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/bespoke", label: "Bespoke" },
  { href: "/concierge", label: "Personal Shopping" },
  { href: "/b2b", label: "B2B Sourcing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-taupe/30 bg-ivory/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="font-serif text-2xl tracking-[0.2em]" onClick={() => setOpen(false)}>MISAAL <span className="text-xs tracking-[0.3em]">WORKS</span></Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => <Link key={l.href} href={l.href} className="text-[11px] uppercase tracking-[0.18em] hover:text-taupe">{l.label}</Link>)}
          <Link href="/concierge" className="bg-charcoal px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-ivory">Start an Enquiry</Link>
        </nav>
        <button className="p-2 md:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-taupe/30 bg-ivory px-5 pb-6 md:hidden">
          {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block border-b border-taupe/20 py-4 text-xs uppercase tracking-[0.18em]">{l.label}</Link>)}
          <Link href="/concierge" onClick={() => setOpen(false)} className="mt-5 flex min-h-12 items-center justify-center bg-charcoal text-xs uppercase tracking-[0.18em] text-ivory">Start an Enquiry</Link>
        </nav>
      )}
    </header>
  );
}
