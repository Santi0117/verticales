"use client";

import { MotionConfig } from "motion/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Checkout from "./Checkout";
import Footer from "./Footer";
import Hero from "./Hero";
import Nav from "./Nav";
import Selector from "./Selector";
import Steps from "./Steps";
import StickyBar from "./StickyBar";
import { industriaPorId } from "./data";
import "./verticales.css";

/**
 * Lee `?vertical=` y `?pago=`. Va aparte y dentro de un Suspense para que el
 * resto de la página se siga prerenderizando entera.
 */
function Parametros({
  alLeer,
}: {
  alLeer: (vertical: string | null, pago: string | null) => void;
}) {
  const params = useSearchParams();
  const vertical = params.get("vertical");
  const pago = params.get("pago");
  useEffect(() => {
    alLeer(vertical, pago);
  }, [vertical, pago, alLeer]);
  return null;
}

function irA(id: string, enfocar?: string) {
  const destino = document.getElementById(id);
  if (!destino) return;
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  destino.scrollIntoView({ behavior: quieto ? "auto" : "smooth", block: "start" });
  if (enfocar) {
    window.setTimeout(
      () => document.getElementById(enfocar)?.focus({ preventScroll: true }),
      quieto ? 0 : 750,
    );
  }
}

export default function VerticalesPage({ year }: { year: number }) {
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [pagoEstado, setPagoEstado] = useState<string | null>(null);
  const [pagando, setPagando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pagoRef = useRef<HTMLElement>(null);
  const [pagoAdelante, setPagoAdelante] = useState(true);
  const elegida = industriaPorId(seleccion);

  const [panelALaVista, setPanelALaVista] = useState(false);

  // La barra flotante solo tiene sentido mientras el pago todavía está más abajo.
  useEffect(() => {
    const seccion = pagoRef.current;
    if (!seccion) return;
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada) return;
        setPagoAdelante(!entrada.isIntersecting && entrada.boundingClientRect.top > 0);
      },
      { threshold: 0.12 },
    );
    io.observe(seccion);
    return () => io.disconnect();
  }, []);

  // En escritorio el panel del selector ya trae su botón: ahí la barra sobra.
  useEffect(() => {
    const panel = document.querySelector(".ova-sel__panel");
    if (!panel) return;
    const io = new IntersectionObserver(
      ([entrada]) => {
        // Oculto (celular) mide cero y nunca cuenta como a la vista.
        setPanelALaVista(Boolean(entrada?.isIntersecting && entrada.boundingClientRect.height));
      },
      { threshold: 0.2 },
    );
    io.observe(panel);
    return () => io.disconnect();
  }, []);

  const alLeer = useCallback((vertical: string | null, pago: string | null) => {
    if (vertical && industriaPorId(vertical)) setSeleccion(vertical);
    setPagoEstado(pago);
  }, []);

  // Si se vuelve con "atrás" desde el checkout, el botón no se queda cargando.
  useEffect(() => {
    const alMostrar = (e: PageTransitionEvent) => {
      if (e.persisted) setPagando(false);
    };
    window.addEventListener("pageshow", alMostrar);
    return () => window.removeEventListener("pageshow", alMostrar);
  }, []);

  const elegir = (id: string) => {
    setSeleccion(id);
    setError(null);
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
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "No se pudo iniciar el pago");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al pagar");
      setPagando(false);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="ova">
        <Suspense fallback={null}>
          <Parametros alLeer={alLeer} />
        </Suspense>

        <Nav />

        <main>
          <Hero pagoEstado={pagoEstado} alElegir={() => irA("industria")} />
          <Steps />
          <Selector
            seleccion={seleccion}
            alElegir={elegir}
            alContinuar={() => irA("pago", "ova-pagar")}
          />
          <Checkout
            seccionRef={pagoRef}
            elegida={elegida}
            pagando={pagando}
            error={error}
            alPagar={pagar}
            alCambiar={() => irA("industria")}
          />
        </main>

        <Footer year={year} />

        <StickyBar
          elegida={elegida}
          visible={pagoAdelante && !panelALaVista}
          alIrAPagar={() => irA("pago", "ova-pagar")}
          alCambiar={() => irA("industria")}
        />
      </div>
    </MotionConfig>
  );
}
