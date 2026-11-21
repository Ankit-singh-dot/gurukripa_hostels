"use client";

import { useEffect, useRef } from "react";
import { onScroll } from "@/lib/scroll";

/**
 * An oversized word filled with a photograph. The photo slides inside the
 * letters as the word scrolls past — the type becomes a window.
 */
export function MaskedWord({ word, src, className = "" }: { word: string; src: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return onScroll(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      el.style.backgroundPosition = `${(30 + p * 40).toFixed(1)}% ${(15 + p * 70).toFixed(1)}%`;
    });
  }, []);
  return (
    <span
      ref={ref}
      aria-label={word}
      className={`block bg-clip-text font-serif italic leading-[0.82] tracking-[-0.04em] text-transparent [-webkit-background-clip:text] ${className}`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "130% auto",
        backgroundPosition: "50% 50%",
      }}
    >
      {word}
    </span>
  );
}
