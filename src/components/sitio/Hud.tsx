"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { comparisonRows } from "@/lib/content";
import Streaks from "./Streaks";
import { Esquinas, Seccion, Tag } from "./ui";
import { ESCENAS } from "./data";

/** El índice de la comparativa es su número de escena. */
const INDICE = String(ESCENAS.indexOf("comparativa") + 1).padStart(2, "0");

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
 * "Onvision vs otros" en el lenguaje de sibaldesign: bloque azul noche con
 * rayado, puntos y estelas; encabezado con índice y regla, y la comparativa
 * como su registro.
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

      <section id="comparativa" className="ov-hud__sec" aria-labelledby="ov-comp-titulo">
        <Seccion indice={INDICE}>Comparativa</Seccion>
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
