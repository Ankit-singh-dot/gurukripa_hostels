"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Item = { title: string; text: string; src: string };

/**
 * A large editorial list. On desktop, hovering a row summons a photo that
 * trails the cursor; on touch screens each row shows its photo inline.
 */
export function HoverRevealList({ items }: { items: Item[] }) {
  const [active, setActive] = useState<number | null>(null);
  const float = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = float.current!;
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
      const dx = x - cx;
      cx += dx * 0.14;
      cy += (y - cy) * 0.14;
      // tilt slightly in the direction of travel
      el.style.transform = `translate3d(${cx + 28}px, ${cy - 120}px, 0) rotate(${Math.max(-8, Math.min(8, dx * 0.08)).toFixed(2)}deg)`;
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
    <>
      <div
        ref={float}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-60 w-48 [@media(pointer:fine)]:block"
      >
        <div
          className="photo photo-sm h-full w-full shadow-[0_30px_60px_-25px_rgba(23,20,15,.55)] transition-[opacity,scale] duration-300"
          style={{ opacity: active === null ? 0 : 1, scale: active === null ? "0.6" : "1" }}
        >
          {items.map((it, i) => (
            <Image
              key={it.src}
              src={it.src}
              alt=""
              fill
              sizes="200px"
              className={`object-cover transition-opacity duration-300 ${i === active ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>

      <ul onPointerLeave={() => setActive(null)} className="border-t border-ink">
        {items.map((it, i) => (
          <li
            key={it.title}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            className="group relative border-b border-line"
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-bottom scale-y-0 bg-paper-2 transition-transform duration-500 ease-out group-hover:scale-y-100"
            />
            <div className="relative grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 py-6 md:grid-cols-[3rem_1fr_minmax(0,22rem)_2.5rem] md:py-8">
              <div className="photo photo-sm h-16 w-14 [@media(pointer:fine)]:hidden">
                <Image src={it.src} alt={it.title} fill sizes="56px" className="object-cover" />
              </div>
              <span className="eyebrow hidden text-ink-3 [@media(pointer:fine)]:md:block">0{i + 1}</span>
              <h3 className="font-serif text-[clamp(1.8rem,4.2vw,4rem)] leading-none transition-transform duration-500 group-hover:translate-x-3">
                {it.title}
              </h3>
              <p className="col-span-2 text-[0.95rem] leading-relaxed text-ink-2 md:col-span-1">{it.text}</p>
              <span className="hidden h-10 w-10 place-items-center rounded-full border border-line transition-all duration-500 group-hover:-rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-paper md:grid">
                →
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
