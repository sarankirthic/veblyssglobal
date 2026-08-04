"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { contactFormSchema, type ContactFormValues } from "@/lib/schemas";
import { submitContactForm } from "@/lib/data";
import type { Category } from "@/lib/types";

export function ContactForm({ categories }: { categories: Category[] }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const mutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => reset(),
  });

  const onSubmit = (values: ContactFormValues) => {
    mutation.mutate({
      name: values.name,
      email: values.email,
      country: values.country || undefined,
      interest: values.interest || undefined,
      message: values.message,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 22 }}>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" {...register("name")} />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register("email")} />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="country">Country</label>
          <input id="country" type="text" {...register("country")} />
        </div>
        <div className="form-field">
          <label htmlFor="interest">What are you interested in?</label>
          <select id="interest" {...register("interest")} defaultValue="">
            <option value="">Just browsing</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea id="message" {...register("message")} />
        {errors.message && <p className="error">{errors.message.message}</p>}
      </div>

      <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
        {mutation.isPending ? "Sending…" : "Send Message"}
      </button>

      <p className="response-note">
        {isSubmitSuccessful && mutation.isSuccess
          ? "Thanks — we've got your message and reply within 24 hours."
          : mutation.isError
            ? "Something went wrong sending that — try again, or email us directly."
            : "We respond within 24 hours — with pricing, sizing help, or answers to any question about a piece."}
      </p>
    </form>
  );
}
