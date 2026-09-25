"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { enProducto } from "./data";

/** Hora de Costa Rica. Se pinta después de montar para no chocar con el HTML del servidor. */
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
    tic();
    const reloj = window.setInterval(tic, 1000);
    return () => window.clearInterval(reloj);
  }, []);

  return (
    <span className="ova-foot__reloj">
      <i aria-hidden />
      Hora de Costa Rica <time>{hora ?? "--:--:--"}</time>
    </span>
  );
}

const PRODUCTO = [
  { label: site.parentName, href: site.parentUrl, externo: true },
  { label: "Módulos", href: enProducto("#modulos") },
  { label: "Industrias", href: enProducto("#industrias-imagenes") },
  { label: "Precios", href: enProducto("#precios") },
  { label: "Activar", href: "#industria" },
];

export default function Footer({ year }: { year: number }) {
  return (
    <footer className="ova-foot">
      <div className="ova-wrap">
        <div className="ova-foot__cols">
          <div>
            <p className="ova-foot__brand">
              <Image
                src="/logo-eye-accent.png"
                alt=""
                width={532}
                height={282}
                className="h-7 w-auto"
              />
              onvision
            </p>
            <p className="ova-foot__blurb">
              SaaS multi-vertical para empresas en Costa Rica. Facturación, inventario y
              módulos por industria.
            </p>
            <p className="ova-foot__parent">
              Un producto de{" "}
              <a href={site.parentUrl} target="_blank" rel="noopener noreferrer">
                {site.parentName}
              </a>
            </p>
          </div>

          <nav aria-label="Producto">
            <p className="ova-mono ova-foot__title">Producto</p>
            <ul>
              {PRODUCTO.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(l.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="ova-mono ova-foot__title">Contacto</p>
            <ul>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp {site.phone}
                </a>
              </li>
              <li>{site.location}</li>
            </ul>
          </div>
        </div>

        <p className="ova-foot__word" aria-hidden>
          <Image src="/logo-eye-accent.png" alt="" width={532} height={282} />
          <span>onvision</span>
        </p>

        <div className="ova-foot__bar">
          <span>
            © {year} {site.parentName} — Onvision SaaS · Hecho en {site.region}
          </span>
          <a href={site.parentUrl} target="_blank" rel="noopener noreferrer">
            {site.parentUrl.replace("https://", "")}
          </a>
          <Reloj />
        </div>
      </div>
    </footer>
  );
}
