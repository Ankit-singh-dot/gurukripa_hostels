import Link from "next/link";
import { hostels, site, telHref, waHref } from "@/lib/hostels";
import { Parallax } from "./motion";
import { Logo } from "./nav";

export function Footer() {
  const tel = telHref();
  const wa = waHref();
  return (
    <footer className="grain relative bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-20 md:px-10 md:pt-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo size={64} />
            <p className="mt-8 max-w-sm font-serif text-3xl leading-tight text-paper/90">
              A second home for students who came to Kota to work hard.
            </p>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow text-marigold">Residences</p>
            <ul className="mt-5 space-y-2.5 text-[0.95rem] text-paper/70">
              {hostels.map((h) => (
                <li key={h.slug}>
                  <Link href={`/residences/${h.slug}`} className="link-u hover:text-paper">
                    {h.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-marigold">Reach us</p>
            <ul className="mt-5 space-y-2.5 text-[0.95rem] text-paper/70">
              {tel && (
                <li>
                  <a href={tel} className="link-u hover:text-paper">
                    {site.phone}
                  </a>
                </li>
              )}
              {wa && (
                <li>
                  <a href={wa} className="link-u hover:text-paper">
                    WhatsApp
                  </a>
                </li>
              )}
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className="link-u hover:text-paper">
                    {site.email}
                  </a>
                </li>
              )}
              <li>{site.city}</li>
            </ul>
          </div>
        </div>

        <div aria-hidden className="mt-24 overflow-hidden">
          <Parallax axis="x" speed={0.12}>
            <div
              className="select-none whitespace-nowrap font-serif leading-[0.8] tracking-tight text-paper/[0.07]"
              style={{ fontSize: "clamp(5rem, 21vw, 21rem)" }}
            >
              Guru<span className="serif-i">kripa</span>
            </div>
          </Parallax>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-line-ink pt-6 text-[0.8rem] text-paper/50 sm:flex-row">
          <p>© 2026 Gurukripa Hostel, Kota</p>
          <p>Girls&rsquo; &amp; boys&rsquo; residences · Single, two &amp; three-seater rooms</p>
        </div>
      </div>
    </footer>
  );
}
