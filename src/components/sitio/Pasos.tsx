"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { howItWorks } from "@/lib/content";
import Particulas from "./Particulas";
import { Mono } from "./ui";

const EASE = [0.22, 1, 0.36, 1] as const;
const N = howItWorks.length;

/** La palabra gigante de cada paso. */
const PALABRA = ["Elegí", "Personalizá", "Facturá"];

/** La consola que se va llenando, un renglón por paso. */
const CONSOLA = [
  "elegí la vertical que necesitás — el núcleo ya viene incluido",
  "logo, cédula jurídica, moneda y cobros — sin implementaciones de 3 meses",
  "facturá, controlá inventario y cobrá con SINPE",
];

const TITULO = "Tres pasos. Sin consultoría eterna.";
const LEDE = "Entrá, elegí tu industria y empezá a facturar. Onvision se adapta a tu empresa — no al revés.";

/**
 * "Cómo funciona" como "At the machine" de jeffmilanes: el dibujo de puntos
 * que cambia de figura, la consola que se llena y la palabra gigante de
 * cada paso.
 */
export default function Pasos() {
  const pista = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pista, offset: ["start start", "end end"] });
  const [i, setI] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const n = Math.min(N - 1, Math.max(0, Math.floor(p * N)));
    setI((prev) => (prev === n ? prev : n));
  });

  const paso = howItWorks[i]!;

  return (
    <section id="como-funciona" className="ov-pasos" aria-labelledby="ov-pasos-titulo">
      <div className="ov-pasos__intro-movil">
        <Mono>Cómo funciona</Mono>
        <h2 className="ov-pasos__h2">{TITULO}</h2>
        <p className="ov-pasos__lede">{LEDE}</p>
      </div>

      <div ref={pista} className="ov-pasos__pista">
        <div className="ov-pasos__stage">
          <div className="ov-pasos__izq">
            <Particulas forma={i} className="ov-pasos__lienzo" />
            <div className="ov-pasos__intro">
              <Mono className="ov-pasos__kicker">Cómo funciona</Mono>
              <h2 id="ov-pasos-titulo" className="ov-pasos__h2">
                {TITULO}
              </h2>
              <p className="ov-pasos__lede">{LEDE}</p>
            </div>
            <ul className="ov-pasos__consola" aria-hidden>
              {CONSOLA.slice(0, i + 1).map((linea, k) => (
                <li key={linea} data-nueva={k === i ? "true" : "false"}>
                  <span>›</span> {linea}
                </li>
              ))}
            </ul>
          </div>

          <div className="ov-pasos__der">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={paso.step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Mono className="ov-pasos__num">{paso.step}</Mono>
                <h3 className="ov-pasos__palabra" style={{ "--len": PALABRA[i]!.length } as CSSProperties}>
                  <span className="sr-only">{paso.title}</span>
                  <motion.span
                    aria-hidden
                    className="inline-block"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    {PALABRA[i]}
                  </motion.span>
                </h3>
                <p className="ov-pasos__titulo" aria-hidden>
                  {paso.title}
                </p>
                <p className="ov-pasos__desc">{paso.description}</p>
              </motion.div>
            </AnimatePresence>

            <ol className="ov-pasos__marcas" aria-hidden>
              {howItWorks.map((s, k) => (
                <li key={s.step} data-on={k <= i ? "true" : "false"}>
                  <i />
                  {s.step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
