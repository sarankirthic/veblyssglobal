import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/admin/api";
import type { Category, PageMeta, Product } from "@/lib/types";

const CATEGORIES_KEY = ["categories"] as const;
const PRODUCTS_KEY = ["products"] as const;

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: async () => (await apiFetch<{ data: Category[] }>("/api/v1/categories")).data,
  });
}

export type CategoryInput = {
  name: string;
  slug: string;
  description?: string | null;
  originRegion?: string | null;
  displayOrder: number;
  heroHeadline?: string | null;
  whyChoose: string[];
  guarantee?: string | null;
  idealFor: string[];
};

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CategoryInput) =>
      apiFetch<{ data: Category }>("/api/v1/categories", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CategoryInput }) =>
      apiFetch<{ data: Category }>(`/api/v1/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/v1/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useProducts(params?: { category?: string }) {
  const search = new URLSearchParams();
  search.set("published_only", "false");
  search.set("per_page", "100");
  if (params?.category) search.set("category", params.category);

  return useQuery({
    queryKey: [...PRODUCTS_KEY, params?.category ?? "all"],
    queryFn: async () =>
      (await apiFetch<{ data: Product[]; meta: PageMeta }>(`/api/v1/products?${search}`)).data,
  });
}

export type ProductInput = {
  categoryId: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  materials?: string | null;
  dimensions?: string | null;
  moq?: string | null;
  packaging?: string | null;
  leadTime?: string | null;
  priceRange?: string | null;
  specs: { key: string; value: string }[];
  images: string[];
  featured: boolean;
  isPublished: boolean;
  showInGallery: boolean;
  heroHeadline?: string | null;
  whyChoose: string[];
  guarantee?: string | null;
  idealFor: string[];
};

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ProductInput) =>
      apiFetch<{ data: Product }>("/api/v1/products", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ProductInput }) =>
      apiFetch<{ data: Product }>(`/api/v1/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/v1/products/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}
