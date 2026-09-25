import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

/*
 * Las tres fuentes del sitio. Se cargan una sola vez, acá:
 * next/font no admite registrar la misma familia dos veces.
 */

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** La serif itálica de los titulares ("de tu industria."). */
export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-ova-serif",
  display: "swap",
});

export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${serif.variable}`;
