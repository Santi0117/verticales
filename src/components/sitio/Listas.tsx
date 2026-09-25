import Glyph from "./Glyph";
import { Flecha } from "./ui";
import { industrias } from "./data";

function Fila({ oculta = false }: { oculta?: boolean }) {
  return (
    <ul className="ov-marquee__fila" aria-hidden={oculta || undefined}>
      {industrias.map((v) => (
        <li key={v.id}>
          <a href={`#${v.id}`} tabIndex={oculta ? -1 : undefined}>
            <Glyph id={v.id} className="h-7 w-7" />
            <span>{v.nombre}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * "Industrias listas": la franja de logos de wisprflow sobre el bloque negro
 * redondeado, con las diez industrias pasando sin parar.
 */
export default function Listas() {
  return (
    <section id="industrias-listas" className="ov-listas" aria-labelledby="ov-listas-titulo">
      <h2 id="ov-listas-titulo" className="ov-listas__eyebrow">
        Industrias listas
      </h2>
      <div className="ov-marquee">
        <div className="ov-marquee__pista">
          <Fila />
          <Fila oculta />
        </div>
      </div>
      <a href="#industrias" className="ov-listas__ver">
        Ver detalle de cada vertical
        <span className="ov-listas__circ">
          <Flecha className="h-3.5 w-3.5" />
        </span>
      </a>
    </section>
  );
}
