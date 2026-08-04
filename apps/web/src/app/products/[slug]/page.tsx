import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/data";
import { getCategoryContent } from "@/lib/category-content";
import { CtaBand } from "@/components/layout/CtaBand";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: `${category.name} — VeBlyss`,
    description: category.description ?? `Handcrafted ${category.name}, made by named artisan communities across India.`,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [{ items: products }, allCategories] = await Promise.all([
    getProducts({ category: slug, perPage: 12 }),
    getCategories(),
  ]);

  const content = getCategoryContent(slug);
  const featured = products.find((p) => p.featured) ?? products[0];
  const related = allCategories.filter((c) => c.slug !== slug).slice(0, 2);

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/products">Products</Link> / {category.name}
          </div>
          <h1>{content.heroHeadline}</h1>
          <p>{category.description}</p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="section-head">
            <h2>The Collection</h2>
            <span className="meta">{category.originRegion ?? "Multi-region"}</span>
          </div>
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="eyebrow">New pieces coming soon</div>
              <p>Products in this category will appear here as they&apos;re added.</p>
            </div>
          ) : (
            <div className="catgrid">
              {products.map((p) => (
                <div className="catcard" key={p.id}>
                  <div className={`sw ${content.swatchClass}`}></div>
                  <div className="body">
                    <h3>{p.name}</h3>
                    <p>{p.shortDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {featured && (
        <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div className="wrap">
            <div className="section-head">
              <h2>Details</h2>
              <span className="meta">{featured.name}</span>
            </div>
            <div className="speccard" style={{ marginTop: 22 }}>
              <div className="imgs">
                <div className={`swatch ${content.swatchClass}`} style={{ border: 0 }}>
                  <span>PRIMARY</span>
                </div>
                <div className={`swatch ${content.swatchClass}`} style={{ border: 0 }}>
                  <span>DETAIL</span>
                </div>
              </div>
              <div className="spec-table">
                {featured.materials && (
                  <div className="spec-row">
                    <span className="k">Materials</span>
                    <span className="v">{featured.materials}</span>
                  </div>
                )}
                {featured.dimensions && (
                  <div className="spec-row">
                    <span className="k">Dimensions</span>
                    <span className="v">{featured.dimensions}</span>
                  </div>
                )}
                {featured.packaging && (
                  <div className="spec-row">
                    <span className="k">Packaging</span>
                    <span className="v">{featured.packaging}</span>
                  </div>
                )}
                {featured.specs.map((s) => (
                  <div className="spec-row" key={s.key}>
                    <span className="k">{s.key}</span>
                    <span className="v">{s.value}</span>
                  </div>
                ))}
                <div className="spec-row">
                  <span className="k">Delivery</span>
                  <span className="v">{featured.leadTime ?? "Confirmed with your order"}</span>
                </div>
                <div className="spec-row">
                  <span className="k">Price</span>
                  <span className="v">
                    {featured.priceRange ?? <Link href="/contact" className="accent">Enquire for pricing</Link>}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="wrap diff-wrap">
          <div>
            <h2>Why choose this category</h2>
            <ul className="bullets">
              {content.whyChoose.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="lede">Guarantee: {content.guarantee}</p>
          </div>
          <div>
            <h2>Ideal for</h2>
            <div className="tags">
              {content.idealFor.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            {related.length > 0 && (
              <>
                <h2 style={{ marginTop: 34 }}>Related categories</h2>
                <div className="related">
                  {related.map((c) => (
                    <Link key={c.id} href={`/products/${c.slug}`}>
                      {c.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Interested in this piece?"
        note="Reach out for pricing, sizing, or a custom request — we reply within 24 hours."
        contactLine={`${category.name} · info@veblyssglobal.com · +91 98448 44225`}
      />
    </>
  );
}
