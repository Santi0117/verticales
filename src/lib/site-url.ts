/** Dirección pública de esta página. */
export const SITIO = "https://sistema.onvisiondigital.com";

/**
 * El sistema anterior (proyecto onvision-landing), en su dirección de Vercel.
 * Sigue cobrando con Onvo y atendiendo los avisos de pago (Onvo y TiloPay)
 * mientras esta página no tenga sus propias llaves.
 */
export const SISTEMA_ANTERIOR = "https://onvision-landing.vercel.app";

/** URL pública de este sitio — redirects de Onvo y SEO. */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3030";
}
