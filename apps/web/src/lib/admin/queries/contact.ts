import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/admin/api";
import type { ContactSubmission, PageMeta } from "@/lib/types";

export function useContactSubmissions(page: number) {
  return useQuery({
    queryKey: ["contact", page],
    queryFn: async () =>
      apiFetch<{ data: ContactSubmission[]; meta: PageMeta }>(
        `/api/v1/contact?page=${page}&per_page=25`
      ),
  });
}
