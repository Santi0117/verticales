"use client";

import { AnimatePresence, motion, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import Glyph from "./Glyph";
import { Flecha } from "./ui";
import { ESCENAS, irA, precioMensual, tinte, type Industria } from "./data";

const pad = (n: number) => String(n).padStart(2, "0");

/** "ESCENA 04": la sección que cruza el medio de la pantalla (jeffmilanes). */
function Escena() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          const k = ESCENAS.indexOf(e.target.id as (typeof ESCENAS)[number]);
          if (k >= 0) setN(k + 1);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const id of ESCENAS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return (
    <p className="ov-escena" aria-hidden>
      Escena <b>{pad(n)}</b>
    </p>
  );
}

/** La tira de película que avanza con la página (jeffmilanes). */
function Pelicula() {
  const { scrollYProgress } = useScroll();
  return (
    <div className="ov-pelicula" aria-hidden>
      <motion.div className="ov-pelicula__tira" style={{ scaleX: scrollYProgress }} />
    </div>
  );
}

const WHATSAPP = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hola, quiero hablar con Onvision.")}`;

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/**
 * Lo que queda fijo sobre la página: el contador de escena y la tira de
 * película de jeffmilanes, el botón redondo lavanda de wisprflow (WhatsApp)
 * y la barra con la industria elegida mientras el pago está más abajo.
 */
export default function Chrome({ elegida }: { elegida: Industria | null }) {
  const [ctaAdelante, setCtaAdelante] = useState(true);

  useEffect(() => {
    const cta = document.querySelector(".ov-activar__cta");
    if (!cta) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        setCtaAdelante(!e.isIntersecting && e.boundingClientRect.top > 0);
      },
      { threshold: 0.3 },
    );
    io.observe(cta);
    return () => io.disconnect();
  }, []);

  const barra = Boolean(elegida) && ctaAdelante;

  return (
    <>
      <Escena />
      <Pelicula />

      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        className="ov-fab"
        data-oculto={barra ? "true" : "false"}
      >
        <WhatsAppGlyph />
      </a>

      <AnimatePresence>
        {barra && elegida ? (
          <motion.div
            key="barra"
            className="ov-barra-sel"
            style={tinte(elegida)}
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <div className="ov-barra-sel__in" role="region" aria-label="Tu selección">
              <span className="ov-barra-sel__ico">
                <Glyph id={elegida.id} className="h-5 w-5" />
              </span>
              <span className="ov-barra-sel__txt">
                <span className="ov-barra-sel__nombre">{elegida.nombre}</span>
                <span className="ov-mono">
                  {precioMensual}
                  <span className="hidden sm:inline"> · {elegida.producto}</span>
                </span>
              </span>
              <button type="button" className="ov-barra-sel__ir" onClick={() => irA("activar", "ov-pagar")}>
                {elegida.disponible ? "Ir a pagar" : "Ver"}
                <Flecha dir="abajo" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
