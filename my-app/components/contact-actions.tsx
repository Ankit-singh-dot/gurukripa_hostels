import { telHref, waHref } from "@/lib/hostels";

/** Call / WhatsApp / Directions buttons. Call and WhatsApp render only once a number is set in lib/hostels.ts. */ 
export function ContactActions({
  mapUrl,
  message,
  tone = "light",
}: {
  mapUrl?: string;
  message?: string;
  tone?: "light" | "dark";
}) {
  const tel = telHref();
  const wa = waHref(message);
  const primary =
    tone === "dark" ? "bg-marigold text-ink hover:bg-marigold-soft" : "bg-ink text-paper hover:bg-ink-2";
  const secondary =
    tone === "dark"
      ? "border border-line-ink text-paper hover:border-paper"
      : "border border-line text-ink hover:border-ink";

  return (
    <div className="flex flex-wrap gap-3">
      {wa && (
        <a href={wa} target="_blank" rel="noopener" className={`rounded-full px-6 py-3.5 text-[0.92rem] transition-colors ${primary}`}>
          Message on WhatsApp
        </a>
      )}
      {tel && (
        <a href={tel} className={`rounded-full px-6 py-3.5 text-[0.92rem] transition-colors ${wa ? secondary : primary}`}>
          Call the warden
        </a>
      )}
      {mapUrl && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener"
          className={`rounded-full px-6 py-3.5 text-[0.92rem] transition-colors ${tel || wa ? secondary : primary}`}
        >
          Get directions ↗
        </a>
      )}
    </div>
  );
}
