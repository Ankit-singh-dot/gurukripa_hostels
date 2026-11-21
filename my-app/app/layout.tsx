import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Gurukripa Hostel — Girls' & Boys' Residences in Kota",
    template: "%s · Gurukripa Hostel, Kota",
  },
  description:
    "Eight Gurukripa residences across Kota. Single, two-seater and three-seater rooms, an in-house mess, study halls and a rooftop garden — a second home for students.",
  // Gurukripa logo replaces the default Next.js favicon.
  // Small tab sizes use the "GR" monogram so it stays legible at 16px.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-mark.png", type: "image/png", sizes: "256x256" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180" },
  },
  openGraph: {
    title: "Gurukripa Hostel — Girls' & Boys' Residences in Kota",
    images: ["/photos/h7/05.jpg"],
  },
};

export const viewport: Viewport = { themeColor: "#f5f1ea" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
