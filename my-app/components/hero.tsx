"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { onScroll } from "@/lib/scroll";
import { Magnetic } from "./motion";

type Slide = {
  src: string;
  /** Portrait crop used on phones, where a landscape photo would be squeezed. */
  mobileSrc?: string;
  title: string;
  where: string;
  href: string;
  /** object-position, to keep the subject in frame on wide screens */
  focus?: string;
};

const SLIDES: Slide[] = [
  {
    src: "/photos/h7/05.jpg",
    title: "The rooftop garden",
    where: "Garden House · Girls",
    href: "/residences/garden-house",
    focus: "50% 60%",
  },
  {
    src: "/photos/h1/12.jpg",
    title: "Two-seater rooms",
    where: "Girls' Residency",
    href: "/residences/girls-residency",
    focus: "40% 60%",
  },
  {
    src: "/photos/h4/10.jpg",
    title: "A library downstairs",
    where: "Parijat · Girls",
    href: "/residences/parijat",
  },
  {
    src: "/photos/h1/06.jpg",
    title: "Three-seater rooms",
    where: "Girls' Residency",
    href: "/residences/girls-residency",
    focus: "60% 55%",
  },
  {
    src: "/photos/h7/09.jpg",
    title: "Evenings on the roof",
    where: "Garden House · Girls",
    href: "/residences/garden-house",
  },
];

const DURATION = 6500;

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

export function Hero({ count }: { count: number }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const still = useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false);
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  const go = useCallback((i: number) => setActive((i + SLIDES.length) % SLIDES.length), []);

  // Autoplay — stops for reduced motion, when hovered, or when the tab is hidden
  useEffect(() => {
    if (still || paused) return;
    const t = setTimeout(() => go(active + 1), DURATION);
    return () => clearTimeout(t);
  }, [active, paused, still, go]);
  useEffect(() => {
    const vis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, []);

  // Scroll: the full-bleed frame shrinks into a rounded card, the copy lifts away
  useEffect(() => {
    return onScroll(() => {
      const s = section.current;
      const f = frame.current;
      const c = copy.current;
      if (!s || !f || !c) return;
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, -s.getBoundingClientRect().top / (vh * 0.6)));
      const e = 1 - Math.pow(1 - p, 2);
      const inset = window.innerWidth < 768 ? 12 : 40;
      f.style.clipPath = `inset(${(e * inset).toFixed(1)}px round ${(e * 28).toFixed(1)}px)`;
      c.style.transform = `translate3d(0, ${(-e * 70).toFixed(1)}px, 0)`;
      c.style.opacity = String(Math.max(0, 1 - e * 1.6));
    });
  }, []);

  const slide = SLIDES[active];

  return (
    <section ref={section} className="relative h-[150svh] bg-paper" aria-label="Welcome">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div ref={frame} className="absolute inset-0 bg-ink [will-change:clip-path]">
          {/* Slides */}
          {SLIDES.map((s, i) => (
            <div
              key={s.src}
              aria-hidden={i !== active}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${i === active ? "opacity-100" : "opacity-0"
                }`}
            >
              <div className={`absolute inset-0 ${i === active && !still ? "kenburns" : ""}`}>
                <Image
                  src={s.src}
                  alt={`${s.title} — ${s.where}`}
                  fill
                  sizes="100vw"
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : undefined}
                  className={`object-cover ${s.mobileSrc ? "hidden md:block" : ""}`}
                  style={{ objectPosition: s.focus ?? "50% 50%" }}
                />
                {s.mobileSrc && (
                  <Image
                    src={s.mobileSrc}
                    alt={`${s.title} — ${s.where}`}
                    fill
                    sizes="100vw"
                    loading="eager"
                    className="object-cover md:hidden"
                  />
                )}
              </div>
            </div>
          ))}

          {/* Legibility: deep ink at the foot, a whisper at the top for the nav */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(23,20,15,.55)_0%,rgba(23,20,15,.05)_26%,rgba(23,20,15,.12)_50%,rgba(23,20,15,.88)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(23,20,15,.55)_0%,rgba(23,20,15,.2)_45%,transparent_70%)]" />
          <div className="grain pointer-events-none absolute inset-0" />

          {/* Copy */}
          <div
            ref={copy}
            className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end px-4 pb-8 text-paper md:px-10 md:pb-12"
          >
            {/* Story-style progress on phones */}
            <div className="absolute inset-x-4 top-20 flex gap-1.5 md:hidden">
              {SLIDES.map((s, i) => (
                <button
                  key={s.src}
                  aria-label={`Show ${s.title}`}
                  onClick={() => go(i)}
                  className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-paper/25"
                >
                  <span
                    key={`${active}-${i}`}
                    className={`absolute inset-y-0 left-0 rounded-full bg-paper ${i < active ? "w-full" : i === active ? (still || paused ? "w-full" : "hero-progress") : "w-0"
                      }`}
                    style={{ "--dur": `${DURATION}ms` } as CSSProperties}
                  />
                </button>
              ))}
            </div>



            <div className="grid items-end gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="eyebrow fade-up mb-6 inline-flex items-center gap-3 rounded-full bg-ink/40 px-3.5 py-2 text-paper/85 backdrop-blur-md">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-marigold" />
                  {count} residences for girls &amp; boys
                </p>
                <h1 className="display" aria-label="Kota is for hard work. Home is for everything else.">
                  <span aria-hidden>
                    <span className="line-mask" style={{ "--i": 0 } as CSSProperties}>
                      <span>Kota is for hard work.</span>
                    </span>
                    <span className="line-mask" style={{ "--i": 1 } as CSSProperties}>
                      <span>
                        <span className="serif-i text-marigold">Home</span> is for
                      </span>
                    </span>
                    <span className="line-mask" style={{ "--i": 2 } as CSSProperties}>
                      <span>everything else.</span>
                    </span>
                  </span>
                </h1>
                <div
                  className="fade-up mt-9 flex flex-wrap items-center gap-3"
                  style={{ "--d": "700ms" } as CSSProperties}
                >
                  <Magnetic>
                    <Link
                      href="#residences"
                      className="group inline-flex items-center gap-3 rounded-full bg-marigold py-3 pl-7 pr-3 text-[0.95rem] text-ink transition-colors hover:bg-marigold-soft"
                    >
                      Explore residences
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-90">
                        ↓
                      </span>
                    </Link>
                  </Magnetic>
                  <Magnetic>
                    <Link
                      href="#visit"
                      className="inline-flex rounded-full border border-paper/35 px-7 py-[1.15rem] text-[0.95rem] text-paper backdrop-blur-sm transition-colors hover:border-paper hover:bg-paper/10"
                    >
                      Book a visit
                    </Link>
                  </Magnetic>
                </div>
              </div>

              {/* Slide caption + thumbnails */}
              <div
                className="fade-up lg:col-span-4"
                style={{ "--d": "900ms" } as CSSProperties}
                onPointerEnter={() => setPaused(true)}
                onPointerLeave={() => setPaused(false)}
              >
                <Link href={slide.href} className="group block border-t border-paper/25 pt-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="eyebrow text-paper/60">
                      {String(active + 1).padStart(2, "0")}
                      <span className="text-paper/30"> / {String(SLIDES.length).padStart(2, "0")}</span>
                    </span>
                    <span className="eyebrow text-paper/60 transition-colors group-hover:text-marigold">
                      {slide.where} ↗
                    </span>
                  </div>
                  <p key={slide.title} className="caption-in mt-2 font-serif text-3xl md:text-4xl">
                    {slide.title}
                  </p>
                </Link>
                <div className="mt-5 hidden gap-2 md:flex">
                  {SLIDES.map((s, i) => (
                    <button
                      key={s.src}
                      onClick={() => go(i)}
                      aria-label={`Show ${s.title}`}
                      aria-current={i === active}
                      className={`group relative h-14 flex-1 overflow-hidden rounded-[10px] transition-all duration-500 ${i === active ? "flex-[1.6] ring-1 ring-paper/70" : "opacity-55 hover:opacity-100"
                        }`}
                    >
                      <Image src={s.src} alt="" fill sizes="120px" className="object-cover" />
                      <span className="absolute inset-x-0 bottom-0 h-[3px] bg-ink/40">
                        {i === active && (
                          <span
                            key={active}
                            className={`absolute inset-y-0 left-0 bg-marigold ${still || paused ? "w-full" : "hero-progress"}`}
                            style={{ "--dur": `${DURATION}ms` } as CSSProperties}
                          />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
