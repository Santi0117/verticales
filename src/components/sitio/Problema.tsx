"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { problems } from "@/lib/content";
import { Check, Onda } from "./ui";
import { scrollA } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;
const N = problems.length;

/** Lo que alguien le escribiría a su contador hoy: el problema dicho en voz alta. */
const MENSAJES = [
  "Hacienda cambió el formato otra vez… ¿el sistema ya está al día con la 4.4?",
  "¿Cómo calculo el aguinaldo y la liquidación sin volver a pelear con Excel?",
  "Cobré en dólares y pagué en colones. ¿Cuánto me quedó al final del mes?",
  "Te pago por SINPE… ¿a qué número y cómo queda registrado?",
];

/** Fondos borrosos como las fotos en movimiento de wisprflow. */
const FONDOS = [
  "radial-gradient(circle at 28% 26%, #7ea7d6 0, transparent 42%), radial-gradient(circle at 72% 70%, #d69856 0, transparent 48%), linear-gradient(160deg, #2f2119 0%, #8a5a32 55%, #e2b983 100%)",
  "radial-gradient(circle at 40% 24%, #9cc6f0 0, transparent 46%), radial-gradient(circle at 58% 72%, #efe1cb 0, transparent 42%), linear-gradient(172deg, #4a80bb 0%, #a8744a 68%, #3a2416 100%)",
  "radial-gradient(circle at 30% 70%, #f2d49b 0, transparent 44%), radial-gradient(circle at 70% 30%, #5fb49a 0, transparent 40%), linear-gradient(160deg, #0d4a42 0%, #3c8a73 52%, #d3c58f 100%)",
  "radial-gradient(circle at 66% 28%, #f4b6d4 0, transparent 42%), radial-gradient(circle at 30% 74%, #f6c28f 0, transparent 44%), linear-gradient(165deg, #33265a 0%, #a85f8e 55%, #f2b98f 100%)",
];

function Tarjeta({ k, activa = true }: { k: number; activa?: boolean }) {
  return (
    <div className="ov-prob__tarjeta" style={{ "--fondo": FONDOS[k] } as CSSProperties}>
      <div className="ov-prob__foto" aria-hidden />
      <div className="ov-prob__composer" aria-hidden>
        <p className="ov-prob__mensaje" data-activa={activa ? "true" : "false"} key={k}>
          {MENSAJES[k]}
        </p>
        <div className="ov-prob__barra">
          <span>+</span>
          <span>Aa</span>
          <span>☺</span>
          <span>···</span>
          <span className="ov-prob__enviar">➤</span>
        </div>
      </div>
      <div className="ov-prob__capsula" aria-hidden>
        <span className="ov-prob__x">×</span>
        <Onda barras={9} />
        <span className="ov-prob__ok">
          <Check className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

/**
 * "El problema" como las funciones de wisprflow: lista con la barra coral a
 * la izquierda, la tarjeta en el medio con el mensaje que se escribe y la
 * cápsula de voz, y el título en serif a la derecha.
 */
export default function Problema() {
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

  const actual = problems[i]!;

  return (
    <section id="problema" className="ov-prob" aria-labelledby="ov-prob-titulo">
      <div className="ov-prob__head">
        <p className="ov-eyebrow">El problema</p>
        <h2 id="ov-prob-titulo" className="ov-serif-h2">
          Los softwares actuales <em>no están pensados para Costa Rica</em>
        </h2>
        <p className="ov-lede">
          El mercado pelea por facturación barata. Nadie ofrece verticales configurables donde el
          mismo núcleo se convierte en un SaaS distinto según la industria.
        </p>
      </div>

      <div ref={pista} className="ov-prob__pista">
        <div className="ov-prob__stage">
          <svg className="ov-prob__trazo" viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden>
            <path d="M -60 640 C 240 520, 420 820, 700 640 S 1010 150, 1240 250 S 1500 520, 1520 420" />
          </svg>

          <ol className="ov-prob__lista">
            {problems.map((p, k) => (
              <li key={p.title}>
                <button type="button" data-on={k === i ? "true" : "false"} onClick={() => ir(k)}>
                  {p.title}
                </button>
              </li>
            ))}
          </ol>

          <div className="ov-prob__centro">
            <AnimatePresence initial={false}>
              <motion.div
                key={i}
                className="ov-prob__capa"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <Tarjeta k={i} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="ov-prob__texto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={actual.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <p className="ov-prob__num">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="ov-prob__titulo">{actual.title}</h3>
                <p className="ov-prob__desc">{actual.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ol className="ov-prob__movil">
        {problems.map((p, k) => (
          <li key={p.title}>
            <Tarjeta k={k} />
            <p className="ov-prob__num">{String(k + 1).padStart(2, "0")}</p>
            <h3 className="ov-prob__titulo">{p.title}</h3>
            <p className="ov-prob__desc">{p.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
