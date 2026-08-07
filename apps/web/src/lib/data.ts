import { apiFetch } from "@/lib/api";
import type {
  Category,
  GalleryAlbum,
  PageMeta,
  Product,
  SiteSettings,
} from "@/lib/types";

/**
 * Listing endpoints degrade to an empty list instead of throwing, so a page
 * still renders (with an empty state) if the API is briefly unreachable or a
 * category genuinely has nothing in it yet — see STRUCTURE.md §5 on reserving
 * layout space for empty states rather than assuming content arrives complete.
 */
async function safeList<T>(fn: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fn();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  return safeList(async () => {
    const res = await apiFetch<{ data: Category[] }>("/api/v1/categories", { revalidate: 300 });
    return res.data;
  });
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getProducts(params?: {
  category?: string;
  featured?: boolean;
  page?: number;
  perPage?: number;
}): Promise<{ items: Product[]; meta: PageMeta }> {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.featured !== undefined) search.set("featured", String(params.featured));
  if (params?.page) search.set("page", String(params.page));
  if (params?.perPage) search.set("per_page", String(params.perPage));

  try {
    const res = await apiFetch<{ data: Product[]; meta: PageMeta }>(
      `/api/v1/products${search.toString() ? `?${search}` : ""}`,
      { revalidate: 120 }
    );
    return { items: res.data, meta: res.meta };
  } catch (err) {
    console.error(err);
    return { items: [], meta: { page: 1, perPage: params?.perPage ?? 24, total: 0 } };
  }
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const res = await apiFetch<{ data: SiteSettings }>("/api/v1/settings", { revalidate: 300 });
    return res.data;
  } catch (err) {
    console.error(err);
    return {};
  }
}

export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  return safeList(async () => {
    const res = await apiFetch<{ data: GalleryAlbum[] }>("/api/v1/gallery/albums", {
      revalidate: 300,
    });
    return res.data;
  });
}

export async function getGalleryProducts(): Promise<Product[]> {
  return safeList(async () => {
    const res = await apiFetch<{ data: Product[]; meta: PageMeta }>(
      "/api/v1/products?show_in_gallery=true&per_page=100",
      { revalidate: 300 }
    );
    return res.data;
  });
}

export async function submitContactForm(payload: {
  name: string;
  email: string;
  country?: string;
  interest?: string;
  message: string;
}): Promise<{ id: string }> {
  const res = await apiFetch<{ data: { id: string } }>("/api/v1/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}
