"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AlbumInput } from "@/lib/admin/queries/gallery";
import { ApiRequestError } from "@/lib/admin/api";
import { Field } from "@/components/admin/ui/Field";
import { Input } from "@/components/admin/ui/Input";
import { Button } from "@/components/admin/ui/Button";
import { Banner } from "@/components/admin/ui/Banner";

const schema = z.object({
  name: z.string().min(1, "Required").max(160),
  slug: z
    .string()
    .min(1, "Required")
    .max(180)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  displayOrder: z.coerce.number().int().min(0),
});
type FormValues = z.infer<typeof schema>;

export function AlbumForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: AlbumInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", displayOrder: 0 },
  });

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    }
  });

  return (
    <form onSubmit={submit} className="rounded-adm-lg bg-white p-7 shadow-adm-sm">
      <h3 className="mb-4 text-lg">New Album</h3>
      {serverError ? (
        <div className="mb-4">
          <Banner>{serverError}</Banner>
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Name" error={errors.name?.message}>
          <Input {...register("name")} />
        </Field>
        <Field label="Slug" error={errors.slug?.message}>
          <Input {...register("slug")} placeholder="factory-floor" />
        </Field>
      </div>
      <Field label="Display Order" error={errors.displayOrder?.message}>
        <Input type="number" {...register("displayOrder")} />
      </Field>
      <div className="mt-4 flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Create"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
