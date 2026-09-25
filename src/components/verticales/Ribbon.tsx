"use client";

import { Fragment, useEffect, useId, useRef } from "react";
import { industrias } from "./data";

type Trazo = {
  viewBox: string;
  frente: string;
  fondo: string;
  letra: number;
  banda: number;
};

/** Dos recorridos: uno ancho para escritorio y uno más cerrado para el celular. */
const TRAZOS: Record<"ancho" | "angosto", Trazo> = {
  ancho: {
    viewBox: "0 0 1440 270",
    frente: "M-80 238 C 250 240, 430 118, 730 146 S 1190 64, 1530 34",
    fondo: "M-80 116 C 310 50, 610 226, 980 196 S 1330 112, 1530 150",
    letra: 21,
    banda: 50,
  },
  angosto: {
    viewBox: "0 0 400 190",
    frente: "M-40 172 C 80 172, 130 92, 222 102 S 340 60, 450 40",
    fondo: "M-40 70 C 60 38, 170 152, 282 130 S 380 92, 450 112",
    letra: 13,
    banda: 32,
  },
};

/** Los diez nombres, separados por un punto. Se repite para cubrir el recorrido. */
function Nombres({ separador }: { separador: string }) {
  return (
    <>
      {industrias.map((v) => (
        <Fragment key={v.id}>
          {v.nombre}
          {/* Espacios duros: SVG colapsa los normales. */}
          <tspan fill={separador}>{"   ●   "}</tspan>
        </Fragment>
      ))}
    </>
  );
}

/**
 * Cinta curva con las industrias corriendo encima, a la manera de wisprflow:
 * una banda clara al frente y otra tenue detrás que va en sentido contrario.
 */
export default function Ribbon({ variante }: { variante: "ancho" | "angosto" }) {
  const t = TRAZOS[variante];
  const base = useId().replace(/[^a-zA-Z0-9]/g, "");
  const idFrente = `ova-cinta-${base}-f`;
  const idFondo = `ova-cinta-${base}-b`;
  const svgRef = useRef<SVGSVGElement>(null);
  const medidaRef = useRef<SVGTextElement>(null);
  const frenteRef = useRef<SVGTextPathElement>(null);
  const fondoRef = useRef<SVGTextPathElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const medida = medidaRef.current;
    const frente = frenteRef.current;
    const fondo = fondoRef.current;
    if (!svg || !medida || !frente || !fondo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let copia = 0;
    let raf = 0;
    let visible = true;
    let desplazado = 0;
    let ultimo = performance.now();
    const velocidad = variante === "ancho" ? 0.05 : 0.028;

    const cuadro = (ahora: number) => {
      const dt = Math.min(ahora - ultimo, 50);
      ultimo = ahora;
      // Oculta con display:none mide cero; se vuelve a intentar en cada cuadro.
      if (!copia) copia = medida.getComputedTextLength();
      if (copia) {
        desplazado = (desplazado + dt * velocidad) % copia;
        frente.setAttribute("startOffset", String(-desplazado));
        fondo.setAttribute("startOffset", String(desplazado - copia));
      }
      raf = visible && !document.hidden ? requestAnimationFrame(cuadro) : 0;
    };

    const arrancar = () => {
      if (raf || !visible || document.hidden) return;
      ultimo = performance.now();
      raf = requestAnimationFrame(cuadro);
    };

    const io = new IntersectionObserver(([entrada]) => {
      visible = Boolean(entrada?.isIntersecting);
      arrancar();
    });
    io.observe(svg);
    document.addEventListener("visibilitychange", arrancar);
    arrancar();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", arrancar);
    };
  }, [variante]);

  return (
    <svg
      ref={svgRef}
      viewBox={t.viewBox}
      className="ova-cinta"
      aria-hidden
      focusable="false"
    >
      <defs>
        <path id={idFrente} d={t.frente} />
        <path id={idFondo} d={t.fondo} />
      </defs>

      <use
        href={`#${idFondo}`}
        fill="none"
        stroke="rgba(148, 197, 255, 0.07)"
        strokeWidth={t.banda * 0.8}
        strokeLinecap="round"
      />
      <text
        fontSize={t.letra * 0.82}
        fill="rgba(226, 233, 243, 0.34)"
        dy="0.34em"
        className="ova-cinta__texto"
      >
        <textPath ref={fondoRef} href={`#${idFondo}`}>
          <Nombres separador="rgba(92, 225, 240, 0.5)" />
          <Nombres separador="rgba(92, 225, 240, 0.5)" />
        </textPath>
      </text>

      <use
        href={`#${idFrente}`}
        fill="none"
        stroke="#f4f1ea"
        strokeWidth={t.banda}
        strokeLinecap="round"
      />
      <text fontSize={t.letra} fill="#0b0f17" dy="0.35em" className="ova-cinta__texto">
        <textPath ref={frenteRef} href={`#${idFrente}`}>
          <Nombres separador="#0e8fa6" />
          <Nombres separador="#0e8fa6" />
        </textPath>
      </text>

      {/* Una sola copia, fuera de vista, para medir cuánto mide el ciclo. */}
      <text
        ref={medidaRef}
        fontSize={t.letra}
        x={-99999}
        y={-99999}
        className="ova-cinta__texto"
      >
        <Nombres separador="transparent" />
      </text>
    </svg>
  );
}
