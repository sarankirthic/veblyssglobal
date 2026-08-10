import type { Metadata } from "next";
import { Marcellus, Karla, DM_Mono, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// Matches redesign/ mockup exactly: Marcellus (headlines) + Karla (nav/body/UI).
const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
});

const karla = Karla({
  variable: "--font-karla",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VeBlyss — Authentic Indian Craftsmanship, Handmade for Modern Homes",
  description:
    "Leather goods, copperware, jewellery, home decor and pantry essentials, handcrafted by named artisan communities across India. Made by hand, not mass-produced.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable, marcellus.variable, karla.variable, dmMono.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
