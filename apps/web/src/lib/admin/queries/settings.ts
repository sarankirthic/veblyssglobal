import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/admin/api";
import type { SiteSettings } from "@/lib/types";

const SETTINGS_KEY = ["settings"] as const;

export function useSiteSettings() {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: async () => (await apiFetch<{ data: SiteSettings }>("/api/v1/settings")).data,
  });
}

export function useUpdateSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: unknown }) =>
      apiFetch(`/api/v1/settings/${key}`, { method: "PUT", body: JSON.stringify({ value }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: SETTINGS_KEY }),
  });
}
