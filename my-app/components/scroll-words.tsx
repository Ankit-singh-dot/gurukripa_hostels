"use client";

import { useEffect, useRef } from "react";
import { onScroll, reducedMotion } from "@/lib/scroll";

type Part = { text: string; italic?: boolean };

/**
 * A paragraph that "inks in" word by word as it scrolls through the viewport —
 * words start pale and darken in reading order.
 */
export function ScrollWords({ parts, className = "" }: { parts: Part[]; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-w]"));
    if (reducedMotion()) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }
    return onScroll(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the paragraph's top reaches 85% of the screen, 1 when its bottom passes 45%
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.4)));
      const lit = p * words.length;
      words.forEach((w, i) => {
        const o = Math.min(1, Math.max(0, lit - i));
        w.style.opacity = String(0.16 + o * 0.84);
      });
    });
  }, []);

  let n = 0;
  return (
    <p ref={ref} className={className} aria-label={parts.map((p) => p.text).join(" ")}>
      {parts.map((part, pi) => (
        <span key={pi} aria-hidden className={part.italic ? "serif-i" : ""}>
          {part.text.split(" ").map((w) => {
            n++;
            return (
              <span key={n} data-w className="transition-opacity duration-200" style={{ opacity: 0.16 }}>
                {w}{" "}
              </span>
            );
          })}
        </span>
      ))}
    </p>
  );
}
