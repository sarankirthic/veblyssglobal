import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/admin/api";
import type {
  ActivityLogEntry,
  FunnelMetrics,
  GeoMetrics,
  PageMeta,
  ProductPerformanceMetrics,
  TrafficMetrics,
} from "@/lib/types";

export function useTraffic(days: number) {
  return useQuery({
    queryKey: ["metrics", "traffic", days],
    queryFn: async () => (await apiFetch<{ data: TrafficMetrics }>(`/api/v1/metrics/traffic?days=${days}`)).data,
  });
}

export function useFunnel(days: number) {
  return useQuery({
    queryKey: ["metrics", "funnel", days],
    queryFn: async () => (await apiFetch<{ data: FunnelMetrics }>(`/api/v1/metrics/funnel?days=${days}`)).data,
  });
}

export function useProductPerformance(days: number) {
  return useQuery({
    queryKey: ["metrics", "products", days],
    queryFn: async () =>
      (await apiFetch<{ data: ProductPerformanceMetrics }>(`/api/v1/metrics/products?days=${days}`)).data,
  });
}

export function useGeo(days: number) {
  return useQuery({
    queryKey: ["metrics", "geo", days],
    queryFn: async () => (await apiFetch<{ data: GeoMetrics }>(`/api/v1/metrics/geo?days=${days}`)).data,
  });
}

export function useActivityLog(page: number) {
  return useQuery({
    queryKey: ["metrics", "activity", page],
    queryFn: async () =>
      apiFetch<{ data: ActivityLogEntry[]; meta: PageMeta }>(
        `/api/v1/metrics/activity?page=${page}&per_page=20`
      ),
  });
}
