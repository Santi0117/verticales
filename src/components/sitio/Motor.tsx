"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { MOTOR, type LadoPieza } from "./data";
import { Mono } from "./ui";
import type { Ancla, Cuadro } from "./motor/escena";
import "./motor.css";

type Caja = { l: number; t: number; r: number; b: number };

const cruza = (a: Caja, b: Caja, aire: number) => a.l < b.r + aire && a.r > b.l - aire && a.t < b.b + aire && a.b > b.t - aire;
const cajaEtiqueta = (x: number, y: number, w: number, h: number): Caja => ({ l: x, t: y - h / 2, r: x + w, b: y + h / 2 });

/** La etiqueta justo afuera del recuadro de la pieza. `y` es el centro (va con translateY(-50%)). */
function afuera(a: Caja, w: number, h: number, lado: LadoPieza, aire: number) {
  const mx = (a.l + a.r) / 2;
  const my = (a.t + a.b) / 2;
  if (lado === "arriba") return { x: mx - w / 2, y: a.t - aire - h / 2 };
  if (lado === "abajo") return { x: mx - w / 2, y: a.b + aire + h / 2 };
  if (lado === "izq") return { x: a.l - aire - w, y: my };
  return { x: a.r + aire, y: my };
}

/**
 * "El motor": el sistema Onvision se abre pieza por pieza mientras se baja
 * (el prototipo /vision de la landing), en su propia sección. La pantalla
 * queda pegada, el fondo pasa de negro a azul noche y a papel crema, y cada
 * pieza lleva su nombre al lado. En el celular los nombres van en una lista
 * debajo del título. La escena 3D se carga recién cuando la sección se
 * acerca, y fuera de pantalla no dibuja.
 */
export default function Motor() {
  const seccion = useRef<HTMLElement>(null);
  const pantalla = useRef<HTMLDivElement>(null);
  const lienzo = useRef<HTMLDivElement>(null);
  const etiquetas = useRef<(HTMLDivElement | null)[]>([]);
  const lista = useRef<HTMLUListElement>(null);
  const contador = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sec = seccion.current;
    const host = lienzo.current;
    const stage = pantalla.current;
    if (!sec || !host || !stage) return;

    let motor: { pausar: (si: boolean) => void; desmontar: () => void } | null = null;
    let vivo = true;
    let cargando = false;
    // Cada etiqueta se queda del lado que le tocó (sin saltar mientras se baja).
    const fijas: ({ lado: LadoPieza; extra: number } | null)[] = MOTOR.piezas.map(() => null);

    const alCuadro = (c: Cuadro) => {
      stage.style.setProperty("--m-fondo", c.fondo);
      stage.style.setProperty("--m-tinta", c.tinta);
      stage.style.setProperty("--m-suave", c.suave);
      const celular = stage.clientWidth < 768;
      lista.current?.classList.toggle("is-on", celular && c.abierto > 0.08);
      const n = Math.min(MOTOR.piezas.length, Math.max(1, Math.ceil(c.abierto * MOTOR.piezas.length)));
      if (contador.current) contador.current.textContent = String(n).padStart(2, "0");
      if (celular) return;
      ubicar(c.anclas, c.abierto, stage.clientWidth, stage.clientHeight);
    };

    const ubicar = (anclas: Ancla[], abierto: number, w: number, h: number) => {
      const borde = 16;
      const aire = 14;
      const minY = 84;
      const maxY = h - 32;
      if (abierto < 0.12) fijas.fill(null);

      // Recién con la cámara atrás se decide el lado (antes el primer plano saca las piezas de pantalla).
      if (abierto > 0.8 && fijas.some((f) => !f)) {
        const puestas: Caja[] = [];
        MOTOR.piezas.forEach((pz, i) => {
          const el = etiquetas.current[i];
          const a = anclas[i];
          if (!el || !a) return;
          const lw = el.offsetWidth || 80;
          const lh = el.offsetHeight || 18;
          let extra = 0;
          let { x, y } = afuera(a, lw, lh, pz.lado, aire);
          let caja = cajaEtiqueta(x, y, lw, lh);
          for (let k = 0; k < 4; k++) {
            if (!puestas.some((p) => cruza(caja, p, 6))) break;
            extra += lh + 8;
            ({ x, y } = afuera(a, lw, lh, pz.lado, aire + extra));
            caja = cajaEtiqueta(x, y, lw, lh);
          }
          puestas.push(caja);
          fijas[i] = { lado: pz.lado, extra };
        });
      }

      const vis = smooth(0.72, 0.98, abierto);
      MOTOR.piezas.forEach((pz, i) => {
        const el = etiquetas.current[i];
        const a = anclas[i];
        if (!el || !a) return;
        const lw = el.offsetWidth || 80;
        const lh = el.offsetHeight || 18;
        const lado = fijas[i]?.lado ?? pz.lado;
        let { x, y } = afuera(a, lw, lh, lado, aire + (fijas[i]?.extra ?? 0));
        if (lado === "arriba" || lado === "abajo") {
          const nx = Math.max(borde, Math.min(w - lw - borde, x));
          if (!cruza(cajaEtiqueta(nx, y, lw, lh), a, 0)) x = nx;
        }
        y = Math.max(minY + lh / 2, Math.min(maxY - lh / 2, y));
        x = Math.max(borde, Math.min(w - lw - borde, x));
        el.classList.toggle("is-izq", lado === "izq");
        const local = smooth(0, 1, Math.min(1, Math.max(0, vis * 1.25 - i * 0.04)));
        el.style.opacity = (a.visible ? local : 0).toFixed(3);
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translateY(-50%)`;
      });
    };

    // La escena (three.js) se baja y se arma cuando la sección se acerca; lejos, se pausa.
    const io = new IntersectionObserver(
      ([e]) => {
        const cerca = !!e?.isIntersecting;
        if (motor) {
          motor.pausar(!cerca);
          return;
        }
        if (!cerca || cargando) return;
        cargando = true;
        void import("./motor/escena").then(({ montarMotor }) => {
          if (!vivo) return;
          motor = montarMotor(host, sec, alCuadro);
        });
      },
      { rootMargin: "60% 0px" },
    );
    io.observe(sec);

    return () => {
      vivo = false;
      io.disconnect();
      motor?.desmontar();
    };
  }, []);

  return (
    <section ref={seccion} id="motor" className="ov-motor" aria-labelledby="ov-motor-titulo">
      <div ref={pantalla} className="ov-motor__pantalla">
        <div ref={lienzo} className="ov-motor__lienzo" aria-hidden />

        <div className="ov-motor__texto">
          <Mono>{MOTOR.antetitulo}</Mono>
          <h2 id="ov-motor-titulo" className="ov-motor__h2">
            {MOTOR.titulo.map((linea) => (
              <span key={linea}>{linea}</span>
            ))}
          </h2>
          <p className="ov-motor__lede">{MOTOR.bajada}</p>
          <p className="ov-motor__pie" aria-hidden>
            <span>Pieza</span> <span ref={contador}>01</span> <span>/ {String(MOTOR.piezas.length).padStart(2, "0")}</span>
            <i />
            <span>{MOTOR.pie}</span>
          </p>
          {/* En el celular los nombres de las piezas van acá, en una lista que aparece al abrirse. */}
          <ul ref={lista} className="ov-motor__lista">
            {MOTOR.piezas.map((pz, i) => (
              <li key={pz.id} style={{ "--d": `${i * 0.055}s` } as CSSProperties}>
                <i />
                {pz.nombre}
              </li>
            ))}
          </ul>
        </div>

        <ul className="ov-motor__etiquetas" aria-label="Las piezas del sistema">
          {MOTOR.piezas.map((pz, i) => (
            <li key={pz.id}>
              <div
                ref={(el) => {
                  etiquetas.current[i] = el;
                }}
                className="ov-motor__etiqueta"
              >
                <span className="ov-motor__pastilla">
                  <i />
                  <b>{pz.nombre}</b>
                  <span className="sr-only">: {pz.detalle}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}

function smooth(a: number, b: number, v: number) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
