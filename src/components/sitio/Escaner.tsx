"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, Ojo } from "./ui";

/** Cada tarea de antes, en qué se convierte con Onvision y cómo queda. */
const PARES = [
  { antes: "facturas a mano", despues: "Facturación 4.4", detalle: "ATV · Hacienda", listo: "Factura electrónica aceptada" },
  { antes: "inventario de memoria", despues: "Inventario", detalle: "Stock en tiempo real", listo: "Stock al día, sin contar a mano" },
  { antes: "anotar cada SINPE", despues: "SINPE Móvil", detalle: "Pagos nativos", listo: "SINPE recibido y registrado" },
  { antes: "calculadora", despues: "CRC / USD", detalle: "Multi-moneda", listo: "Tipo de cambio aplicado solo" },
  { antes: "hojas de Excel", despues: "Reportes IVA", detalle: "Básicos incluidos", listo: "IVA del mes, listo para declarar" },
  { antes: "caja cuadrada a mano", despues: "Cierre de caja", detalle: "Cuadra solo", listo: "Caja cuadrada: ₡0 de diferencia" },
] as const;

const N = PARES.length;

/**
 * Tres vueltas del tren. De izquierda a derecha los pares van al revés, así
 * el ojo los procesa en orden: 0, 1, 2… (el primero ya está en el ojo al
 * arrancar).
 */
const TREN = Array.from({ length: N * 3 }, (_, j) => PARES[(N - (j % N)) % N]!);

/** Un poco de desorden en los papelitos de antes. */
const GIROS = [-4, 3, -2, 5, -3, 2];

/**
 * La franja de la portada: los papelitos de antes entran por la izquierda,
 * pasan por el ojo de Onvision y salen del otro lado como piezas del
 * sistema. Debajo del ojo, qué quedó hecho con cada una. Se detiene con el
 * cursor encima y, con movimiento reducido, queda quieta.
 */
export default function Escaner() {
  const ref = useRef<HTMLDivElement>(null);
  const [anda, setAnda] = useState(false);
  const [k, setK] = useState(0);

  // Todo arranca junto cuando se ve (así el ojo late justo cuando pasa cada pieza).
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setAnda(Boolean(e?.isIntersecting)), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const par = PARES[k % N]!;

  return (
    <div ref={ref} className="ov-escaner" data-anda={anda ? "true" : undefined}>
      <p className="sr-only">
        Antes: {PARES.map((p) => p.antes).join(", ")}. Con Onvision: {PARES.map((p) => p.despues).join(", ")}.
      </p>

      <div className="ov-escaner__banda" aria-hidden>
        <span className="ov-escaner__riel" />

        <div className="ov-escaner__lado ov-escaner__lado--antes">
          <div className="ov-escaner__tren">
            {TREN.map((p, j) => (
              <span key={j} className="ov-escaner__lugar">
                <span className="ov-escaner__nota" style={{ "--giro": `${GIROS[j % GIROS.length]}deg` } as CSSProperties}>
                  {p.antes}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="ov-escaner__lado ov-escaner__lado--despues">
          <div className="ov-escaner__tren">
            {TREN.map((p, j) => (
              <span key={j} className="ov-escaner__lugar">
                <span className="ov-escaner__pieza">
                  <b>{p.despues}</b>
                  <small>{p.detalle}</small>
                </span>
              </span>
            ))}
          </div>
        </div>

        <span className="ov-escaner__puerta">
          <span className="ov-escaner__pulso" onAnimationIteration={() => setK((n) => n + 1)} />
          <span className="ov-escaner__haz" />
          <Ojo className="ov-escaner__ojo" />
        </span>
      </div>

      <p key={k} className="ov-escaner__estado" aria-hidden>
        <Check className="h-3.5 w-3.5" />
        {par.listo}
      </p>
    </div>
  );
}
