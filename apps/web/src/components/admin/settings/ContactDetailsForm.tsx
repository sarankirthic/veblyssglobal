"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ContactDetails } from "@/lib/types";
import { useUpdateSetting } from "@/lib/admin/queries/settings";
import { ApiRequestError } from "@/lib/admin/api";
import { Field } from "@/components/admin/ui/Field";
import { Input } from "@/components/admin/ui/Input";
import { Button } from "@/components/admin/ui/Button";
import { Banner } from "@/components/admin/ui/Banner";

export function ContactDetailsForm({ initial }: { initial: ContactDetails }) {
  const updateSetting = useUpdateSetting();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ContactDetails>({ defaultValues: initial });

  const submit = handleSubmit(async (values) => {
    setStatus("idle");
    try {
      await updateSetting.mutateAsync({ key: "contact_details", value: values });
      setStatus("saved");
    } catch (err) {
      setErrorMessage(err instanceof ApiRequestError ? err.message : "Something went wrong.");
      setStatus("error");
    }
  });

  return (
    <form onSubmit={submit} className="border border-adm-hairline bg-white p-6">
      <h3 className="mb-1 text-lg">Contact Details</h3>
      <p className="mb-4 text-xs text-adm-muted">
        Single source of truth pulled by the public site's Contact page and footer.
      </p>
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
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Email">
          <Input type="email" {...register("email")} />
        </Field>
        <Field label="Phone">
          <Input {...register("phone")} />
        </Field>
        <Field label="WhatsApp">
          <Input {...register("whatsapp")} />
        </Field>
      </div>
      <Field label="Bengaluru Office Address">
        <Input {...register("bengaluruAddress")} />
      </Field>
      <Field label="London Office Address">
        <Input {...register("londonAddress")} />
      </Field>
      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
