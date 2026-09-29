"use client";

import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Activar from "./Activar";
import Anuncio from "./Anuncio";
import Base from "./Base";
import Boot from "./Boot";
import Chrome from "./Chrome";
import Detalle from "./Detalle";
import Hero from "./Hero";
import Hud from "./Hud";
import Listas from "./Listas";
import Nav from "./Nav";
import Nucleo from "./Nucleo";
import Pasos from "./Pasos";
import Pie from "./Pie";
import Precios from "./Precios";
import Registro from "./Registro";
import Showcase from "./Showcase";
import { industriaPorId, irA } from "./data";
import "./sitio.css";
import "./secciones.css";

/**
 * Lee `?vertical=` y `?pago=` (lo que manda el checkout al volver). Va en su
 * propio Suspense para que el resto de la página se prerenderice entera.
 */
function Parametros({ alLeer }: { alLeer: (vertical: string | null, pago: string | null) => void }) {
  const params = useSearchParams();
  const vertical = params.get("vertical");
  const pago = params.get("pago");
  useEffect(() => {
    alLeer(vertical, pago);
  }, [vertical, pago, alLeer]);
  return null;
}

export default function Sitio({ year }: { year: number }) {
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [pagoEstado, setPagoEstado] = useState<string | null>(null);
  const [pagando, setPagando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activarRef = useRef<HTMLElement>(null);
  const elegida = industriaPorId(seleccion);

  // Scroll suave como jeffmilanes y clarvos (Lenis). Con movimiento reducido no se enciende.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -12 } });
    const w = window as unknown as { __ovLenis?: Lenis };
    w.__ovLenis = lenis;
    return () => {
      lenis.destroy();
      delete w.__ovLenis;
    };
  }, []);

  // Si se vuelve con "atrás" desde el checkout, el botón no se queda cargando.
  useEffect(() => {
    const alMostrar = (e: PageTransitionEvent) => {
      if (e.persisted) setPagando(false);
    };
    window.addEventListener("pageshow", alMostrar);
    return () => window.removeEventListener("pageshow", alMostrar);
  }, []);

  const alLeer = useCallback((vertical: string | null, pago: string | null) => {
    if (vertical && industriaPorId(vertical)) setSeleccion(vertical);
    setPagoEstado(pago);
    // Quien vuelve del checkout cae directo en Activar.
    if (vertical || pago) window.setTimeout(() => irA("activar"), 600);
  }, []);

  const elegir = (id: string) => {
    setSeleccion(id);
    setError(null);
  };

  const activarVertical = (id: string) => {
    elegir(id);
    irA("activar", "ov-pagar");
  };

  async function pagar() {
    if (!elegida?.disponible || pagando) return;
    setError(null);
    setPagando(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verticalId: elegida.id }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "No se pudo iniciar el pago");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al pagar");
      setPagando(false);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="ov">
        <Boot year={year} />
        <Suspense fallback={null}>
          <Parametros alLeer={alLeer} />
        </Suspense>

        <Anuncio />
        <Nav />

        <main>
          <Hero />
          <Listas />
          <Nucleo />
          <div className="ov-negro">
            <Showcase alActivar={activarVertical} />
            <Base />
          </div>
          <Detalle alActivar={activarVertical} />
          <div className="ov-negro">
            <Pasos />
          </div>
          <Hud />
          <Precios />
          <Registro alActivar={activarVertical} />
          <div className="ov-negro ov-negro--arriba">
            <Activar
              seccionRef={activarRef}
              seleccion={seleccion}
              elegida={elegida}
              pagoEstado={pagoEstado}
              pagando={pagando}
              error={error}
              alElegir={elegir}
              alPagar={pagar}
            />
          </div>
        </main>
        <div className="ov-negro ov-negro--abajo">
          <Pie year={year} />
        </div>

        <Chrome elegida={elegida} />
      </div>
    </MotionConfig>
  );
}
