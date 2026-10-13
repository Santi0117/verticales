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
 * En producción se usan las variables NEXT_PUBLIC_APP_* (los subdominios).
 */

export type PlanId = "unico";

/** En tu compu, sin variables, cada app en su puerto local. */
const enDesarrollo = process.env.NODE_ENV === "development";
const local = (puerto: number) => (enDesarrollo ? `http://localhost:${puerto}` : "");

/** URL de la app de cada vertical (de las variables NEXT_PUBLIC_APP_*). */
const APP_URLS: Record<string, string> = {
  retail: process.env.NEXT_PUBLIC_APP_RETAIL_URL || local(3008),
  constructoras: process.env.NEXT_PUBLIC_APP_CONSTRUCTORAS_URL || local(3004),
  "bienes-raices": process.env.NEXT_PUBLIC_APP_BIENES_RAICES_URL || local(3003),
  abogados: process.env.NEXT_PUBLIC_APP_ABOGADOS_URL || local(3012),
  restaurantes: process.env.NEXT_PUBLIC_APP_RESTAURANTES_URL || local(3005),
  clinicas: process.env.NEXT_PUBLIC_APP_CLINICAS_URL || local(3007),
  ganaderia: process.env.NEXT_PUBLIC_APP_GANADERIA_URL || local(3006),
  agricultura: process.env.NEXT_PUBLIC_APP_AGRICULTURA_URL || local(3009),
  talleres: process.env.NEXT_PUBLIC_APP_TALLERES_URL || local(3011),
  personal: process.env.NEXT_PUBLIC_APP_PERSONAL_URL || local(3013),
};

/**
 * Las apps publicadas (las mismas de `.env.example`). Si falta la variable,
 * quien ya pagó igual llega a su app y no a una página de error.
 */
const APPS_PUBLICADAS: Record<string, string> = {
  restaurantes: "https://resta.onvisiondigital.com",
  retail: "https://retail.onvisiondigital.com",
  clinicas: "https://salud.onvisiondigital.com",
  abogados: "https://legal.onvisiondigital.com",
  constructoras: "https://obras.onvisiondigital.com",
  "bienes-raices": "https://inmo.onvisiondigital.com",
  ganaderia: "https://ganadero.onvisiondigital.com",
  agricultura: "https://agricola.onvisiondigital.com",
  talleres: "https://taller.onvisiondigital.com",
  personal: "https://personal.onvisiondigital.com",
};

/** Ruta de entrada de cada app. Por defecto /registro (flujo de activación). */
const RUTAS_REGISTRO: Record<string, string> = {};

export function appUrlDeVertical(verticalId: string): string | null {
  return APP_URLS[verticalId] ?? null;
}

/** La app a la que entra quien ya pagó: la de su variable o, si falta, la publicada. */
function appParaEntrar(verticalId: string): string | null {
  return APP_URLS[verticalId] || APPS_PUBLICADAS[verticalId] || null;
}

/** URL de registro en la app del vertical, con el plan elegido en la landing. */
export function urlDeActivacion(
  verticalId: string,
  planId: PlanId,
  extra?: { billing?: "activa" | "pendiente"; sessionId?: string },
): string | null {
  const base = appParaEntrar(verticalId);
  if (!base) return null;
  const ruta = RUTAS_REGISTRO[verticalId] ?? "/registro";
  const params = new URLSearchParams({ vertical: verticalId, plan: planId });
  if (extra?.billing) params.set("billing", extra.billing);
  if (extra?.sessionId) params.set("session_id", extra.sessionId);
  return `${base}${ruta}?${params.toString()}`;
}
