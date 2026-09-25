/**
 * Conexión entre la landing y las apps de cada vertical (monorepo onvision).
 *
 * Mapa canónico:
 *   restaurantes  → sector-01 (Onvision-Resta) · puerto 3005
 *   clinicas      → sector-02 (Onvision Salud) · puerto 3007
 *   bienes-raices → sector-03 (Onvision Inmo) · puerto 3003
 *   constructoras → sector-04 (Onvision Obras) · puerto 3004
 *   ganaderia     → sector-05 (Onvision Ganadero) · puerto 3006
 *   retail        → sector-06 (Onvision Retail) · puerto 3008
 *   agricultura   → sector-07 (Onvision Agrícola) · puerto 3009
 *   talleres      → sector-08 (Onvision Taller) · puerto 3011
 *   abogados      → sector-09 (Onvision Legal) · puerto 3012
 *   personal      → sector-10 (Onvision Personal) · puerto 3013
 *
 * Todas las verticales están listas para activar.
 * En producción usá NEXT_PUBLIC_APP_* para subdominios.
 */

export type PlanId = "unico";

/** URL de la app de cada vertical. */
const APP_URLS: Record<string, string> = {
  retail: process.env.NEXT_PUBLIC_APP_RETAIL_URL ?? "http://localhost:3008",
  constructoras:
    process.env.NEXT_PUBLIC_APP_CONSTRUCTORAS_URL ?? "http://localhost:3004",
  "bienes-raices":
    process.env.NEXT_PUBLIC_APP_BIENES_RAICES_URL ?? "http://localhost:3003",
  abogados: process.env.NEXT_PUBLIC_APP_ABOGADOS_URL ?? "http://localhost:3012",
  restaurantes:
    process.env.NEXT_PUBLIC_APP_RESTAURANTES_URL ?? "http://localhost:3005",
  clinicas: process.env.NEXT_PUBLIC_APP_CLINICAS_URL ?? "http://localhost:3007",
  ganaderia:
    process.env.NEXT_PUBLIC_APP_GANADERIA_URL ?? "http://localhost:3006",
  agricultura:
    process.env.NEXT_PUBLIC_APP_AGRICULTURA_URL ?? "http://localhost:3009",
  talleres: process.env.NEXT_PUBLIC_APP_TALLERES_URL ?? "http://localhost:3011",
  personal: process.env.NEXT_PUBLIC_APP_PERSONAL_URL ?? "http://localhost:3013",
};

/** Ruta de entrada de cada app. Por defecto /registro (flujo de activación). */
const RUTAS_REGISTRO: Record<string, string> = {};

export function appUrlDeVertical(verticalId: string): string | null {
  return APP_URLS[verticalId] ?? null;
}

/** URL de registro en la app del vertical, con el plan elegido en la landing. */
export function urlDeActivacion(
  verticalId: string,
  planId: PlanId,
  extra?: { billing?: "activa" | "pendiente"; sessionId?: string },
): string | null {
  const base = appUrlDeVertical(verticalId);
  if (!base) return null;
  const ruta = RUTAS_REGISTRO[verticalId] ?? "/registro";
  const params = new URLSearchParams({ vertical: verticalId, plan: planId });
  if (extra?.billing) params.set("billing", extra.billing);
  if (extra?.sessionId) params.set("session_id", extra.sessionId);
  return `${base}${ruta}?${params.toString()}`;
}
