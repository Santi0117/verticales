import Image from "next/image";
import type { ReactNode } from "react";
import { sectorShowcase } from "@/lib/content";
import { Check, Flecha, Icono, Ojo, type IconoNombre } from "./ui";
import { industriaPorId } from "./data";

type Tarjeta = (typeof sectorShowcase.cards)[number];

const ICONO: Record<Tarjeta["visual"], IconoNombre> = {
  fe: "factura",
  stock: "cajas",
  finanzas: "moneda",
  giros: "giro",
  ia: "chispa",
};

const ENLACE: Record<string, string> = {
  "#modulos": "Ver la base común",
  "#industrias": "Ver cada industria",
  "#precios": "Ver precios",
};

function Sparkline({ puntos, color }: { puntos: number[]; color: string }) {
  const d = puntos.map((y, i) => `${i === 0 ? "M" : "L"}${i * 10} ${24 - y}`).join(" ");
  return (
    <svg viewBox="0 0 70 26" className="ov-spark" aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VisualFe() {
  return (
    <div className="ov-ui">
      <div className="ov-ui__head">
        <p>Factura electrónica</p>
        <span className="ov-chip ov-chip--negro">FE 4.4</span>
      </div>
      <div className="ov-ui__bloque">
        <div className="ov-card__fila">
          <p className="ov-card__titulo">Factura 001-001-000000148</p>
          <span className="ov-chip ov-chip--menta">
            <Check className="h-3 w-3" />
            Aceptada
          </span>
        </div>
        <div className="ov-barra">
          <i style={{ width: "92%" }} />
        </div>
        <p className="ov-card__mono">Clave · 506140826003101…</p>
      </div>
      <ul className="ov-ui__lista">
        {[
          ["XML v4.4", "Generado"],
          ["Clave numérica", "50 dígitos"],
          ["Acuse de Hacienda", "Aceptada"],
        ].map(([a, b], i) => (
          <li key={a}>
            <span className="ov-rango">{i + 1}</span>
            <span className="ov-ui__nombre">{a}</span>
            <span className="ov-chip ov-chip--menta">{b}</span>
          </li>
        ))}
      </ul>
      <p className="ov-ui__pie">
        <i className="ov-punto" /> Hacienda · TRIBU-CR · FE 4.4
      </p>
    </div>
  );
}

function VisualStock() {
  const filas = [
    { nombre: "Varilla 3/8", qty: "142", bajo: false, puntos: [8, 10, 9, 13, 12, 15, 16] },
    { nombre: "Café 250 g", qty: "8", bajo: true, puntos: [18, 16, 14, 11, 9, 6, 4] },
    { nombre: "Cemento 50 kg", qty: "64", bajo: false, puntos: [10, 12, 11, 12, 14, 13, 15] },
  ];
  return (
    <div className="ov-ui">
      <div className="ov-ui__head">
        <p>
          <i className="ov-vivo" /> Inventario
        </p>
        <span className="ov-chip ov-chip--menta">En vivo</span>
      </div>
      <ul className="ov-ui__lista ov-ui__lista--alta">
        {filas.map((f, i) => (
          <li key={f.nombre}>
            <span className="ov-rango">{i + 1}</span>
            <span className="ov-ui__nombre">
              {f.nombre}
              <small>{f.bajo ? "Stock bajo" : "Stock ok"}</small>
            </span>
            <span className={`ov-chip ${f.bajo ? "ov-chip--sol" : "ov-chip--menta"}`}>{f.qty} und</span>
            <Sparkline puntos={f.puntos} color={f.bajo ? "#c77700" : "#1a1a1a"} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function VisualFinanzas() {
  const barras = [42, 58, 36, 71, 64, 88, 52];
  return (
    <div className="ov-ui">
      <div className="ov-ui__metricas">
        <div className="ov-ui__metrica">
          <p className="ov-card__label">Hoy</p>
          <p className="ov-card__grande ov-verde">₡1.24 M</p>
          <p className="ov-card__chico">ingresos</p>
        </div>
        <div className="ov-ui__metrica">
          <p className="ov-card__label">Salidas</p>
          <p className="ov-card__grande">₡318 mil</p>
          <p className="ov-card__chico">caja neta +</p>
        </div>
      </div>
      <div className="ov-ui__grafico" aria-hidden>
        {barras.map((h, i) => (
          <span key={i}>
            <i style={{ height: `${h}%` }} data-alta={h > 80 ? "true" : "false"} />
            <small>{"LMKJVSD"[i]}</small>
          </span>
        ))}
      </div>
      <p className="ov-chip ov-chip--violeta ov-chip--ancho">SINPE · CRC / USD</p>
    </div>
  );
}

function VisualGiros() {
  const chips = ["Obra", "Cartera", "POS", "Plazos", "Agenda", "Lotes"];
  const mini = ["constructoras", "bienes-raices", "retail", "abogados"].flatMap((id) => {
    const v = industriaPorId(id);
    return v ? [v] : [];
  });
  return (
    <div className="ov-ui">
      <div className="ov-ui__tags">
        {chips.map((c, i) => (
          <span key={c} className={`ov-tagc ov-tagc--${i % 4}`}>
            {c}
          </span>
        ))}
      </div>
      <div className="ov-ui__mini">
        {mini.map((v) => (
          <figure key={v.id}>
            <span>
              <Image src={v.imagen} alt="" fill sizes="220px" className="object-cover object-left-top" />
            </span>
            <figcaption>{v.corto}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function VisualIa() {
  return (
    <div className="ov-ui ov-ui--chat">
      <div className="ov-ui__head">
        <p>
          <span className="ov-avatar">
            <Ojo className="h-3.5 w-3.5" />
          </span>
          ONVI
        </p>
        <span className="ov-chip ov-chip--violeta">IA</span>
      </div>
      <p className="ov-burbuja ov-burbuja--onvi">
        Esta semana el margen se te fue en 3 SKUs. Reponé café 250 g antes del viernes.
      </p>
      <p className="ov-burbuja ov-burbuja--yo">¿Y si bajo precio en varilla?</p>
      <p className="ov-escribiendo" aria-hidden>
        <i />
        <i />
        <i />
      </p>
    </div>
  );
}

const VISUALES: Record<Tarjeta["visual"], () => ReactNode> = {
  fe: VisualFe,
  stock: VisualStock,
  finanzas: VisualFinanzas,
  giros: VisualGiros,
  ia: VisualIa,
};

function Fila({ tarjeta, indice }: { tarjeta: Tarjeta; indice: number }) {
  const sol = indice % 2 === 1;
  const Visual = VISUALES[tarjeta.visual];
  return (
    <article className={`ov-fila ${sol ? "ov-fila--sol" : "ov-fila--crema"}`}>
      <div className="ov-fila__texto">
        <h3 className="ov-fila__titulo">
          <span className="ov-fila__num">{String(indice + 1).padStart(2, "0")}</span>
          <span className="ov-fila__pildora">
            {tarjeta.title}
            <span className="ov-fila__circ">
              <Icono nombre={ICONO[tarjeta.visual]} />
            </span>
          </span>
        </h3>
        <p className="ov-fila__desc">{tarjeta.description}</p>
        <a href={tarjeta.href} className="ov-fila__link">
          {ENLACE[tarjeta.href] ?? "Ver más"}
          <Flecha className="h-4 w-4" />
        </a>
      </div>
      <div className="ov-fila__visual">
        <div className="ov-fila__lienzo">
          <Visual />
        </div>
      </div>
    </article>
  );
}

/**
 * "El núcleo y tu giro" a la manera de clarvos: titular con un ícono metido
 * en la frase y subrayado amarillo, y cada pieza del núcleo en su fila con
 * número, píldora negra y una tarjeta de producto al lado.
 */
export default function Nucleo() {
  const [antes, despues = ""] = sectorShowcase.title.split(" — ");
  const corte = despues.lastIndexOf("tu ");
  const inicio = corte >= 0 ? despues.slice(0, corte) : despues;
  const final = corte >= 0 ? despues.slice(corte) : "";

  return (
    <section id="hecho" className="ov-nucleo" aria-labelledby="ov-nucleo-titulo">
      <div className="ov-nucleo__head">
        <p className="ov-eyebrow">{sectorShowcase.eyebrow}</p>
        <h2 id="ov-nucleo-titulo" className="ov-redondo">
          {antes} —
          <br />
          {inicio}
          <span className="ov-redondo__icono" aria-hidden>
            <Icono nombre="sol" className="h-[0.55em] w-[0.55em]" />
          </span>{" "}
          <span className="ov-subrayado">{final}</span>
        </h2>
      </div>

      <div className="ov-nucleo__filas">
        {sectorShowcase.cards.map((t, i) => (
          <Fila key={t.id} tarjeta={t} indice={i} />
        ))}
      </div>
    </section>
  );
}
