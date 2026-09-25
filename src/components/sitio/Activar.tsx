"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Ref } from "react";
import Glyph from "./Glyph";
import { Check, Esquinas, Flecha, Mono, Tag } from "./ui";
import {
  formatCRC,
  industrias,
  listas,
  mediosDePago,
  plan,
  precioMensual,
  tinte,
  type Industria,
} from "./data";

/** Lo que se le dice a quien vuelve del checkout sin haber terminado. */
const AVISOS: Record<string, { titulo: string; texto: string }> = {
  cancelado: {
    titulo: "Pago cancelado",
    texto: "Cancelaste el pago. Podés elegir de nuevo la industria e intentarlo.",
  },
  error: {
    titulo: "Pago sin confirmar",
    texto: "No pudimos confirmar el pago. Si te cobraron, escribinos a soporte con el correo que usaste en Onvo.",
  },
  pendiente: {
    titulo: "Pago sin confirmar",
    texto: "No pudimos confirmar el pago. Si te cobraron, escribinos a soporte con el correo que usaste en Onvo.",
  },
};

type Props = {
  seccionRef: Ref<HTMLElement>;
  seleccion: string | null;
  elegida: Industria | null;
  pagoEstado: string | null;
  pagando: boolean;
  error: string | null;
  alElegir: (id: string) => void;
  alPagar: () => void;
};

function Opcion({ v, on, alElegir }: { v: Industria; on: boolean; alElegir: (id: string) => void }) {
  return (
    <label className="ov-opcion" data-on={on ? "true" : "false"} style={tinte(v)}>
      <input
        type="radio"
        name="industria"
        value={v.id}
        checked={on}
        onChange={() => alElegir(v.id)}
        className="sr-only"
      />
      {on ? (
        <motion.span layoutId="ov-opcion-marco" className="ov-opcion__marco" transition={{ type: "spring", stiffness: 420, damping: 36 }}>
          <Esquinas />
        </motion.span>
      ) : null}
      <span className="ov-opcion__num">{v.codigo}</span>
      <span className="ov-opcion__ico">
        <Glyph id={v.id} className="h-5 w-5" />
      </span>
      <span className="ov-opcion__texto">
        <span className="ov-opcion__nombre">{v.nombre}</span>
        <span className="ov-opcion__sub">{v.subtitulo}</span>
      </span>
      <span className="ov-opcion__estado" aria-hidden>
        {on ? <Check className="h-4 w-4" /> : v.disponible ? "LISTA" : "PRONTO"}
      </span>
    </label>
  );
}

/**
 * Activar: el titular de contacto de jeffmilanes con la palabra tachada, los
 * dos pasos en paneles de HUD de sibaldesign y el botón gigante de clarvos.
 * Mismo flujo de siempre: elegir, pagar con Onvo, crear la cuenta.
 */
export default function Activar({
  seccionRef,
  seleccion,
  elegida,
  pagoEstado,
  pagando,
  error,
  alElegir,
  alPagar,
}: Props) {
  const aviso = pagoEstado ? AVISOS[pagoEstado] : undefined;
  const lista = Boolean(elegida?.disponible);

  return (
    <section id="activar" ref={seccionRef} className="ov-activar" aria-labelledby="ov-activar-titulo" style={tinte(elegida)}>
      <div className="ov-activar__head">
        <Mono>Activación</Mono>
        <h2 id="ov-activar-titulo" className="ov-activar__h2" aria-label="Activá el software de tu industria">
          <span aria-hidden>Activá el software de tu </span>
          <s aria-hidden>empresa</s>
          <span aria-hidden> industria.</span>
        </h2>
        <p className="ov-activar__lede">
          Elegí tu industria, pagá <b>{precioMensual}</b> con tarjeta y creás tu cuenta. Todas las
          industrias están listas para activar.
        </p>
      </div>

      {aviso ? (
        <div className="ov-aviso" role="status">
          <p className="ov-aviso__titulo">▲ {aviso.titulo}</p>
          <p>{aviso.texto}</p>
        </div>
      ) : null}

      <div className="ov-activar__grid">
        <fieldset id="ov-lista" className="ov-panel ov-activar__lista" tabIndex={-1}>
          <legend className="sr-only">Elegí tu industria</legend>
          <Tag derecha={`${listas} / ${industrias.length} LISTAS`}>PASO 01 · TU INDUSTRIA</Tag>
          <div className="ov-activar__opciones">
            {industrias.map((v) => (
              <Opcion key={v.id} v={v} on={v.id === seleccion} alElegir={alElegir} />
            ))}
          </div>
        </fieldset>

        <div className="ov-panel ov-activar__pago">
          <Tag derecha="CHECKOUT · ONVO">PASO 02 · PAGO</Tag>
          <div className="ov-activar__resumen" aria-live="polite">
            {elegida ? (
              <>
                <div className="ov-activar__pantalla">
                  <Image
                    key={elegida.id}
                    src={elegida.imagen}
                    alt={elegida.alt}
                    fill
                    sizes="(min-width: 1024px) 520px, 90vw"
                    className="object-cover object-left-top"
                  />
                  <Esquinas className="ov-activar__esquinas" />
                </div>
                <p className="ov-activar__sistema">{elegida.producto}</p>
              </>
            ) : (
              <p className="ov-activar__vacio">Elegí una industria</p>
            )}
          </div>

          <dl className="ov-recibo">
            <div>
              <dt>Industria</dt>
              <dd>{elegida?.nombre ?? "—"}</dd>
            </div>
            <div>
              <dt>Plan</dt>
              <dd>
                {plan.name} · {plan.badge}
              </dd>
            </div>
            <div>
              <dt>Precio</dt>
              <dd className="ov-recibo__precio">{precioMensual}</dd>
            </div>
            <div>
              <dt>Cobro</dt>
              <dd>Suscripción con tarjeta · colones (CRC)</dd>
            </div>
            <div>
              <dt>Medios</dt>
              <dd>{mediosDePago.join(" · ")}</dd>
            </div>
          </dl>

          <ul className="ov-recibo__incluye">
            {plan.features.map((f) => (
              <li key={f}>
                <Check className="h-3.5 w-3.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ov-activar__cta">
        {elegida && lista ? (
          <button
            id="ov-pagar"
            type="button"
            className="ov-gigante"
            onClick={alPagar}
            disabled={pagando}
            aria-describedby="ov-pago-nota"
          >
            <span className="ov-gigante__circ">
              {pagando ? <span className="ov-spinner" aria-hidden /> : <Flecha dir="diagonal" className="h-[42%] w-[42%]" />}
            </span>
            <span className="ov-gigante__texto">{pagando ? "Abriendo pago…" : `Pagar ${formatCRC(plan.monthly)}`}</span>
          </button>
        ) : elegida ? (
          <a href="#registro" className="ov-gigante ov-gigante--vacio">
            <span className="ov-gigante__circ">
              <Flecha className="h-[42%] w-[42%]" />
            </span>
            <span className="ov-gigante__texto">Unirme a la lista</span>
          </a>
        ) : (
          <button
            type="button"
            className="ov-gigante ov-gigante--vacio"
            onClick={() => document.getElementById("ov-lista")?.focus()}
          >
            <span className="ov-gigante__circ">
              <Flecha dir="arriba" className="h-[42%] w-[42%]" />
            </span>
            <span className="ov-gigante__texto">Elegí una industria</span>
          </button>
        )}

        <p id="ov-pago-nota" className="ov-activar__nota">
          {elegida && lista ? (
            <>
              Al pagar te llevamos al checkout de Onvo (Visa, Mastercard, Amex y SINPE). Cuando el cobro
              quede confirmado, creás tu cuenta en {elegida.nombre} y entrás con la suscripción activa.
            </>
          ) : elegida ? (
            <>{elegida.nombre} está casi listo — dejanos tu correo y te avisamos primero.</>
          ) : (
            <>El resumen aparece cuando elijas tu industria arriba.</>
          )}
        </p>
        {error ? (
          <p role="alert" className="ov-activar__error">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
