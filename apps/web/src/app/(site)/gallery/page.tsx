import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getGalleryAlbums, getGalleryProducts } from "@/lib/data";
import { CtaBand } from "@/components/layout/CtaBand";

export const metadata: Metadata = {
  title: "Gallery — VeBlyss",
  description: "Workshops, artisans, products and packaging — a closer look at where every VeBlyss piece actually comes from.",
};

const PLACEHOLDER_TILES = [
  { cls: "g1", label: "WORKSHOPS / 01" },
  { cls: "g2", label: "PRODUCTS / 01" },
  { cls: "g3", label: "PACKAGING / 01" },
  { cls: "g4", label: "ARTISANS / 01" },
  { cls: "g5", label: "IN THE HOME / 01" },
  { cls: "g6", label: "BEHIND THE SCENES / 01" },
];

const FILTERS = ["All", "Workshops", "Products", "Packaging", "Artisans", "In the Home", "Behind the Scenes", "Customer Moments"];

export default async function GalleryPage() {
  const [albums, galleryProducts, categories] = await Promise.all([
    getGalleryAlbums(),
    getGalleryProducts(),
    getCategories(),
  ]);
  const categorySlugById = new Map(categories.map((c) => [c.id, c.slug]));
  const albumImages = albums.flatMap((a) => a.images ?? []);
  const productTiles = galleryProducts.flatMap((p) => {
    const categorySlug = categorySlugById.get(p.categoryId);
    return p.images.map((url, i) => ({ url, alt: p.name, categorySlug, key: `${p.id}-${i}` }));
  });
  const hasRealImages = albumImages.length > 0 || productTiles.length > 0;

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Gallery
          </div>
          <h1>See the Hands Behind Your Piece</h1>
          <p>Artisan workshops, product close-ups, packaging, and behind-the-scenes moments — a closer look at where your piece actually comes from.</p>
          <div className="filterbar">
            {FILTERS.map((f, i) => (
              <span className={`chip ${i === 0 ? "active" : ""}`} key={f}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section>
        <div className="wrap">
          {hasRealImages ? (
            <div className="gallery-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
              {albumImages.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={img.id} src={img.url} alt={img.altText ?? ""} style={{ aspectRatio: "1", objectFit: "cover", border: "1px solid var(--border)" }} />
              ))}
              {productTiles.map((tile) =>
                tile.categorySlug ? (
                  <Link key={tile.key} href={`/products/${tile.categorySlug}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tile.url} alt={tile.alt} style={{ aspectRatio: "1", objectFit: "cover", border: "1px solid var(--border)" }} />
                  </Link>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={tile.key} src={tile.url} alt={tile.alt} style={{ aspectRatio: "1", objectFit: "cover", border: "1px solid var(--border)" }} />
                )
              )}
            </div>
          ) : (
            <div className="gallery-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
              {PLACEHOLDER_TILES.map((t) => (
                <div className={`gtile ${t.cls}`} key={t.label}>
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
          )}
          <div className="empty-state">
            <div className="eyebrow">Customer Moments</div>
            <p>We&apos;ll share real customer moments here as they come in — tag us when your piece arrives, and it might feature.</p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
