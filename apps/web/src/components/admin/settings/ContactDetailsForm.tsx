"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { ContactDetails } from "@/lib/types";
import { useUpdateSetting } from "@/lib/admin/queries/settings";
import { ApiRequestError } from "@/lib/admin/api";
import { Field } from "@/components/admin/ui/Field";
import { Input } from "@/components/admin/ui/Input";
import { Textarea } from "@/components/admin/ui/Textarea";
import { Button } from "@/components/admin/ui/Button";
import { Banner } from "@/components/admin/ui/Banner";

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function ContactDetailsForm({ initial }: { initial: ContactDetails }) {
  const updateSetting = useUpdateSetting();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ContactDetails>({ defaultValues: { locations: [], ...initial } });
  const locations = useFieldArray({ control, name: "locations" });

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
    <form onSubmit={submit} className="rounded-adm-lg bg-white p-7 shadow-adm-sm">
      <h3 className="mb-1 text-lg">Contact Details</h3>
      <p className="mb-4 text-xs text-adm-muted">
        Single source of truth pulled by the public site&apos;s Contact page and footer.
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

      <div className="mb-1.5 mt-5 font-mono text-[11px] uppercase tracking-wider text-adm-muted">
        Office Locations
      </div>
      <div className="flex flex-col gap-3">
        {locations.fields.map((f, i) => (
          <div key={f.id} className="rounded-adm-sm bg-adm-neutral-light/60 p-3.5">
            <div className="grid grid-cols-2 gap-x-4">
              <Field label="City">
                <Input placeholder="Bengaluru" {...register(`locations.${i}.city` as const)} />
              </Field>
              <Field label="Company Name">
                <Input placeholder="VeBlyss Global Pvt Ltd" {...register(`locations.${i}.companyName` as const)} />
              </Field>
            </div>
            <Field label="Address">
              <Textarea
                placeholder={"Street, area\nCity, State - PIN"}
                {...register(`locations.${i}.address` as const)}
              />
            </Field>
            <div className="flex items-end justify-between gap-4">
              <Field label="Phone (optional, overrides the one above)">
                <Input {...register(`locations.${i}.phone` as const)} />
              </Field>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mb-4"
                onClick={() => locations.remove(i)}
              >
                <Trash2 size={14} /> Remove
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => locations.append({ id: newId(), city: "", companyName: "", address: "" })}
          className="self-start"
        >
          <Plus size={14} /> Add Location
        </Button>
      </div>

      <Button type="submit" size="sm" className="mt-5" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
