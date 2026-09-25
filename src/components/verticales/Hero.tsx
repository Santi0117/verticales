"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from "motion/react";
import { Fragment, useEffect, useRef, useState, type PointerEvent } from "react";
import Ribbon from "./Ribbon";
import Streaks from "./Streaks";
import { Check, Esquinas, Flecha, Hud } from "./ui";
import {
  SIZES_CAPTURA,
  enProducto,
  formatCRC,
  industrias,
  industriasConImagen,
  listas,
  mediosDePago,
  plan,
  precioMensual,
  tinte,
} from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Lo que se le dice a quien vuelve del checkout sin haber terminado. */
const AVISOS: Record<string, { titulo: string; texto: string }> = {
  cancelado: {
    titulo: "Pago cancelado",
    texto: "Cancelaste el pago. Podés elegir de nuevo la industria e intentarlo.",
  },
  error: {
    titulo: "Pago sin confirmar",
    texto:
      "No pudimos confirmar el pago. Si te cobraron, escribinos a soporte con el correo que usaste en Onvo.",
  },
  pendiente: {
    titulo: "Pago sin confirmar",
    texto:
      "No pudimos confirmar el pago. Si te cobraron, escribinos a soporte con el correo que usaste en Onvo.",
  },
};

/** Cada palabra sube desde detrás de su propia máscara. */
function Palabras({ texto, retraso = 0 }: { texto: string; retraso?: number }) {
  const palabras = texto.split(" ");
  return (
    <>
      {palabras.map((p, i) => (
        <Fragment key={`${p}-${i}`}>
          <span className="ova-word">
            <motion.span
              className="inline-block"
              initial={{ y: "108%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.95, ease: EASE, delay: retraso + i * 0.07 }}
            >
              {p}
            </motion.span>
          </span>
          {/* El espacio va afuera: dentro de un inline-block se lo come el final de línea. */}
          {i < palabras.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/** Contador de avance en el riel derecho: SCROLL 000 → 100. */
function Contador() {
  const { scrollYProgress } = useScroll();
  const [valor, setValor] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = Math.round(v * 100);
    setValor((prev) => (prev === n ? prev : n));
  });
  return <>Scroll {String(valor).padStart(3, "0")}</>;
}

function Visual() {
  const ref = useRef<HTMLDivElement>(null);
  const enVista = useInView(ref, { amount: 0.25 });
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (!enVista) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const reloj = window.setInterval(
      () => setIndice((n) => (n + 1) % industriasConImagen.length),
      3400,
    );
    return () => window.clearInterval(reloj);
  }, [enVista]);

  // Paralaje: cada pieza se mueve a su propia profundidad.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18 });
  const sy = useSpring(my, { stiffness: 70, damping: 18 });
  // La ventana va girada solo en pantallas anchas; en el celular queda de frente.
  const giro = useMotionValue(0);
  useEffect(() => {
    const ancho = window.matchMedia("(min-width: 1024px)");
    const aplicar = () => giro.set(ancho.matches ? 1 : 0);
    aplicar();
    ancho.addEventListener("change", aplicar);
    return () => ancho.removeEventListener("change", aplicar);
  }, [giro]);
  const ventanaX = useTransform(sx, (v) => v * 8);
  const ventanaY = useTransform(sy, (v) => v * 6);
  const giroY = useTransform([sx, giro], ([v, g]) => (g as number) * (-9 + (v as number) * 3));
  const giroX = useTransform([sy, giro], ([v, g]) => (g as number) * (4 - (v as number) * 2));
  const precioX = useTransform(sx, (v) => v * -20);
  const precioY = useTransform(sy, (v) => v * -14);
  const pagoX = useTransform(sx, (v) => v * 18);
  const pagoY = useTransform(sy, (v) => v * 12);
  const cuentaX = useTransform(sx, (v) => v * 26);
  const cuentaY = useTransform(sy, (v) => v * -18);

  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const soltar = () => {
    mx.set(0);
    my.set(0);
  };

  const v = industriasConImagen[indice]!;
  const total = String(industriasConImagen.length).padStart(2, "0");

  return (
    <div ref={ref} className="ova-visual" onPointerMove={mover} onPointerLeave={soltar}>
      <motion.div
        className="ova-visual__window"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
      >
        <motion.div
          className="ova-window"
          style={{ x: ventanaX, y: ventanaY, rotateY: giroY, rotateX: giroX, ...tinte(v) } as MotionStyle}
        >
          <div className="ova-window__bar">
            <span className="ova-dots3" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <span className="ova-mono truncate">{v.producto}</span>
            <span className="ova-mono ml-auto opacity-60">V.{v.codigo}</span>
          </div>
          <div className="ova-window__screen">
            <AnimatePresence initial={false}>
              <motion.div
                key={v.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.035 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <Image
                  src={v.imagen}
                  alt={v.alt}
                  fill
                  sizes={SIZES_CAPTURA}
                  className="object-cover object-left-top"
                  {...(indice === 0 ? { loading: "eager", fetchPriority: "high" } : {})}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="ova-window__foot">
            <span className="ova-mono">
              {v.codigo} / {total}
            </span>
            <span className="ova-ticks" aria-hidden>
              {industriasConImagen.map((x, k) => (
                <i key={x.id} data-on={k === indice ? "true" : "false"} />
              ))}
            </span>
            <span className="ova-mono hidden truncate sm:inline">{v.nombre}</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="ova-visual__price"
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.75 }}
      >
        <motion.div style={{ x: precioX, y: precioY }}>
          <div className="ova-card ova-card--precio ova-float">
            <p className="ova-mono ova-card__label">{plan.name}</p>
            <p className="ova-card__big">
              {formatCRC(plan.monthly)}
              <span>/mes</span>
            </p>
            <p className="ova-card__small">{plan.badge} · todas las industrias</p>
            <ul className="ova-card__list">
              {plan.features.slice(0, 3).map((f) => (
                <li key={f}>
                  <Check className="h-3.5 w-3.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="ova-visual__pay"
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.95 }}
      >
        <motion.div style={{ x: pagoX, y: pagoY }}>
          <div className="ova-card ova-card--pago ova-float ova-float--lento">
            <p className="ova-mono ova-card__label">Checkout · Onvo</p>
            <div className="ova-card__chips">
              {mediosDePago.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
            <p className="ova-card__small">Colones (CRC) · suscripción con tarjeta</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="ova-visual__count"
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 1.1 }}
      >
        <motion.div style={{ x: cuentaX, y: cuentaY }}>
          <div className="ova-card ova-card--cuenta ova-float ova-float--corto">
            <p className="ova-card__big">
              {listas}
              <span>/{industrias.length}</span>
            </p>
            <p className="ova-mono ova-card__label">industrias listas</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Hero({
  pagoEstado,
  alElegir,
}: {
  pagoEstado: string | null;
  alElegir: () => void;
}) {
  const aviso = pagoEstado ? AVISOS[pagoEstado] : undefined;

  return (
    <section className="ova-slab ova-hero" aria-labelledby="ova-hero-titulo">
      <div className="ova-notch" aria-hidden />
      <div className="ova-fx" aria-hidden>
        <div className="ova-glow" />
        <div className="ova-hatch" />
        <div className="ova-grid-dots" />
        <Streaks className="absolute inset-0 h-full w-full" />
        <Esquinas />
      </div>
      <p className="ova-rail ova-rail--izq" aria-hidden>
        Onvision // Sistema · Costa Rica
      </p>
      <p className="ova-rail ova-rail--der" aria-hidden>
        <Contador />
      </p>

      <div className="ova-hero__inner">
        {aviso ? (
          <motion.div
            role="status"
            className="ova-aviso"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="ova-mono ova-aviso__titulo">▲ {aviso.titulo}</span>
            <p>{aviso.texto}</p>
          </motion.div>
        ) : null}

        <div className="ova-hero__grid">
          <div className="ova-hero__copy">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <Hud>Activación · Sistema Onvision</Hud>
            </motion.div>

            <h1 id="ova-hero-titulo" className="ova-h1">
              <span className="block">
                <Palabras texto="Activá el software" retraso={0.1} />
              </span>
              <em className="block">
                <Palabras texto="de tu industria." retraso={0.36} />
              </em>
            </h1>

            <motion.p
              className="ova-lead"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
            >
              Elegí tu industria, pagá <span className="ova-pill">{precioMensual}</span> con
              tarjeta y creás tu cuenta.
            </motion.p>

            <motion.div
              className="ova-hero__ctas"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.85 }}
            >
              <button type="button" onClick={alElegir} className="ova-btn ova-btn--claro">
                Elegí tu industria
                <span className="ova-btn__circle">
                  <Flecha dir="abajo" />
                </span>
              </button>
              <a href={enProducto("#como-funciona")} className="ova-btn ova-btn--fantasma">
                Cómo funciona
              </a>
            </motion.div>

            <motion.ul
              className="ova-meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              <li>
                {listas} de {industrias.length} industrias listas
              </li>
              <li aria-hidden>/</li>
              <li>{precioMensual}</li>
              <li aria-hidden>/</li>
              <li>Hecho en Costa Rica</li>
            </motion.ul>
          </div>

          <Visual />
        </div>
      </div>

      <div className="ova-hero__cinta">
        <div className="hidden md:block">
          <Ribbon variante="ancho" />
        </div>
        <div className="md:hidden">
          <Ribbon variante="angosto" />
        </div>
      </div>
    </section>
  );
}
