# FUTURE

Features that are built (or partly built) but intentionally not part of the live site right
now — different from `TODO.md`, which tracks real business facts still needed for copy already
live. Nothing here is fabricated data; it's scoped-out or paused work, kept so it isn't
rebuilt from scratch later.

## Shop by Occasion — paused (2026-08-08)

`apps/web/src/app/(site)/occasions/page.tsx` is fully built (5 occasion groupings, each linking
into real product categories) but deliberately unlinked from navigation (`Header.tsx`,
`Footer.tsx`) per an explicit call to hold it back for now. The route still resolves directly at
`/occasions` — nothing was deleted. To bring it back: re-add the `NavLink`/`Link` entries removed
from `Header.tsx` and `Footer.tsx`.

## No real product-detail page

`apps/web/src/app/(site)/products/[slug]/page.tsx` is actually a **category** detail page
(`CategoryDetailPage`, looked up by category slug) — there's no per-product detail route
anywhere in the app. The backend's single-product endpoint (`GET /api/v1/products/<id>`) is
ID-keyed, not slug-keyed, so a real product page would need a new slug-keyed lookup too.
`docs/STRUCTURE.md` §3.3 calls this "the single biggest content gap found in the audit." Surfaced
while building the gallery per-product toggle (2026-08-07) — gallery tiles link to the category
page instead as a stopgap.

## Industries page not built

`docs/STRUCTURE.md` §3.5 specs a `/industries` page (buyer-segment cards: Retailers, Hospitality,
Interior Designers, Gift Companies, Supermarkets, Private Label). Never built — same category of
gap as the Blog page and Certifications page were before this pass (both since resolved:
Blog was fabricated content and got deleted; Certifications got built for real on 2026-08-08).

## `published_only=false` has no role guard

`apps/api/app/schemas/product.py` (`ProductQuery.published_only`) and `list_products` in
`apps/api/app/products/views.py` — any unauthenticated caller can pass
`?published_only=false` and see draft/unpublished products. Not introduced by any recent
change; flagged during the gallery-toggle final review (2026-08-07) as real but out of scope
for that feature. Needs a `require_role` guard (or to ignore the param for anonymous sessions)
plus a test — `test_unpublished_product_hidden_from_public` only covers the default-true path.

## Minor gallery-page polish (deferred, not blocking anything)

- `apps/web/src/app/(site)/gallery/page.tsx` — some inline-style/JSX duplication between the
  album-image and product-image tile branches; a shared `tileStyle` const or small `GalleryTile`
  component would collapse it.
- No per-product image cap when a gallery-enabled product has many photos — one flagged product
  can currently dominate the grid. Taking the first 2-3 images per product would fix it.
- `apps/web/src/lib/data.ts`'s `getGalleryProducts()` requests `per_page=100` — silently caps at
  100 gallery-enabled products with no error. Fine at current catalogue size.
- No "in gallery" badge on the admin products list (`apps/web/src/app/admin/(dashboard)/products/page.tsx`)
  — no at-a-glance way to see what's currently showing on `/gallery` without opening each product.

## mapcn / office-locations map — tried, fully removed (2026-08-08)

`pnpm dlx shadcn@latest add @mapcn/map -c apps/web` was tried for showing office locations on
`/contact`. Needed a fix (`maplibre-gl@6.2.0` dropped its default export; the generated
component did `import MapLibreGL from "maplibre-gl"`, which resolved to `undefined`). After
that fix a full integration was built (two `OfficeMapCard` instances, one per office, real
coordinates on `OfficeLocation.lat`/`.lng`) — then broke the frontend again a different way and
was pulled out entirely per an explicit call to remove it, not just unlink it:
`apps/web/src/components/ui/map.tsx`, `apps/web/src/components/OfficeMapCard.tsx`, the
`lat`/`lng` fields (type, admin form, seed data, DB), and the `maplibre-gl`/`@types/geojson`
deps are all gone. `/contact` is back to the plain placeholder swatch. If office-location maps
come up again: consider a different map library, or budget real time to debug `@mapcn/map`
properly rather than patching it reactively — it broke twice in one session.
