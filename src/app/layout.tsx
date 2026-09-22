import type { Metadata } from "next";
import { Archivo_Black, Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const archivoBlack = Archivo_Black({ variable: "--font-display", weight: "400", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-serif", subsets: ["latin"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-mono", weight: ["400", "500", "600"], subsets: ["latin"] });
const plexSans = IBM_Plex_Sans({ variable: "--font-sans", weight: ["400", "500", "600", "700"], subsets: ["latin"] });

const SITE_URL = "https://aglaowner.vercel.app";
const SITE_DESCRIPTION =
  "A commission-free marketplace for selling a business, equipment, a lease, or inventory in India. Sellers pay once to list -- buyers browse and connect for free.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "aglaowner -- the next owner", template: "%s | aglaowner" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "aglaowner",
    title: "aglaowner -- the next owner",
    description: SITE_DESCRIPTION,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "aglaowner -- the next owner",
    description: SITE_DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "aglaowner",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  areaServed: "IN",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${fraunces.variable} ${plexMono.variable} ${plexSans.variable} h-full antialiased`}
    >
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
