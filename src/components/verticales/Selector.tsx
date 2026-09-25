"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Glyph from "./Glyph";
import { Check, Encabezado, Esquinas, Flecha } from "./ui";
import {
  SIZES_CAPTURA,
  enProducto,
  industriaPorId,
  industrias,
  industriasConImagen,
  listas,
  precioMensual,
  tinte,
  type Industria,
} from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  seleccion: string | null;
  alElegir: (id: string) => void;
  alContinuar: () => void;
};

function Fila({
  v,
  elegida,
  alElegir,
  alVer,
  alContinuar,
}: {
  v: Industria;
  elegida: boolean;
  alElegir: (id: string) => void;
  alVer: (id: string) => void;
  alContinuar: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const elegir = () => {
    alElegir(v.id);
    // En el celular el detalle se abre debajo de la fila: la llevamos arriba.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          ref.current?.scrollIntoView({ behavior: quieto ? "auto" : "smooth", block: "start" }),
        ),
      );
    }
  };

  return (
    <div ref={ref} className="ova-rowwrap" data-on={elegida ? "true" : "false"} style={tinte(v)}>
      <label className="ova-row" data-on={elegida ? "true" : "false"} onMouseEnter={() => alVer(v.id)}>
        <input
          type="radio"
          name="industria"
          value={v.id}
          checked={elegida}
          onChange={elegir}
          className="sr-only"
        />
        {elegida ? (
          <>
            <motion.span
              layoutId="ova-reticula"
              className="ova-reticula"
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
            >
              <Esquinas />
            </motion.span>
            <motion.span
              layoutId="ova-barra"
              className="ova-row__bar"
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
            />
          </>
        ) : null}
        <span className="ova-row__code">{v.codigo}</span>
        <span className="ova-row__ico">
          <Glyph id={v.id} className="h-[22px] w-[22px]" />
        </span>
        <span className="ova-row__text">
          <span className="ova-row__name">{v.nombre}</span>
          <span className="ova-row__sub">{v.subtitulo}</span>
        </span>
        <span className="ova-row__go" aria-hidden>
          {!v.disponible ? (
            <span className="ova-mono">Pronto</span>
          ) : elegida ? (
            <Check />
          ) : (
            <Flecha />
          )}
        </span>
      </label>

      <AnimatePresence initial={false}>
        {elegida ? (
          <motion.div
            key="detalle"
            className="ova-row__detalle"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0 } }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="ova-movil">
              {v.imagen ? (
                <div className="ova-movil__screen">
                  <Image
                    src={v.imagen}
                    alt={v.alt}
                    fill
                    sizes={SIZES_CAPTURA}
                    className="object-cover object-left-top"
                  />
                </div>
              ) : null}
              <p className="ova-movil__pitch">{v.pitch}</p>
              <p className="ova-mono ova-movil__label">Módulos incluidos</p>
              <ul className="ova-chips">
                {v.modulos.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
              {v.disponible ? (
                <button type="button" className="ova-accion" onClick={alContinuar}>
                  Continuar al pago
                  <Flecha dir="abajo" />
                </button>
              ) : (
                <a href={enProducto("#registro")} className="ova-accion">
                  Unirme a la lista
                  <Flecha />
                </a>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Ficha({
  v,
  elegida,
  alElegir,
  alContinuar,
}: {
  v: Industria;
  elegida: boolean;
  alElegir: (id: string) => void;
  alContinuar: () => void;
}) {
  return (
    <>
      <h3 className="ova-panel__name">{v.nombre}</h3>
      <p className="ova-panel__sub">{v.subtitulo}</p>
      <p className="ova-panel__pitch">{v.pitch}</p>
      <p className="ova-mono ova-panel__label">Módulos incluidos</p>
      <ul className="ova-chips">
        {v.modulos.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <div className="ova-panel__actions">
        <p className="ova-panel__precio">
          {precioMensual}
          <span className="ova-mono">Plan único</span>
        </p>
        {!v.disponible ? (
          <a href={enProducto("#registro")} className="ova-accion ova-accion--sec">
            Unirme a la lista
            <Flecha />
          </a>
        ) : elegida ? (
          <button type="button" className="ova-accion" onClick={alContinuar}>
            Continuar al pago
            <Flecha dir="abajo" />
          </button>
        ) : (
          <button type="button" className="ova-accion ova-accion--sec" onClick={() => alElegir(v.id)}>
            Elegir esta industria
            <Flecha />
          </button>
        )}
      </div>
    </>
  );
}

function Panel({
  activa,
  seleccion,
  alElegir,
  alContinuar,
}: {
  activa: Industria | null;
  seleccion: string | null;
  alElegir: (id: string) => void;
  alContinuar: () => void;
}) {
  const estado = !activa ? "espera" : activa.id === seleccion ? "elegida" : "vista";

  return (
    <div className="ova-panel" style={tinte(activa)}>
      <div className="ova-panel__head">
        <span className="min-w-0 truncate">
          ■{" "}
          {activa ? (
            <>
              V.{activa.codigo} · <b>{activa.producto}</b>
            </>
          ) : (
            <>
              Sistema · <b>esperando selección</b>
            </>
          )}
        </span>
        <span className="ova-panel__status" data-estado={estado}>
          <i aria-hidden />
          {estado === "elegida" ? "Seleccionada" : estado === "vista" ? "Vista previa" : "En espera"}
        </span>
      </div>

      <div className="ova-panel__body">
        <div className="ova-screen">
          {/* Las diez apiladas: cambiar de industria no espera a que cargue nada. */}
          {industriasConImagen.map((x) => {
            const on = activa?.id === x.id;
            return (
              <span key={x.id} className="ova-screen__img" data-on={on ? "true" : "false"} aria-hidden={!on}>
                <Image
                  src={x.imagen}
                  alt={on ? x.alt : ""}
                  fill
                  sizes={SIZES_CAPTURA}
                  className="object-cover object-left-top"
                />
              </span>
            );
          })}
          {activa ? null : (
            <div className="ova-mosaico" aria-hidden>
              {industriasConImagen.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  tabIndex={-1}
                  className="ova-tile"
                  style={tinte(x)}
                  onClick={() => alElegir(x.id)}
                >
                  <span className="ova-tile__img">
                    <Image
                      src={x.imagen}
                      alt=""
                      fill
                      sizes={SIZES_CAPTURA}
                      className="object-cover object-left-top"
                    />
                  </span>
                  <span className="ova-tile__label">
                    <span className="ova-mono">{x.codigo}</span>
                    {x.nombre}
                  </span>
                </button>
              ))}
            </div>
          )}
          <Esquinas className="ova-screen__corners" />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activa?.id ?? "espera"}
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {activa ? (
              <Ficha
                v={activa}
                elegida={estado === "elegida"}
                alElegir={alElegir}
                alContinuar={alContinuar}
              />
            ) : (
              <>
                <h3 className="ova-panel__name">
                  {industrias.length} sistemas. <em>Un solo núcleo.</em>
                </h3>
                <p className="ova-panel__pitch">
                  Cada vertical activa módulos sobre el mismo núcleo de facturación e
                  inventario. Pasá el cursor por la lista para ver cada sistema, o elegí
                  uno.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Paso 1. A la izquierda la lista (un grupo de radios de verdad: flechas y
 * tabulador funcionan solos); a la derecha, en escritorio, el panel con la
 * pantalla real de cada sistema. Pasar el cursor muestra una vista previa;
 * elegir la fija. En el celular el detalle se abre debajo de la fila.
 */
export default function Selector({ seleccion, alElegir, alContinuar }: Props) {
  const [vista, setVista] = useState<string | null>(null);
  const salida = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(salida.current), []);

  const ver = (id: string) => {
    window.clearTimeout(salida.current);
    setVista(id);
  };
  // Se espera un poco: así da tiempo de cruzar de la lista al panel.
  const soltar = () => {
    window.clearTimeout(salida.current);
    salida.current = window.setTimeout(() => setVista(null), 420);
  };
  const retener = () => window.clearTimeout(salida.current);

  const elegir = (id: string) => {
    setVista(null);
    alElegir(id);
  };

  const activa = industriaPorId(vista ?? seleccion);

  return (
    <section id="industria" className="ova-sec ova-selector" aria-labelledby="ova-industria-titulo">
      <div className="ova-wrap">
        <Encabezado
          indice="01"
          id="ova-industria-titulo"
          titulo={
            <>
              Tu <em>industria</em>
            </>
          }
          derecha={
            <>
              <i className="ova-dot" aria-hidden />
              {listas} / {industrias.length} listas para activar
            </>
          }
        />

        <div className="ova-sel">
          <fieldset className="ova-list" onMouseLeave={soltar}>
            <legend className="sr-only">Elegí tu industria</legend>
            {industrias.map((v) => (
              <Fila
                key={v.id}
                v={v}
                elegida={v.id === seleccion}
                alElegir={elegir}
                alVer={ver}
                alContinuar={alContinuar}
              />
            ))}
          </fieldset>

          <div className="ova-sel__panel" onMouseEnter={retener} onMouseLeave={soltar}>
            <Panel activa={activa} seleccion={seleccion} alElegir={elegir} alContinuar={alContinuar} />
          </div>
        </div>
      </div>
    </section>
  );
}
