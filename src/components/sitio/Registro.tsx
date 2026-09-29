"use client";

import { waitlist } from "@/lib/content";
import { site } from "@/lib/site";
import ChatPrueba from "./ChatPrueba";
import { Check } from "./ui";

/**
 * "Empieza gratis 15 días" como las preguntas frecuentes de wisprflow: caja
 * arena con el panel verde de lo que incluye y, al lado, Onvi, que abre la
 * prueba conversando.
 */
export default function Registro({ alActivar }: { alActivar: (id: string) => void }) {
  return (
    <section id="registro" className="ov-registro" aria-labelledby="ov-registro-titulo">
      <div className="ov-registro__head">
        <p className="ov-eyebrow">Empezá hoy</p>
        <h2 id="ov-registro-titulo" className="ov-serif-h2">
          Empieza gratis <em>15 días</em>
        </h2>
      </div>

      <div className="ov-caja">
        <div className="ov-caja__izq">
          <p className="ov-caja__titulo">Qué incluye</p>
          <p className="ov-caja__texto">{waitlist.subtitle}</p>
          <ul className="ov-caja__filas">
            {waitlist.benefits.map((b) => (
              <li key={b}>
                <span className="ov-caja__check">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <p className="ov-caja__nota">No necesitás tarjeta de crédito · Acceso en menos de 24 h</p>
        </div>

        <div className="ov-caja__der ov-caja__der--chat">
          <ChatPrueba alActivar={alActivar} />
          <p className="ov-caja__pie">
            o escribinos a <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
