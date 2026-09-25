"use client";

import { useState, type FormEvent } from "react";
import { appUrlDeVertical } from "@/lib/activacion";
import { waitlist } from "@/lib/content";
import { site } from "@/lib/site";
import { Check, Flecha } from "./ui";
import { industrias } from "./data";

/**
 * "Empieza gratis 15 días" como las preguntas frecuentes de wisprflow: caja
 * arena con el panel verde de lo que incluye y el formulario al lado.
 *
 * Si la industria ya está lista, se elige abajo en Activar. Si no, no se
 * finge un envío: se abre WhatsApp con los datos ya escritos.
 */
export default function Registro({ alActivar }: { alActivar: (id: string) => void }) {
  const [industria, setIndustria] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [enviado, setEnviado] = useState(false);

  const lista = Boolean(industria && appUrlDeVertical(industria));

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (lista) {
      alActivar(industria);
      return;
    }
    const nombreIndustria = industrias.find((v) => v.id === industria)?.nombre ?? "Otra";
    const texto = [
      "Hola, quiero probar Onvision 15 días.",
      `Industria: ${nombreIndustria}`,
      `Nombre: ${nombre}`,
      `Correo: ${correo}`,
      `Empresa: ${empresa}`,
    ].join("\n");
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
    setEnviado(true);
  };

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

        <form className="ov-caja__der" onSubmit={enviar}>
          <p className="ov-caja__titulo ov-caja__titulo--tinta">Empezá tu prueba de 15 días</p>
          <label className="ov-campo">
            <span>¿Cuál es tu industria?</span>
            <select required value={industria} onChange={(e) => setIndustria(e.target.value)}>
              <option value="" disabled>
                Elegí una
              </option>
              {industrias.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.disponible ? `${v.nombre} · disponible ahora` : `${v.nombre} · lista de espera`}
                </option>
              ))}
              <option value="otra">Otra</option>
            </select>
          </label>

          {lista ? (
            <p className="ov-caja__aviso">
              Esta industria ya está lista. Te llevamos a crear tu cuenta y activar la prueba.
            </p>
          ) : (
            <>
              <label className="ov-campo">
                <span>Tu nombre</span>
                <input type="text" required autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </label>
              <label className="ov-campo">
                <span>Correo electrónico</span>
                <input type="email" required autoComplete="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
              </label>
              <label className="ov-campo">
                <span>Empresa</span>
                <input type="text" required autoComplete="organization" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
              </label>
            </>
          )}

          {enviado && !lista ? (
            <p className="ov-caja__aviso" role="status">
              Abrimos WhatsApp con tus datos. Si no se abrió, escribinos a {site.email}.
            </p>
          ) : null}

          <button type="submit" className="ov-boton-lila ov-boton-lila--ancho">
            {lista ? "Activar prueba ahora" : "Quiero probar 15 días"}
            <Flecha className="h-4 w-4" />
          </button>
          <p className="ov-caja__pie">
            o escribinos a <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </form>
      </div>
    </section>
  );
}
