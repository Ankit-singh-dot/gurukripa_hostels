import Image from "next/image";
import Link from "next/link";
import { ContactActions } from "@/components/contact-actions";
import { CountUp, Parallax, ParallaxLayer, ScrollBand } from "@/components/motion";
import { Hero } from "@/components/hero";
import { ResidenceGrid } from "@/components/residence-grid";
import { ScrollWords } from "@/components/scroll-words";
import { RoomSelector } from "@/components/room-selector";
import { HoverRevealList } from "@/components/hover-reveal-list";
import { MaskedWord } from "@/components/masked-word";
import { genderLabel, hostels } from "@/lib/hostels";

function Shot({
  src,
  alt,
  sizes,
  className = "",
  preload,
  drift = 0.08,
  reveal = true,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  preload?: boolean;
  /** How far the photo slides inside its frame while scrolling; 0 = static. */
  drift?: number;
  /** Unveil from a smaller rounded window when entering the viewport. */
  reveal?: boolean;
}) {
  const img = (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={preload ? "eager" : undefined}
      fetchPriority={preload ? "high" : undefined}
      className="object-cover"
    />
  );
  return (
    <div className={`photo ${reveal ? "clip-reveal" : ""} ${className}`}>
      {drift ? <ParallaxLayer speed={drift}>{img}</ParallaxLayer> : img}
    </div>
  );
}

/** Second line of a heading that slides sideways as the section scrolls past. */
function Drift({ children, speed = 0.06 }: { children: React.ReactNode; speed?: number }) {
  return (
    <Parallax as="span" axis="x" speed={speed} className="inline-block">
      {children}
    </Parallax>
  );
}

function SectionHead({ n, label, children }: { n: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <p className="eyebrow flex gap-3 md:col-span-3">
        <span className="opacity-50">{n}</span>
        <span>{label}</span>
      </p>
      <div className="md:col-span-9">{children}</div>
    </div>
  );
}

const mess = [
  { src: "/photos/h1/02.jpg", title: "The dining hall", where: "Girls' Residency" },
  { src: "/photos/h6/30.jpg", title: "Our own kitchen", where: "Khalsa Residency" },
  { src: "/photos/h4/06.jpg", title: "Bright & clean", where: "Parijat" },
  { src: "/photos/h5/03.jpg", title: "Served hot", where: "Krishna Kunj" },
  { src: "/photos/h6/02.jpg", title: "Room for everyone", where: "Khalsa Residency" },
];

const life = [
  {
    src: "/photos/h7/03.jpg",
    title: "The rooftop garden",
    text: "Cane chairs, hand-painted rangoli and more plants than anyone has counted.",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/photos/h4/10.jpg",
    title: "In-house libraries",
    text: "Partitioned cubicles and long quiet hours, away from a shared room.",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/photos/h1/10.jpg",
    title: "A desk by the window",
    text: "Every seat comes with its own desk, chair and shelf — daylight included.",
    aspect: "aspect-square",
  },
];

const included = [
  "Bed with mattress & linen",
  "Personal study desk and chair",
  "Wardrobe and shelving",
  "Fan & lighting; AC at select residences",
];

const care = [
  {
    title: "Biometric entry",
    text: "In-and-out times are logged, so the warden always knows who is home.",
    src: "/photos/h5/02.jpg",
  },
  {
    title: "Staffed front desk",
    text: "A warden's office on the ground floor, open through the day.",
    src: "/photos/h6/24.jpg",
  },
  {
    title: "Lifts & wide stairwells",
    text: "In our taller buildings — no hauling suitcases up six floors.",
    src: "/photos/h6/28.jpg",
  },
  {
    title: "Power backup",
    text: "Generators on site, so a summer outage never stops a study night.",
    src: "/photos/h6/13.jpg",
  },
  {
    title: "RO drinking water",
    text: "Purified, chilled drinking water at the water station.",
    src: "/photos/h6/23.jpg",
  },
  {
    title: "SAIS registered",
    text: "Listed on Kota's Student Accommodation Information System.",
    src: "/photos/h5/15.jpg",
  },
];

export default function Home() {
  const girls = hostels.filter((h) => h.gender === "girls").length;

  return (
    <>
      <Hero count={hostels.length} />

      {/* ───────────── Stats ───────────── */}
      <section className="mx-auto max-w-[1440px] px-4 md:px-10">
        <dl className="mt-6 grid grid-cols-2 border-y border-line md:grid-cols-4">
          {[
            [String(hostels.length).padStart(2, "0"), "Residences in Kota"],
            [String(girls).padStart(2, "0"), "Dedicated girls' houses"],
            ["1·2·3", "Seater room formats"],
            ["Daily", "Home-style mess"],
          ].map(([k, v], i) => (
            <div
              key={v}
              className={`px-1 py-7 md:px-6 ${i % 2 ? "border-l border-line pl-5" : ""} ${i === 2 ? "md:border-l md:pl-6" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""}`}
            >
              <dt className="font-serif text-5xl tabular-nums md:text-6xl">
                <CountUp value={k} />
              </dt>
              <dd className="mt-2 text-[0.9rem] text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ───────────── Manifesto ───────────── */}
      <section className="mx-auto max-w-[1440px] px-4 py-24 md:px-10 md:py-36">
        <SectionHead n="01" label="Our promise">
          <ScrollWords
            className="max-w-[62rem] font-serif text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.12]"
            parts={[
              { text: "Moving to Kota at sixteen is a big step. We keep the rest simple —" },
              { text: "a clean room, a warm meal, a quiet desk,", italic: true },
              { text: "and people downstairs who notice when you haven’t come down for dinner." },
            ]}
          />
        </SectionHead>
      </section>

      <ScrollBand words={["Study hard", "Eat well", "Sleep safe", "Feel at home"]} />

      {/* ───────────── Residences (pinned horizontal gallery) ───────────── */}
      <ResidenceGrid hostels={hostels}>
        <div>
          <p className="eyebrow flex gap-3">
            <span className="opacity-50">02</span>
            <span>Residences</span>
          </p>
          <h2 className="h2 mt-5">
            {hostels.length} addresses.{" "}
            <Drift>
              <span className="serif-i">One standard.</span>
            </Drift>
          </h2>
        </div>
      </ResidenceGrid>

      {/* ───────────── Rooms (interactive selector) ───────────── */}
      <section id="rooms" className="grain relative bg-ink text-paper">
        <div className="mx-auto max-w-[1440px] px-4 py-24 md:px-10 md:py-36">
          <div className="grid gap-8 md:grid-cols-12">
            <p className="eyebrow flex gap-3 text-marigold md:col-span-3">
              <span className="opacity-60">03</span>
              <span>Rooms</span>
            </p>
            <div className="md:col-span-9">
              <h2 className="h2">
                Choose how{" "}
                <Drift speed={0.1}>
                  <span className="serif-i">you live.</span>
                </Drift>
              </h2>
              <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-paper/65">
                Three room formats, one standard of furniture and care. Hover or tap to look inside.
              </p>
            </div>
          </div>

          <div className="mt-16 md:mt-20">
            <RoomSelector />
          </div>

          <div className="mt-24 grid gap-6 border-t border-line-ink pt-8 md:grid-cols-12">
            <p className="eyebrow text-paper/50 md:col-span-3">In every room</p>
            <ul className="grid gap-x-8 gap-y-3 text-[0.98rem] text-paper/80 sm:grid-cols-2 md:col-span-9">
              {included.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-[0.6em] h-1 w-3 shrink-0 bg-marigold" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────── Mess (expanding panels) ───────────── */}
      <section id="mess" className="mx-auto max-w-[1440px] px-4 py-24 md:px-10 md:py-36">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow flex gap-3">
              <span className="opacity-50">04</span>
              <span>The mess</span>
            </p>
            <h2 className="h2 mt-5">
              Food that tastes
              <br />
              <Drift>
                like <span className="serif-i">someone cares.</span>
              </Drift>
            </h2>
          </div>
          <p className="lede md:col-span-5">
            Meals are cooked in our own kitchens and served in bright, clean dining halls — breakfast before
            class, a hot dinner after the last test series.
          </p>
        </div>

        <ul className="acc mt-14 md:h-[min(72vh,640px)]">
          {mess.map((m, i) => (
            <li key={m.src} className="reveal">
              <figure tabIndex={0} className="photo relative h-[60vh] outline-none md:h-full">
                <Image src={m.src} alt={m.title} fill sizes="(min-width:768px) 60vw, 80vw" className="object-cover" />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <span className="acc-num eyebrow absolute bottom-5 left-1/2 -translate-x-1/2 text-paper [writing-mode:vertical-rl]">
                  0{i + 1} · {m.title}
                </span>
                <figcaption className="acc-cap absolute inset-x-5 bottom-5 text-paper md:inset-x-7 md:bottom-7">
                  <span className="eyebrow text-marigold">
                    0{i + 1} — {m.where}
                  </span>
                  <span className="mt-2 block font-serif text-3xl md:text-5xl">{m.title}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────── Life inside (type as a window) ───────────── */}
      <section className="overflow-hidden bg-paper-2">
        <div className="mx-auto max-w-[1440px] px-4 pt-24 md:px-10 md:pt-36">
          <SectionHead n="05" label="Life inside">
            <h2 className="h2">
              A desk to focus.{" "}
              <Drift>
                <span className="serif-i">A garden to breathe.</span>
              </Drift>
            </h2>
          </SectionHead>
        </div>

        <div className="mt-10 px-2 md:mt-6">
          <MaskedWord word="breathe" src="/photos/h7/05.jpg" className="text-center text-[31vw]" />
        </div>

        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 pb-24 pt-24 md:grid-cols-3 md:gap-6 md:px-10 md:pb-36 md:pt-24">
          {life.map((l, i) => (
            <Parallax key={l.src} speed={[0.04, 0.12, 0.07][i]}>
              <figure className="group">
                <Shot src={l.src} alt={l.title} sizes="(min-width:768px) 31vw, 100vw" className={l.aspect} />
                <figcaption className="mt-4 border-t border-line pt-3">
                  <span className="eyebrow text-ink-3">0{i + 1}</span>
                  <span className="mt-1 block font-serif text-[1.7rem] leading-tight">{l.title}</span>
                  <p className="mt-1 text-[0.92rem] leading-relaxed text-ink-2">{l.text}</p>
                </figcaption>
              </figure>
            </Parallax>
          ))}
        </div>
      </section>

      {/* ───────────── Safety & care (hover-reveal list) ───────────── */}
      <section id="care" className="mx-auto max-w-[1440px] px-4 py-24 md:px-10 md:py-36">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow flex gap-3">
              <span className="opacity-50">06</span>
              <span>Safety &amp; care</span>
            </p>
            <h2 className="h2 mt-5">
              The things parents
              <br />
              <Drift>
                <span className="serif-i">ask about first.</span>
              </Drift>
            </h2>
          </div>
          <p className="lede md:col-span-5">
            Facilities vary by building — each residence page lists exactly what that address offers.
          </p>
        </div>
        <div className="mt-14">
          <HoverRevealList items={care} />
        </div>
      </section>

      {/* ───────────── Visit ───────────── */}
      <section id="visit" className="grain relative bg-ink text-paper">
        <div className="mx-auto max-w-[1440px] px-4 py-24 md:px-10 md:py-36">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-6">
              <p className="eyebrow flex gap-3 text-marigold">
                <span className="opacity-60">07</span>
                <span>Visit</span>
              </p>
              <h2 className="h2 mt-6">
                Come see it
                <br />
                <Drift speed={0.08}>
                  <span className="serif-i">before you decide.</span>
                </Drift>
              </h2>
              <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-paper/65">
                Walk the rooms, eat a meal in the mess, meet the warden. Bring your parents — we&rsquo;d rather
                you choose with your own eyes.
              </p>
              <div className="mt-10">
                <ContactActions tone="dark" mapUrl={hostels[0].mapUrl} />
              </div>
            </div>

            <ul className="min-w-0 lg:col-span-6">
              {hostels.map((h, i) => (
                <li key={h.slug} className="group/row border-t border-line-ink last:border-b">
                  <div className="flex items-center gap-4 py-4 transition-transform duration-500 group-hover/row:translate-x-2">
                    <span className="eyebrow w-6 text-paper/40">{String(i + 1).padStart(2, "0")}</span>
                    <Link href={`/residences/${h.slug}`} className="min-w-0 flex-1 group">
                      <span className="block truncate font-serif text-[1.35rem] group-hover:text-marigold">
                        {h.name}
                      </span>
                      <span className="eyebrow text-paper/40">
                        {[genderLabel(h.gender), h.area].filter(Boolean).join(" · ")}
                      </span>
                    </Link>
                    <a
                      href={h.mapUrl}
                      target="_blank"
                      rel="noopener"
                      className="eyebrow shrink-0 rounded-full border border-line-ink px-3 py-2 text-paper/70 transition-colors hover:border-marigold hover:text-marigold"
                    >
                      Map ↗
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
