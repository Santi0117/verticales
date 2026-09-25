"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import Glyph from "./Glyph";
import { Check, Flecha, Mono } from "./ui";
import { industrias, tinte, type Industria } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;

function Fila({
  v,
  abierta,
  alAlternar,
  alActivar,
}: {
  v: Industria;
  abierta: boolean;
  alAlternar: () => void;
  alActivar: (id: string) => void;
}) {
  const panel = `ov-det-${v.id}`;
  return (
    <article id={v.id} className="ov-det__fila" data-abierta={abierta ? "true" : "false"} style={tinte(v)}>
      <h3 className="ov-det__h3">
        <button type="button" aria-expanded={abierta} aria-controls={panel} onClick={alAlternar}>
          <span className="ov-det__num" aria-hidden>
            {v.codigo}
          </span>
          <span className="ov-det__nombre">
            {v.nombre}
            <span className="ov-det__flecha" aria-hidden>
              <Flecha dir="diagonal" className="h-[0.42em] w-[0.42em]" />
            </span>
          </span>
          <span className="ov-det__sub">{v.subtitulo}</span>
          <span className="ov-det__estado" aria-hidden>
            <i />
            {v.disponible ? "Lista" : "Pronto"}
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {abierta ? (
          <motion.div
            id={panel}
            key="panel"
            className="ov-det__panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="ov-det__cuerpo">
              <p className="ov-det__pitch">{v.pitch}</p>
              <div className="ov-det__columnas">
                <div>
                  <Mono className="ov-det__label">Cómo te ayuda Onvision</Mono>
                  <ul className="ov-det__ayuda">
                    {v.ayuda.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Mono className="ov-det__label">Módulos incluidos</Mono>
                  <ul className="ov-det__modulos">
                    {v.modulos.map((m) => (
                      <li key={m}>
                        <Check className="h-4 w-4" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="ov-det__lado">
                  <figure className="ov-det__captura">
                    <Image src={v.imagen} alt={v.alt} fill sizes="(min-width: 1024px) 380px, 90vw" className="object-cover object-left-top" />
                    <figcaption>
                      <Glyph id={v.id} className="h-4 w-4" />
                      {v.producto}
                    </figcaption>
                  </figure>
                  <button type="button" className="ov-pill ov-pill--sol" onClick={() => alActivar(v.id)}>
                    Activar esta vertical
                    <span className="ov-pill__circ">
                      <Flecha dir="diagonal" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

/**
 * "Detalle por industria" como "Proof, not promises" de jeffmilanes: el
 * número delineado, el nombre gigante y, al abrir, el pitch grande con las
 * columnas de lo que resuelve y lo que trae.
 */
export default function Detalle({ alActivar }: { alActivar: (id: string) => void }) {
  const [abierta, setAbierta] = useState<string | null>(industrias[0]!.id);

  // Los enlaces "#retail", "#clinicas"… de otras secciones abren su fila.
  useEffect(() => {
    const ids = new Set(industrias.map((v) => v.id));
    const alClic = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href^='#']");
      const id = a?.getAttribute("href")?.slice(1);
      if (id && ids.has(id)) setAbierta(id);
    };
    document.addEventListener("click", alClic);
    return () => document.removeEventListener("click", alClic);
  }, []);

  return (
    <section id="industrias" className="ov-det" aria-labelledby="ov-det-titulo">
      <div className="ov-det__head">
        <Mono>Verticales</Mono>
        <h2 id="ov-det-titulo" className="ov-det__h2">
          <span className="ov-det__h2-grande">Detalle por industria:</span>
          <em className="ov-det__h2-serif">cómo Onvision te ayuda de verdad</em>
        </h2>
        <p className="ov-det__lede">
          Cada vertical activa módulos sobre el mismo núcleo de facturación e inventario. Cambiá de
          giro sin migrar datos.
        </p>
      </div>

      <div className="ov-det__lista">
        {industrias.map((v) => (
          <Fila
            key={v.id}
            v={v}
            abierta={abierta === v.id}
            alAlternar={() => setAbierta((a) => (a === v.id ? null : v.id))}
            alActivar={alActivar}
          />
        ))}
      </div>
    </section>
  );
}
