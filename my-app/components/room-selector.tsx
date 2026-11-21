"use client";

import Image from "next/image";
import { useState } from "react";
import { roomInfo, type RoomType } from "@/lib/hostels";
import { Parallax } from "./motion";

const SHOTS: Record<RoomType, { main: string; inset: string }> = {
  single: { main: "/photos/h1/01.jpg", inset: "/photos/h1/13.jpg" },
  double: { main: "/photos/h1/12.jpg", inset: "/photos/h1/17.jpg" },
  triple: { main: "/photos/h1/06.jpg", inset: "/photos/h1/18.jpg" },
};

const TYPES = Object.keys(roomInfo) as RoomType[];

/**
 * Room formats as an interactive selector: the big photo wipes across to the
 * chosen room, a second angle floats over the corner, and the chosen row
 * opens to reveal its description.
 */
export function RoomSelector() {
  const [active, setActive] = useState<RoomType>("single");

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Stage */}
      <div className="relative lg:col-span-7">
        <div className="photo aspect-[4/3]">
          {TYPES.map((t) => (
            <div
              key={t}
              className="absolute inset-0 transition-[clip-path] duration-[900ms] ease-[cubic-bezier(.7,0,.2,1)]"
              style={{ clipPath: t === active ? "inset(0 0 0 0)" : "inset(0 0 0 100%)", zIndex: t === active ? 2 : 1 }}
            >
              <Image
                src={SHOTS[t].main}
                alt={`${roomInfo[t].title} room`}
                fill
                sizes="(min-width:1024px) 55vw, 100vw"
                className={`object-cover transition-transform duration-[1400ms] ${t === active ? "scale-100" : "scale-110"}`}
              />
            </div>
          ))}
          <span className="eyebrow absolute left-4 top-4 z-10 rounded-full bg-ink/60 px-3 py-1.5 text-paper backdrop-blur">
            {roomInfo[active].title} · {roomInfo[active].seats}
          </span>
        </div>

        {/* Floating second angle */}
        <Parallax speed={-0.08} className="absolute -bottom-10 -right-2 z-10 hidden w-[34%] md:block lg:-right-8">
          <div className="photo photo-sm aspect-[3/4] shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] ring-4 ring-ink">
            {TYPES.map((t) => (
              <Image
                key={t}
                src={SHOTS[t].inset}
                alt=""
                fill
                sizes="20vw"
                className={`object-cover transition-opacity duration-700 ${t === active ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
        </Parallax>
      </div>

      {/* Picker */}
      <ol className="flex flex-col justify-center lg:col-span-5">
        {TYPES.map((t, i) => {
          const on = t === active;
          return (
            <li key={t} className="border-t border-line-ink last:border-b">
              <button
                onClick={() => setActive(t)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(t)}
                aria-expanded={on}
                className="group w-full py-6 text-left md:py-7"
              >
                <div className="flex items-center gap-5">
                  <span className={`eyebrow w-6 transition-colors ${on ? "text-marigold" : "text-paper/35"}`}>
                    0{i + 1}
                  </span>
                  <span
                    className={`flex-1 font-serif text-[clamp(2.2rem,4vw,3.6rem)] leading-none transition-all duration-500 ${
                      on ? "translate-x-1 text-paper" : "text-paper/35 group-hover:text-paper/70"
                    }`}
                  >
                    {on ? <span className="serif-i">{roomInfo[t].title}</span> : roomInfo[t].title}
                  </span>
                  <span className="flex items-center gap-1.5" aria-label={roomInfo[t].seats}>
                    {[0, 1, 2].map((k) => (
                      <span
                        key={k}
                        className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                          k <= i ? (on ? "bg-marigold" : "bg-paper/40") : "border border-line-ink"
                        }`}
                        style={{ transitionDelay: on ? `${k * 80}ms` : "0ms" }}
                      />
                    ))}
                  </span>
                </div>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ${
                    on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="overflow-hidden pl-11 text-[1rem] leading-relaxed text-paper/65">
                    <span className="block pt-4">{roomInfo[t].blurb}</span>
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
