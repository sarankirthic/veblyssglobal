import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/layout/CtaBand";

export const metadata: Metadata = {
  title: "Shop by Occasion — VeBlyss",
  description: "However you're shopping — for your home, a gift, or your everyday carry — find the VeBlyss category that fits.",
};

const OCCASIONS = [
  {
    n: "01",
    title: "For Your Home",
    body: "Copperware, hand-carved wood, and textiles that make a space feel considered, not decorated overnight.",
    links: [
      { label: "Copperware →", href: "/products/copperware" },
      { label: "Home Decor →", href: "/products/handcrafted-home-decor" },
    ],
  },
  {
    n: "02",
    title: "For Everyday Carry",
    body: "Bags, wallets and accessories built for daily use, not just special occasions.",
    links: [{ label: "Leather Goods →", href: "/products/leather-goods" }],
  },
  {
    n: "03",
    title: "For Gifting",
    body: "A piece with a story tends to matter more than a piece with a price tag — explore what to give, and who it's for.",
    links: [{ label: "Shop gifts →", href: "/products" }],
  },
  {
    n: "04",
    title: "For Style",
    body: "Necklaces, earrings and sets rooted in centuries-old technique, made for how you actually get dressed.",
    links: [{ label: "Jewellery →", href: "/products/jewellery" }],
  },
  {
    n: "05",
    title: "For Considered Living",
    body: "Small swaps — from your kitchen to your commute — that add up without asking you to compromise.",
    links: [{ label: "Sustainable Lifestyle Products →", href: "/products/sustainable-lifestyle-products" }],
  },
  {
    n: "06",
    title: "For the Pantry",
    body: "Spices, teas, and pantry favourites that turn a weeknight dinner into something worth slowing down for.",
    links: [{ label: "Curated Indian Essentials →", href: "/products/curated-indian-essentials" }],
  },
];

export default function OccasionsPage() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Shop by Occasion
          </div>
          <h1>Made for However You Live</h1>
          <p>
            Whether you&apos;re decorating a home, building a capsule of everyday-carry essentials, or looking for a
            gift with a story — VeBlyss has a place to start.
          </p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="cardgrid">
            {OCCASIONS.map((o) => (
              <div className="card" key={o.n}>
                <div className="n">{o.n}</div>
                <h3>{o.title}</h3>
                <p>{o.body}</p>
                <div className="links">
                  {o.links.map((l) => (
                    <Link key={l.href} href={l.href}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
