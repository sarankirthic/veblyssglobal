const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiRequestError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

interface FetchOptions extends RequestInit {
  /** Next.js server-side cache/revalidate hint — ignored client-side. */
  revalidate?: number | false;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { revalidate, ...init } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    credentials: init.credentials ?? "same-origin",
    next: revalidate === undefined ? undefined : { revalidate: revalidate === false ? undefined : revalidate },
  });

  if (!res.ok) {
    let message = `Request to ${path} failed with ${res.status}`;
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

  return res.json() as Promise<T>;
}
