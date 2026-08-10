// See apps/web/src/lib/api.ts for why this branches on server vs. client.
const API_URL =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
    : process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiRequestError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function readError(res: Response, fallback: string): Promise<never> {
  let message = fallback;
  let code = "request_failed";
  try {
    const body = await res.json();
    message = body?.error?.message ?? message;
    code = body?.error?.code ?? code;
  } catch {
    // response wasn't JSON — keep the default message
  }
  throw new ApiRequestError(message, res.status, code);
}

/**
 * The admin app runs on a different port than the API (3001 vs 4000). Both
 * are "localhost" so the session cookie is same-site and flows automatically
 * with credentials: "include" — see apps/api/.env's CORS_ORIGINS.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    return readError(res, `Request to ${path} failed with ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export async function apiUpload<T>(path: string, file: File, folder: string): Promise<T> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    body: form,
    credentials: "include",
  });

  if (!res.ok) {
    return readError(res, `Upload to ${path} failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}
