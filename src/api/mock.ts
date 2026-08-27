/**
 * MODO MOCK — simula el backend .NET cuando no está disponible.
 * Activado automáticamente si VITE_USE_MOCK=true o si el backend no responde.
 */

import type { Credito, CreditoCreateInput, CreditoQuery, PagedResult } from "@/types/credito";
import type { LoginResponse } from "./auth";

const MOCK_USER = "admin";
const MOCK_PASS = "Admin123!";
const MOCK_TOKEN = "mock-jwt-token-fya-creditos-2026";

// Base de datos en memoria — empieza con créditos de ejemplo
let mockCreditos: Credito[] = [
  {
    id: "1",
    nombreCliente: "María López Gómez",
    cedula: "1023456789",
    valorCredito: 5000000,
    tasaInteres: 2.5,
    plazoMeses: 12,
    nombreComercial: "Tienda El Sol",
    fechaRegistro: "2026-07-15T10:30:00Z",
  },
  {
    id: "2",
    nombreCliente: "Carlos Ramírez Peña",
    cedula: "7654321098",
    valorCredito: 2000000,
    tasaInteres: 3.0,
    plazoMeses: 6,
    nombreComercial: "Panadería La Esperanza",
    fechaRegistro: "2026-07-22T08:00:00Z",
  },
  {
    id: "3",
    nombreCliente: "Ana Sofía Herrera",
    cedula: "3219876543",
    valorCredito: 8500000,
    tasaInteres: 2.2,
    plazoMeses: 24,
    nombreComercial: "Miscelánea Doña Ana",
    fechaRegistro: "2026-08-01T14:15:00Z",
  },
  {
    id: "4",
    nombreCliente: "Luis Fernando Mora",
    cedula: "9871234560",
    valorCredito: 1500000,
    tasaInteres: 3.5,
    plazoMeses: 3,
    nombreComercial: "Distribuidora Mora",
    fechaRegistro: "2026-08-10T09:45:00Z",
  },
  {
    id: "5",
    nombreCliente: "Patricia Salinas Ruiz",
    cedula: "5432167890",
    valorCredito: 12000000,
    tasaInteres: 1.9,
    plazoMeses: 36,
    nombreComercial: "Confecciones Patricia",
    fechaRegistro: "2026-08-20T11:00:00Z",
  },
];

let nextId = 6;

function delay(ms = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── AUTH ──────────────────────────────────────────────────────────────────────

export async function mockLogin(username: string, password: string): Promise<LoginResponse> {
  await delay();
  if (username === MOCK_USER && password === MOCK_PASS) {
    return {
      token: MOCK_TOKEN,
      expiresAtUtc: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    };
  }
  const err = new Error("Usuario o contraseña incorrectos.");
  (err as any).status = 401;
  throw err;
}

// ── CRÉDITOS ──────────────────────────────────────────────────────────────────

export async function mockCrearCredito(input: CreditoCreateInput): Promise<Credito> {
  await delay();
  const nuevo: Credito = {
    id: String(nextId++),
    ...input,
    fechaRegistro: new Date().toISOString(),
  };
  mockCreditos.unshift(nuevo);
  return nuevo;
}

export async function mockListarCreditos(query: CreditoQuery): Promise<PagedResult<Credito>> {
  await delay();

  let items = [...mockCreditos];

  // Filtros
  if (query.nombre) {
    const q = query.nombre.toLowerCase();
    items = items.filter((c) => c.nombreCliente.toLowerCase().includes(q));
  }
  if (query.cedula) {
    items = items.filter((c) => c.cedula.includes(query.cedula!));
  }
  if (query.comercial) {
    const q = query.comercial.toLowerCase();
    items = items.filter((c) => c.nombreComercial.toLowerCase().includes(q));
  }

  // Ordenamiento
  const order = query.order === "asc" ? 1 : -1;
  if (query.sortBy === "valor") {
    items.sort((a, b) => (a.valorCredito - b.valorCredito) * order);
  } else {
    // por fecha (default)
    items.sort(
      (a, b) => (new Date(a.fechaRegistro).getTime() - new Date(b.fechaRegistro).getTime()) * order
    );
  }

  // Paginación
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 20;
  const totalCount = items.length;
  const paginated = items.slice((page - 1) * pageSize, page * pageSize);

  return { items: paginated, totalCount, page, pageSize };
}
