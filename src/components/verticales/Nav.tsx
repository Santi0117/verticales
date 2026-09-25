"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/content";
import { site } from "@/lib/site";
import { enProducto } from "./data";
import { Flecha } from "./ui";

/** Los mismos enlaces de siempre: esas secciones viven en /producto del sitio oficial. */
const enlaces = navLinks.map((l) => ({
  ...l,
  href: l.href.startsWith("#") ? enProducto(l.href) : l.href,
}));

/**
 * Cápsula clara flotante. Arriba del todo queda encajada en la muesca del
 * hero; al bajar se despega con sombra. La línea de abajo marca el avance.
 */
export default function Nav() {
  const [bajo, setBajo] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const { scrollYProgress } = useScroll();
  const avance = useSpring(scrollYProgress, { stiffness: 180, damping: 32, mass: 0.3 });

  useEffect(() => {
    const alScroll = () => setBajo(window.scrollY > 24);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
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
    <header className="ova-nav" data-bajo={bajo || abierto ? "true" : "false"}>
      <div className="ova-nav__bar">
        <Link href="/" className="ova-nav__brand" aria-label="Onvision, inicio">
          <Image
            src="/logo-eye-accent.png"
            alt=""
            width={532}
            height={282}
            className="h-[22px] w-auto"
            loading="eager"
          />
          <span>onvision</span>
        </Link>

        <div className="ova-seg" role="group" aria-label="Productos de Onvision">
          <span aria-current="page">Sistema</span>
          <a href={site.parentUrl} target="_blank" rel="noopener noreferrer">
            {site.parentName}
            <Flecha dir="diagonal" className="h-3 w-3" />
          </a>
        </div>

        <nav aria-label="Producto" className="ova-nav__links">
          {enlaces.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#industria" className="ova-nav__cta">
          <i aria-hidden />
          Activar
        </a>

        <button
          type="button"
          className="ova-nav__menu"
          aria-expanded={abierto}
          aria-controls="ova-menu"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setAbierto((v) => !v)}
        >
          <span data-abierto={abierto ? "true" : "false"} />
        </button>
      </div>

      <motion.span aria-hidden className="ova-nav__progress" style={{ scaleX: avance }} />

      {abierto ? (
        <div id="ova-menu" className="ova-nav__drawer">
          <nav aria-label="Menú" className="grid">
            {enlaces.map((l) => (
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
          <a href="#industria" className="ova-nav__drawer-cta" onClick={cerrar}>
            Activar
            <Flecha dir="abajo" className="h-4 w-4" />
          </a>
        </div>
      ) : null}
    </header>
  );
}
