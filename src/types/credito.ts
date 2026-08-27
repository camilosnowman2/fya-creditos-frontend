export interface Credito {
  id: string;
  nombreCliente: string;
  cedula: string;
  valorCredito: number;
  tasaInteres: number;
  plazoMeses: number;
  nombreComercial: string;
  fechaRegistro: string; // ISO
}

export interface CreditoCreateInput {
  nombreCliente: string;
  cedula: string;
  valorCredito: number;
  tasaInteres: number;
  plazoMeses: number;
  nombreComercial: string;
}

export type CreditoSortBy = "fecha" | "valor";
export type SortOrder = "asc" | "desc";

export interface CreditoQuery {
  nombre?: string;
  cedula?: string;
  comercial?: string;
  sortBy?: CreditoSortBy;
  order?: SortOrder;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
