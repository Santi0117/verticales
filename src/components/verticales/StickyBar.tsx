"use client";

import { AnimatePresence, motion } from "motion/react";
import Glyph from "./Glyph";
import { Flecha } from "./ui";
import { precioMensual, tinte, type Industria } from "./data";

/**
 * Cápsula flotante con lo elegido. Aparece apenas hay industria y se esconde
 * cuando el paso de pago ya está en pantalla. En el celular es el camino
 * corto al pago: antes el botón quedaba diez tarjetas más abajo.
 */
export default function StickyBar({
  elegida,
  visible,
  alIrAPagar,
  alCambiar,
}: {
  elegida: Industria | null;
  visible: boolean;
  alIrAPagar: () => void;
  alCambiar: () => void;
}) {
  return (
    <AnimatePresence>
      {elegida && visible ? (
        <motion.div
          key="barra"
          className="ova-sticky"
          style={tinte(elegida)}
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          <div className="ova-sticky__bar" role="region" aria-label="Tu selección">
            <span className="ova-sticky__ico">
              <Glyph id={elegida.id} className="h-5 w-5" />
            </span>
            <span className="ova-sticky__txt">
              <span className="ova-sticky__nombre">{elegida.nombre}</span>
              <span className="ova-mono">
                {precioMensual}
                <span className="hidden sm:inline"> · {elegida.producto}</span>
              </span>
            </span>
            <button type="button" className="ova-sticky__cambiar" onClick={alCambiar}>
              Cambiar
            </button>
            <button type="button" className="ova-sticky__pagar" onClick={alIrAPagar}>
              {elegida.disponible ? "Ir a pagar" : "Ver"}
              <Flecha dir="abajo" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
