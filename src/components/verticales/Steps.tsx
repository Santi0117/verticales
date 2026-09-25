"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Hud } from "./ui";
import { industrias, precioMensual } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;

const icono = (trazos: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[18px] w-[18px]"
    aria-hidden
  >
    {trazos}
  </svg>
);

/** Los tres pasos que la página siempre prometió: elegir, pagar, entrar. */
const PASOS = [
  {
    n: "01",
    titulo: "Elegí",
    texto: `Una de las ${industrias.length} industrias. Cada una trae su propio sistema.`,
    icono: icono(
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <path d="m14.5 17.5 2 2 4-4.5" />
      </>,
    ),
  },
  {
    n: "02",
    titulo: "Pagá",
    texto: `${precioMensual} con tarjeta, en colones, por el checkout de Onvo.`,
    icono: icono(
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M2.5 10h19M6.5 15h4" />
      </>,
    ),
  },
  {
    n: "03",
    titulo: "Entrá",
    texto: "Creás tu cuenta y entrás con la suscripción activa.",
    icono: icono(
      <>
        <circle cx="8" cy="15" r="4" />
        <path d="m10.8 12.2 8.7-8.7M16 7l2.5 2.5M18.5 4.5 21 7" />
      </>,
    ),
  },
];

export default function Steps() {
  return (
    <section className="ova-sec ova-pasos" aria-labelledby="ova-pasos-titulo">
      <div className="ova-wrap">
        <div className="ova-pasos__head">
          <Hud tono="claro">Así se activa</Hud>
          <h2 id="ova-pasos-titulo" className="ova-h2">
            Tu cuenta, <em>el mismo día.</em>
          </h2>
        </div>

        <div className="ova-pasos__marco">
          <span className="ova-pasos__lazo" aria-hidden />
          <ol className="ova-pasos__grid">
          {PASOS.map((p, i) => (
            <motion.li
              key={p.n}
              className="ova-paso"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.12 }}
            >
              <span className="ova-paso__pill">
                <span className="ova-mono">{p.n}</span>
                {p.titulo}
                <span className="ova-paso__ico">{p.icono}</span>
              </span>
              <p>{p.texto}</p>
            </motion.li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
