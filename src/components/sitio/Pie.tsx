"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/content";
import { site } from "@/lib/site";
import { Flecha } from "./ui";

/** Hora de Costa Rica (el reloj del pie de sibaldesign). Se pinta al montar. */
function Reloj() {
  const [hora, setHora] = useState<string | null>(null);
  useEffect(() => {
    const formato = new Intl.DateTimeFormat("es-CR", {
      timeZone: "America/Costa_Rica",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tic = () => setHora(formato.format(new Date()));
    const primero = window.setTimeout(tic, 0);
    const reloj = window.setInterval(tic, 1000);
    return () => {
      window.clearTimeout(primero);
      window.clearInterval(reloj);
    };
  }, []);
  return <time>{hora ?? "--:--:--"}</time>;
}

const WHATSAPP = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hola, quiero hablar con Onvision.")}`;

/**
 * El pie dentro del bloque negro, como el de clarvos (lema, píldoras,
 * enlaces y el logo gigante), con la barra de estado y el reloj de
 * sibaldesign.
 */
export default function Pie({ year }: { year: number }) {
  return (
    <footer className="ov-pie">
      <div className="ov-pie__cols">
        <div className="ov-pie__marca-col">
          <p className="ov-pie__lema">{site.tagline}</p>
          <p className="ov-pie__blurb">
            SaaS multi-vertical para empresas en Costa Rica. Facturación, inventario y módulos por
            industria. Un producto de{" "}
            <a href={site.parentUrl} target="_blank" rel="noopener noreferrer">
              {site.parentName}
            </a>
            .
          </p>
          <div className="ov-pie__pills">
            <a href="#activar" className="ov-pill ov-pill--blanca ov-pill--chica">
              Activar
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="ov-pill ov-pill--linea ov-pill--chica">
              WhatsApp
            </a>
          </div>
        </div>

        <nav aria-label="Pie" className="ov-pie__links">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href="#modulos">Módulos</a>
          <a href={site.parentUrl} target="_blank" rel="noopener noreferrer">
            {site.parentName}
            <Flecha dir="diagonal" className="h-4 w-4" />
          </a>
        </nav>

        <ul className="ov-pie__contacto">
          <li>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              WhatsApp {site.phone}
            </a>
          </li>
          <li>{site.location}</li>
        </ul>
      </div>

      <p className="ov-pie__logo" aria-hidden>
        <Image src="/logo-eye.png" alt="" width={532} height={282} />
        <span>onvision</span>
      </p>

      <div className="ov-pie__barra">
        <span className="ov-pie__estado">
          <i aria-hidden /> Estado: en línea
        </span>
        <span>
          © {year} {site.parentName} — Onvision SaaS · Hecho en {site.region}
        </span>
        <a href={site.parentUrl} target="_blank" rel="noopener noreferrer">
          {site.parentUrl.replace("https://", "")}
        </a>
        <span className="ov-pie__hora">
          Hora CR <Reloj />
        </span>
      </div>
    </footer>
  );
}
