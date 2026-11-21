import type { Metadata } from "next";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ContactActions } from "@/components/contact-actions";
import { Gallery } from "@/components/gallery";
import { ParallaxLayer } from "@/components/motion";
import { embedUrl, genderLabel, getHostel, hostels, roomInfo } from "@/lib/hostels";

export function generateStaticParams() {
  return hostels.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: PageProps<"/residences/[slug]">): Promise<Metadata> {
  const h = getHostel((await params).slug);
  if (!h) return {};
  return {
    title: h.name,
    description: `${h.name}, ${h.area}. ${h.line}`,
    openGraph: h.cover ? { images: [h.cover] } : undefined,
  };
}

export default function Page({ params }: PageProps<"/residences/[slug]">) {
  return (
    <Suspense fallback={<ResidenceSkeleton />}>
      {params.then(({ slug }) => (
        <Residence slug={slug} />
      ))}
    </Suspense>
  );
}

function ResidenceSkeleton() {
  return (
    <section aria-busy className="mx-auto max-w-[1440px] animate-pulse px-4 pt-28 md:px-10 md:pt-36">
      <div className="h-3 w-32 rounded-full bg-paper-2" />
      <div className="mt-10 h-16 w-3/4 rounded-xl bg-paper-2" />
      <div className="mt-12 aspect-[16/9] rounded-[var(--radius)] bg-paper-2" />
    </section>
  );
}

function Residence({ slug }: { slug: string }) {
  const h = getHostel(slug);
  if (!h) notFound();

  const i = hostels.indexOf(h);
  const next = hostels[(i + 1) % hostels.length];
  const g = genderLabel(h.gender);

  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-[1440px] px-4 pt-28 md:px-10 md:pt-36">
        <nav className="eyebrow flex items-center gap-2 text-ink-3">
          <Link href="/#residences" className="link-u hover:text-ink">
            Residences
          </Link>
          <span>/</span>
          <span className="text-ink">{String(i + 1).padStart(2, "0")}</span>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap gap-2">
              {g && (
                <span
                  className={`eyebrow rounded-full px-3 py-1.5 ${h.gender === "girls" ? "bg-marigold text-ink" : "bg-ink text-paper"}`}
                >
                  {g}
                </span>
              )}
              <span className="eyebrow rounded-full border border-line px-3 py-1.5 text-ink-2">{h.area}</span>
            </div>
            <h1 className="mt-6 font-serif text-[clamp(2.75rem,6.4vw,6.5rem)] leading-[0.95] tracking-[-0.02em]">
              <span className="line-mask">
                <span>{h.name}</span>
              </span>
            </h1>
          </div>
          <p className="lede fade-up lg:col-span-4 lg:pb-3" style={{ "--d": "400ms" } as React.CSSProperties}>
            {h.line}
          </p>
        </div>
      </section>

      {/* Cover */}
      <section className="mx-auto mt-12 max-w-[1440px] px-4 md:px-10">
        {h.photos.length >= 3 ? (
          <div className="grid gap-3 md:grid-cols-12 md:gap-4">
            {h.photos.slice(0, 3).map((p, k) => (
              <div
                key={p.src}
                style={{ "--d": `${250 + k * 120}ms` } as React.CSSProperties}
                className={`photo fade-up ${k === 0 ? "aspect-[4/5] md:col-span-5 md:aspect-auto md:h-[min(72vh,760px)]" : k === 1 ? "hidden md:col-span-4 md:block" : "hidden md:col-span-3 md:block"}`}
              >
                <ParallaxLayer speed={0.06 + k * 0.04}>
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    loading={k === 0 ? "eager" : undefined}
                    fetchPriority={k === 0 ? "high" : undefined}
                    sizes={k === 0 ? "(min-width:768px) 42vw, 100vw" : "30vw"}
                    className="object-cover"
                  />
                </ParallaxLayer>
              </div>
            ))}
          </div>
        ) : h.cover ? (
          <div className="photo aspect-[4/5] sm:aspect-[16/10]">
            <Image src={h.cover} alt={h.name} fill loading="eager" fetchPriority="high" sizes="100vw" className="object-cover" />
          </div>
        ) : (
          <div className="grain relative grid aspect-[16/9] overflow-hidden rounded-[var(--radius)] place-items-center bg-ink px-6 text-center text-paper lg:aspect-[21/9]">
            <div>
              <p className="eyebrow text-marigold">Photos on the way</p>
              <p className="mt-4 font-serif text-4xl md:text-5xl">Visit us to see it first.</p>
            </div>
          </div>
        )}
      </section>

      {/* Facts */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <dl className="grid gap-px self-start overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2 lg:col-span-7">
            <div className="bg-paper p-6 md:p-8">
              <dt className="eyebrow text-ink-3">Room formats</dt>
              <dd className="mt-4">
                {h.rooms.length ? (
                  <ul className="space-y-2">
                    {h.rooms.map((r) => (
                      <li key={r} className="flex items-baseline justify-between gap-4">
                        <span className="font-serif text-2xl">{roomInfo[r].title}</span>
                        <span className="eyebrow text-ink-3">{roomInfo[r].seats}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-serif text-2xl">Ask for availability</p>
                )}
              </dd>
            </div>
            <div className="bg-paper p-6 md:p-8">
              <dt className="eyebrow text-ink-3">At this address</dt>
              <dd className="mt-4">
                {h.amenities.length ? (
                  <ul className="space-y-2 text-[0.98rem]">
                    {h.amenities.map((a) => (
                      <li key={a} className="flex gap-3">
                        <span className="mt-[0.6em] h-1 w-3 shrink-0 bg-marigold" />
                        {a}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-ink-2">Details coming soon.</p>
                )}
              </dd>
            </div>
          </dl>

          <div className="lg:col-span-5">
            <p className="eyebrow text-ink-3">Plan a visit</p>
            <p className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
              See the rooms, taste the food, meet the warden.
            </p>
            <div className="mt-8">
              <ContactActions mapUrl={h.mapUrl} message={`Hi, I'd like to know about rooms at ${h.name}.`} />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {h.photos.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 pb-24 md:px-10 md:pb-32">
          <div className="mb-8 flex items-end justify-between border-t border-ink pt-8">
            <h2 className="h2">
              Inside <span className="serif-i">the house</span>
            </h2>
            <span className="eyebrow hidden text-ink-3 sm:block">{h.photos.length} photographs</span>
          </div>
          <Gallery photos={h.photos} />
        </section>
      )}

      {/* Reviews (only when genuine reviews are added to lib/hostels.ts) */}
      {h.reviews.length > 0 && (
        <section className="bg-paper-2">
          <div className="mx-auto max-w-[1440px] px-4 py-24 md:px-10">
            <h2 className="h2">
              In their <span className="serif-i">words</span>
            </h2>
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {h.reviews.map((r) => (
                <li key={r.name + r.text.slice(0, 12)} className="border-t border-ink pt-6">
                  <p className="text-marigold" aria-label={`${r.rating} out of 5`}>
                    <span className="text-ink">{"★".repeat(r.rating)}</span>
                  </p>
                  <blockquote className="mt-4 font-serif text-2xl leading-snug">&ldquo;{r.text}&rdquo;</blockquote>
                  <p className="eyebrow mt-5 text-ink-3">{r.name} · Google review</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Map */}
      <section className="mx-auto max-w-[1440px] px-4 pb-24 md:px-10 md:pb-32">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-ink-3">Location</p>
            <p className="mt-4 font-serif text-3xl">{h.area}</p>
            <a href={h.mapUrl} target="_blank" rel="noopener" className="link-u mt-4 inline-block text-ink-2">
              Open in Google Maps — read reviews ↗
            </a>
          </div>
          <div className="photo clip-reveal aspect-[4/3] lg:col-span-8 lg:aspect-[16/8]">
            <iframe
              title={`Map showing ${h.name}`}
              src={embedUrl(h.mapQuery)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full grayscale-[0.85] contrast-[1.05]"
            />
          </div>
        </div>
      </section>

      {/* Next */}
      <Link href={`/residences/${next.slug}`} className="group block border-t border-line">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-14 md:px-10 md:py-20">
          <div>
            <p className="eyebrow text-ink-3">Next residence</p>
            <p className="mt-3 font-serif text-[clamp(2rem,4.5vw,4.5rem)] leading-none transition-[color,translate] duration-500 group-hover:translate-x-3 group-hover:text-ink-2">
              {next.name}
            </p>
          </div>
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-ink text-2xl transition-all duration-500 group-hover:bg-marigold group-hover:border-marigold md:h-24 md:w-24">
            →
          </span>
        </div>
      </Link>
    </>
  );
}
