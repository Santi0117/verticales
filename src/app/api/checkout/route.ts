import { NextResponse } from "next/server";
import { appUrlDeVertical } from "@/lib/activacion";
import { verticals } from "@/lib/content";
import {
  ONVO_PRECIO_MENSUAL_CRC,
  checkoutOriginFromRequest,
  createOnvoOneTimeLink,
  onvoConfigured,
} from "@/lib/onvo";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

/**
 * Crea un link de checkout Onvo (un solo uso) para la suscripción mensual.
 * Body: { verticalId: string }
 */
export async function POST(request: Request) {
  if (!onvoConfigured()) {
    return NextResponse.json(
      {
        error:
          "Onvo no está configurado. Agregá ONVO_SECRET_KEY en .env.local / Vercel.",
      },
      { status: 503 },
    );
  }

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
