"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { apiUpload, ApiRequestError } from "@/lib/admin/api";

interface UploadResponse {
  data: { key: string; url: string; size: number };
}

export function ImageUploader({
  images,
  onChange,
  folder,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      let next = images;
      for (const file of Array.from(files)) {
        const result = await apiUpload<UploadResponse>("/api/v1/media/upload", file, folder);
        next = [...next, result.data.url];
      }
      onChange(next);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {images.map((url) => (
          <div key={url} className="relative h-20 w-20 border border-adm-hairline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((u) => u !== url))}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-adm-danger text-white"
              aria-label="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-adm-hairline text-adm-muted hover:border-adm-navy hover:text-adm-navy">
          <Upload size={16} />
          <span className="text-[10px]">{uploading ? "…" : "Add"}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
      {error ? <p className="mt-2 text-xs text-adm-danger">{error}</p> : null}
    </div>
  );
}
