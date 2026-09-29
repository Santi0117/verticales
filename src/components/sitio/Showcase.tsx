"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Glyph from "./Glyph";
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

/**
 * En el celular, una industria a la vez y con su color: se cambia tocando la
 * fila de arriba, con las flechas o deslizando la tarjeta de lado. Solo lo
 * esencial: su pantalla, una línea y tres cosas que trae.
 */
function Movil({ alActivar }: { alActivar: (id: string) => void }) {
  const [k, setK] = useState(0);
  const [dir, setDir] = useState(1);
  const fila = useRef<HTMLDivElement>(null);
  const toque = useRef<{ x: number; y: number } | null>(null);
  const x = escenas[k]!;

  const ir = (n: number, d: number) => {
    setDir(d);
    setK((n + N) % N);
  };

  // La fila acompaña: la industria elegida queda a la vista (sin mover la página).
  useEffect(() => {
    const el = fila.current;
    const chip = el?.children[k] as HTMLElement | undefined;
    if (!el || !chip) return;
    el.scrollTo({ left: chip.offsetLeft - (el.clientWidth - chip.offsetWidth) / 2, behavior: "smooth" });
  }, [k]);

  const alApoyar = (e: PointerEvent) => {
    toque.current = { x: e.clientX, y: e.clientY };
  };
  const alSoltar = (e: PointerEvent) => {
    const t = toque.current;
    toque.current = null;
    if (!t) return;
    const dx = e.clientX - t.x;
    const dy = e.clientY - t.y;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.4) ir(k + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  };

  return (
    <div className="ov-movil" style={tinte(x.industria)}>
      <div ref={fila} className="ov-movil__fila" role="group" aria-label="Elegí una industria">
        {escenas.map((e, n) => (
          <button
            key={e.id}
            type="button"
            className="ov-movil__chip"
            aria-pressed={n === k}
            style={tinte(e.industria)}
            onClick={() => ir(n, n > k ? 1 : -1)}
          >
            <Glyph id={e.id} className="h-4 w-4" />
            {e.name}
          </button>
        ))}
      </div>

      <article
        className="ov-movil__tarjeta"
        aria-label={`${pad(k + 1)} de ${pad(N)}: ${x.name}`}
        onPointerDown={alApoyar}
        onPointerUp={alSoltar}
        onPointerCancel={() => (toque.current = null)}
      >
        <div className="ov-movil__cabeza">
          <p className="ov-mono">
            <b>{pad(k + 1)}</b> / {pad(N)} · {x.detail}
          </p>
          <span className="ov-movil__flechas">
            <button type="button" aria-label="Industria anterior" onClick={() => ir(k - 1, -1)}>
              <Flecha dir="izquierda" />
            </button>
            <button type="button" aria-label="Industria siguiente" onClick={() => ir(k + 1, 1)}>
              <Flecha />
            </button>
          </span>
        </div>

        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={x.id}
            className="ov-movil__cuerpo"
            custom={dir}
            initial={{ opacity: 0, x: 40 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 * dir }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <p className="ov-movil__nombre" style={{ "--len": x.name.length } as CSSProperties}>
              {x.name}
            </p>
            <div className="ov-movil__pantalla">
              <Image src={x.industria.imagen} alt={x.industria.alt} fill sizes="88vw" className="object-cover object-left-top" />
            </div>
            <p className="ov-movil__body">{x.panelBody}</p>
            <ul className="ov-movil__specs">
              {lineas(x)
                .slice(0, 3)
                .map((l, n) => (
                  <li key={l.titulo} style={{ "--n": n } as CSSProperties}>
                    {l.titulo}
                  </li>
                ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        <div className="ov-movil__acciones">
          <button type="button" className="ov-pill ov-pill--blanca" onClick={() => alActivar(x.id)}>
            Activar esta vertical
            <span className="ov-pill__circ">
              <Flecha dir="diagonal" />
            </span>
          </button>
          <a href={`#${x.id}`} className="ov-show__detalle">
            Ver detalle
            <Flecha className="h-3.5 w-3.5" />
          </a>
        </div>

        <p className="ov-movil__puntos" aria-hidden>
          {escenas.map((e, n) => (
            <i key={e.id} data-on={n === k ? "true" : undefined} />
          ))}
        </p>
      </article>
    </div>
  );
}

const TITULO = "Todo su negocio centralizado según su industria";
const LEDE = "POS, inventario, caja y facturación electrónica — adaptado a tu giro, en una sola cuenta.";

/**
 * "Por industria" como el "Across industries" de jeffmilanes: escena fija en
 * negro; al bajar cambia el nombre gigante y su pantalla real, que va en un
 * panel de HUD. En el celular, una industria a la vez (ver Movil).
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
        <Movil alActivar={alActivar} />
      </div>
    </section>
  );
}
