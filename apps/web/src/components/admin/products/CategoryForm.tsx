"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Category } from "@/lib/types";
import type { CategoryInput } from "@/lib/admin/queries/products";
import { ApiRequestError } from "@/lib/admin/api";
import { Field } from "@/components/admin/ui/Field";
import { Input } from "@/components/admin/ui/Input";
import { Textarea } from "@/components/admin/ui/Textarea";
import { Button } from "@/components/admin/ui/Button";
import { Banner } from "@/components/admin/ui/Banner";

const schema = z.object({
  name: z.string().min(1, "Required").max(120),
  slug: z
    .string()
    .min(1, "Required")
    .max(140)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  description: z.string().optional(),
  originRegion: z.string().optional(),
  displayOrder: z.coerce.number().int().min(0),
});
type FormValues = z.infer<typeof schema>;

export function CategoryForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Category;
  onSubmit: (values: CategoryInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      description: initial?.description ?? "",
      originRegion: initial?.originRegion ?? "",
      displayOrder: initial?.displayOrder ?? 0,
    },
  });

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await onSubmit({
        ...values,
        description: values.description || null,
        originRegion: values.originRegion || null,
      });
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    }
  });

  return (
    <form onSubmit={submit} className="border border-adm-hairline bg-white p-6">
      <h3 className="mb-4 text-lg">{initial ? "Edit Category" : "New Category"}</h3>
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
          <Input {...register("slug")} placeholder="leather-goods" />
        </Field>
      </div>
      <Field label="Description" error={errors.description?.message}>
        <Textarea {...register("description")} />
      </Field>
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Origin Region" error={errors.originRegion?.message}>
          <Input {...register("originRegion")} placeholder="Dharavi, Mumbai" />
        </Field>
        <Field label="Display Order" error={errors.displayOrder?.message}>
          <Input type="number" {...register("displayOrder")} />
        </Field>
      </div>
      <div className="mt-4 flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
