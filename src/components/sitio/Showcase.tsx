"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { Esquinas, Flecha, Mono, Tag } from "./ui";
import { SIZES_CAPTURA, escenas, scrollA, tinte, type Escena } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;
const N = escenas.length;
const pad = (n: number) => String(n).padStart(2, "0");

/** Lo que trae cada industria: sus specs si las tiene, si no sus módulos. */
function lineas(e: Escena) {
  return e.specs.length
    ? e.specs.map((s) => ({ titulo: s.title, texto: s.description }))
    : e.industria.modulos.map((m) => ({ titulo: m, texto: "" }));
}

function Onvi({ e }: { e: Escena }) {
  return (
    <p className="ov-show__onvi">
      <span aria-hidden>◈</span>
      <b>{e.highlight?.title ?? "ONVI"}</b>
      {e.highlight?.description ?? "Tu agente de IA personal para mejorar tu negocio"}
    </p>
  );
}

const TITULO = "Todo su negocio centralizado según su industria";
const LEDE = "POS, inventario, caja y facturación electrónica — adaptado a tu giro, en una sola cuenta.";

/**
 * "Por industria" como el "Across industries" de jeffmilanes: escena fija en
 * negro; al bajar cambia el nombre gigante y su pantalla real, que va en un
 * panel de HUD. En el celular es un carrusel que se desliza.
 */
export default function Showcase({ alActivar }: { alActivar: (id: string) => void }) {
  const pista = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pista, offset: ["start start", "end end"] });
  const [i, setI] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const n = Math.min(N - 1, Math.max(0, Math.floor(p * N)));
    setI((prev) => (prev === n ? prev : n));
  });

  const ir = (k: number) => {
    const el = pista.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const recorrido = el.offsetHeight - window.innerHeight;
    scrollA(top + recorrido * ((k + 0.5) / N));
  };

  const e = escenas[i]!;
  const v = e.industria;

  return (
    <section id="industrias-imagenes" className="ov-show" aria-label="Por industria">
      <div ref={pista} className="ov-show__pista" style={{ "--n": N } as CSSProperties}>
        <div className="ov-show__stage" style={tinte(v)}>
          <div className="ov-show__izq">
            <Mono>Por industria · Software para tu giro</Mono>
            <h2 className="ov-show__h2">{TITULO}.</h2>
            <p className="ov-show__lede">{LEDE}</p>

            <div className="ov-show__actual">
              <p className="ov-show__nombre" style={{ "--len": e.name.length } as CSSProperties}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={e.id}
                    className="inline-block"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-60%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    {e.name}
                  </motion.span>
                </AnimatePresence>
              </p>
              <p className="ov-show__meta">
                <span>
                  {pad(i + 1)} / {pad(N)}
                </span>
                <span>{e.detail}</span>
              </p>
              <p className="ov-show__body">{e.panelBody}</p>
              <div className="ov-show__acciones">
                <button type="button" className="ov-pill ov-pill--blanca" onClick={() => alActivar(e.id)}>
                  Activar esta vertical
                  <span className="ov-pill__circ">
                    <Flecha dir="diagonal" />
                  </span>
                </button>
                <a href={`#${e.id}`} className="ov-show__detalle">
                  Ver detalle
                  <Flecha className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="ov-show__der">
            <div className="ov-panel ov-show__panel">
              <Tag derecha={`${pad(i + 1)} / ${pad(N)}`}>{v.producto}</Tag>
              <div className="ov-show__pantalla">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={e.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <Image src={v.imagen} alt={v.alt} fill sizes={SIZES_CAPTURA} className="object-cover object-left-top" />
                  </motion.div>
                </AnimatePresence>
                <Esquinas className="ov-show__esquinas" />
              </div>
              <ul className="ov-terminal">
                {lineas(e).map((l) => (
                  <li key={l.titulo}>
                    <span aria-hidden>›</span>
                    <b>{l.titulo}</b>
                    {l.texto ? <em>{l.texto}</em> : null}
                  </li>
                ))}
              </ul>
              <Onvi e={e} />
            </div>

            <div className="ov-show__indices" role="group" aria-label="Ir a una industria">
              {escenas.map((x, k) => (
                <button
                  key={x.id}
                  type="button"
                  aria-label={x.name}
                  aria-current={k === i ? "true" : undefined}
                  onClick={() => ir(k)}
                >
                  {pad(k + 1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ov-show__movil">
        <div className="ov-show__movil-head">
          <Mono>Por industria · Software para tu giro</Mono>
          <h2 className="ov-show__h2">{TITULO}.</h2>
          <p className="ov-show__lede">{LEDE}</p>
        </div>
        <ul className="ov-show__carrusel">
          {escenas.map((x, k) => (
            <li key={x.id} className="ov-show__tarjeta" style={tinte(x.industria)}>
              <p className="ov-show__meta">
                <span>
                  {pad(k + 1)} / {pad(N)}
                </span>
                <span>{x.detail}</span>
              </p>
              <p className="ov-show__nombre" style={{ "--len": x.name.length } as CSSProperties}>
                {x.name}
              </p>
              <div className="ov-show__pantalla">
                <Image src={x.industria.imagen} alt={x.industria.alt} fill sizes="88vw" className="object-cover object-left-top" />
              </div>
              <p className="ov-show__body">{x.panelBody}</p>
              <ul className="ov-terminal">
                {lineas(x).map((l) => (
                  <li key={l.titulo}>
                    <span aria-hidden>›</span>
                    <b>{l.titulo}</b>
                  </li>
                ))}
              </ul>
              <Onvi e={x} />
              <button type="button" className="ov-pill ov-pill--blanca" onClick={() => alActivar(x.id)}>
                Activar esta vertical
                <span className="ov-pill__circ">
                  <Flecha dir="diagonal" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
