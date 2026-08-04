"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import type { ProductInput } from "@/lib/admin/queries/products";
import { ApiRequestError } from "@/lib/admin/api";
import { Field } from "@/components/admin/ui/Field";
import { Input } from "@/components/admin/ui/Input";
import { Textarea } from "@/components/admin/ui/Textarea";
import { Select } from "@/components/admin/ui/Select";
import { Button } from "@/components/admin/ui/Button";
import { Banner } from "@/components/admin/ui/Banner";
import { ImageUploader } from "@/components/admin/media/ImageUploader";

const schema = z.object({
  categoryId: z.string().min(1, "Choose a category"),
  name: z.string().min(1, "Required").max(200),
  slug: z
    .string()
    .min(1, "Required")
    .max(220)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  materials: z.string().optional(),
  dimensions: z.string().optional(),
  moq: z.string().optional(),
  packaging: z.string().optional(),
  leadTime: z.string().optional(),
  priceRange: z.string().optional(),
  specs: z.array(z.object({ key: z.string().min(1), value: z.string().min(1) })),
  featured: z.boolean(),
  isPublished: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

export function ProductForm({
  initial,
  categories,
  onSubmit,
  onCancel,
}: {
  initial?: Product;
  categories: Category[];
  onSubmit: (values: ProductInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      shortDescription: initial?.shortDescription ?? "",
      description: initial?.description ?? "",
      materials: initial?.materials ?? "",
      dimensions: initial?.dimensions ?? "",
      moq: initial?.moq ?? "",
      packaging: initial?.packaging ?? "",
      leadTime: initial?.leadTime ?? "",
      priceRange: initial?.priceRange ?? "",
      specs: initial?.specs ?? [],
      featured: initial?.featured ?? false,
      isPublished: initial?.isPublished ?? true,
    },
  });
  const specFields = useFieldArray({ control, name: "specs" });

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await onSubmit({
        ...values,
        shortDescription: values.shortDescription || null,
        description: values.description || null,
        materials: values.materials || null,
        dimensions: values.dimensions || null,
        moq: values.moq || null,
        packaging: values.packaging || null,
        leadTime: values.leadTime || null,
        priceRange: values.priceRange || null,
        images,
      });
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    }
  });

  return (
    <form onSubmit={submit} className="border border-adm-hairline bg-white p-6">
      <h3 className="mb-4 text-lg">{initial ? "Edit Product" : "New Product"}</h3>
      {serverError ? (
        <div className="mb-4">
          <Banner>{serverError}</Banner>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Category" error={errors.categoryId?.message}>
          <Select {...register("categoryId")}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Slug" error={errors.slug?.message}>
          <Input {...register("slug")} placeholder="leather-portfolio" />
        </Field>
      </div>

      <Field label="Name" error={errors.name?.message}>
        <Input {...register("name")} />
      </Field>
      <Field label="Short Description" error={errors.shortDescription?.message}>
        <Input {...register("shortDescription")} />
      </Field>
      <Field label="Description" error={errors.description?.message}>
        <Textarea {...register("description")} />
      </Field>

      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Materials">
          <Input {...register("materials")} />
        </Field>
        <Field label="Dimensions">
          <Input {...register("dimensions")} />
        </Field>
        <Field label="MOQ">
          <Input {...register("moq")} />
        </Field>
        <Field label="Packaging">
          <Input {...register("packaging")} />
        </Field>
        <Field label="Lead Time">
          <Input {...register("leadTime")} />
        </Field>
        <Field label="Price Range">
          <Input {...register("priceRange")} />
        </Field>
      </div>

      <Field label="Specs">
        <div className="flex flex-col gap-2">
          {specFields.fields.map((f, i) => (
            <div key={f.id} className="flex gap-2">
              <Input placeholder="Key" {...register(`specs.${i}.key` as const)} />
              <Input placeholder="Value" {...register(`specs.${i}.value` as const)} />
              <Button type="button" variant="ghost" size="sm" onClick={() => specFields.remove(i)}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => specFields.append({ key: "", value: "" })}
            className="self-start"
          >
            <Plus size={14} /> Add spec
          </Button>
        </div>
      </Field>

      <Field label="Images">
        <ImageUploader images={images} onChange={setImages} folder="products" />
      </Field>

      <div className="mt-4 flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("featured")} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isPublished")} /> Published
        </label>
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
