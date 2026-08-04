import Link from "next/link";
import type { Metadata } from "next";
import { getCategories } from "@/lib/data";
import { getCategoryContent } from "@/lib/category-content";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";

export const metadata: Metadata = {
  title: "Shop All Categories — VeBlyss",
  description:
    "Explore VeBlyss: handcrafted leather goods, copperware, jewellery, home decor, sustainable lifestyle products and curated Indian pantry essentials.",
};

export default async function ProductsIndexPage() {
  const categories = await getCategories();

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
                    <div className={`sw ${content.swatchClass}`}></div>
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
