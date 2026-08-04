"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { Differentiator } from "@/lib/types";
import { useUpdateSetting } from "@/lib/admin/queries/settings";
import { ApiRequestError } from "@/lib/admin/api";
import { Input } from "@/components/admin/ui/Input";
import { Textarea } from "@/components/admin/ui/Textarea";
import { Button } from "@/components/admin/ui/Button";
import { Banner } from "@/components/admin/ui/Banner";

export function DifferentiatorsForm({ initial }: { initial: Differentiator[] }) {
  const updateSetting = useUpdateSetting();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { control, register, handleSubmit, formState } = useForm<{ items: Differentiator[] }>({
    defaultValues: { items: initial },
  });
  const fields = useFieldArray({ control, name: "items" });

  const submit = handleSubmit(async (values) => {
    setStatus("idle");
    try {
      await updateSetting.mutateAsync({ key: "differentiators", value: values.items });
      setStatus("saved");
    } catch (err) {
      setErrorMessage(err instanceof ApiRequestError ? err.message : "Something went wrong.");
      setStatus("error");
    }
  });

  return (
    <form onSubmit={submit} className="border border-adm-hairline bg-white p-6">
      <h3 className="mb-1 text-lg">What Makes Us Different</h3>
      <p className="mb-4 text-xs text-adm-muted">
        Canonical list per docs/BRAND.md §4 — shown on Home and About.
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

      <div className="flex flex-col gap-3">
        {fields.fields.map((f, i) => (
          <div key={f.id} className="flex gap-2 border border-adm-hairline p-3">
            <div className="flex-1">
              <Input placeholder="Title" className="mb-2" {...register(`items.${i}.title` as const)} />
              <Textarea placeholder="Description" {...register(`items.${i}.description` as const)} />
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => fields.remove(i)}>
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => fields.append({ title: "", description: "" })}
        >
          <Plus size={14} /> Add item
        </Button>
      </div>

      <Button type="submit" size="sm" className="mt-4" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
