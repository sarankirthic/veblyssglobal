"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import {
  useAlbum,
  useAlbums,
  useAddImage,
  useCreateAlbum,
  useDeleteAlbum,
  useDeleteImage,
  useReorderImages,
} from "@/lib/admin/queries/gallery";
import { RoleGate } from "@/components/admin/RoleGate";
import { Button } from "@/components/admin/ui/Button";
import { ConfirmButton } from "@/components/admin/ui/ConfirmButton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { AlbumForm } from "@/components/admin/gallery/AlbumForm";
import { ImageUploader } from "@/components/admin/media/ImageUploader";

export default function GalleryPage() {
  const { data: albums, isLoading } = useAlbums();
  const createAlbum = useCreateAlbum();
  const deleteAlbum = useDeleteAlbum();
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  if (isLoading) return <p className="text-sm text-adm-muted">Loading…</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl">Gallery</h1>
        <RoleGate allow={["admin", "editor"]}>
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus size={14} /> Add Album
          </Button>
        </RoleGate>
      </div>

      {creating ? (
        <div className="mb-6">
          <AlbumForm
            onCancel={() => setCreating(false)}
            onSubmit={async (values) => {
              await createAlbum.mutateAsync(values);
              setCreating(false);
            }}
          />
        </div>
      ) : null}

      {!albums || albums.length === 0 ? (
        <EmptyState title="No albums yet" description="Create the first album to start uploading photos." />
      ) : (
        <div className="grid grid-cols-[240px_1fr] gap-6">
          <div className="flex flex-col gap-1">
            {albums.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a.id)}
                className={`flex items-center justify-between border px-3 py-2.5 text-left text-sm ${
                  selected === a.id
                    ? "border-adm-navy bg-white"
                    : "border-adm-hairline bg-white text-adm-muted hover:border-adm-navy"
                }`}
              >
                <span>{a.name}</span>
                <span className="font-mono text-[10px] text-adm-muted">{a.imageCount}</span>
              </button>
            ))}
          </div>

          {selected ? (
            <AlbumDetail
              albumId={selected}
              onDeleted={() => setSelected(null)}
              onDeleteAlbum={(id) => deleteAlbum.mutate(id)}
            />
          ) : (
            <EmptyState title="Select an album" description="Choose an album on the left to manage its images." />
          )}
        </div>
      )}
    </div>
  );
}

function AlbumDetail({
  albumId,
  onDeleted,
  onDeleteAlbum,
}: {
  albumId: string;
  onDeleted: () => void;
  onDeleteAlbum: (id: string) => void;
}) {
  const { data: album, isLoading } = useAlbum(albumId);
  const addImage = useAddImage(albumId);
  const deleteImage = useDeleteImage(albumId);
  const reorderImages = useReorderImages(albumId);

  if (isLoading || !album) return <p className="text-sm text-adm-muted">Loading…</p>;

  const images = album.images ?? [];

  const move = (index: number, direction: -1 | 1) => {
    const next = [...images];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    reorderImages.mutate(next.map((img) => img.id));
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between border border-adm-hairline bg-white px-4 py-3">
        <div>
          <div className="font-medium">{album.name}</div>
          <div className="font-mono text-xs text-adm-muted">{album.slug}</div>
        </div>
        <RoleGate allow={["admin"]}>
          <ConfirmButton
            confirmMessage={`Delete album "${album.name}" and all its images? This can't be undone.`}
            onConfirm={() => {
              onDeleteAlbum(albumId);
              onDeleted();
            }}
          >
            Delete Album
          </ConfirmButton>
        </RoleGate>
      </div>

      {images.length === 0 ? (
        <EmptyState title="No images yet" description="Upload the first image to this album." />
      ) : (
        <div className="mb-4 grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={img.id} className="border border-adm-hairline bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.altText ?? ""} className="h-32 w-full object-cover" />
              <div className="flex items-center justify-between px-2 py-1.5">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="text-adm-muted hover:text-adm-navy disabled:opacity-30"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === images.length - 1}
                    className="text-adm-muted hover:text-adm-navy disabled:opacity-30"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>
                <RoleGate allow={["admin", "editor"]}>
                  <button
                    type="button"
                    onClick={() => deleteImage.mutate(img.id)}
                    className="text-adm-muted hover:text-adm-danger"
                  >
                    <Trash2 size={13} />
                  </button>
                </RoleGate>
              </div>
            </div>
          ))}
        </div>
      )}

      <RoleGate allow={["admin", "editor"]}>
        <ImageUploader
          images={[]}
          folder="gallery"
          onChange={(urls) => {
            const newUrl = urls[urls.length - 1];
            if (newUrl) addImage.mutate({ url: newUrl, order: images.length });
          }}
        />
      </RoleGate>
    </div>
  );
}
