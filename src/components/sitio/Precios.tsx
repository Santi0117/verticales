"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check, Flecha, Icono, Onda } from "./ui";
import { formatCRC, industrias, plan, precioAnualMensual, precioAnualTotal } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * "Precios": titular en serif y selector de wisprflow, las píldoras gigantes
 * de clarvos con el precio adentro y la tarjeta de producto de wisprflow.
 */
export default function Precios() {
  const [anual, setAnual] = useState(false);
  const mensual = anual ? precioAnualMensual : plan.monthly;

  return (
    <section id="precios" className="ov-precios" aria-labelledby="ov-precios-titulo">
      <div className="ov-precios__head">
        <p className="ov-eyebrow">Precios</p>
        <h2 id="ov-precios-titulo" className="ov-serif-h2">
          Un solo precio. <em>Todas las industrias.</em>
        </h2>
        <p className="ov-lede">
          ₡10,500 al mes para cualquier sector. Sin planes confusos ni cobros ocultos. Anual incluye 2
          meses gratis (−17%).
        </p>
        <div className="ov-seg ov-seg--grande" role="group" aria-label="Periodo de facturación">
          <button type="button" aria-pressed={!anual} onClick={() => setAnual(false)}>
            Mensual
          </button>
          <button type="button" aria-pressed={anual} onClick={() => setAnual(true)}>
            Anual <small>−17%</small>
          </button>
        </div>
      </div>

      <div className="ov-pildoras">
        <div className="ov-pildoras__fila">
          <p className="ov-pildora">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mensual}
                className="inline-block"
                initial={{ y: "60%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-60%", opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {formatCRC(mensual)}
              </motion.span>
            </AnimatePresence>
            <span className="ov-pildora__icono" aria-hidden>
              <Icono nombre="calendario" className="h-[0.5em] w-[0.5em]" />
            </span>
            al mes
          </p>
          <a href="#activar" className="ov-pildora__circulo" aria-label="Ir a activar">
            <Flecha dir="esquina" className="h-[0.6em] w-[0.6em]" />
          </a>
        </div>
        <p className="ov-pildora__nota">
          {anual
            ? `Facturado ${formatCRC(precioAnualTotal)} al año`
            : "Mismo precio en restaurantes, clínicas, retail, abogados, personal y el resto de verticales."}
        </p>
        <p className="ov-pildora ov-pildora--corrida">
          Un solo precio para las <span className="ov-pildora__sol">{industrias.length}</span> industrias.
        </p>
      </div>

      <article className="ov-plan">
        <div className="ov-plan__miniatura" aria-hidden>
          <Image src="/logo-eye.png" alt="" width={532} height={282} className="ov-plan__ojo" />
          <span className="ov-plan__capsula">
            <Onda barras={9} />
          </span>
        </div>
        <div className="ov-plan__cuerpo">
          <div className="ov-plan__cabeza">
            <h3 className="ov-plan__nombre">{plan.name}</h3>
            <span className="ov-plan__badge">{plan.badge}</span>
          </div>
          <p className="ov-plan__sub">{plan.subtitle}</p>
          <ul className="ov-plan__lista">
            {plan.features.map((f) => (
              <li key={f}>
                <Check className="h-4 w-4" />
                {f}
              </li>
            ))}
          </ul>
          <a href="#activar" className="ov-boton-lila">
            Activar Onvision
            <Flecha className="h-4 w-4" />
          </a>
        </div>
      </article>
    </section>
  );
}
