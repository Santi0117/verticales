import type { ReactNode } from "react";

/** Etiqueta de consola en mono con espaciado ancho (jeffmilanes, sibaldesign). */
export function Mono({
  children,
  className = "",
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
}) {
  return <Tag className={`ov-mono ${className}`}>{children}</Tag>;
}

/** Cabecera de panel de HUD: cuadrito que brilla + etiqueta (sibaldesign). */
export function Tag({ children, derecha }: { children: ReactNode; derecha?: ReactNode }) {
  return (
    <div className="ov-tag">
      <span className="ov-tag__izq">
        <i aria-hidden />
        {children}
      </span>
      {derecha ? <span className="ov-tag__der">{derecha}</span> : null}
    </div>
  );
}

/** Las cuatro esquinas de retícula (sibaldesign). */
export function Esquinas({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`ov-corners ${className}`}>
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

/** Encabezado de sección de HUD: índice, título espaciado y regla (sibaldesign). */
export function Seccion({ indice, children }: { indice: string; children: ReactNode }) {
  return (
    <div className="ov-sechead">
      <span className="ov-sechead__idx">{indice}</span>
      <span className="ov-sechead__title">{children}</span>
      <span className="ov-sechead__rule" aria-hidden />
    </div>
  );
}

const FLECHAS = {
  derecha: "M5 12h14M13 6l6 6-6 6",
  izquierda: "M19 12H5M11 6l-6 6 6 6",
  abajo: "M12 5v14M6 13l6 6 6-6",
  arriba: "M12 19V5M6 11l6-6 6 6",
  diagonal: "M7 17 17 7M8 7h9v9",
  esquina: "M6 5v8a3 3 0 0 0 3 3h9M14 12l4 4-4 4",
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
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/** El ojo de Onvision dibujado, para píldoras y avatares pequeños. */
export function Ojo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" />
    </svg>
  );
}

/** Onda de voz dentro de una cápsula (wisprflow). */
export function Onda({ barras = 11, className = "" }: { barras?: number; className?: string }) {
  return (
    <span className={`ov-onda ${className}`} aria-hidden>
      {Array.from({ length: barras }, (_, i) => (
        <i key={i} style={{ animationDelay: `${(i % 5) * -0.18}s` }} />
      ))}
    </span>
  );
}

/** Ícono pequeño para las píldoras negras de clarvos. */
export function Icono({ nombre, className = "h-[18px] w-[18px]" }: { nombre: IconoNombre; className?: string }) {
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
      {ICONOS[nombre]}
    </svg>
  );
}

const ICONOS = {
  factura: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  cajas: (
    <>
      <path d="M3 8.5 12 4l9 4.5-9 4.5L3 8.5Z" />
      <path d="M3 8.5V16l9 4.5 9-4.5V8.5M12 13v7.5" />
    </>
  ),
  moneda: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.8 9.2c-.6-.8-1.6-1.2-2.8-1.2-1.7 0-2.8.9-2.8 2s1 1.7 2.8 2c1.8.3 2.8.9 2.8 2.1S13.7 16 12 16c-1.3 0-2.4-.5-3-1.3M12 6.5V8m0 8v1.5" />
    </>
  ),
  giro: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <path d="m14.5 17.5 2 2 3.5-4" />
    </>
  ),
  chispa: (
    <>
      <path d="M12 3.5 13.4 9l5.1 1.5-5.1 1.5L12 17.5 10.6 12 5.5 10.5 10.6 9 12 3.5Z" />
      <path d="M18.5 15.5 19 17.3l1.8.5-1.8.5-.5 1.8-.5-1.8-1.8-.5 1.8-.5.5-1.8Z" />
    </>
  ),
  calendario: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  reloj: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  sol: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
} as const;

export type IconoNombre = keyof typeof ICONOS;
