"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo, PhotoTag } from "@/lib/hostels";

const LABEL: Partial<Record<PhotoTag, string>> = {
  exterior: "Building",
  single: "Single",
  double: "Two-seater",
  triple: "Three-seater",
  room: "Rooms",
  study: "Study",
  mess: "Mess",
  kitchen: "Kitchen",
  bath: "Bath",
  common: "Common",
  safety: "Safety",
  garden: "Garden",
};

export function Gallery({ photos }: { photos: Photo[] }) {
  const tags = Array.from(new Set(photos.map((p) => p.tag)));
  const [tag, setTag] = useState<PhotoTag | "all">("all");
  const [index, setIndex] = useState<number | null>(null);
  const list = tag === "all" ? photos : photos.filter((p) => p.tag === tag);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + list.length) % list.length)),
    [list.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  const current = index !== null ? list[index] : null;
  const touchX = useRef<number | null>(null);

  return (
    <>
      {tags.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {(["all", ...tags] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`rounded-full border px-3.5 py-1.5 text-[0.82rem] transition-colors ${
                tag === t ? "border-ink bg-ink text-paper" : "border-line text-ink-2 hover:border-ink"
              }`}
            >
              {t === "all" ? `All ${photos.length}` : LABEL[t]}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-8 columns-2 gap-3 md:columns-3 md:gap-4 [&>li]:mb-3 md:[&>li]:mb-4">
        {list.map((p, i) => (
          <li key={p.src} className="clip-reveal break-inside-avoid rounded-[var(--radius-sm)]">
            <button
              onClick={() => setIndex(i)}
              className="photo photo-sm group relative block w-full cursor-zoom-in"
              aria-label={`Open photo: ${p.alt}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={p.width}
                height={p.height}
                sizes="(min-width:768px) 30vw, 48vw"
                className="h-auto w-full"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/15" />
              <span className="eyebrow absolute bottom-3 left-3 translate-y-2 rounded-full bg-paper/90 px-2.5 py-1 opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {LABEL[p.tag]} · Enlarge
              </span>
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="lightbox fixed inset-0 z-[100] flex flex-col bg-ink/95 text-paper backdrop-blur-sm"
          onClick={close}
        >
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <span className="eyebrow text-paper/60">
              {String((index ?? 0) + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")} ·{" "}
              {LABEL[current.tag]}
            </span>
            <button onClick={close} className="eyebrow rounded-full border border-line-ink px-4 py-2 hover:border-paper">
              Close
            </button>
          </div>
          <div
            className="relative flex-1"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              className="lightbox-img object-contain p-2 md:p-8"
            />
            <button
              aria-label="Previous photo"
              onClick={() => step(-1)}
              className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 text-xl hover:bg-marigold hover:text-ink md:left-6"
            >
              ←
            </button>
            <button
              aria-label="Next photo"
              onClick={() => step(1)}
              className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 text-xl hover:bg-marigold hover:text-ink md:right-6"
            >
              →
            </button>
          </div>
          <p className="px-4 pb-5 text-center text-[0.85rem] text-paper/60">{current.alt}</p>
        </div>
      )}
    </>
  );
}
