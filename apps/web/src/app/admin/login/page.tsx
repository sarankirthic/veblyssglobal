"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/admin/auth";
import { ApiRequestError } from "@/lib/admin/api";
import { Input } from "@/components/admin/ui/Input";
import { Field } from "@/components/admin/ui/Field";
import { Button } from "@/components/admin/ui/Button";
import { Banner } from "@/components/admin/ui/Banner";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!isLoading && user) router.replace("/admin");
  }, [isLoading, user, router]);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
      router.replace("/admin");
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-adm-navy px-4">
      <div className="w-full max-w-sm border border-adm-hairline bg-white p-8">
        <div className="mb-6">
          <div className="font-mono text-[11px] uppercase tracking-wider text-adm-muted">VeBlyss</div>
          <h1 className="mt-1 text-2xl">Admin Login</h1>
        </div>

        {serverError ? (
          <div className="mb-4">
            <Banner>{serverError}</Banner>
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" autoComplete="email" {...register("email")} />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <Input type="password" autoComplete="current-password" {...register("password")} />
          </Field>
          <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
