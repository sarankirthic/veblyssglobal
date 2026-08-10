"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateSetting } from "@/lib/admin/queries/settings";
import { ApiRequestError } from "@/lib/admin/api";
import { Field } from "@/components/admin/ui/Field";
import { Input } from "@/components/admin/ui/Input";
import { Button } from "@/components/admin/ui/Button";
import { Banner } from "@/components/admin/ui/Banner";

interface SocialLinksValues {
  linkedin: string;
  facebook: string;
  instagram: string;
}

export function SocialLinksForm({ initial }: { initial: Record<string, string> }) {
  const updateSetting = useUpdateSetting();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SocialLinksValues>({
    defaultValues: {
      linkedin: initial.linkedin ?? "",
      facebook: initial.facebook ?? "",
      instagram: initial.instagram ?? "",
    },
  });

  const submit = handleSubmit(async (values) => {
    setStatus("idle");
    try {
      await updateSetting.mutateAsync({ key: "social_links", value: values });
      setStatus("saved");
    } catch (err) {
      setErrorMessage(err instanceof ApiRequestError ? err.message : "Something went wrong.");
      setStatus("error");
    }
  });

  return (
    <form onSubmit={submit} className="rounded-adm-lg bg-white p-7 shadow-adm-sm">
      <h3 className="mb-4 text-lg">Social Links</h3>
      {status === "saved" ? (
        <div className="mb-4">
          <Banner tone="success">Saved.</Banner>
        </div>
      ) : null}
      {status === "error" ? (
        <div className="mb-4">
          <Banner>{errorMessage}</Banner>
        </div>
      ) : null}
      <Field label="LinkedIn">
        <Input {...register("linkedin")} placeholder="https://linkedin.com/company/veblyss" />
      </Field>
      <Field label="Facebook">
        <Input {...register("facebook")} placeholder="https://facebook.com/veblyssglobal" />
      </Field>
      <Field label="Instagram">
        <Input {...register("instagram")} placeholder="https://instagram.com/veblyssglobal" />
      </Field>
      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
