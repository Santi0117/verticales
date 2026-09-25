import { Archivo, Chakra_Petch, EB_Garamond, Figtree, Geist_Mono } from "next/font/google";

/*
 * Una familia por referencia, cargadas una sola vez acá
 * (next/font no admite registrar la misma familia dos veces):
 *   Archivo       → los titulares gigantes en mayúscula (jeffmilanes)
 *   EB Garamond   → la serif editorial con itálica (wisprflow)
 *   Figtree       → el texto y los titulares redondos (wisprflow, clarvos)
 *   Geist Mono    → las etiquetas de consola (jeffmilanes, sibaldesign)
 *   Chakra Petch  → los paneles de HUD (sibaldesign)
 */

export const display = Archivo({
  variable: "--ff-display",
  subsets: ["latin"],
  weight: ["600", "800"],
  display: "swap",
});

export const serif = EB_Garamond({
  variable: "--ff-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const sans = Figtree({
  variable: "--ff-sans",
  subsets: ["latin"],
  display: "swap",
});

export const mono = Geist_Mono({
  variable: "--ff-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const hud = Chakra_Petch({
  variable: "--ff-hud",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const fontVariables = [display, serif, sans, mono, hud].map((f) => f.variable).join(" ");
