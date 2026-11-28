import sizes from "./photo-sizes.json";

/* ------------------------------------------------------------------ */
/*  Site-wide contact details.                                         */
/*  Fill these in — every "Call" / "WhatsApp" button appears only     */
/*  once a number is set. Use the full number with country code.      */
/* ------------------------------------------------------------------ */
export const site = {
  name: "Gurukripa Hostel",
  city: "Kota, Rajasthan",
  phone: "", // e.g. "+91 98290 00000"
  whatsapp: "919549175383", // digits only, with country code
  email: "",
};

export type Gender = "girls" | "boys";
export type RoomType = "single" | "double" | "triple";
export type PhotoTag =
  | "exterior"
  | "single"
  | "double"
  | "triple"
  | "room"
  | "study"
  | "mess"
  | "kitchen"
  | "bath"
  | "common"
  | "safety"
  | "garden";

export type Photo = {
  src: string;
  width: number;
  height: number;
  tag: PhotoTag;
  alt: string;
};

export type Review = { name: string; rating: number; text: string };

export type Hostel = {
  slug: string;
  name: string;
  /** One-line character of the place, shown under the name. */
  line: string;
  gender: Gender | null;
  area: string;
  mapUrl: string;
  /** Query used for the embedded map. */
  mapQuery: string;
  rooms: RoomType[];
  amenities: string[];
  cover?: string;
  photos: Photo[];
  /** Paste genuine Google reviews here; the section shows only when filled. */
  reviews: Review[];
};

const ALT: Record<PhotoTag, string> = {
  exterior: "Building exterior",
  single: "Single-seater room",
  double: "Two-seater room",
  triple: "Three-seater room",
  room: "Room interior",
  study: "Study area",
  mess: "Mess and dining hall",
  kitchen: "Kitchen",
  bath: "Bathroom",
  common: "Common area",
  safety: "Safety and access",
  garden: "Rooftop garden lounge",
};

/** Build a photo list from "index:tag" pairs, e.g. "01:single". */
function shots(dir: string, name: string, spec: string): Photo[] {
  return spec
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [n, tag] = pair.split(":") as [string, PhotoTag];
      const key = `${dir}/${n}.jpg` as keyof typeof sizes;
      const [width, height] = sizes[key];
      return {
        src: `/photos/${key}`,
        width,
        height,
        tag,
        alt: `${ALT[tag]} — ${name}`,
      };
    });
}

const H1 = "Gurukripa Girls' Residency";
const H2 = "Gurukripa Boys' Residency";
const H3 = "Gurukripa Boys' Residency, Jawahar Nagar";
const H4 = "Gurukripa Girls' Residency, Parijat";
const H5 = "Krishna Kunj";
const H6 = "Khalsa Boys' Residency";
const H7 = "Gurukripa Girls' Residency — Garden House";
const H8 = "Gurukripa Pulse 636";

export const hostels: Hostel[] = [
  {
    slug: "girls-residency",
    name: H1,
    line: "A new high-rise with modular, light-filled rooms.",
    gender: "girls",
    area: "Kota",
    mapUrl: "https://share.google/088Woy8hbDqYBcj1t",
    mapQuery: "Gurukripa Girl's Residency, Kota",
    rooms: ["single", "double", "triple"],
    amenities: ["Air-conditioned rooms", "In-house mess", "Study desk & wardrobe", "Modular furniture"],
    cover: "/photos/h1/03.jpg",
    photos: shots(
      "h1",
      H1,
      "03:exterior 12:double 06:triple 01:single 02:mess 08:double 11:triple 05:single 07:room 10:study 14:triple 17:double 09:room 13:single 15:study 18:triple",
    ),
    reviews: [],
  },
  {
    slug: "garden-house",
    name: H7,
    line: "Known for its rooftop garden — the calmest corner in Kota.",
    gender: "girls",
    area: "Kota",
    mapUrl: "https://share.google/BGhlIzhhQ0Qid03FY",
    mapQuery: "Gurukripa Girls residency, Kota",
    rooms: [],
    amenities: ["Rooftop garden lounge", "Cane seating & reading nooks", "Evening lighting"],
    cover: "/photos/h7/03.jpg",
    photos: shots("h7", H7, "05:garden 03:garden 01:garden 02:garden 04:garden 08:garden 09:garden 10:garden 06:garden"),
    reviews: [],
  },
  {
    slug: "parijat",
    name: H4,
    line: "A homely residence with its own library and dining hall.",
    gender: "girls",
    area: "Parijat · 10-F-27, Kota",
    mapUrl: "https://share.google/BQsJTMuFRjad0tpT2",
    mapQuery: "Gurukripa Girls Residency Parijat 10F27, Kota",
    rooms: ["single"],
    amenities: ["In-house library", "Dining hall", "Geyser in bathrooms", "Air-conditioned rooms", "Power backup"],
    cover: "/photos/h4/13.jpg",
    photos: shots(
      "h4",
      H4,
      "13:exterior 06:mess 10:study 01:single 03:room 09:mess 02:bath 04:study 07:mess 11:single 05:study",
    ),
    reviews: [],
  },
  {
    slug: "krishna-kunj",
    name: H5,
    line: "Five floors with lift, biometric entry and a bright mess.",
    gender: null,
    area: "Kota",
    mapUrl: "https://share.google/UCaURMOcQRjavMkkh",
    mapQuery: "Krishana Kunj, Kota",
    rooms: ["single"],
    amenities: ["Lift", "Biometric attendance", "In-house mess", "Balcony rooms", "SAIS registered · ID 3502"],
    cover: "/photos/h5/13.jpg",
    photos: shots(
      "h5",
      H5,
      "13:exterior 14:mess 16:single 02:safety 10:mess 06:single 01:safety 03:kitchen 17:single 05:common 15:safety 12:common 18:room 04:exterior",
    ),
    reviews: [],
  },
  {
    slug: "boys-residency",
    name: H2,
    line: "Practical rooms with attached baths and private desks.",
    gender: "boys",
    area: "Kota",
    mapUrl: "https://share.google/PxbqQxiW3ipYHHC6P",
    mapQuery: "Gurukripa Boy's Residency, Kota",
    rooms: ["single", "double"],
    amenities: ["Attached bathroom", "Air-conditioned rooms", "Study desk & shelf", "Balcony"],
    cover: "/photos/h2/18.jpg",
    photos: shots(
      "h2",
      H2,
      "18:double 09:double 12:single 07:study 15:double 22:single 08:bath 13:room 21:single 16:study 05:room 23:bath",
    ),
    reviews: [],
  },
  {
    slug: "jawahar-nagar",
    name: H3,
    line: "Close to the coaching belt, with a quiet study hall.",
    gender: "boys",
    area: "Jawahar Nagar, Kota",
    mapUrl: "https://share.google/rjB3AaRW3BhUlctud",
    mapQuery: "Gurukripa boys residency, Jawahar Nagar, Kota",
    rooms: ["single", "double"],
    amenities: ["Study hall with cubicles", "Air-conditioned rooms", "Balcony", "Twin study desks"],
    cover: "/photos/h3/05.jpg",
    photos: shots("h3", H3, "05:double 09:study 03:double 02:single 08:single 06:room 04:study 10:bath"),
    reviews: [],
  },
  {
    slug: "khalsa",
    name: H6,
    line: "A full-service building — lift, reception and a large mess.",
    gender: "boys",
    area: "Kota",
    mapUrl: "https://maps.app.goo.gl/FvzA4kGbJQWG9u3X9",
    mapQuery: "25.1990217,75.827398",
    rooms: [],
    amenities: ["Lift", "Front desk & warden office", "Large mess hall", "RO drinking water", "Power backup", "Fire safety"],
    cover: "/photos/h6/21.jpg",
    photos: shots(
      "h6",
      H6,
      "21:exterior 02:mess 24:safety 28:safety 16:common 30:kitchen 09:mess 04:kitchen 13:exterior 23:common 18:common 34:room 15:mess 01:exterior 26:mess 36:bath",
    ),
    reviews: [],
  },
  {
    slug: "pulse-636",
    name: H8,
    line: "Our newest address. Photos on the way.",
    gender: null,
    area: "Kota",
    mapUrl: "https://maps.app.goo.gl/FMn188zMEZfXbucJ8",
    mapQuery: "25.1407296,75.8449617",
    rooms: [],
    amenities: [],
    photos: [],
    reviews: [],
  },
];

export const roomInfo: Record<RoomType, { title: string; seats: string; blurb: string }> = {
  single: {
    title: "Single",
    seats: "1 seat",
    blurb: "Your own four walls. For the student who studies best alone and sleeps on her own schedule.",
  },
  double: {
    title: "Two-seater",
    seats: "2 seats",
    blurb: "Shared with one roommate. Separate beds, desks and storage — company without the crowd.",
  },
  triple: {
    title: "Three-seater",
    seats: "3 seats",
    blurb: "The most economical choice. Bunk and single beds, each with a dedicated study corner.",
  },
};

export const getHostel = (slug: string) => hostels.find((h) => h.slug === slug);

export const genderLabel = (g: Gender | null) => (g === "girls" ? "Girls" : g === "boys" ? "Boys" : null);

export const embedUrl = (q: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;

export const telHref = () => (site.phone ? `tel:${site.phone.replace(/\s+/g, "")}` : null);
export const waHref = (msg = "Hi, I'd like to know about rooms at Gurukripa Hostel.") =>
  site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}` : null;
