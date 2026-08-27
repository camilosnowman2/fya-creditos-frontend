import { apiRequest } from "./client";
import { mockLogin } from "./mock";

export interface LoginResponse {
  token: string;
  expiresAtUtc: string;
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export function login(username: string, password: string): Promise<LoginResponse> {
  if (USE_MOCK) return mockLogin(username, password);
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: { username, password },
  });
}
