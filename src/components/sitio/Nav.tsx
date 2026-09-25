"use client";

import Image from "next/image";
import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/content";
import { site } from "@/lib/site";
import { Flecha, Ojo } from "./ui";

/**
 * La tarjeta flotante de wisprflow: marca, selector segmentado, enlaces y el
 * botón lavanda. Arriba del todo queda encajada en la muesca de la portada;
 * la línea de abajo es el avance de sibaldesign y el enlace de la sección
 * que está en pantalla se subraya.
 */
export default function Nav() {
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const avance = useSpring(scrollYProgress, { stiffness: 180, damping: 32, mass: 0.3 });

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const vistos = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) vistos.set(e.target.id, e.isIntersecting);
        setActivo(ids.find((id) => vistos.get(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const alTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", alTecla);
    return () => window.removeEventListener("keydown", alTecla);
  }, [abierto]);

  const cerrar = () => setAbierto(false);

  return (
    <header className="ov-nav">
      <div className="ov-nav__card">
        <a href="#inicio" className="ov-nav__marca" aria-label="Onvision, inicio">
          <Image src="/logo-eye-accent.png" alt="" width={532} height={282} className="ov-nav__ojo" loading="eager" />
          <span>onvision</span>
        </a>

        <div className="ov-seg" role="group" aria-label="Productos">
          <span aria-current="page">Sistema</span>
          <a href={site.parentUrl} target="_blank" rel="noopener noreferrer">
            {site.parentName}
            <Flecha dir="diagonal" className="h-3 w-3" />
          </a>
        </div>

        <nav aria-label="Secciones" className="ov-nav__links">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} data-on={activo === l.href.slice(1) ? "true" : "false"}>
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#activar" className="ov-nav__cta">
          <Ojo className="h-4 w-4" />
          Activar
        </a>

        <button
          type="button"
          className="ov-nav__menu"
          aria-expanded={abierto}
          aria-controls="ov-menu"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setAbierto((v) => !v)}
        >
          <span data-abierto={abierto ? "true" : "false"} />
        </button>

        <motion.span aria-hidden className="ov-nav__avance" style={{ scaleX: avance }} />
      </div>

      {abierto ? (
        <div id="ov-menu" className="ov-nav__drawer">
          <nav aria-label="Menú">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={cerrar}>
                {l.label}
                <Flecha className="h-4 w-4 opacity-40" />
              </a>
            ))}
            <a href={site.parentUrl} target="_blank" rel="noopener noreferrer" onClick={cerrar}>
              {site.parentName}
              <Flecha dir="diagonal" className="h-4 w-4 opacity-40" />
            </a>
          </nav>
          <a href="#activar" className="ov-nav__drawer-cta" onClick={cerrar}>
            Activar Onvision
            <Flecha dir="abajo" className="h-4 w-4" />
          </a>
        </div>
      ) : null}
    </header>
  );
}
