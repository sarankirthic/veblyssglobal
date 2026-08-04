import { z } from "zod";

// Mirrors apps/api/app/schemas/contact.py::ContactSubmissionBody — kept in
// sync by hand, same caveat as lib/types.ts.
export const contactFormSchema = z.object({
  name: z.string().min(1, "Tell us your name.").max(200),
  email: z.string().email("Enter a valid email address."),
  country: z.string().max(120).optional().or(z.literal("")),
  interest: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(1, "Let us know what you're after.").max(4000),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
