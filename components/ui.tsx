import { ReactNode } from "react";
export const input = "w-full border border-taupe/60 bg-soft px-3 py-3 text-base outline-none focus:border-charcoal";
export const btn = "inline-flex min-h-12 items-center justify-center bg-charcoal px-7 text-xs uppercase tracking-[0.18em] text-ivory hover:bg-charcoal/85 disabled:opacity-50";
export const btnLine = "inline-flex min-h-12 items-center justify-center border border-charcoal px-7 text-xs uppercase tracking-[0.18em] hover:bg-charcoal hover:text-ivory";
export const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-charcoal/70">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-[#8a3b2e]">{error}</span>}
    </label>
  );
}
export function PageHead({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <header className="mx-auto max-w-3xl px-5 pb-10 pt-16 sm:pt-24">
      <p className="text-[11px] uppercase tracking-[0.22em] text-taupe">{kicker}</p>
      <h1 className="mt-4 text-4xl leading-tight sm:text-6xl">{title}</h1>
      <p className="mt-5 text-lg leading-relaxed text-charcoal/80">{body}</p>
    </header>
  );
}
export const validUrl = (s: string) => { try { const u = new URL(s); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; } };
export const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export function checkFile(f: File | undefined, types: string[], mb: number) {
  if (!f) return "";
  if (!types.includes(f.type)) return "Unsupported file type";
  if (f.size > mb * 1048576) return `File exceeds ${mb} MB`;
  return "";
}
// Opens the customer's mail app with a structured request. Files cannot be attached this way.
export function sendMail(subject: string, lines: string[]) {
  if (!EMAIL) return false;
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  return true;
}
export const NoEmail = () => (
  <p className="mt-3 text-sm text-[#8a3b2e]">Contact email is not configured. Set NEXT_PUBLIC_CONTACT_EMAIL in Vercel to enable submission.</p>
);
export const FileNote = () => (
  <p className="text-sm text-charcoal/70">Files can&apos;t be attached from this form yet. We&apos;ll ask you to reply to our confirmation with any images or documents.</p>
);
