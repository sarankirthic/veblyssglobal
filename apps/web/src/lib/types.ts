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
  showInGallery: boolean;
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

export interface Differentiator {
  title: string;
  description: string;
}

export interface SiteSettings {
  contact_details?: ContactDetails;
  differentiators?: Differentiator[];
  social_links?: Record<string, string>;
  site_meta?: Record<string, string>;
}

// --- Admin-only types (apps/web/src/app/admin) -----------------------------
// Not consumed by the public site; kept here alongside the rest so the whole
// API surface's shapes live in one file.

export const ROLES = ["admin", "editor", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  country: string | null;
  interest: string | null;
  message: string;
  source: string;
  createdAt: string;
}

export interface TrafficPoint {
  date: string;
  count: number;
}

export interface TrafficMetrics {
  days: number;
  total: number;
  series: TrafficPoint[];
}

export interface FunnelMetrics {
  days: number;
  pageviews: number;
  productViews: number;
  enquiries: number;
}

export interface ProductPerformanceRow {
  path: string;
  views: number;
}

export interface ProductPerformanceMetrics {
  days: number;
  top: ProductPerformanceRow[];
}

export interface GeoRow {
  country: string;
  count: number;
}

export interface GeoMetrics {
  days: number;
  breakdown: GeoRow[];
}

export interface ActivityLogEntry {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  createdAt: string;
}
