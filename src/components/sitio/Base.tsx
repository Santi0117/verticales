"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { appsIntro, baseFeatures } from "@/lib/content";
import { Mono } from "./ui";
import { industrias } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Las etapas: el núcleo pieza por pieza y al final, tu giro. */
const ETAPAS = [
  ...baseFeatures.map((f) => ({ nombre: f.name, frase: f.detail })),
  { nombre: "Tu giro", frase: "Encima se activan los módulos de tu industria." },
];
const FINAL = ETAPAS.length - 1;

type Nodo = { id: string; texto: string; x: number; y: number };
type Punto = { x: number; y: number };

/** Dónde va cada píldora, en un sistema 0–100 que se estira a la caja. */
type Plano = {
  empresa: Nodo[];
  nucleo: Nodo[];
  giro: Nodo[];
  hacienda: Nodo;
  filas: { texto: string; y: number }[];
  centroEmpresa: Punto;
  centroNucleo: Punto;
};

const TEXTO_EMPRESA = ["Web", "Celular", "POS"];
const TEXTO_NUCLEO = ["Facturación 4.4", "Inventario", "SINPE Móvil", "CRC / USD", "Reportes IVA"];
const HACIENDA = "Hacienda · TRIBU-CR";

function nodos(ids: string[], textos: string[], pos: Punto[]): Nodo[] {
  return textos.map((texto, k) => ({ id: ids[k]!, texto, ...pos[k]! }));
}

const ID_EMPRESA = ["web", "cel", "pos"];
const ID_NUCLEO = ["n0", "n1", "n2", "n3", "n4"];
const ID_GIRO = industrias.map((v) => v.id);
const TEXTO_GIRO = industrias.map((v) => v.corto);

/** Escritorio: filas a la izquierda y cinco giros por renglón. */
const ANCHO: Plano = {
  empresa: nodos(ID_EMPRESA, TEXTO_EMPRESA, [
    { x: 38, y: 8 },
    { x: 60, y: 8 },
    { x: 82, y: 8 },
  ]),
  nucleo: nodos(ID_NUCLEO, TEXTO_NUCLEO, [
    { x: 34, y: 27 },
    { x: 60, y: 27 },
    { x: 84, y: 27 },
    { x: 47, y: 38 },
    { x: 72, y: 38 },
  ]),
  giro: nodos(
    ID_GIRO,
    TEXTO_GIRO,
    ID_GIRO.map((_, k) => ({ x: [24, 40, 56, 72, 88][k % 5]!, y: k < 5 ? 58 : 69 })),
  ),
  hacienda: { id: "hac", texto: HACIENDA, x: 34, y: 90 },
  filas: [
    { texto: "Tu empresa", y: 8 },
    { texto: "Núcleo", y: 32.5 },
    { texto: "Tu giro", y: 63.5 },
    { texto: "Hacienda", y: 90 },
  ],
  centroEmpresa: { x: 60, y: 17 },
  centroNucleo: { x: 60, y: 48 },
};

/** Celular: los nombres de fila van arriba de cada grupo y los giros en cuatro renglones. */
const GIRO_ANGOSTO: Punto[] = [
  { x: 19, y: 59 },
  { x: 50, y: 59 },
  { x: 81, y: 59 },
  { x: 19, y: 66.5 },
  { x: 50, y: 66.5 },
  { x: 81, y: 66.5 },
  { x: 30, y: 74 },
  { x: 70, y: 74 },
  { x: 30, y: 81.5 },
  { x: 70, y: 81.5 },
];

const ANGOSTO: Plano = {
  empresa: nodos(ID_EMPRESA, TEXTO_EMPRESA, [
    { x: 20, y: 7 },
    { x: 50, y: 7 },
    { x: 80, y: 7 },
  ]),
  nucleo: nodos(ID_NUCLEO, TEXTO_NUCLEO, [
    { x: 28, y: 26 },
    { x: 72, y: 26 },
    { x: 17, y: 34 },
    { x: 50, y: 34 },
    { x: 83, y: 34 },
  ]),
  giro: nodos(ID_GIRO, TEXTO_GIRO, GIRO_ANGOSTO),
  hacienda: { id: "hac", texto: HACIENDA, x: 50, y: 95 },
  filas: [
    { texto: "Tu empresa", y: 0.5 },
    { texto: "Núcleo", y: 19.5 },
    { texto: "Tu giro", y: 52.5 },
    { texto: "Hacienda", y: 88.5 },
  ],
  centroEmpresa: { x: 50, y: 15 },
  centroNucleo: { x: 50, y: 44 },
};

/** Una curva vertical suave entre dos puntos, en el sistema 0–100. */
function curva(a: Punto, b: Punto) {
  const dy = (b.y - a.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
}

/** Cifras al fondo, como la lluvia de números de jeffmilanes. Fija, para que servidor y navegador coincidan. */
const MATRIZ = (() => {
  let s = 7;
  const azar = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: 26 }, () =>
    Array.from({ length: 34 }, () => Math.floor(azar() * 10)).join(" "),
  ).join("\n");
})();

function Pildora({ n, on, activa }: { n: Nodo; on: boolean; activa?: boolean }) {
  return (
    <span
      className="ov-dia__nodo"
      data-on={on ? "true" : "false"}
      data-activa={activa ? "true" : "false"}
      style={{ left: `${n.x}%`, top: `${n.y}%` }}
    >
      <i aria-hidden />
      {n.texto}
    </span>
  );
}

type Estado = {
  empresaOn: boolean;
  nucleoOn: (k: number) => boolean;
  giroOn: (k: number) => boolean;
  etapa: number;
  cuenta: number;
};

/** El diagrama con sus curvas; el mismo dibujo con dos planos (escritorio y celular). */
function Diagrama({ plano, estado, className }: { plano: Plano; estado: Estado; className: string }) {
  const { empresa, nucleo, giro, hacienda, filas, centroEmpresa, centroNucleo } = plano;
  const { empresaOn, nucleoOn, giroOn, etapa, cuenta } = estado;
  return (
    <div className={`ov-dia ${className}`} aria-hidden>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="ov-dia__lineas">
        {empresa.map((n) => (
          <path key={n.id} d={curva(n, centroEmpresa)} data-on={empresaOn ? "true" : "false"} />
        ))}
        {nucleo.map((n, k) => (
          <path key={n.id} d={curva(centroEmpresa, n)} data-on={nucleoOn(k) ? "true" : "false"} />
        ))}
        {nucleo.map((n, k) => (
          <path key={`${n.id}-b`} d={curva(n, centroNucleo)} data-on={nucleoOn(k) ? "true" : "false"} />
        ))}
        {giro.map((n, k) => (
          <path key={n.id} d={curva(centroNucleo, n)} data-on={giroOn(k) ? "true" : "false"} />
        ))}
        <path d={curva(nucleo[0]!, hacienda)} className="ov-dia__lateral" data-on={nucleoOn(0) ? "true" : "false"} />
      </svg>

      {filas.map((f) => (
        <span key={f.texto} className="ov-dia__fila" style={{ top: `${f.y}%` }}>
          {f.texto}
        </span>
      ))}
      {empresa.map((n) => (
        <Pildora key={n.id} n={n} on={empresaOn} />
      ))}
      {nucleo.map((n, k) => (
        <Pildora key={n.id} n={n} on={nucleoOn(k)} activa={etapa === k} />
      ))}
      {giro.map((n, k) => (
        <Pildora key={n.id} n={n} on={giroOn(k)} activa={cuenta === k + 1} />
      ))}
      <Pildora n={hacienda} on={nucleoOn(0)} />
    </div>
  );
}

/**
 * "Base común" como "The journey" de jeffmilanes: escena fija en negro, un
 * contador gigante que sube a 10 verticales mientras el diagrama se enciende
 * — tu empresa, el núcleo pieza por pieza, cada giro y Hacienda.
 */
export default function Base() {
  const pista = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pista, offset: ["start start", "end end"] });
  const [p, setP] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const q = Math.round(v * 200) / 200;
    setP((prev) => (prev === q ? prev : q));
  });

  const cuenta = Math.min(10, Math.floor(p * 11.6));
  const etapa = p >= 0.86 ? FINAL : Math.min(FINAL - 1, Math.floor((p / 0.86) * FINAL));
  const empresaOn = p > 0.02;
  const nucleoOn = (k: number) => empresaOn && etapa >= k;
  const giroOn = (k: number) => cuenta > k;
  const e = ETAPAS[etapa]!;
  const estado: Estado = { empresaOn, nucleoOn, giroOn, etapa, cuenta };

  return (
    <section id="modulos" className="ov-base" aria-labelledby="ov-base-titulo">
      <div className="ov-base__intro-movil">
        <Mono>Base común</Mono>
        <h2 className="ov-base__h2">{appsIntro.title}</h2>
      </div>

      <div ref={pista} className="ov-base__pista">
        <div className="ov-base__stage">
          <pre className="ov-base__matriz" aria-hidden>
            {MATRIZ}
          </pre>

          <div className="ov-base__izq">
            <div className="ov-base__intro">
              <Mono>Base común</Mono>
              <h2 id="ov-base-titulo" className="ov-base__h2">
                {appsIntro.title}
              </h2>
            </div>
            <p className="ov-base__num" aria-hidden>
              {cuenta}
            </p>
            <Mono className="ov-base__unidad">Verticales sobre el mismo núcleo</Mono>
            <div className="ov-base__etapa">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={e.nombre}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="ov-base__nombre">
                    <span aria-hidden>◇</span> {e.nombre}
                  </p>
                  <p className="ov-base__frase">{e.frase}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="ov-base__cuerpo">{appsIntro.body}</p>
          </div>

          <Diagrama plano={ANCHO} estado={estado} className="ov-dia--ancho" />
          <Diagrama plano={ANGOSTO} estado={estado} className="ov-dia--angosto" />
        </div>
      </div>

      <p className="ov-base__cuerpo-movil">{appsIntro.body}</p>
    </section>
  );
}
