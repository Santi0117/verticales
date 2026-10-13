import { NextResponse } from "next/server";
import { appUrlDeVertical } from "@/lib/activacion";
import { verticals } from "@/lib/content";
import {
  ONVO_PRECIO_MENSUAL_CRC,
  checkoutOriginFromRequest,
  createOnvoOneTimeLink,
  onvoConfigured,
} from "@/lib/onvo";
import { SISTEMA_ANTERIOR, SITIO, getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

/**
 * Si el sistema anterior no contesta, su página de activar, con la industria
 * ya elegida. Va por su dirección de Vercel: sistema.onvisiondigital.com
 * ahora es esta página.
 */
const ACTIVAR_RESPALDO = `${SISTEMA_ANTERIOR}/activar`;

/** A dónde vuelve el cliente: la dirección desde la que pagó, si es de esta página. */
function origenPropio(request: Request) {
  try {
    const { hostname, origin } = new URL(checkoutOriginFromRequest(request) ?? "");
    const propio =
      hostname === new URL(SITIO).hostname ||
      (hostname.startsWith("verticales") && hostname.endsWith(".vercel.app")) ||
      hostname === "localhost";
    if (propio) return origin;
  } catch {}
  return SITIO;
}

/**
 * Mientras este proyecto no tenga ONVO_SECRET_KEY, el link de pago lo arma
 * el sistema anterior, que ya cobra con Onvo (lo mismo que hace
 * onvisiondigital.com). Le pasamos esta dirección como origen, así el
 * cliente vuelve acá al terminar o al cancelar.
 */
async function linkDelSistemaAnterior(verticalId: string, origen: string): Promise<string | null> {
  try {
    const res = await fetch(`${SISTEMA_ANTERIOR}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: origen },
      body: JSON.stringify({ verticalId }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const data = (await res.json().catch(() => ({}))) as { url?: string };
    if (res.ok && data.url) return data.url;
    console.error("[checkout] sistema anterior", res.status);
  } catch (err) {
    console.error("[checkout] sistema anterior", err instanceof Error ? err.message : err);
  }
  return null;
}

/**
 * Crea un link de checkout Onvo (un solo uso) para la suscripción mensual.
 * Body: { verticalId: string }
 */
export async function POST(request: Request) {
  let body: { verticalId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const verticalId = body.verticalId?.trim();
  if (!verticalId) {
    return NextResponse.json({ error: "Falta verticalId" }, { status: 400 });
  }

  const vertical = verticals.find((v) => v.id === verticalId);
  if (!vertical) {
    return NextResponse.json({ error: "Industria no válida" }, { status: 400 });
  }

  // Sin llave de Onvo propia, el link lo arma el sistema anterior.
  if (!onvoConfigured()) {
    const url = await linkDelSistemaAnterior(verticalId, origenPropio(request));
    return NextResponse.json({ url: url ?? `${ACTIVAR_RESPALDO}?vertical=${encodeURIComponent(verticalId)}` });
  }

  if (!appUrlDeVertical(verticalId)) {
    return NextResponse.json(
      { error: "Esa industria todavía no está disponible para activar" },
      { status: 400 },
    );
  }

  const origin = (checkoutOriginFromRequest(request) ?? getSiteUrl()).replace(
    /\/$/,
    "",
  );

  try {
    const session = await createOnvoOneTimeLink({
      unitAmount: ONVO_PRECIO_MENSUAL_CRC,
      currency: "CRC",
      description: `Onvision · ${vertical.name} — suscripción mensual`,
      metadata: {
        verticalId,
        verticalName: vertical.name,
        planId: "unico",
        producto: "onvision",
        source: "verticales",
        site: new URL(origin).host,
        // Mes 1 ahora; webhook agenda meses 2–4 automáticos (tarjeta).
        setupRecurring: "1",
        recurringMonths: "4",
        minMonths: "4",
        unitAmount: String(ONVO_PRECIO_MENSUAL_CRC),
        currency: "CRC",
      },
      redirectUrl: `${origin}/activar/exito?vertical=${encodeURIComponent(verticalId)}`,
      cancelUrl: `${origin}/?vertical=${encodeURIComponent(verticalId)}&pago=cancelado`,
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "No se pudo crear el pago";
    console.error("[onvo/checkout]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
