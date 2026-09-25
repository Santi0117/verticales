import type { ReactNode } from "react";

/** Etiqueta de consola: cuadrito + texto en mono, como los paneles de un HUD. */
export function Hud({
  children,
  className = "",
  tono = "oscuro",
}: {
  children: ReactNode;
  className?: string;
  tono?: "oscuro" | "claro";
}) {
  return (
    <p className={`ova-hud ${tono === "claro" ? "ova-hud--claro" : ""} ${className}`}>
      <i aria-hidden />
      {children}
    </p>
  );
}

/** Cuatro esquinas de retícula. */
export function Esquinas({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`ova-corners ${className}`}>
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

const FLECHAS = {
  derecha: "M5 12h14M13 6l6 6-6 6",
  abajo: "M12 5v14M6 13l6 6 6-6",
  arriba: "M12 19V5M6 11l6-6 6 6",
  diagonal: "M7 17 17 7M8 7h9v9",
} as const;

export function Flecha({
  dir = "derecha",
  className = "h-4 w-4",
}: {
  dir?: keyof typeof FLECHAS;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={FLECHAS[dir]} />
    </svg>
  );
}

export function Check({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Encabezado de sección: índice, título y una regla que llega hasta el borde. */
export function Encabezado({
  indice,
  id,
  titulo,
  derecha,
  oscuro = false,
}: {
  indice: string;
  id: string;
  titulo: ReactNode;
  derecha?: ReactNode;
  oscuro?: boolean;
}) {
  return (
    <div className={`ova-sechead ${oscuro ? "ova-sechead--oscuro" : ""}`}>
      <span className="ova-sechead__idx">{indice}</span>
      <h2 id={id} className="ova-sechead__title">
        {titulo}
      </h2>
      <span className="ova-sechead__rule" aria-hidden />
      {derecha ? <span className="ova-sechead__right">{derecha}</span> : null}
    </div>
  );
}
