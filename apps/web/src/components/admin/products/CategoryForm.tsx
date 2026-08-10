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
  heroHeadline: z.string().max(200).optional(),
  whyChoose: z.string().optional(),
  guarantee: z.string().max(500).optional(),
  idealFor: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

function splitLines(value?: string): string[] {
  return (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

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
      heroHeadline: initial?.heroHeadline ?? "",
      whyChoose: (initial?.whyChoose ?? []).join("\n"),
      guarantee: initial?.guarantee ?? "",
      idealFor: (initial?.idealFor ?? []).join("\n"),
    },
  });

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await onSubmit({
        ...values,
        description: values.description || null,
        originRegion: values.originRegion || null,
        heroHeadline: values.heroHeadline || null,
        whyChoose: splitLines(values.whyChoose),
        guarantee: values.guarantee || null,
        idealFor: splitLines(values.idealFor),
      });
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    }
  });

  return (
    <form onSubmit={submit} className="rounded-adm-lg bg-white p-7 shadow-adm-sm">
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

      <h3 className="mb-4 mt-6 text-lg pt-2">Category Page Content</h3>
      <Field label="Hero Headline" error={errors.heroHeadline?.message}>
        <Input {...register("heroHeadline")} placeholder="Falls back to built-in copy if left blank" />
      </Field>
      <Field label="Why Choose (one per line)" error={errors.whyChoose?.message}>
        <Textarea {...register("whyChoose")} rows={4} placeholder="Falls back to built-in copy if left blank" />
      </Field>
      <Field label="Guarantee" error={errors.guarantee?.message}>
        <Textarea {...register("guarantee")} placeholder="Falls back to built-in copy if left blank" />
      </Field>
      <Field label="Ideal For (one per line)" error={errors.idealFor?.message}>
        <Textarea {...register("idealFor")} rows={3} placeholder="Falls back to built-in copy if left blank" />
      </Field>

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
