"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { onScroll } from "@/lib/scroll";
import { genderLabel, roomInfo, type Hostel } from "@/lib/hostels";
import { Logo } from "./nav";

type Filter = "all" | "girls" | "boys";

const DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(DESKTOP);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/**
 * Residences as a pinned horizontal gallery: on desktop the section sticks
 * and vertical scrolling slides the cards sideways. On phones (or with
 * reduced motion) it becomes a swipeable snap carousel.
 */
export function ResidenceGrid({ hostels, children }: { hostels: Hostel[]; children?: React.ReactNode }) {
  const [filter, setFilter] = useState<Filter>("all");
  const count = (f: Filter) => (f === "all" ? hostels.length : hostels.filter((h) => h.gender === f).length);
  const shown = filter === "all" ? hostels : hostels.filter((h) => h.gender === filter);

  const pinned = useSyncExternalStore(subscribe, () => window.matchMedia(DESKTOP).matches, () => false);
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [current, setCurrent] = useState(1);

  // Section height = horizontal distance to travel + one screen
  useEffect(() => {
    if (!pinned) {
      if (track.current) track.current.style.transform = "";
      return;
    }
    const measure = () => {
      const t = track.current;
      if (!t) return;
      const travel = Math.max(0, t.scrollWidth - window.innerWidth + 80);
      setHeight(travel + window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pinned, filter]);

  useEffect(() => {
    if (!pinned) return;
    return onScroll(() => {
      const s = section.current;
      const t = track.current;
      if (!s || !t) return;
      const travel = Math.max(0, t.scrollWidth - window.innerWidth + 80);
      const range = s.offsetHeight - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -s.getBoundingClientRect().top / range)) : 0;
      t.style.transform = `translate3d(${(-p * travel).toFixed(1)}px,0,0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      setCurrent(Math.min(shown.length, Math.floor(p * shown.length) + 1));
    });
  }, [pinned, shown.length]);

  // Marigold "View" disc that trails the pointer over cards
  const cursor = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = cursor.current!;
    let x = 0,
      y = 0,
      cx = 0,
      cy = 0,
      raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate3d(${cx - 44}px, ${cy - 44}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="residences" ref={section} style={{ height: pinned ? height : undefined }} className="relative">
      <div
        className={`${pinned ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden" : "py-24"}`}
      >
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10">
          <div className="flex flex-col justify-between gap-8 border-t border-ink pt-6 lg:flex-row lg:items-end">
            {children}
            <div className="flex flex-col gap-5 lg:items-end">
              <div role="tablist" aria-label="Filter residences" className="flex flex-wrap gap-2">
                {(["all", "girls", "boys"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    role="tab"
                    aria-selected={filter === f}
                    onClick={() => {
                      setFilter(f);
                      if (pinned) section.current?.scrollIntoView({ behavior: "smooth" });
                      else track.current?.scrollTo({ left: 0, behavior: "smooth" });
                    }}
                    className={`rounded-full border px-4 py-2 text-[0.88rem] transition-colors ${
                      filter === f
                        ? "border-ink bg-ink text-paper"
                        : "border-line text-ink-2 hover:border-ink hover:text-ink"
                    }`}
                  >
                    {f === "all" ? "All" : f === "girls" ? "Girls" : "Boys"}
                    <sup className="ml-1 font-mono text-[0.65rem] opacity-60">{count(f)}</sup>
                  </button>
                ))}
              </div>
              {pinned && (
                <div className="flex w-56 items-center gap-3">
                  <span className="eyebrow tabular-nums text-ink-2">
                    {String(current).padStart(2, "0")} / {String(shown.length).padStart(2, "0")}
                  </span>
                  <span className="relative h-px flex-1 bg-line">
                    <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-ink" />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          ref={cursor}
          aria-hidden
          className="cursor-label hidden h-[88px] w-[88px] place-items-center rounded-full bg-marigold text-ink [@media(pointer:fine)]:grid"
          style={{ opacity: hover ? 1 : 0, scale: hover ? "1" : "0.4" }}
        >
          <span className="eyebrow">View</span>
        </div>

        <ul
          ref={track}
          className={`mt-10 flex gap-5 px-4 will-change-transform md:px-10 lg:gap-7 ${
            pinned
              ? "w-max"
              : "snap-x snap-mandatory scroll-pl-4 overflow-x-auto pb-4 md:scroll-pl-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          }`}
          style={pinned ? { paddingLeft: "max(2.5rem, calc((100vw - 1440px) / 2 + 2.5rem))" } : undefined}
        >
          {shown.map((h) => {
            const n = String(hostels.indexOf(h) + 1).padStart(2, "0");
            const g = genderLabel(h.gender);
            return (
              <li
                key={h.slug}
                className="w-[78vw] shrink-0 snap-start sm:w-[22rem] lg:w-auto"
                style={pinned ? { width: "calc(min(58svh, 600px) * 0.8)" } : undefined}
              >
                <Link
                  href={`/residences/${h.slug}`}
                  className="group block [@media(pointer:fine)]:cursor-none"
                  onPointerEnter={() => setHover(true)}
                  onPointerLeave={() => setHover(false)}
                >
                  <div className="photo aspect-[4/5]">
                    {h.cover ? (
                      <Image
                        src={h.cover}
                        alt={h.name}
                        fill
                        sizes="(min-width:1024px) 30vw, 80vw"
                        className="object-cover transition-[filter] duration-700 group-hover:saturate-[1.1]"
                      />
                    ) : (
                      <div className="grain absolute inset-0 grid place-items-center bg-ink text-paper">
                        <div className="text-center">
                          <div className="mx-auto w-fit">
                            <Logo size={72} />
                          </div>
                          <p className="eyebrow mt-5 text-marigold">Photos coming soon</p>
                        </div>
                      </div>
                    )}
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute bottom-4 left-4 right-4 translate-y-3 text-[0.9rem] leading-snug text-paper opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
                      {h.line}
                    </span>
                    <span className="eyebrow absolute left-4 top-4 rounded-full bg-paper/90 px-2.5 py-1 text-ink backdrop-blur">
                      {n}
                    </span>
                    {g && (
                      <span
                        className={`eyebrow absolute right-4 top-4 rounded-full px-2.5 py-1 ${
                          h.gender === "girls" ? "bg-marigold text-ink" : "bg-ink text-paper"
                        }`}
                      >
                        {g}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <h3 className="font-serif text-[1.55rem] leading-[1.1] transition-colors group-hover:text-ink-2">
                      {h.name}
                    </h3>
                  </div>
                  <p className="eyebrow mt-3 flex flex-wrap gap-x-3 text-ink-3">
                    <span>{h.area}</span>
                    {h.rooms.length > 0 && (
                      <span>{h.rooms.map((r) => roomInfo[r].seats.split(" ")[0]).join(" · ")} seater</span>
                    )}
                  </p>
                </Link>
              </li>
            );
          })}
          {/* Closing card — a nudge to visit */}
          <li
            className="w-[78vw] shrink-0 snap-start sm:w-[22rem] lg:w-auto"
            style={pinned ? { width: "calc(min(58svh, 600px) * 0.8)" } : undefined}
          >
            <Link
              href="#visit"
              className="group grain relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[var(--radius)] bg-ink p-6 text-paper"
            >
              <span className="eyebrow text-marigold">Still deciding?</span>
              <span className="font-serif text-4xl leading-[1.05]">
                Come see them
                <br />
                <span className="serif-i">in person.</span>
              </span>
              <span className="grid h-14 w-14 place-items-center rounded-full bg-marigold text-xl text-ink transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-45">
                →
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
