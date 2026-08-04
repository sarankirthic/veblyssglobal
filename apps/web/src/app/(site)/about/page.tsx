import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/data";
import { CtaBand } from "@/components/layout/CtaBand";

export const metadata: Metadata = {
  title: "Our Story — VeBlyss",
  description:
    "VeBlyss brings together artisan communities across India — leather from Dharavi, copper from Moradabad, jewellery from Jaipur — to make handcrafted pieces for homes around the world.",
};

const DIFFERENTIATORS = [
  { title: "Ethical & Sustainable Sourcing", description: "Every piece traces back to a named artisan community — so you know exactly whose hands made it, and how." },
  { title: "Honest Materials", description: "Full-grain leather, food-safe copper, natural dyes — we tell you exactly what something is made of, and why it was chosen." },
  { title: "Made in Small Batches", description: "Handmade in small batches, not mass-produced on a line — expect natural variation, not a copy-paste finish." },
  { title: "Plastic-Free Packaging", description: "Every order arrives in recyclable, plastic-reduced packaging — considered from workshop to doorstep." },
  { title: "Quality You Can Feel", description: "Every piece is inspected by hand before it's packed — so what you see in the photos is what arrives at your door." },
  { title: "Here When You Need Us", description: "Real people in Bengaluru and London, ready to help with sizing, care, or a gift that needs to arrive on time." },
];

export default async function AboutPage() {
  const settings = await getSettings();
  const differentiators = settings.differentiators?.length ? settings.differentiators : DIFFERENTIATORS;

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / About
          </div>
          <h1>About VeBlyss</h1>
          <p>We bring together India&apos;s finest artisan traditions — leather, copper, jewellery, and craft — for people who care where their things come from.</p>
        </div>
      </div>

      <section>
        <div className="wrap diff-wrap">
          <div>
            <h2>Who we are</h2>
            <p className="lede">
              VeBlyss Global Pvt Ltd (India) and VeBlyss Limited (UK) are one team, working across two cities, with
              one job: bringing genuinely handmade Indian pieces to homes around the world.
            </p>
          </div>
          <div>
            <h2>Our story</h2>
            <p className="lede">
              Every product line traces back to a named craft region — leather from Dharavi, copperware from
              Moradabad, jewellery from Jaipur. We built VeBlyss to carry that craftsmanship beyond India — so a
              piece made by hand in Dharavi or Jaipur can become part of everyday life anywhere in the world.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap diff-wrap">
          <div>
            <div className="eyebrow">Our Vision</div>
            <h2 style={{ marginTop: 10, fontSize: 24 }}>
              A trusted home for ethically made, handcrafted goods — for people who want their everyday things to
              mean something.
            </h2>
          </div>
          <div>
            <div className="eyebrow">Our Mission</div>
            <h2 style={{ marginTop: 10, fontSize: 24 }}>
              Not simply to sell products — but to share stories, preserve craftsmanship, and create opportunities,
              connecting India&apos;s artisan communities with people who value real craft, wherever they live.
            </h2>
          </div>
        </div>
      </section>

      <section>
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
            <h2>The People Behind VeBlyss</h2>
            <span className="meta">Bengaluru · London</span>
          </div>
          <div className="cardgrid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            <div className="card">
              <div className="n">01</div>
              <h3>Managing Director</h3>
              <p>Oversees every partnership with our artisan workshops — making sure the story behind each piece is one worth telling.</p>
            </div>
            <div className="card">
              <div className="n">02</div>
              <h3>Head of Craft Partnerships</h3>
              <p>Works directly with artisan workshops in India to make sure every piece meets the standard we promise, long before it reaches you.</p>
            </div>
            <div className="card">
              <div className="n">03</div>
              <h3>UK Director</h3>
              <p>Leads our London base — your first point of contact if you&apos;re anywhere in Europe or North America.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <h2>Our Promise</h2>
            <Link className="meta accent" href="/our-promise">
              View all →
            </Link>
          </div>
          <div className="certgrid" style={{ gridTemplateColumns: "repeat(6,1fr)" }}>
            {["HANDCRAFTED", "NAMED ARTISANS", "ETHICAL", "PLASTIC-FREE", "SMALL-BATCH", "MADE TO LAST"].map((m) => (
              <div className="cert" key={m}>
                <div className="mark">{m}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <h2>Where We Deliver</h2>
          <div className="market-list">
            {["United Kingdom", "Europe", "Middle East", "North America", "Asia-Pacific"].map((m) => (
              <div className="market-row" key={m}>
                <span>{m}</span>
                <span className="tag">{m === "United Kingdom" ? "Home to our London studio" : "Tracked international shipping"}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand note="Talk to the team directly — no call centre, no hand-off." />
    </>
  );
}
