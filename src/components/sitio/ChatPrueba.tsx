"use client";

import Image from "next/image";
import { motion, type MotionStyle, type Variants } from "motion/react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { appUrlDeVertical } from "@/lib/activacion";
import { site } from "@/lib/site";
import Glyph from "./Glyph";
import { Check, Flecha, Onda } from "./ui";
import { industrias, tinte } from "./data";

type Paso = "saludo" | "pensando" | "industria" | "lista" | "nombre" | "correo" | "empresa" | "resumen" | "enviado";
type Ficha = { industria: string; nombre: string; correo: string; empresa: string };
type Mensaje = { id: number; de: "onvi" | "yo"; texto: string } | { id: number; de: "ficha"; ficha: Ficha };

const EASE = [0.22, 1, 0.36, 1] as const;

const esCorreo = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Lo que pide el cuadro de abajo en cada paso (en los demás se elige con botones). */
const PIDE: Partial<Record<Paso, { placeholder: string; tipo: "text" | "email"; auto: string }>> = {
  industria: { placeholder: "O escribí tu industria", tipo: "text", auto: "off" },
  nombre: { placeholder: "Escribí tu nombre", tipo: "text", auto: "name" },
  correo: { placeholder: "tu@correo.com", tipo: "email", auto: "email" },
  empresa: { placeholder: "Nombre de tu empresa", tipo: "text", auto: "organization" },
};

/**
 * Cómo le dice la gente a cada industria, sin tildes. Las de 4 letras o más
 * valen como comienzo de palabra ("restaur" → restaurante); las cortas, solo
 * como palabra entera.
 */
const PISTAS: Record<string, string[]> = {
  restaurantes: ["restaur", "soda", "bar", "cafeteria", "comida", "panaderia", "pizzeria", "cocina", "catering"],
  retail: ["retail", "tienda", "comerci", "super", "minisuper", "pulperia", "boutique", "ferreteria", "libreria"],
  clinicas: ["clinic", "medic", "doctor", "dental", "dentist", "odontolog", "consultorio", "hospital", "salud"],
  abogados: ["abogad", "notari", "bufete", "legal", "juridic", "derecho"],
  constructoras: ["construc", "obra", "arquitect"],
  "bienes-raices": ["bienes", "raices", "inmobiliari", "propiedad", "alquiler", "condominio"],
  ganaderia: ["ganad", "ganader", "lecher", "porcin", "avicol"],
  agricultura: ["agric", "agro", "cultivo", "cosecha", "vivero", "finca", "cafetal", "siembra"],
  talleres: ["taller", "mecanic", "tecnic", "reparac", "enderez", "automotri"],
  personal: ["personal", "hogar", "famil", "presupuest"],
};

const sinTildes = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** La industria que más se parece a lo que escribió la persona (o ninguna, si hay duda). */
function adivinar(texto: string) {
  const palabras = sinTildes(texto).split(/[^a-z0-9]+/).filter(Boolean);
  let mejor: string | null = null;
  let puntos = 0;
  let empate = false;
  for (const [id, pistas] of Object.entries(PISTAS)) {
    let p = 0;
    for (const w of palabras) {
      for (const s of pistas) {
        const pega = s.length >= 4 ? w.startsWith(s) : w === s || w === `${s}s` || w === `${s}es`;
        if (pega) p = Math.max(p, s.length);
      }
    }
    if (p > puntos) {
      mejor = id;
      puntos = p;
      empate = false;
    } else if (p > 0 && p === puntos) {
      empate = true;
    }
  }
  return empate ? null : mejor;
}

/** Los botones de industria entran uno detrás del otro. */
const OPCIONES: Variants = { visto: { transition: { staggerChildren: 0.035 } } };
const OPCION: Variants = {
  oculto: { opacity: 0, y: 8, scale: 0.94 },
  visto: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: EASE } },
};

/**
 * "Empezá gratis 15 días" como una conversación con Onvi: saluda cuando se
 * ve y pregunta la industria (con botones o escribiéndola). Si esa industria
 * ya está lista, lleva a activarla; si no, pide nombre, correo y empresa, y
 * no finge un envío: abre WhatsApp con los datos ya escritos.
 */
export default function ChatPrueba({ alActivar }: { alActivar: (id: string) => void }) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [escribiendo, setEscribiendo] = useState(false);
  const [paso, setPaso] = useState<Paso>("saludo");
  const [texto, setTexto] = useState("");
  const [industria, setIndustria] = useState<string | null>(null);
  const [otra, setOtra] = useState("");
  const [datos, setDatos] = useState({ nombre: "", correo: "", empresa: "" });
  const [enviada, setEnviada] = useState<number | null>(null);
  const caja = useRef<HTMLDivElement>(null);
  const cuerpo = useRef<HTMLDivElement>(null);
  const entrada = useRef<HTMLInputElement>(null);
  const avatar = useRef<HTMLSpanElement>(null);
  const relojes = useRef<number[]>([]);
  const siguiente = useRef(0);

  const agregar = useCallback((m: { de: "onvi" | "yo"; texto: string } | { de: "ficha"; ficha: Ficha }) => {
    siguiente.current += 1;
    const id = siguiente.current;
    setMensajes((ms) => [...ms, { ...m, id }]);
  }, []);

  /** Onvi escribe: la onda de "escribiendo" y después cada mensaje, uno por uno. */
  const decir = useCallback(
    (textos: string[], luego?: () => void) => {
      let t = 0;
      textos.forEach((tx, i) => {
        relojes.current.push(window.setTimeout(() => setEscribiendo(true), t));
        t += 600 + Math.min(800, tx.length * 12);
        relojes.current.push(
          window.setTimeout(() => {
            setEscribiendo(false);
            agregar({ de: "onvi", texto: tx });
            if (i === textos.length - 1) luego?.();
          }, t),
        );
        t += 220;
      });
    },
    [agregar],
  );

  // Saluda la primera vez que el chat se ve.
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        decir(["¡Hola! Soy Onvi, el asistente de Onvision.", "Te dejo lista tu prueba de 15 días en un minuto. ¿En qué industria trabajás?"], () =>
          setPaso("industria"),
        );
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    const pendientes = relojes.current;
    return () => {
      io.disconnect();
      pendientes.forEach((r) => window.clearTimeout(r));
    };
  }, [decir]);

  // El ojo de Onvi mira hacia el cursor (solo con mouse y mientras el chat se ve).
  useEffect(() => {
    const el = avatar.current;
    const c = caja.current;
    if (!el || !c) return;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const mirar = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 240);
        el.style.setProperty("--mx", `${((dx / d) * 4 * k).toFixed(2)}px`);
        el.style.setProperty("--my", `${((dy / d) * 3 * k).toFixed(2)}px`);
      });
    };
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) window.addEventListener("pointermove", mirar, { passive: true });
      else window.removeEventListener("pointermove", mirar);
    });
    io.observe(c);
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", mirar);
      cancelAnimationFrame(raf);
    };
  }, []);

  // La conversación baja sola (adentro del chat, sin mover la página).
  useEffect(() => {
    const el = cuerpo.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [mensajes, escribiendo, paso]);

  // Con mouse, el cursor queda listo para escribir; en el celular no se abre el teclado solo.
  useEffect(() => {
    if (paso !== "industria" && PIDE[paso] && window.matchMedia("(pointer: fine)").matches) entrada.current?.focus({ preventScroll: true });
  }, [paso]);

  /** La industria, con un botón o escrita (`dicho` es lo que escribió la persona). */
  const elegir = (id: string, dicho?: string) => {
    if (paso !== "industria") return;
    const v = industrias.find((x) => x.id === id);
    setIndustria(v ? v.id : null);
    setOtra(v ? "" : (dicho ?? ""));
    setPaso("pensando");
    agregar({ de: "yo", texto: dicho ?? v?.nombre ?? "Otra" });
    if (!v) {
      decir([dicho ? "Anotado. Lo vemos juntos con el equipo." : "Contame de tu negocio y lo vemos juntos.", "Primero, ¿cómo te llamás?"], () =>
        setPaso("nombre"),
      );
    } else if (appUrlDeVertical(v.id)) {
      const listo = "Creás tu cuenta y la prueba de 15 días arranca en el momento.";
      decir(dicho ? [`Eso entra en ${v.nombre}. ¡Y ya está lista!`, listo] : [`¡${v.nombre} ya está lista! ${listo}`], () => setPaso("lista"));
    } else if (v.disponible) {
      // Está incluida, pero este sitio todavía no la activa solo: la prueba la deja lista el equipo.
      decir(
        [
          dicho ? `Eso entra en ${v.nombre}, y está incluida en la prueba.` : `¡Buenísimo! ${v.nombre} está incluida en la prueba.`,
          "Te la dejamos lista con el equipo. ¿Cómo te llamás?",
        ],
        () => setPaso("nombre"),
      );
    } else {
      decir([`${v.nombre} está en lista de espera: te guardamos el lugar y te avisamos apenas esté.`, "¿Cómo te llamás?"], () => setPaso("nombre"));
    }
  };

  const nombreIndustria = industrias.find((v) => v.id === industria)?.nombre ?? (otra || "Otra");
  const primer = datos.nombre.split(/\s+/)[0] ?? "";

  const responder = (e: FormEvent) => {
    e.preventDefault();
    const v = texto.trim();
    if (!v || !PIDE[paso]) return;
    setTexto("");
    if (paso === "industria") {
      elegir(adivinar(v) ?? "otra", v);
      return;
    }
    const ahora = paso;
    agregar({ de: "yo", texto: v });
    setPaso("pensando");
    if (ahora === "nombre") {
      if (v.length < 2) {
        decir(["¿Me lo escribís completo?"], () => setPaso("nombre"));
        return;
      }
      setDatos((d) => ({ ...d, nombre: v }));
      decir([`Mucho gusto, ${v.split(/\s+/)[0]}. ¿A qué correo te escribimos?`], () => setPaso("correo"));
    } else if (ahora === "correo") {
      if (!esCorreo(v)) {
        decir(["Ese correo parece incompleto. ¿Lo revisás?"], () => setPaso("correo"));
        return;
      }
      setDatos((d) => ({ ...d, correo: v }));
      decir(["Perfecto. ¿Y cómo se llama tu empresa?"], () => setPaso("empresa"));
    } else {
      if (v.length < 2) {
        decir(["¿Me escribís el nombre completo de la empresa?"], () => setPaso("empresa"));
        return;
      }
      setDatos((d) => ({ ...d, empresa: v }));
      const ficha = { industria: nombreIndustria, nombre: datos.nombre, correo: datos.correo, empresa: v };
      decir(["Listo. Esto es lo que le paso al equipo:"], () => {
        agregar({ de: "ficha", ficha });
        setPaso("resumen");
      });
    }
  };

  const whatsapp = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    [
      "Hola, quiero probar Onvision 15 días.",
      `Industria: ${nombreIndustria}`,
      `Nombre: ${datos.nombre}`,
      `Correo: ${datos.correo}`,
      `Empresa: ${datos.empresa}`,
    ].join("\n"),
  )}`;

  const enviar = (fichaId: number) => {
    window.open(whatsapp, "_blank", "noopener,noreferrer");
    setEnviada(fichaId);
    agregar({ de: "yo", texto: "Enviar por WhatsApp" });
    setPaso("pensando");
    decir([`¡Listo, ${primer}! Te abrimos WhatsApp con todo escrito: solo le das enviar.`], () => setPaso("enviado"));
  };

  /** Vuelve a la pregunta de la industria (lo ya conversado queda arriba). */
  const otraVez = (etiqueta: string, respuesta = "Dale, empecemos de nuevo. ¿En qué industria trabajás?") => {
    relojes.current.splice(0).forEach((r) => window.clearTimeout(r));
    setEscribiendo(false);
    setIndustria(null);
    setOtra("");
    setDatos({ nombre: "", correo: "", empresa: "" });
    setTexto("");
    setPaso("pensando");
    agregar({ de: "yo", texto: etiqueta });
    decir([respuesta], () => setPaso("industria"));
  };

  const pide = PIDE[paso];
  const ultimo = mensajes[mensajes.length - 1];

  return (
    <div ref={caja} className="ov-chat">
      <header className="ov-chat__cabeza">
        <span ref={avatar} className="ov-chat__avatar" data-escribe={escribiendo ? "true" : undefined}>
          <Image src="/logo-eye-accent.png" alt="" width={532} height={282} />
        </span>
        <span className="ov-chat__quien">
          <b>Onvi</b>
          <small>
            <i aria-hidden />
            {escribiendo ? "escribiendo…" : "Asistente de Onvision · en línea"}
          </small>
        </span>
        <span className="ov-chat__sello">15 días gratis</span>
      </header>

      <div ref={cuerpo} className="ov-chat__cuerpo" role="log" aria-live="polite" aria-label="Conversación con Onvi">
        {mensajes.map((m) =>
          m.de === "ficha" ? (
            <motion.div
              key={m.id}
              className="ov-chat__ticket"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <p className="ov-chat__ticket-titulo">
                <Check className="h-4 w-4" />
                Prueba de 15 días
              </p>
              <dl>
                <div>
                  <dt>Industria</dt>
                  <dd>{m.ficha.industria}</dd>
                </div>
                <div>
                  <dt>Nombre</dt>
                  <dd>{m.ficha.nombre}</dd>
                </div>
                <div>
                  <dt>Correo</dt>
                  <dd>{m.ficha.correo}</dd>
                </div>
                <div>
                  <dt>Empresa</dt>
                  <dd>{m.ficha.empresa}</dd>
                </div>
              </dl>
              {paso === "resumen" && ultimo?.id === m.id ? (
                <div className="ov-chat__acciones">
                  <button type="button" className="ov-boton-lila" onClick={() => enviar(m.id)}>
                    Enviar por WhatsApp
                    <Flecha className="h-4 w-4" />
                  </button>
                  <button type="button" className="ov-chat__link" onClick={() => otraVez("Cambiar algo")}>
                    Cambiar algo
                  </button>
                </div>
              ) : null}
              {enviada === m.id ? (
                <motion.p
                  className="ov-chat__enviado"
                  initial={{ opacity: 0, scale: 1.5, rotate: -14 }}
                  animate={{ opacity: 1, scale: 1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 480, damping: 20 }}
                >
                  <Check className="h-3.5 w-3.5" />
                  Enviado por WhatsApp
                </motion.p>
              ) : null}
            </motion.div>
          ) : (
            <motion.p
              key={m.id}
              className={`ov-chat__msj ov-chat__msj--${m.de}`}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {m.texto}
            </motion.p>
          ),
        )}

        {escribiendo ? (
          <p className="ov-chat__msj ov-chat__msj--onvi ov-chat__escribe">
            <Onda barras={7} />
            <span className="sr-only">Onvi está escribiendo</span>
          </p>
        ) : null}

        {paso === "industria" ? (
          <motion.div className="ov-chat__opciones" variants={OPCIONES} initial="oculto" animate="visto">
            {industrias.map((v) => (
              <motion.button key={v.id} type="button" variants={OPCION} style={tinte(v) as MotionStyle} onClick={() => elegir(v.id)}>
                <Glyph id={v.id} className="h-4 w-4" />
                {v.nombre}
              </motion.button>
            ))}
            <motion.button type="button" variants={OPCION} onClick={() => elegir("otra")}>
              Otra
            </motion.button>
          </motion.div>
        ) : null}

        {paso === "lista" && industria ? (
          <motion.div className="ov-chat__acciones" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            <button type="button" className="ov-boton-lila" onClick={() => alActivar(industria)}>
              Activar mi prueba
              <Flecha className="h-4 w-4" />
            </button>
            <button type="button" className="ov-chat__link" onClick={() => otraVez("Elegir otra industria", "Dale. ¿En qué industria trabajás?")}>
              Elegir otra industria
            </button>
          </motion.div>
        ) : null}

        {paso === "enviado" ? (
          <motion.div className="ov-chat__acciones" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            <a className="ov-chat__link" href={whatsapp} target="_blank" rel="noopener noreferrer">
              Abrir WhatsApp otra vez
            </a>
            <button type="button" className="ov-chat__link" onClick={() => otraVez("Empezar de nuevo")}>
              Empezar de nuevo
            </button>
          </motion.div>
        ) : null}
      </div>

      <form className="ov-chat__escribir" onSubmit={responder}>
        <input
          ref={entrada}
          type={pide?.tipo ?? "text"}
          autoComplete={pide?.auto ?? "off"}
          inputMode={pide?.tipo === "email" ? "email" : undefined}
          enterKeyHint="send"
          maxLength={pide?.tipo === "email" ? 120 : 80}
          value={texto}
          disabled={!pide}
          placeholder={pide?.placeholder ?? "Onvi está contigo…"}
          aria-label={pide?.placeholder ?? "Escribir a Onvi"}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button type="submit" aria-label="Enviar" disabled={!pide || !texto.trim()}>
          <Flecha dir="arriba" />
        </button>
      </form>
    </div>
  );
}
