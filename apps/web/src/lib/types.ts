// Mirrors app/*/to_dict() shapes in apps/api — see apps/api/app/*/models.py.
// No shared codegen between Flask (Pydantic) and this app (TypeScript); keep
// these in sync by hand. See apps/api/README.md "Deviations from the doc".

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  originRegion: string | null;
  displayOrder: number;
}

export interface ProductSpecRow {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  categoryId: string;
  category: string | null;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  materials: string | null;
  dimensions: string | null;
  moq: string | null;
  packaging: string | null;
  leadTime: string | null;
  priceRange: string | null;
  specs: ProductSpecRow[];
  images: string[];
  featured: boolean;
  isPublished: boolean;
}

export interface GalleryImage {
  id: string;
  albumId: string;
  url: string;
  altText: string | null;
  order: number;
}

export interface GalleryAlbum {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  imageCount: number;
  images?: GalleryImage[];
}

export interface PageMeta {
  page: number;
  perPage: number;
  total: number;
}

export interface ContactDetails {
  email?: string;
  phone?: string;
  whatsapp?: string;
  bengaluruAddress?: string;
  londonAddress?: string;
}

export interface SiteSettings {
  contact_details?: ContactDetails;
  differentiators?: { title: string; description: string }[];
  social_links?: Record<string, string>;
  site_meta?: Record<string, string>;
}
