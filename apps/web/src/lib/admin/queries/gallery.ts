import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/admin/api";
import type { GalleryAlbum } from "@/lib/types";

const ALBUMS_KEY = ["gallery", "albums"] as const;
const ALBUM_KEY = (id: string) => ["gallery", "albums", id] as const;

export function useAlbums() {
  return useQuery({
    queryKey: ALBUMS_KEY,
    queryFn: async () =>
      (await apiFetch<{ data: GalleryAlbum[] }>("/api/v1/gallery/albums")).data,
  });
}

export function useAlbum(id: string | null) {
  return useQuery({
    queryKey: id ? ALBUM_KEY(id) : ["gallery", "albums", "none"],
    queryFn: async () => (await apiFetch<{ data: GalleryAlbum }>(`/api/v1/gallery/albums/${id}`)).data,
    enabled: !!id,
  });
}

export type AlbumInput = { name: string; slug: string; displayOrder: number };

export function useCreateAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AlbumInput) =>
      apiFetch<{ data: GalleryAlbum }>("/api/v1/gallery/albums", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ALBUMS_KEY }),
  });
}

export function useDeleteAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/v1/gallery/albums/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ALBUMS_KEY }),
  });
}

export type ImageInput = { url: string; altText?: string | null; order: number };

export function useAddImage(albumId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ImageInput) =>
      apiFetch(`/api/v1/gallery/albums/${albumId}/images`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ALBUM_KEY(albumId) });
      qc.invalidateQueries({ queryKey: ALBUMS_KEY });
    },
  });
}

export function useDeleteImage(albumId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) =>
      apiFetch(`/api/v1/gallery/albums/${albumId}/images/${imageId}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ALBUM_KEY(albumId) });
      qc.invalidateQueries({ queryKey: ALBUMS_KEY });
    },
  });
}

export function useReorderImages(albumId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageIds: string[]) =>
      apiFetch(`/api/v1/gallery/albums/${albumId}/order`, {
        method: "PUT",
        body: JSON.stringify({ imageIds }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ALBUM_KEY(albumId) }),
  });
}
