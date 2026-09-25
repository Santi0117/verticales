"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** Lo que "arranca": el núcleo que todas las industrias comparten. */
const FILAS = ["Facturación 4.4", "Inventario", "SINPE Móvil", "CRC · USD", "10 verticales"];

const R = 52;
const CIRCUNFERENCIA = 2 * Math.PI * R;
const DURACION = 1900;

/**
 * Pantalla de arranque: la lista "INICIANDO" de jeffmilanes con el anillo de
 * carga y el botón de entrar de sibaldesign. Sale una vez por sesión (lo
 * decide el script del layout antes de pintar), se puede saltar, y aunque
 * no corra JavaScript se va sola por CSS.
 */
export default function Boot({ year }: { year: number }) {
  const [estado, setEstado] = useState<"dentro" | "fuera" | "oculto">("dentro");
  const pct = useRef<HTMLSpanElement>(null);
  const anillo = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // Ya se vio en esta sesión: el CSS la tiene escondida, no hay nada que correr.
    if (document.documentElement.dataset.boot === "off") return;
    const inicio = performance.now();
    let raf = 0;
    const tic = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / DURACION);
      const e = 1 - Math.pow(1 - t, 3);
      if (pct.current) pct.current.textContent = String(Math.round(e * 100)).padStart(2, "0");
      if (anillo.current) anillo.current.style.strokeDashoffset = String(CIRCUNFERENCIA * (1 - e));
      if (t < 1) raf = requestAnimationFrame(tic);
      else setEstado("fuera");
    };
    raf = requestAnimationFrame(tic);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (estado !== "fuera") return;
    const html = document.documentElement;
    html.dataset.boot = "done";
    const fin = window.setTimeout(() => {
      setEstado("oculto");
      html.dataset.boot = "off";
    }, 950);
    return () => window.clearTimeout(fin);
  }, [estado]);

  if (estado === "oculto") return null;

  return (
    <div className="ov-boot" data-estado={estado} aria-hidden>
      <div className="ov-boot__in">
        <div className="ov-boot__marca">
          <Image src="/logo-eye.png" alt="" width={532} height={282} className="ov-boot__ojo" priority />
          <div>
            <p className="ov-boot__nombre">ONVISION</p>
            <p className="ov-boot__sub">
              {"SISTEMA".split("").map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </p>
          </div>
        </div>

        <ol className="ov-boot__lineas">
          <li>ONVISION DIGITAL · PRESENTA</li>
          <li>
            COSTA RICA [SISTEMA / {year}]
          </li>
          <li>
            HECHO PARA HACIENDA 4.4 <b>◤</b>
          </li>
        </ol>

        <button type="button" tabIndex={-1} className="ov-boot__entrar" onClick={() => setEstado("fuera")}>
          <span className="ov-boot__regla" />
          <span className="ov-boot__barras">
            <i />
            <i />
            <i />
          </span>
          ENTRAR A ONVISION
        </button>
      </div>

      <div className="ov-boot__carga">
        <div className="ov-boot__anillo">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={R} className="ov-boot__pista" />
            <circle
              ref={anillo}
              cx="60"
              cy="60"
              r={R}
              className="ov-boot__lleno"
              strokeDasharray={CIRCUNFERENCIA}
              strokeDashoffset={CIRCUNFERENCIA}
            />
          </svg>
          <p>
            <span ref={pct}>00</span>
            <small>%</small>
          </p>
        </div>
        <p className="ov-boot__titulo">OV.CARGANDO.SISTEMA</p>
      </div>

      <div className="ov-boot__lista">
        <p className="ov-boot__iniciando">INICIANDO</p>
        <ul>
          {FILAS.map((f, i) => (
            <li key={f} style={{ animationDelay: `${0.2 + i * 0.26}s` }}>
              <span>{f}</span>
              <i />
              <b>LISTO</b>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
