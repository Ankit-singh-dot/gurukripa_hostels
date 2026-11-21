"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "./motion";

const links = [
  { href: "/#residences", label: "Residences" },
  { href: "/#rooms", label: "Rooms" },
  { href: "/#mess", label: "Mess" },
  { href: "/#care", label: "Safety" },
  { href: "/#visit", label: "Visit" },
];

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <span
      className="relative block shrink-0 overflow-hidden rounded-full"
      style={{ width: size, height: size }}
    >
      <Image src="/icon.png" alt="Gurukripa Hostel" fill sizes={`${size}px`} className="object-contain" />
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);
  // Over the home page's dark hero photos the bar starts out light-on-dark
  const light = usePathname() === "/" && !scrolled && !open;

  useEffect(() => {
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // hide while reading down, reveal the moment you scroll up
      if (Math.abs(y - last.current) > 6) {
        setHidden(y > last.current && y > 400);
        last.current = y;
      }
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter,translate] duration-500 ${
        hidden && !open ? "-translate-y-full" : ""
      } ${
        scrolled || open
          ? "border-b border-line bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:h-20 md:px-10">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo size={38} />
          <span className="leading-none">
            <span className={`block font-serif text-[1.45rem] tracking-tight transition-colors duration-500 ${light ? "text-paper" : ""}`}>Gurukripa</span>
            <span className={`eyebrow block text-[0.6rem] transition-colors duration-500 ${light ? "text-paper/60" : "text-ink-3"}`}>Hostels · Kota</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 text-[0.92rem] lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`link-u transition-colors duration-500 ${light ? "text-paper/80 hover:text-paper" : "text-ink-2 hover:text-ink"}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Magnetic>
            <Link
              href="/#visit"
              className={`group hidden items-center gap-2 rounded-full py-2.5 pl-5 pr-2.5 text-[0.88rem] transition-colors duration-500 sm:inline-flex ${light ? "bg-paper text-ink hover:bg-paper-2" : "bg-ink text-paper hover:bg-ink-2"}`}
            >
              Book a visit
              <span className="grid h-6 w-6 place-items-center rounded-full bg-marigold text-ink transition-transform duration-500 group-hover:rotate-[-45deg]">
                →
              </span>
            </Link>
          </Magnetic>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className={`relative grid h-11 w-11 place-items-center rounded-full transition-colors duration-500 lg:hidden ${light ? "bg-ink/35 backdrop-blur-md" : ""}`}
          >
            <span
              className={`absolute h-px w-6 transition-transform duration-300 ${light ? "bg-paper" : "bg-ink"} ${open ? "rotate-45" : "-translate-y-[4px]"}`}
            />
            <span
              className={`absolute h-px w-6 transition-transform duration-300 ${light ? "bg-paper" : "bg-ink"} ${open ? "-rotate-45" : "translate-y-[4px]"}`}
            />
          </button>
        </div>
      </div>

      <span aria-hidden className="progress absolute inset-x-0 bottom-[-1px] h-[2px] bg-marigold" />

      <div
        className={`overflow-hidden transition-[max-height] duration-500 lg:hidden ${open ? "max-h-[100dvh]" : "max-h-0"}`}
      >
        <nav className="flex h-[calc(100dvh-4rem)] flex-col justify-between px-4 pb-10 pt-6">
          <ul className="space-y-1">
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-line">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-4"
                >
                  <span className="font-serif text-4xl">{l.label}</span>
                  <span className="eyebrow text-ink-3">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#visit"
            onClick={() => setOpen(false)}
            className="rounded-full bg-ink py-4 text-center text-paper"
          >
            Book a visit
          </Link>
        </nav>
      </div>
    </header>
  );
}
