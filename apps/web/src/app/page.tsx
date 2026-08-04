import Link from "next/link";
import { getCategories, getSettings } from "@/lib/data";
import { CtaBand } from "@/components/layout/CtaBand";

const DEFAULT_DIFFERENTIATORS = [
  {
    title: "Ethical & Sustainable Sourcing",
    description:
      "Every piece traces back to a named artisan community — so you know exactly whose hands made it, and how.",
  },
  {
    title: "Honest Materials",
    description:
      "Full-grain leather, food-safe copper, natural dyes — we tell you exactly what something is made of, and why it was chosen.",
  },
  {
    title: "Made in Small Batches",
    description:
      "Handmade in small batches, not mass-produced on a line — expect natural variation, not a copy-paste finish.",
  },
  {
    title: "Plastic-Free Packaging",
    description: "Every order arrives in recyclable, plastic-reduced packaging — considered from workshop to doorstep.",
  },
  {
    title: "Quality You Can Feel",
    description:
      "Every piece is inspected by hand before it's packed — so what you see in the photos is what arrives at your door.",
  },
  {
    title: "Here When You Need Us",
    description: "Real people in Bengaluru and London, ready to help with sizing, care, or a gift that needs to arrive on time.",
  },
];

const MARKETS = ["United Kingdom", "Europe", "Middle East", "North America", "Asia-Pacific"];

const GALLERY_TILES = [
  { cls: "g1", label: "WORKSHOPS" },
  { cls: "g2", label: "PRODUCTS" },
  { cls: "g3", label: "PACKAGING" },
  { cls: "g4", label: "ARTISANS" },
  { cls: "g5", label: "IN THE HOME" },
  { cls: "g6", label: "BEHIND THE SCENES" },
];

export default async function HomePage() {
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);
  const differentiators = settings.differentiators?.length ? settings.differentiators : DEFAULT_DIFFERENTIATORS;

  return (
    <>
      <div className="hero wrap">
        <div className="eyebrow">Handcrafted in India, For the World</div>
        <h1>Everyday Pieces, Made By Hand</h1>
        <p className="sub">
          From Dharavi&apos;s leather workshops to Jaipur&apos;s jewellers — every VeBlyss piece is made by named
          artisan communities using techniques passed down for generations. Thoughtfully made, not mass-produced.
        </p>
        <div className="hero-cta">
          <Link className="btn btn-primary" href="/products">
            Shop the Collection
          </Link>
          <Link className="btn btn-outline" href="/about">
            Meet the Artisans
          </Link>
          <span className="note">We reply within 24 hours</span>
        </div>
        <div className="hero-imgs">
          <div className="swatch big sw-leather">
            <span>01 — LEATHER / DHARAVI, MUMBAI</span>
          </div>
          <div className="stack">
            <div className="swatch sw-copper">
              <span>02 — COPPER / FOOD-SAFE</span>
            </div>
            <div className="swatch sw-craft">
              <span>03 — HOME DECOR / WOOD, CLAY</span>
            </div>
          </div>
        </div>
        <div className="certstrip">
          <span className="label">The VeBlyss Promise</span>
          <span>HANDCRAFTED</span>
          <span>NAMED ARTISAN COMMUNITIES</span>
          <span>ETHICALLY SOURCED</span>
          <span>PLASTIC-FREE PACKAGING</span>
          <span>SMALL-BATCH</span>
          <span>MADE TO LAST</span>
          <Link className="more" href="/our-promise">
            Our Promise →
          </Link>
        </div>
      </div>

      <section id="products">
        <div className="wrap">
          <div className="section-head">
            <h2>Shop by Category</h2>
            <span className="meta">{categories.length} categories, each handmade</span>
          </div>
          <div className="table">
            <div className="row head">
              <span>No.</span>
              <span>Category</span>
              <span>What You&apos;ll Find</span>
              <span>Origin</span>
              <span style={{ textAlign: "right" }}>&nbsp;</span>
            </div>
            {categories.length === 0 ? (
              <div style={{ padding: 40 }} className="lede">
                Categories will appear here once the catalogue is published.
              </div>
            ) : (
              categories.map((c, i) => (
                <div className="row" key={c.id}>
                  <span className="no">{String(i + 1).padStart(2, "0")}</span>
                  <Link className="cat" href={`/products/${c.slug}`}>
                    {c.name}
                  </Link>
                  <span className="focus">{c.description ?? ""}</span>
                  <span className="origin">{c.originRegion ?? "Multi-region"}</span>
                  <span className="moq"></span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap diff-wrap">
          <div>
            <h2>Why VeBlyss</h2>
            <p>Every piece comes with more than a price tag — here&apos;s what stands behind it.</p>
          </div>
          <div className="diff-grid">
            {differentiators.map((d, i) => (
              <div className="diff-item" key={d.title}>
                <div className="n">{String(i + 1).padStart(2, "0")}</div>
                <div className="t">{d.title}</div>
                <div className="d">{d.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="section-head">
            <h2>From Workshop to Your Home</h2>
            <span className="meta">What happens before a piece ever reaches you</span>
          </div>
          <div className="cardgrid">
            <div className="card">
              <div className="n">01</div>
              <h3>Sourced Responsibly</h3>
              <p>Materials chosen from trusted, named regions — full-grain leather from Dharavi, food-safe copper from Moradabad.</p>
            </div>
            <div className="card">
              <div className="n">02</div>
              <h3>Handmade in Small Batches</h3>
              <p>Each piece passes through an artisan&apos;s hands, not a factory line — expect character, not uniformity.</p>
            </div>
            <div className="card">
              <div className="n">03</div>
              <h3>Packed With Care</h3>
              <p>Inspected, wrapped, and shipped in plastic-free packaging — ready to become part of your everyday.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap mg">
          <div>
            <h2>Where We Deliver</h2>
            <p className="lede">We ship worldwide, with tracked delivery to every region below.</p>
            <div className="market-list">
              {MARKETS.map((m) => (
                <div className="market-row" key={m}>
                  <span>{m}</span>
                  <span className="tag">{m === "United Kingdom" ? "Home to our London studio" : "Tracked international shipping"}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="section-head">
              <h2>See the workshops</h2>
              <Link className="meta accent" href="/gallery">
                View all →
              </Link>
            </div>
            <div className="gallery-grid">
              {GALLERY_TILES.map((t) => (
                <div className={`gtile ${t.cls}`} key={t.cls}>
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
