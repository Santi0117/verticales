import type { CSSProperties } from "react";
import { appUrlDeVertical } from "@/lib/activacion";
import { pricingTiers, verticals } from "@/lib/content";
import { sectores, type Sector } from "@/lib/sectores";
import { sistemaVerticals } from "@/lib/sistema-demo";

/**
 * Color de cada sistema, sacado de su propia interfaz (las capturas de
 * public/product). Tiñe la selección, el panel y el cobro.
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

/** "…la solución para tu ___": la palabra que rota en la portada. */
const PALABRAS: Record<string, string> = {
  restaurantes: "restaurante",
  retail: "tienda",
  clinicas: "clínica",
  abogados: "bufete",
  constructoras: "constructora",
  "bienes-raices": "inmobiliaria",
  ganaderia: "ganadería",
  agricultura: "finca",
  talleres: "taller",
  personal: "hogar",
};

export type Industria = {
  id: string;
  codigo: string;
  nombre: string;
  subtitulo: string;
  pitch: string;
  ayuda: string[];
  modulos: string[];
  producto: string;
  corto: string;
  palabra: string;
  imagen: string;
  alt: string;
  acento: string;
  sobreAcento: string;
  disponible: boolean;
};

export const industrias: Industria[] = verticals.map((v, i) => {
  const demo = sistemaVerticals.find((d) => d.id === v.id);
  return {
    id: v.id,
    codigo: String(i + 1).padStart(2, "0"),
    nombre: v.name,
    subtitulo: v.subtitle,
    pitch: v.pitch,
    ayuda: v.helps,
    modulos: v.features,
    producto: demo?.product ?? `Onvision ${v.name}`,
    corto: demo?.name ?? v.name,
    palabra: PALABRAS[v.id] ?? "empresa",
    imagen: demo?.image ?? "/product/retail-pos-hq2.webp",
    alt: demo?.alt ?? v.name,
    acento: ACENTOS[v.id] ?? "#5fe0ff",
    sobreAcento: ACENTOS_CLAROS.has(v.id) ? "#0b0f17" : "#ffffff",
    disponible: appUrlDeVertical(v.id) !== null,
  };
});

export function industriaPorId(id: string | null | undefined) {
  return industrias.find((v) => v.id === id) ?? null;
}

export const listas = industrias.filter((v) => v.disponible).length;

/** El carrusel por industria, con su captura y su color. */
export type Escena = Sector & { industria: Industria };

export const escenas: Escena[] = sectores.flatMap((s) => {
  const industria = industriaPorId(s.id);
  return industria ? [{ ...s, industria }] : [];
});

export const plan = pricingTiers[0]!;

/** ₡10,500. Sin toLocaleString: servidor y navegador tienen que dar lo mismo. */
export function formatCRC(monto: number) {
  return `₡${String(monto).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export const precioMensual = `${formatCRC(plan.monthly)}/mes`;

/** Anual: 2 meses gratis, como en la sección de precios de siempre. */
export const precioAnualMensual = Math.round((plan.monthly * 10) / 12);
export const precioAnualTotal = plan.monthly * 10;

/** Los medios del checkout de Onvo, como los nombra la nota de pago. */
export const mediosDePago = ["Visa", "Mastercard", "Amex", "SINPE"];

/** Mismo `sizes` en todas las capturas grandes: así salen de la caché. */
export const SIZES_CAPTURA = "(min-width: 1024px) 720px, 92vw";

/** Variables de color de una industria, para un `style`. */
export function tinte(v: Pick<Industria, "acento" | "sobreAcento"> | null) {
  return {
    "--acc": v?.acento ?? "#5fe0ff",
    "--on-acc": v?.sobreAcento ?? "#0b0f17",
  } as CSSProperties;
}

/** Las secciones, en orden: alimentan el contador de escenas. */
export const ESCENAS = [
  "inicio",
  "industrias-listas",
  "hecho",
  "industrias-imagenes",
  "modulos",
  "problema",
  "como-funciona",
  "industrias",
  "por-que",
  "comparativa",
  "precios",
  "registro",
  "activar",
] as const;

type ConLenis = { __ovLenis?: { scrollTo: (t: HTMLElement | number, o?: object) => void } };

/** Llevar la página a un punto, con el scroll suave si está encendido. */
export function scrollA(destino: HTMLElement | number, offset = 0) {
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = (window as unknown as ConLenis).__ovLenis;
  if (lenis && !quieto) {
    lenis.scrollTo(destino, { offset, duration: 1.3 });
    return;
  }
  const y =
    typeof destino === "number"
      ? destino
      : destino.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top: y, behavior: quieto ? "auto" : "smooth" });
}

/** Llevar la página a una sección y, si se pide, enfocar algo al llegar. */
export function irA(id: string, enfocar?: string) {
  const destino = document.getElementById(id);
  if (!destino) return;
  scrollA(destino, -12);
  if (enfocar) {
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => document.getElementById(enfocar)?.focus({ preventScroll: true }),
      quieto ? 0 : 1350,
    );
  }
}
