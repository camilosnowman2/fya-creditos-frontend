const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
}

/**
 * Wrapper mínimo sobre fetch: agrega la base URL, serializa JSON, adjunta
 * el header Authorization cuando hay token, y convierte respuestas de
 * error (incluidos los ProblemDetails / ValidationProblem del backend en
 * .NET) en un ApiError legible para la UI.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    Accept: "application/json"
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json().catch(() => undefined) : undefined;

  if (!response.ok) {
    const message = extractErrorMessage(payload) ?? `Error ${response.status} al llamar a la API.`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

function extractErrorMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const p = payload as Record<string, unknown>;

  if (typeof p.title === "string") {
    // ValidationProblem de ASP.NET Core: { title, errors: { Campo: ["mensaje"] } }
    if (p.errors && typeof p.errors === "object") {
      const errors = p.errors as Record<string, string[]>;
      const firstField = Object.keys(errors)[0];
      if (firstField && errors[firstField]?.length) {
        return errors[firstField][0];
      }
    }
    return p.title;
  }

  return undefined;
}
