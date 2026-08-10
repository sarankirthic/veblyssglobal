import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data";
import { getCategoryContent } from "@/lib/category-content";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";

export const metadata: Metadata = {
  title: "Shop All Categories — VeBlyss",
  description:
    "Explore VeBlyss: handcrafted leather goods, copperware, jewellery, home decor, sustainable lifestyle products and curated Indian pantry essentials.",
};

export default async function ProductsIndexPage() {
  const [categories, { items: allProducts }] = await Promise.all([
    getCategories(),
    getProducts({ perPage: 100 }),
  ]);

  const thumbByCategory = new Map<string, string>();
  for (const p of allProducts) {
    if (!p.images[0]) continue;
    if (!thumbByCategory.has(p.categoryId) || p.featured) thumbByCategory.set(p.categoryId, p.images[0]);
  }

  return (
    <>
      <PageHero
        crumb="Products"
        title="Six Categories, All Handmade"
        description="Every category traces back to a named Indian craft region — leather from Dharavi, copper from Moradabad, jewellery from Jaipur. Each piece is made by hand, not mass-produced."
      />

      <section>
        <div className="wrap">
          {categories.length === 0 ? (
            <div className="empty-state">
              <div className="eyebrow">Catalogue coming soon</div>
              <p>Categories will appear here once the catalogue is published.</p>
            </div>
          ) : (
            <div className="catgrid">
              {categories.map((c, i) => {
                const content = getCategoryContent(c.slug);
                return (
                  <Link key={c.id} className="catcard" href={`/products/${c.slug}`}>
                    {thumbByCategory.get(c.id) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbByCategory.get(c.id)}
                        alt={c.name}
                        className="sw"
                        style={{ width: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div className={`sw ${content.swatchClass}`}></div>
                    )}
                    <div className="body">
                      <div className="n">{String(i + 1).padStart(2, "0")}</div>
                      <h3>{c.name}</h3>
                      <p>{c.description}</p>
                      <div className="moq">{(c.originRegion ?? "MULTI-REGION").toUpperCase()}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
