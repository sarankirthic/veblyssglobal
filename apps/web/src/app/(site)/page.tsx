import Link from "next/link";
import Image from "next/image";
import { getCategories, getGalleryAlbums, getProducts, getSettings } from "@/lib/data";
import { CtaBand } from "@/components/layout/CtaBand";
import { getCategoryContent } from "@/lib/category-content";

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
  const [categories, settings, albums] = await Promise.all([
    getCategories(),
    getSettings(),
    getGalleryAlbums(),
  ]);
  const differentiators = settings.differentiators?.length ? settings.differentiators : DEFAULT_DIFFERENTIATORS;
  const albumImages = albums.flatMap((a) => a.images ?? []).slice(0, 6);

  const categoryCovers = await Promise.all(
    categories.map((c) => getProducts({ category: c.slug, perPage: 6 }).then((r) => r.items.find((p) => p.images[0])?.images[0]))
  );

  const bestSellers = await getProducts({ featured: true, perPage: 4 }).then((r) => r.items);

  return (
    <>
      <section className="hero2">
        <div className="hero2-media">
          <Image
            src="/assets/hero.png"
            alt="VeBlyss handcrafted leather, copperware and home decor, styled together"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 880px) 100vw, 1180px"
            className="hero2-img"
          />
          <div className="hero2-scrim" />
        </div>
        <div className="wrap">
          <div className="hero2-content">
            <div className="eyebrow">Handmade in India</div>
            <h1>The Soul of India, Curated for the World</h1>
            <p className="sub">
              Discover handcrafted products, timeless traditions, and contemporary expressions of India&apos;s rich
              heritage.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/products">
                Shop Collection
              </Link>
              <Link className="btn btn-outline" href="/about">
                Meet the Artisans
              </Link>
            </div>
            <div className="hero2-promise">
              <span className="label">The VeBlyss Promise</span>
              <span>Handcrafted</span>
              <span>Named Artisan Communities</span>
              <span>Ethically Sourced</span>
              <span>Plastic-Free Packaging</span>
              <Link className="more" href="/our-promise">
                Our Promise →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="products">
        <div className="wrap">
          <div className="section-head">
            <h2>Featured Collections</h2>
            <Link className="meta accent" href="/products">
              View all
            </Link>
          </div>
          {categories.length === 0 ? (
            <div className="empty-state">
              <div className="eyebrow">Catalogue coming soon</div>
              <p>Categories will appear here once the catalogue is published.</p>
            </div>
          ) : (
            <div className="collgrid">
              {categories.map((c, i) => {
                const cover = categoryCovers[i];
                const content = getCategoryContent(c.slug);
                return (
                  <Link key={c.id} href={`/products/${c.slug}`} className={`collcard ${i === 0 ? "tall" : ""} ${i === 3 ? "wide" : ""}`}>
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt={c.name} />
                    ) : (
                      <div className={`sw ${content.swatchClass}`}></div>
                    )}
                    <span className="collcard-label">{c.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {bestSellers.length > 0 && (
        <section>
          <div className="wrap">
            <div className="section-head">
              <h2>Best Sellers</h2>
            </div>
            <div className="bsgrid">
              {bestSellers.map((p) => (
                <Link key={p.id} href={`/products/${p.categorySlug}/${p.slug}`} className="bscard">
                  <div className="bscard-img">
                    {p.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0]} alt={p.name} />
                    ) : (
                      <div className="sw" />
                    )}
                  </div>
                  <span className="name">{p.name}</span>
                  <span className="price">{p.priceRange ?? "Enquire for pricing"}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
              {albumImages.length > 0
                ? albumImages.map((img) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={img.id} src={img.url} alt={img.altText ?? ""} style={{ aspectRatio: "1", objectFit: "cover", width: "100%" }} />
                  ))
                : GALLERY_TILES.map((t) => (
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
