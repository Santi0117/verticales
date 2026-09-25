"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { hero } from "@/lib/content";
import Cinta from "./Cinta";
import Streaks from "./Streaks";
import { Check, Esquinas, Flecha, Tag } from "./ui";
import { SIZES_CAPTURA, industrias, tinte } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;

/** "empresa" y después cada industria; la captura acompaña a la palabra. */
const ROTACION = [
  { palabra: "empresa", industria: industrias[0]! },
  ...industrias.map((v) => ({ palabra: v.palabra, industria: v })),
];

/** SCROLL 000 → 100 en el riel derecho (sibaldesign). */
function ContadorScroll() {
  const { scrollYProgress } = useScroll();
  const [valor, setValor] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = Math.round(v * 100);
    setValor((prev) => (prev === n ? prev : n));
  });
  return <>SCROLL {String(valor).padStart(3, "0")}</>;
}

/** Las tarjetas de producto de la portada, ordenadas como el mosaico de clarvos. */
function Collage({ indice }: { indice: number }) {
  const { industria } = ROTACION[indice]!;
  return (
    <div className="ov-collage" style={tinte(industria)}>
      <div className="ov-collage__panel ov-panel">
        <Tag derecha={`${industria.codigo} / ${String(industrias.length).padStart(2, "0")}`}>{industria.producto}</Tag>
        <div className="ov-collage__pantalla">
          <AnimatePresence initial={false}>
            <motion.div
              key={industria.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <Image
                src={industria.imagen}
                alt={industria.alt}
                fill
                sizes={SIZES_CAPTURA}
                className="object-cover object-left-top"
                {...(industria.id === industrias[0]!.id ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
              />
            </motion.div>
          </AnimatePresence>
          <Esquinas className="ov-collage__esquinas" />
        </div>
      </div>

      <div className="ov-card ov-card--sol ov-collage__caja">
        <p className="ov-card__label">Caja de hoy</p>
        <p className="ov-card__grande">₡1.24 M</p>
        <p className="ov-card__chico">ingresos · salidas ₡318 mil</p>
        <p className="ov-chip ov-chip--negro">SINPE · CRC / USD</p>
      </div>

      <div className="ov-card ov-collage__factura">
        <div className="ov-card__fila">
          <p className="ov-card__titulo">Factura 001-001-000000148</p>
          <span className="ov-chip ov-chip--menta">
            <Check className="h-3 w-3" />
            Aceptada
          </span>
        </div>
        <div className="ov-barra">
          <i style={{ width: "92%" }} />
        </div>
        <p className="ov-card__mono">Clave · 506140826003101…</p>
        <p className="ov-card__chico">
          <i className="ov-punto" /> Hacienda · TRIBU-CR · FE 4.4
        </p>
      </div>

      <div className="ov-card ov-collage__stock">
        <p className="ov-card__label">
          <i className="ov-vivo" /> Inventario en vivo
        </p>
        {[
          ["Varilla 3/8", "142", "ok"],
          ["Café 250 g", "8", "bajo"],
          ["Cemento 50 kg", "64", "ok"],
        ].map(([nombre, qty, estado], i) => (
          <div key={nombre} className="ov-card__item">
            <span className="ov-rango">{i + 1}</span>
            <span className="ov-card__item-nombre">{nombre}</span>
            <span className={`ov-chip ${estado === "bajo" ? "ov-chip--sol" : "ov-chip--menta"}`}>{qty} und</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Portada: el marco oscuro con la muesca del menú (clarvos), el titular
 * gigante en mayúscula (jeffmilanes) con la segunda línea delineada
 * (sibaldesign) y la palabra que rota en amarillo; debajo, la cinta de
 * wisprflow.
 */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const enVista = useInView(ref, { amount: 0.2 });
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (!enVista) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const reloj = window.setInterval(() => setIndice((n) => (n + 1) % ROTACION.length), 2600);
    return () => window.clearInterval(reloj);
  }, [enVista]);

  const { palabra } = ROTACION[indice]!;

  return (
    <section id="inicio" className="ov-hero" aria-labelledby="ov-h1">
      <div ref={ref} className="ov-hero__marco">
        <div className="ov-notch" aria-hidden />
        <div className="ov-fx" aria-hidden>
          <div className="ov-fx__rayado" />
          <div className="ov-fx__puntos" />
          <div className="ov-fx__vineta" />
          <Streaks className="ov-fx__estelas" />
        </div>
        <p className="ov-riel ov-riel--izq" aria-hidden>
          ONVISION <b>{"//"}</b> COSTA RICA
        </p>
        <p className="ov-riel ov-riel--der" aria-hidden>
          <ContadorScroll />
        </p>
        <Esquinas className="ov-hero__esquinas" />

        <div className="ov-hero__in">
          <motion.p
            className="ov-hero__kicker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            « {hero.brand.toUpperCase()}
            <span>.SISTEMA.PARA.TODAS.LAS.INDUSTRIAS</span>
          </motion.p>

          <h1 id="ov-h1" className="ov-hero__h1">
            <span className="sr-only">
              {hero.line1} {hero.highlight}
            </span>
            <span aria-hidden className="ov-hero__linea">
              <motion.span
                className="inline-block"
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease: EASE, delay: 0.15 }}
              >
                Onvision ya tiene
              </motion.span>
            </span>
            <span aria-hidden className="ov-hero__linea ov-hero__linea--hueca">
              <motion.span
                className="inline-block"
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease: EASE, delay: 0.27 }}
              >
                la solución para tu
              </motion.span>
            </span>
            <span
              aria-hidden
              className="ov-hero__linea ov-hero__linea--sol"
              style={{ "--len": palabra.length + 1 } as CSSProperties}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={palabra}
                  className="inline-block"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-130%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  {palabra}.
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <div className="ov-hero__fila">
            <motion.div
              className="ov-hero__copy"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
            >
              <p className="ov-hero__lede">{hero.line2}</p>
              <div className="ov-hero__ctas">
                <a href="#activar" className="ov-pill ov-pill--sol">
                  {hero.ctaPrimary}
                  <span className="ov-pill__circ">
                    <Flecha dir="diagonal" />
                  </span>
                </a>
                <a href={hero.ctaSecondaryHref} className="ov-pill ov-pill--linea">
                  {hero.ctaSecondary}
                  <Flecha />
                </a>
              </div>
              <ul className="ov-hero__meta">
                {hero.priceNote.split(" · ").map((parte, i) => (
                  <li key={parte}>
                    {i > 0 ? <em aria-hidden>/</em> : null}
                    {parte}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="ov-hero__visual"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.45 }}
            >
              <Collage indice={indice} />
            </motion.div>
          </div>

          <a href="#industrias-listas" className="ov-hero__bajar">
            Bajá para recorrer
            <span aria-hidden>
              <Flecha dir="abajo" className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </div>

      <Cinta />
    </section>
  );
}
