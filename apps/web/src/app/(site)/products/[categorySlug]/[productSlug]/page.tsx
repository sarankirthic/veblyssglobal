import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductBySlug } from "@/lib/data";
import { getCategoryContent } from "@/lib/category-content";
import { CtaBand } from "@/components/layout/CtaBand";

async function loadProduct(categorySlug: string, productSlug: string) {
  const [category, product] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getProductBySlug(productSlug),
  ]);
  if (!category || !product || product.categorySlug !== categorySlug) return null;
  return { category, product };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;
  const found = await loadProduct(categorySlug, productSlug);
  if (!found) return {};

  return {
    title: `${found.product.name} — VeBlyss`,
    description: found.product.shortDescription ?? found.product.description ?? undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}) {
  const { categorySlug, productSlug } = await params;
  const found = await loadProduct(categorySlug, productSlug);
  if (!found) notFound();
  const { category, product } = found;

  const staticFallback = getCategoryContent(categorySlug);
  const catHeroHeadline = category.heroHeadline || staticFallback.heroHeadline;
  const catWhyChoose = category.whyChoose.length > 0 ? category.whyChoose : staticFallback.whyChoose;
  const catGuarantee = category.guarantee || staticFallback.guarantee;
  const catIdealFor = category.idealFor.length > 0 ? category.idealFor : staticFallback.idealFor;

  const heroHeadline = product.heroHeadline || catHeroHeadline;
  const whyChoose = product.whyChoose.length > 0 ? product.whyChoose : catWhyChoose;
  const guarantee = product.guarantee || catGuarantee;
  const idealFor = product.idealFor.length > 0 ? product.idealFor : catIdealFor;

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/products">Products</Link> /{" "}
            <Link href={`/products/${categorySlug}`}>{category.name}</Link> / {product.name}
          </div>
          <h1>{heroHeadline}</h1>
          <p>{product.shortDescription ?? category.description}</p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="section-head">
            <h2>Details</h2>
            <span className="meta">{product.name}</span>
          </div>
          <div className="speccard" style={{ marginTop: 22 }}>
            <div className="imgs">
              {product.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[0]} alt={product.name} style={{ width: "100%", minHeight: 220, objectFit: "cover" }} />
              ) : (
                <div className={`swatch ${staticFallback.swatchClass}`} style={{ border: 0 }}>
                  <span>PRIMARY</span>
                </div>
              )}
              {product.images[1] ?? product.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[1] ?? product.images[0]}
                  alt={product.name}
                  style={{ width: "100%", minHeight: 220, objectFit: "cover" }}
                />
              ) : (
                <div className={`swatch ${staticFallback.swatchClass}`} style={{ border: 0 }}>
                  <span>DETAIL</span>
                </div>
              )}
            </div>
            <div className="spec-table">
              {product.materials && (
                <div className="spec-row">
                  <span className="k">Materials</span>
                  <span className="v">{product.materials}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="spec-row">
                  <span className="k">Dimensions</span>
                  <span className="v">{product.dimensions}</span>
                </div>
              )}
              {product.packaging && (
                <div className="spec-row">
                  <span className="k">Packaging</span>
                  <span className="v">{product.packaging}</span>
                </div>
              )}
              {product.specs.map((s) => (
                <div className="spec-row" key={s.key}>
                  <span className="k">{s.key}</span>
                  <span className="v">{s.value}</span>
                </div>
              ))}
              <div className="spec-row">
                <span className="k">Delivery</span>
                <span className="v">{product.leadTime ?? "Confirmed with your order"}</span>
              </div>
              <div className="spec-row">
                <span className="k">Price</span>
                <span className="v">
                  {product.priceRange ?? <Link href="/contact" className="accent">Enquire for pricing</Link>}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap diff-wrap">
          <div>
            <h2>Why choose this piece</h2>
            <ul className="bullets">
              {whyChoose.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="lede">Guarantee: {guarantee}</p>
          </div>
          <div>
            <h2>Ideal for</h2>
            <div className="tags">
              {idealFor.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <h2 style={{ marginTop: 34 }}>More from this category</h2>
            <div className="related">
              <Link href={`/products/${categorySlug}`}>{category.name}</Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        heading="Interested in this piece?"
        note="Reach out for pricing, sizing, or a custom request — we reply within 24 hours."
        contactLine={`${product.name} · info@veblyssglobal.com · +91 98448 44225`}
      />
    </>
  );
}
