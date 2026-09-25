import type { CSSProperties } from "react";
import { appUrlDeVertical } from "@/lib/activacion";
import { pricingTiers, verticals } from "@/lib/content";
import { sistemaVerticals } from "@/lib/sistema-demo";
import { site } from "@/lib/site";

/**
 * Color de cada sistema, sacado de su propia interfaz (las capturas de
 * public/product). En esta página tiñe la selección, el panel y el cobro.
 */
const ACENTOS: Record<string, string> = {
  restaurantes: "#e5484d",
  retail: "#c4895a",
  clinicas: "#3d9be9",
  abogados: "#c0485a",
  constructoras: "#cf8a2e",
  "bienes-raices": "#4f7fbd",
  ganaderia: "#2f9e63",
  agricultura: "#6aab34",
  talleres: "#eab308",
  personal: "#6c5ce7",
};

/** Acentos tan claros que el texto encima tiene que ir oscuro. */
const ACENTOS_CLAROS = new Set(["talleres"]);

export type Industria = {
  id: string;
  codigo: string;
  nombre: string;
  subtitulo: string;
  pitch: string;
  modulos: string[];
  producto: string;
  imagen: string | null;
  alt: string;
  acento: string;
  sobreAcento: string;
  disponible: boolean;
};

export const industrias: Industria[] = verticals
  .map((v) => {
    const demo = sistemaVerticals.find((d) => d.id === v.id);
    return {
      id: v.id,
      nombre: v.name,
      subtitulo: v.subtitle,
      pitch: v.pitch,
      modulos: v.features,
      producto: demo?.product ?? `Onvision ${v.name}`,
      imagen: demo?.image ?? null,
      alt: demo?.alt ?? v.name,
      acento: ACENTOS[v.id] ?? "#5ce1f0",
      sobreAcento: ACENTOS_CLAROS.has(v.id) ? "#0b0f17" : "#ffffff",
      disponible: appUrlDeVertical(v.id) !== null,
    };
  })
  // Las que ya se pueden activar van primero.
  .sort((a, b) => Number(b.disponible) - Number(a.disponible))
  .map((v, i) => ({ ...v, codigo: String(i + 1).padStart(2, "0") }));

export const industriasConImagen = industrias.filter(
  (v): v is Industria & { imagen: string } => v.imagen !== null,
);

export function industriaPorId(id: string | null | undefined) {
  return industrias.find((v) => v.id === id) ?? null;
}

export const listas = industrias.filter((v) => v.disponible).length;

export const plan = pricingTiers[0]!;

/** ₡10,500. Sin toLocaleString: servidor y navegador tienen que dar lo mismo. */
export function formatCRC(monto: number) {
  return `₡${String(monto).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export const precioMensual = `${formatCRC(plan.monthly)}/mes`;

/** Cómo funciona, módulos, precios…: esas secciones viven en el sitio oficial. */
export function enProducto(ancla: string) {
  return `${site.parentUrl}/producto${ancla}`;
}

/** Los medios del checkout de Onvo, como los nombra la nota de pago. */
export const mediosDePago = ["Visa", "Mastercard", "Amex", "SINPE"];

/** Mismo `sizes` en el hero y en el panel: así la captura sale de la caché. */
export const SIZES_CAPTURA = "(min-width: 1024px) 640px, 92vw";

/** Variables de color de una industria, para un `style`. */
export function tinte(v: Pick<Industria, "acento" | "sobreAcento"> | null) {
  return {
    "--acc": v?.acento ?? "#5ce1f0",
    "--on-acc": v?.sobreAcento ?? "#0b0f17",
  } as CSSProperties;
}
