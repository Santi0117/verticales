"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { comparisonRows, valueProps } from "@/lib/content";
import Streaks from "./Streaks";
import { Esquinas, Seccion, Tag } from "./ui";

const EASE = [0.16, 1, 0.3, 1] as const;

/** SCROLL 000 → 100 del bloque, en el riel derecho. */
function Riel({ objetivo }: { objetivo: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ target: objetivo, offset: ["start end", "end start"] });
  const [v, setV] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const n = Math.round(p * 100);
    setV((prev) => (prev === n ? prev : n));
  });
  return <>SCROLL {String(v).padStart(3, "0")}</>;
}

/**
 * "Por qué Onvision" y "Comparativa" en el lenguaje de sibaldesign: bloque
 * azul noche con rayado, puntos y estelas; encabezados con índice y regla;
 * las ventajas como su grilla de equipo y la comparativa como su registro.
 */
export default function Hud() {
  const bloque = useRef<HTMLDivElement>(null);

  return (
    <div ref={bloque} className="ov-hud">
      <div className="ov-fx" aria-hidden>
        <div className="ov-fx__rayado ov-fx__rayado--hud" />
        <div className="ov-fx__puntos ov-fx__puntos--bordes" />
        <div className="ov-fx__scan" />
        <div className="ov-fx__vineta" />
        <Streaks className="ov-fx__estelas" />
      </div>
      <p className="ov-riel ov-riel--izq" aria-hidden>
        ONVISION <b>{"//"}</b> EST. COSTA RICA
      </p>
      <p className="ov-riel ov-riel--der" aria-hidden>
        <Riel objetivo={bloque} />
      </p>
      <Esquinas className="ov-hud__esquinas" />

      <section id="por-que" className="ov-hud__sec" aria-labelledby="ov-porque-titulo">
        <Seccion indice="09">Por qué Onvision</Seccion>
        <h2 id="ov-porque-titulo" className="ov-hud__h2">
          <span>El diferenciador es</span>
          <span className="ov-hud__hueca">la verticalización.</span>
        </h2>

        <div className="ov-equipo">
          {valueProps.map((v, i) => (
            <motion.article
              key={v.title}
              className="ov-equipo__card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
            >
              <p className="ov-equipo__cat">VENTAJA.{String(i + 1).padStart(2, "0")}</p>
              <h3 className="ov-equipo__titulo">{v.title}</h3>
              <span className="ov-equipo__barra" aria-hidden>
                <motion.i
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.25 + (i % 3) * 0.12 }}
                />
              </span>
              <p className="ov-equipo__desc">{v.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="comparativa" className="ov-hud__sec" aria-labelledby="ov-comp-titulo">
        <Seccion indice="10">Comparativa</Seccion>
        <h2 id="ov-comp-titulo" className="ov-hud__h2">
          <span>Onvision</span>
          <span className="ov-hud__hueca">vs otros</span>
        </h2>
        <p className="ov-hud__lede">
          El mercado pelea por facturación barata. Nadie más ofrece verticales configurables sobre el
          mismo núcleo.
        </p>

        <div className="ov-panel ov-log">
          <Tag derecha={`${comparisonRows.length} ASPECTOS · 3 SISTEMAS`}>COMPARATIVA.LOG</Tag>
          <table className="ov-log__tabla">
            <thead>
              <tr>
                <th scope="col">Aspecto</th>
                <th scope="col" className="ov-log__on">
                  Onvision
                </th>
                <th scope="col">Otros</th>
                <th scope="col">Otros</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((r, i) => (
                <tr key={r.label}>
                  <th scope="row">
                    <span className="ov-log__idx" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {r.label}
                  </th>
                  <td className="ov-log__on" data-label="Onvision">
                    {r.onvision}
                  </td>
                  <td data-label="Otros">{r.alegra}</td>
                  <td data-label="Otros">{r.facturele}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
