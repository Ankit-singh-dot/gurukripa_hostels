"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { onScroll, reducedMotion } from "@/lib/scroll";

/**
 * Moves its children against the scroll. `speed` is the fraction of the
 * viewport height travelled while the element crosses the screen
 * (0.1 = subtle, 0.3 = strong). Negative values move the other way.
 */
export function Parallax({
  speed = 0.12,
  axis = "y",
  className = "",
  as: Tag = "div",
  children,
}: {
  speed?: number;
  axis?: "x" | "y";
  className?: string;
  /** Use "span" inside headings and other inline content. */
  as?: "div" | "span";
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return onScroll(() => {
      const r = el.parentElement?.getBoundingClientRect() ?? el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -vh || r.top > vh * 2) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh; // ≈ -1 … 1 across the screen
      const d = -p * speed * vh;
      el.style.transform = axis === "y" ? `translate3d(0,${d.toFixed(1)}px,0)` : `translate3d(${d.toFixed(1)}px,0,0)`;
    });
  }, [speed, axis]);
  return (
    <Tag ref={ref as React.Ref<never>} className={`will-change-transform ${className}`}>
      {children}
    </Tag>
  );
}

/**
 * Image layer that drifts inside its rounded frame — the frame stays put,
 * the photo slides. Place inside a positioned `.photo` container.
 */
export function ParallaxLayer({ speed = 0.08, children }: { speed?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return onScroll(() => {
      const r = el.parentElement!.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(0,${(p * speed * 100).toFixed(2)}%,0)`;
    });
  }, [speed]);
  return (
    <div ref={ref} className="absolute inset-x-0 -inset-y-[10%] will-change-transform">
      {children}
    </div>
  );
}

/** Counts up to a number once it scrolls into view. Keeps leading zeros ("08"). */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const el = ref.current;
    // Only animate pure numbers like "08"; leave "1·2·3", "Daily" etc. untouched.
    if (!el || !/^\d+$/.test(value) || reducedMotion()) return;
    const target = parseInt(value, 10);
    const pad = value.length;
    setShown("0".padStart(pad, "0"));
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1100;
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          setShown(String(Math.round(eased * target)).padStart(pad, "0"));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{shown}</span>;
}

/** Pulls its child gently toward the pointer. Desktop pointers only. */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
    };
    const leave = () => (el.style.transform = "");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return (
    <span ref={ref} className="inline-block transition-transform duration-300 ease-out">
      {children}
    </span>
  );
}

/** Two rows of oversized words that slide in opposite directions as you scroll. */
export function ScrollBand({ words }: { words: string[] }) {
  const row = (outline: boolean) => (
    <span className="flex shrink-0 items-center">
      {[...words, ...words, ...words].map((w, i) => (
        <span key={i} className="flex items-center">
          <span className={outline ? "text-outline serif-i" : ""}>{w}</span>
          <span aria-hidden className="mx-[0.35em] inline-block h-[0.14em] w-[0.14em] rounded-full bg-marigold" />
        </span>
      ))}
    </span>
  );
  return (
    <div aria-label={words.join(", ")} className="overflow-hidden py-6 font-serif leading-[1.05] md:py-10" style={{ fontSize: "clamp(3.5rem, 10vw, 10rem)" }}>
      <div aria-hidden>
        <Parallax axis="x" speed={0.35} className="-ml-[40%] flex whitespace-nowrap">
          {row(false)}
        </Parallax>
        <Parallax axis="x" speed={-0.35} className="-ml-[60%] flex whitespace-nowrap">
          {row(true)}
        </Parallax>
      </div>
    </div>
  );
}
