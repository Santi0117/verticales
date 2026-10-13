import * as THREE from "three";

/*
 * El motor: el sistema Onvision explotado pieza por pieza (el prototipo
 * /vision de la landing, "motor explotado"), metido en una sola sección.
 * Se carga aparte (import dinámico) para que three.js no pese en el resto
 * de la página. El scroll de la sección mueve todo: se abre, se queda
 * abierto en papel crema y se vuelve a armar.
 */

/* ── Números ────────────────────────────────────────────────────────────── */

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function smoothstep(a: number, b: number, v: number) {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/** Progreso sin límite de una sección con pantalla pegada (0 = arriba, 1 = fin del recorrido). */
export function recorrido(el: HTMLElement, vh: number) {
  const r = el.getBoundingClientRect();
  return -r.top / Math.max(r.height - vh, 1);
}

/** Cuánto está abierto el motor: se abre, se sostiene y se vuelve a armar al final. */
export const apertura = (p: number) => smoothstep(0.08, 0.5, p) * (1 - smoothstep(0.82, 0.97, p));

/* ── Colores: negro → azul noche → crema → negro (los de Verticales) ──── */

type Rgb = [number, number, number];
type Clave = "bg" | "ink" | "fill" | "line" | "accent" | "glass";

const TEMAS: Record<"negro" | "noche" | "crema", Record<Clave, string>> = {
  negro: { bg: "#000000", ink: "#f8fafc", fill: "#0c1118", line: "#5fe0ff", accent: "#ffd64e", glass: "#0e7490" },
  noche: { bg: "#080c15", ink: "#eaf1ff", fill: "#141b2a", line: "#a3e9ff", accent: "#ffd64e", glass: "#33415f" },
  crema: { bg: "#ffffeb", ink: "#1a1a1a", fill: "#fafadf", line: "#034f46", accent: "#ffd64e", glass: "#e4e4d0" },
};

const ETAPAS: readonly [number, keyof typeof TEMAS][] = [
  [0, "negro"],
  [0.14, "negro"],
  [0.38, "noche"],
  [0.5, "noche"],
  [0.64, "crema"],
  [0.86, "crema"],
  [0.985, "negro"],
];

/** La tinta cambia de golpe a mitad del fundido: gris sobre gris no se lee. */
const ETAPAS_TINTA: readonly [number, keyof typeof TEMAS][] = [
  [0, "negro"],
  [0.38, "noche"],
  [0.56, "noche"],
  [0.6, "crema"],
  [0.9, "crema"],
  [0.94, "negro"],
];

const hex = (h: string): Rgb => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const rampas = new Map<Clave, readonly [number, Rgb][]>();

export function color(clave: Clave, p: number): Rgb {
  let paradas = rampas.get(clave);
  if (!paradas) {
    const fuente = clave === "ink" || clave === "line" ? ETAPAS_TINTA : ETAPAS;
    paradas = fuente.map(([pos, tema]) => [pos, hex(TEMAS[tema][clave])] as [number, Rgb]);
    rampas.set(clave, paradas);
  }
  if (p <= paradas[0]![0]) return paradas[0]![1];
  for (let i = 1; i < paradas.length; i++) {
    const [pos, col] = paradas[i]!;
    if (p <= pos) {
      const [pPos, pCol] = paradas[i - 1]!;
      const t0 = (p - pPos) / (pos - pPos || 1);
      const t = t0 * t0 * (3 - 2 * t0);
      return [pCol[0] + (col[0] - pCol[0]) * t, pCol[1] + (col[1] - pCol[1]) * t, pCol[2] + (col[2] - pCol[2]) * t];
    }
  }
  return paradas[paradas.length - 1]![1];
}

export const css = ([r, g, b]: Rgb, a = 1) => (a >= 1 ? `rgb(${r | 0} ${g | 0} ${b | 0})` : `rgb(${r | 0} ${g | 0} ${b | 0} / ${a})`);

/* ── Materiales y piezas ────────────────────────────────────────────────── */

type Mats = {
  fill: THREE.MeshToonMaterial;
  accent: THREE.MeshToonMaterial;
  glass: THREE.MeshToonMaterial;
  line: THREE.LineBasicMaterial;
  accentLine: THREE.LineBasicMaterial;
};

function materiales(): Mats {
  const data = new Uint8Array([110, 170, 225, 255]);
  const gradientMap = new THREE.DataTexture(data, 4, 1, THREE.RedFormat);
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.needsUpdate = true;
  const base = { gradientMap, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 };
  return {
    fill: new THREE.MeshToonMaterial({ ...base, color: 0x0c1118 }),
    accent: new THREE.MeshToonMaterial({ ...base, color: 0xffd64e }),
    glass: new THREE.MeshToonMaterial({ ...base, color: 0x0e7490, transparent: true, opacity: 0.55 }),
    line: new THREE.LineBasicMaterial({ color: 0x5fe0ff, transparent: true, opacity: 0.9 }),
    accentLine: new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }),
  };
}

type V3 = [number, number, number];

function pieza(
  geos: THREE.BufferGeometry[],
  padre: THREE.Object3D,
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  lineMat: THREE.LineBasicMaterial,
  pos?: V3,
  rot?: V3,
  angulo = 24,
) {
  const bordes = new THREE.EdgesGeometry(geo, angulo);
  geos.push(geo, bordes);
  const mesh = new THREE.Mesh(geo, mat);
  const lineas = new THREE.LineSegments(bordes, lineMat);
  if (pos) {
    mesh.position.set(...pos);
    lineas.position.set(...pos);
  }
  if (rot) {
    mesh.rotation.set(...rot);
    lineas.rotation.set(...rot);
  }
  padre.add(mesh, lineas);
}

type Modulo = {
  grupo: THREE.Group;
  casa: THREE.Vector3;
  abierto: THREE.Vector3;
  giro: THREE.Euler;
  retraso: number;
};

/** Las nueve piezas, de adelante (la lente) hacia atrás (la base), apiladas en Z. */
function armar(m: Mats, geos: THREE.BufferGeometry[]): Modulo[] {
  const P = (g: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, l: THREE.LineBasicMaterial, pos?: V3, rot?: V3, a?: number) =>
    pieza(geos, g, geo, mat, l, pos, rot, a);
  const X: V3 = [Math.PI / 2, 0, 0];

  const constructores: Array<(g: THREE.Group) => void> = [
    // 0 · vista en vivo: anillo frontal y vidrio
    (g) => {
      P(g, new THREE.TorusGeometry(1.15, 0.13, 10, 48), m.fill, m.line);
      P(g, new THREE.CylinderGeometry(1.02, 1.02, 0.05, 48), m.glass, m.line, [0, 0, 0], X, 60);
      P(g, new THREE.TorusGeometry(0.42, 0.04, 8, 32), m.fill, m.line, [0, 0, 0.06]);
    },
    // 1 · Onvi IA: ocho aspas alrededor de una pupila amarilla
    (g) => {
      for (let i = 0; i < 8; i++) {
        const aspa = new THREE.Group();
        aspa.rotation.z = (i / 8) * Math.PI * 2;
        P(aspa, new THREE.BoxGeometry(0.62, 0.22, 0.06), m.fill, m.line, [0.62, 0, 0], [0, 0, 0.55]);
        g.add(aspa);
      }
      P(g, new THREE.SphereGeometry(0.34, 20, 14), m.accent, m.accentLine, undefined, undefined, 40);
      P(g, new THREE.TorusGeometry(1.0, 0.05, 8, 48), m.fill, m.line);
    },
    // 2 · núcleo: placa octogonal con bornes
    (g) => {
      P(g, new THREE.CylinderGeometry(1.25, 1.25, 0.14, 8), m.fill, m.line, [0, 0, 0], X);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        P(g, new THREE.CylinderGeometry(0.07, 0.07, 0.18, 8), m.fill, m.line, [Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0.12], X);
      }
    },
    // 3 · facturación: tres láminas apiladas
    (g) => {
      for (let i = 0; i < 3; i++) {
        P(g, new THREE.BoxGeometry(1.7, 1.25, 0.05), m.fill, m.line, [(i - 1) * 0.09, (i - 1) * -0.07, (i - 1) * 0.11], [0, 0, (i - 1) * 0.05]);
      }
      P(g, new THREE.BoxGeometry(1.1, 0.05, 0.06), m.accent, m.accentLine, [0, 0.35, 0.23]);
      P(g, new THREE.BoxGeometry(0.7, 0.05, 0.06), m.accent, m.accentLine, [-0.2, 0.15, 0.23]);
    },
    // 4 · inventario: cajas en anillo
    (g) => {
      P(g, new THREE.CylinderGeometry(0.55, 0.55, 0.3, 24), m.fill, m.line, [0, 0, 0], X);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        P(g, new THREE.BoxGeometry(0.3, 0.3, 0.3), m.fill, m.line, [Math.cos(a), Math.sin(a), 0], [0, 0, a]);
      }
    },
    // 5 · SINPE: disco con aletas
    (g) => {
      P(g, new THREE.CylinderGeometry(0.85, 0.85, 0.16, 32), m.fill, m.line, [0, 0, 0], X);
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        P(g, new THREE.BoxGeometry(0.5, 0.05, 0.28), m.fill, m.line, [Math.cos(a) * 1.05, Math.sin(a) * 1.05, 0], [0, 0, a]);
      }
      P(g, new THREE.TorusGeometry(0.4, 0.05, 8, 32), m.accent, m.accentLine, [0, 0, 0.1]);
    },
    // 6 · web y tienda: el marco de una pantalla
    (g) => {
      const [w, h, t] = [1.9, 1.3, 0.12];
      P(g, new THREE.BoxGeometry(w, t, 0.1), m.fill, m.line, [0, h / 2, 0]);
      P(g, new THREE.BoxGeometry(w, t, 0.1), m.fill, m.line, [0, -h / 2, 0]);
      P(g, new THREE.BoxGeometry(t, h, 0.1), m.fill, m.line, [-w / 2, 0, 0]);
      P(g, new THREE.BoxGeometry(t, h, 0.1), m.fill, m.line, [w / 2, 0, 0]);
      P(g, new THREE.BoxGeometry(w - t, h - t, 0.03), m.glass, m.line, [0, 0, -0.02], undefined, 60);
      P(g, new THREE.BoxGeometry(0.5, 0.16, 0.05), m.accent, m.accentLine, [-0.5, 0.25, 0.04]);
    },
    // 7 · tu industria: tres engranes
    (g) => {
      const engrane = (r: number, dientes: number, pos: V3, acento = false) => {
        const sub = new THREE.Group();
        sub.position.set(...pos);
        P(sub, new THREE.CylinderGeometry(r, r, 0.14, dientes), acento ? m.accent : m.fill, acento ? m.accentLine : m.line, [0, 0, 0], X);
        for (let i = 0; i < dientes; i++) {
          const a = (i / dientes) * Math.PI * 2;
          P(sub, new THREE.BoxGeometry(0.12, 0.12, 0.12), m.fill, m.line, [Math.cos(a) * (r + 0.04), Math.sin(a) * (r + 0.04), 0], [0, 0, a]);
        }
        g.add(sub);
      };
      engrane(0.62, 12, [-0.55, 0.3, 0]);
      engrane(0.42, 9, [0.5, 0.55, 0.02], true);
      engrane(0.5, 10, [0.35, -0.5, -0.02]);
    },
    // 8 · la base: montura trasera
    (g) => {
      P(g, new THREE.CylinderGeometry(0.95, 1.15, 0.36, 32), m.fill, m.line, [0, 0, 0], X);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        P(g, new THREE.BoxGeometry(0.22, 0.5, 0.1), m.fill, m.line, [Math.cos(a) * 1.3, Math.sin(a) * 1.3, -0.05], [0, 0, a + Math.PI / 2]);
      }
      P(g, new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16), m.fill, m.line, [0, 0, -0.3], X);
    },
  ];

  const zCasa = [2.05, 1.62, 1.18, 0.66, 0.02, -0.6, -1.22, -1.82, -2.5];
  const centro = (zCasa[0]! + zCasa[zCasa.length - 1]!) / 2;

  return constructores.map((armarPieza, i) => {
    const grupo = new THREE.Group();
    armarPieza(grupo);
    const z = zCasa[i]! - centro;
    const casa = new THREE.Vector3(0, 0, z);
    grupo.position.copy(casa);
    const giroZ = (i % 2 === 0 ? 1 : -1) * (0.5 + (i % 3) * 0.25);
    return {
      grupo,
      casa,
      abierto: new THREE.Vector3(Math.sin(i * 2.3) * 0.55, Math.cos(i * 1.7) * 0.45, z * 2.05),
      giro: new THREE.Euler(i === 3 || i === 6 ? 0.35 : 0.1, 0, giroZ),
      retraso: i * 0.04,
    };
  });
}

/* ── La escena ──────────────────────────────────────────────────────────── */

/** Recuadro en pantalla (px) de cada pieza, para poner su etiqueta al lado. */
export type Ancla = { x: number; y: number; visible: boolean; l: number; t: number; r: number; b: number };

export type Cuadro = {
  /** Progreso de la sección, 0..1, y sin límite. */
  p: number;
  bruto: number;
  /** Cuánto está abierto, 0..1. */
  abierto: number;
  anclas: Ancla[];
  fondo: string;
  tinta: string;
  suave: string;
};

/**
 * Monta el motor en `host` (que llena la pantalla pegada de la sección) y
 * llama `alCuadro` en cada cuadro. Devuelve cómo pausarlo y cómo desmontarlo.
 */
export function montarMotor(host: HTMLElement, seccion: HTMLElement, alCuadro: (c: Cuadro) => void) {
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.6));
  Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%" });
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 1.35));
  const luz = new THREE.DirectionalLight(0xffffff, 1.6);
  luz.position.set(4, 6, 8);
  scene.add(luz);
  const contra = new THREE.DirectionalLight(0xbfefff, 0.7);
  contra.position.set(-6, -3, -4);
  scene.add(contra);

  const geos: THREE.BufferGeometry[] = [];
  const mats = materiales();
  const modulos = armar(mats, geos);
  const inclinado = new THREE.Group();
  const giro = new THREE.Group();
  inclinado.add(giro);
  modulos.forEach((m) => giro.add(m.grupo));
  scene.add(inclinado);

  const raton = { x: 0, y: 0, tx: 0, ty: 0 };
  const alMover = (e: PointerEvent) => {
    raton.tx = (e.clientX / window.innerWidth) * 2 - 1;
    raton.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", alMover, { passive: true });

  let ancho = 1;
  let alto = 1;
  const medir = () => {
    ancho = host.clientWidth || window.innerWidth;
    alto = host.clientHeight || window.innerHeight;
    renderer.setSize(ancho, alto, false);
    camera.aspect = ancho / alto;
    camera.updateProjectionMatrix();
  };
  medir();
  const ro = new ResizeObserver(medir);
  ro.observe(host);

  const anclas: Ancla[] = modulos.map(() => ({ x: 0, y: 0, visible: false, l: 0, t: 0, r: 0, b: 0 }));
  const v = new THREE.Vector3();
  const destino = new THREE.Vector3();
  const esquinas = Array.from({ length: 8 }, () => new THREE.Vector3());
  const tmp = new THREE.Color();
  const blanco = new THREE.Color(0xffffff);
  const tintaPapel = new THREE.Color(0x1a1a1a);
  const pintar = (mat: { color: THREE.Color }, rgb: Rgb) => {
    tmp.setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, THREE.SRGBColorSpace);
    mat.color.copy(tmp);
  };
  const reloj = new THREE.Clock();
  // En el celular la cámara se acomoda sola: el motor (cerrado o abierto) entra
  // entero en su recuadro, centrado, sin pasarse a los textos.
  const encuadre = { dist: 16, x: 0, y: 1.2, cuadros: 0 };

  /**
   * Con lo que ocupa el motor en este cuadro, la cámara del siguiente: lo
   * acerca o aleja hasta que llena el recuadro (con aire) y lo centra. Los
   * primeros cuadros saltan directo; después se mueve suave.
   */
  const encuadrar = () => {
    let [l, t, r, b] = [Infinity, Infinity, -Infinity, -Infinity];
    for (const a of anclas) {
      if (!a.visible) continue;
      l = Math.min(l, a.l);
      t = Math.min(t, a.t);
      r = Math.max(r, a.r);
      b = Math.max(b, a.b);
    }
    if (!Number.isFinite(l) || r - l < 1 || b - t < 1) return;
    const k = Math.max((r - l) / (ancho * 0.88), (b - t) / (alto * 0.9));
    const mundoPorPx = (2 * encuadre.dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / alto;
    const meta = {
      dist: Math.min(60, Math.max(4, encuadre.dist * k)),
      x: encuadre.x + ((l + r) / 2 - ancho / 2) * mundoPorPx,
      y: encuadre.y - ((t + b) / 2 - alto / 2) * mundoPorPx,
    };
    const suave = encuadre.cuadros < 6 ? 1 : 0.12;
    encuadre.cuadros++;
    encuadre.dist += (meta.dist - encuadre.dist) * suave;
    encuadre.x += (meta.x - encuadre.x) * suave;
    encuadre.y += (meta.y - encuadre.y) * suave;
  };

  const cuadro = () => {
    const t = reloj.getElapsedTime();
    const bruto = recorrido(seccion, window.innerHeight);
    const p = clamp01(bruto);
    const ab = apertura(p);

    pintar(mats.fill, color("fill", p));
    pintar(mats.line, color("line", p));
    pintar(mats.accent, color("accent", p));
    pintar(mats.glass, color("glass", p));
    const papel = smoothstep(0.56, 0.62, p) * (1 - smoothstep(0.9, 0.94, p));
    mats.accentLine.color.copy(blanco).lerp(tintaPapel, papel);
    mats.glass.opacity = 0.55 - papel * 0.25;

    const vertical = ancho < 768;
    raton.x += (raton.tx - raton.x) * 0.06;
    raton.y += (raton.ty - raton.y) * 0.06;
    if (vertical) inclinado.rotation.set(-1.18, 0.14, 0.1);
    else inclinado.rotation.set(0.5 + raton.y * 0.08, -0.72 + raton.x * 0.12, 0.18);
    // En compu el motor va corrido a la derecha: a la izquierda está el título.
    inclinado.position.set(vertical ? 0 : camera.aspect > 1.45 ? 1.55 : 1.15, 0, 0);
    giro.rotation.z = (quieto ? 0 : t * 0.12) + p * 2.4;

    for (let i = 0; i < modulos.length; i++) {
      const m = modulos[i]!;
      const local = smoothstep(0, 1, clamp01(ab * 1.35 - m.retraso));
      destino.copy(m.abierto);
      if (vertical) {
        // En el celular se abre de arriba hacia abajo y menos ancho: las etiquetas van en una lista.
        destino.x *= 0.55;
        destino.y *= 0.7;
        destino.z *= 0.7;
      }
      m.grupo.position.lerpVectors(m.casa, destino, local);
      m.grupo.rotation.set(m.giro.x * local, 0, m.giro.z * local);
    }

    if (vertical) {
      camera.position.set(encuadre.x, encuadre.y + 0.3, encuadre.dist);
      camera.lookAt(encuadre.x, encuadre.y, 0);
    } else {
      camera.position.set(ab * 0.6, 0.35 - ab * 0.2, 10.2 + ab * 5.2);
      camera.lookAt(ab * 0.6, 0, 0);
    }

    // Dónde cae cada pieza en pantalla (y su recuadro), para las etiquetas.
    for (let i = 0; i < modulos.length; i++) {
      const g = modulos[i]!.grupo;
      g.getWorldPosition(v);
      v.project(camera);
      const a = anclas[i]!;
      a.x = ((v.x + 1) / 2) * ancho;
      a.y = ((1 - v.y) / 2) * alto;
      a.visible = v.z < 1;
      let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
      g.traverse((hijo) => {
        const mesh = hijo as THREE.Mesh;
        if (!mesh.isMesh || !mesh.geometry) return;
        if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
        const bb = mesh.geometry.boundingBox;
        if (!bb || bb.isEmpty()) return;
        const { min, max } = bb;
        esquinas[0]!.set(min.x, min.y, min.z);
        esquinas[1]!.set(min.x, min.y, max.z);
        esquinas[2]!.set(min.x, max.y, min.z);
        esquinas[3]!.set(min.x, max.y, max.z);
        esquinas[4]!.set(max.x, min.y, min.z);
        esquinas[5]!.set(max.x, min.y, max.z);
        esquinas[6]!.set(max.x, max.y, min.z);
        esquinas[7]!.set(max.x, max.y, max.z);
        hijo.updateWorldMatrix(true, false);
        for (const c of esquinas) {
          c.applyMatrix4(hijo.matrixWorld).project(camera);
          const sx = ((c.x + 1) / 2) * ancho;
          const sy = ((1 - c.y) / 2) * alto;
          if (sx < minX) minX = sx;
          if (sy < minY) minY = sy;
          if (sx > maxX) maxX = sx;
          if (sy > maxY) maxY = sy;
        }
      });
      if (Number.isFinite(minX)) Object.assign(a, { l: minX, t: minY, r: maxX, b: maxY });
      else Object.assign(a, { l: a.x, r: a.x, t: a.y, b: a.y });
    }

    if (vertical) encuadrar();

    const tinta = color("ink", p);
    alCuadro({ p, bruto, abierto: ab, anclas, fondo: css(color("bg", p)), tinta: css(tinta), suave: css(tinta, 0.6) });
    renderer.render(scene, camera);
  };

  let andando = false;
  const pausar = (si: boolean) => {
    const debe = !si && !document.hidden;
    if (debe === andando) return;
    andando = debe;
    renderer.setAnimationLoop(debe ? cuadro : null);
  };
  let fuera = false;
  const alVisibilidad = () => pausar(fuera);
  document.addEventListener("visibilitychange", alVisibilidad);
  pausar(false);

  return {
    /** Fuera de pantalla no dibuja. */
    pausar: (si: boolean) => {
      fuera = si;
      pausar(si);
    },
    desmontar: () => {
      renderer.setAnimationLoop(null);
      document.removeEventListener("visibilitychange", alVisibilidad);
      window.removeEventListener("pointermove", alMover);
      ro.disconnect();
      geos.forEach((g) => g.dispose());
      Object.values(mats).forEach((m) => m.dispose());
      mats.fill.gradientMap?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
