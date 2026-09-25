"use client";

import type { Ref } from "react";
import Glyph from "./Glyph";
import { Check, Encabezado, Esquinas, Flecha } from "./ui";
import {
  enProducto,
  formatCRC,
  industrias,
  mediosDePago,
  plan,
  precioMensual,
  tinte,
  type Industria,
} from "./data";

type Props = {
  seccionRef: Ref<HTMLElement>;
  elegida: Industria | null;
  pagando: boolean;
  error: string | null;
  alPagar: () => void;
  alCambiar: () => void;
};

/**
 * Paso 2. Un recibo que se va llenando con lo que se eligió y el botón grande
 * que abre el checkout de Onvo. Sin industria elegida, el botón lleva de
 * vuelta a la lista en vez de quedarse muerto.
 */
export default function Checkout({
  seccionRef,
  elegida,
  pagando,
  error,
  alPagar,
  alCambiar,
}: Props) {
  const lista = Boolean(elegida?.disponible);

  return (
    <section
      id="pago"
      ref={seccionRef}
      className="ova-slab ova-pago"
      aria-labelledby="ova-pago-titulo"
      style={tinte(elegida)}
    >
      <div className="ova-fx" aria-hidden>
        <div className="ova-glow ova-glow--acento" />
        <div className="ova-hatch" />
        <Esquinas />
      </div>

      <div className="ova-wrap relative">
        <Encabezado
          oscuro
          indice="02"
          id="ova-pago-titulo"
          titulo="Pago"
          derecha="Checkout · Onvo"
        />
        <p className="ova-pago__lema">
          <em>Suscripción con tarjeta,</em> en colones.
        </p>

        <div className="ova-pago__grid">
          <div className="ova-recibo">
            <div className="ova-recibo__head">
              <span>■ Orden · resumen</span>
              <span>{elegida ? `V.${elegida.codigo}` : "V.—"}</span>
            </div>

            <dl className="ova-recibo__filas">
              <div>
                <dt>Industria</dt>
                <dd>
                  {elegida ? (
                    <span className="ova-recibo__industria">
                      <span className="ova-recibo__ico">
                        <Glyph id={elegida.id} className="h-4 w-4" />
                      </span>
                      {elegida.nombre}
                    </span>
                  ) : (
                    <span className="ova-recibo__vacio">Elegí una industria arriba</span>
                  )}
                </dd>
                <dd className="ova-recibo__editar">
                  <button type="button" onClick={alCambiar}>
                    {elegida ? "Cambiar" : "Elegir"}
                  </button>
                </dd>
              </div>
              <div>
                <dt>Sistema</dt>
                <dd>{elegida?.producto ?? "—"}</dd>
              </div>
              <div>
                <dt>Plan</dt>
                <dd>
                  {plan.name} · {plan.badge}
                </dd>
              </div>
              <div>
                <dt>Precio</dt>
                <dd className="ova-recibo__precio">{precioMensual}</dd>
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

            <div className="ova-recibo__incluye">
              <p className="ova-mono">Incluye</p>
              <ul>
                {plan.features.map((f) => (
                  <li key={f}>
                    <Check className="h-3.5 w-3.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ova-pago__accion">
            <div className="ova-pago__eleccion" aria-live="polite">
              <p className="ova-mono">■ Tu sistema</p>
              {elegida ? (
                <>
                  <p className="ova-pago__nombre">
                    {elegida.producto.startsWith("Onvision ") ? (
                      <>
                        Onvision <em>{elegida.producto.slice("Onvision ".length)}</em>
                      </>
                    ) : (
                      elegida.producto
                    )}
                  </p>
                  <p className="ova-pago__sub">
                    {elegida.nombre} · {elegida.subtitulo}
                  </p>
                </>
              ) : (
                <>
                  <p className="ova-pago__nombre">
                    Todavía <em>sin elegir.</em>
                  </p>
                  <p className="ova-pago__sub">
                    Elegí una de las {industrias.length} industrias y el resumen se completa
                    solo.
                  </p>
                </>
              )}
            </div>

            {elegida && lista ? (
              <button
                id="ova-pagar"
                type="button"
                onClick={alPagar}
                disabled={pagando}
                aria-describedby="ova-pago-nota"
                className="ova-cta"
              >
                <span className="ova-cta__circulo">
                  {pagando ? <span className="ova-spinner" aria-hidden /> : <Flecha dir="diagonal" className="h-7 w-7" />}
                </span>
                <span className="ova-cta__texto">
                  {pagando ? (
                    "Abriendo pago…"
                  ) : (
                    <>
                      Pagar <span className="whitespace-nowrap">{formatCRC(plan.monthly)}</span>
                    </>
                  )}
                </span>
              </button>
            ) : elegida ? (
              <a href={enProducto("#registro")} className="ova-cta ova-cta--vacia">
                <span className="ova-cta__circulo">
                  <Flecha className="h-7 w-7" />
                </span>
                <span className="ova-cta__texto">Unirme a la lista</span>
              </a>
            ) : (
              <button type="button" onClick={alCambiar} className="ova-cta ova-cta--vacia">
                <span className="ova-cta__circulo">
                  <Flecha dir="arriba" className="h-7 w-7" />
                </span>
                <span className="ova-cta__texto">Elegí una industria</span>
              </button>
            )}

            <p id="ova-pago-nota" className="ova-pago__nota">
              {elegida && lista ? (
                <>
                  Al pagar te llevamos al checkout de Onvo (Visa, Mastercard, Amex y SINPE).
                  Cuando el cobro quede confirmado, creás tu cuenta en {elegida.nombre} y
                  entrás con la suscripción activa.
                </>
              ) : elegida ? (
                <>{elegida.nombre} está casi listo — dejanos tu correo y te avisamos primero.</>
              ) : (
                <>El resumen aparece cuando elijas tu industria arriba.</>
              )}
            </p>

            {error ? (
              <p role="alert" className="ova-pago__error">
                {error}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
