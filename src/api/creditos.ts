import { apiRequest } from "./client";
import { mockCrearCredito, mockListarCreditos } from "./mock";
import type { Credito, CreditoCreateInput, CreditoQuery, PagedResult } from "@/types/credito";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export function crearCredito(input: CreditoCreateInput, token: string | null): Promise<Credito> {
  if (USE_MOCK) return mockCrearCredito(input);
  return apiRequest<Credito>("/api/creditos", {
    method: "POST",
    body: input,
    token,
  });
}

export function listarCreditos(
  query: CreditoQuery,
  token: string | null
): Promise<PagedResult<Credito>> {
  if (USE_MOCK) return mockListarCreditos(query);
  const params = new URLSearchParams();
  if (query.nombre) params.set("nombre", query.nombre);
  if (query.cedula) params.set("cedula", query.cedula);
  if (query.comercial) params.set("comercial", query.comercial);
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.order) params.set("order", query.order);
  params.set("page", String(query.page ?? 1));
  params.set("pageSize", String(query.pageSize ?? 20));

  return apiRequest<PagedResult<Credito>>(`/api/creditos?${params.toString()}`, { token });
}
