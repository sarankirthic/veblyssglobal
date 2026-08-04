"use client";

import { useSiteSettings } from "@/lib/admin/queries/settings";
import { useAuth } from "@/lib/admin/auth";
import { ContactDetailsForm } from "@/components/admin/settings/ContactDetailsForm";
import { DifferentiatorsForm } from "@/components/admin/settings/DifferentiatorsForm";
import { SocialLinksForm } from "@/components/admin/settings/SocialLinksForm";
import { Banner } from "@/components/admin/ui/Banner";

export default function SettingsPage() {
  const { data: settings, isLoading } = useSiteSettings();
  const { user } = useAuth();

  if (isLoading || !settings) return <p className="text-sm text-adm-muted">Loading…</p>;

  const canEdit = user?.role === "admin" || user?.role === "editor";

  return (
    <div>
      <h1 className="mb-6 text-2xl">Settings</h1>

      {!canEdit ? (
        <div className="mb-6">
          <Banner tone="success">Viewer role — read-only. Ask an admin or editor for changes.</Banner>
        </div>
      ) : null}

      {canEdit ? (
        <div className="flex flex-col gap-6">
          <ContactDetailsForm initial={settings.contact_details ?? {}} />
          <DifferentiatorsForm initial={settings.differentiators ?? []} />
          <SocialLinksForm initial={settings.social_links ?? {}} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="border border-adm-hairline bg-white p-6">
            <h3 className="mb-2 text-lg">Contact Details</h3>
            <p className="text-sm">{settings.contact_details?.email ?? "—"}</p>
            <p className="text-sm">{settings.contact_details?.phone ?? "—"}</p>
          </div>
          <div className="border border-adm-hairline bg-white p-6">
            <h3 className="mb-2 text-lg">What Makes Us Different</h3>
            <ul className="list-disc pl-5 text-sm">
              {(settings.differentiators ?? []).map((d) => (
                <li key={d.title}>{d.title}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
