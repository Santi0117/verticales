# Onvision Verticales

La página para activar el software de cada industria: elegís tu industria,
pagás ₡10,500/mes con tarjeta y creás tu cuenta.

Es un sitio **aparte** de [onvisiondigital.com](https://onvisiondigital.com):
vive en su propio repositorio y se publica como su propio proyecto, así que
nada de lo que pase acá toca la landing oficial.

## Correrla en tu compu

```bash
npm install
npm run dev
```

Abrí [http://localhost:3030](http://localhost:3030).

Necesita Node 20.9 o más nuevo.

## Qué hay adentro

Todas las partes de la página original de sistema, en una sola página con el
estilo mezclado de sibaldesign, wisprflow, clarvos y jeffmilanes.

```
src/
├── app/
│   ├── page.tsx               la página (en "/")
│   ├── layout.tsx             fuentes, cursor y el script de la intro
│   ├── fonts.ts               Archivo, EB Garamond, Figtree, Geist Mono y Chakra Petch
│   ├── api/checkout/          crea el link de pago en Onvo
│   └── activar/exito/         después de pagar, manda a la app del vertical
├── components/
│   ├── sitio/                 las piezas de la página, en orden
│   │   ├── Sitio.tsx          arma todo; scroll suave, selección y pago
│   │   ├── Boot.tsx           intro "iniciando" (una vez por visita)
│   │   ├── Anuncio.tsx        barra de arriba
│   │   ├── Nav.tsx            menú flotante
│   │   ├── Hero.tsx           portada con la palabra que rota y el mosaico
│   │   ├── Escaner.tsx        franja: lo de antes pasa por el ojo y sale hecho
│   │   ├── Listas.tsx         industrias listas (marquesina)
│   │   ├── Nucleo.tsx         el núcleo y tu giro, en cinco filas
│   │   ├── Showcase.tsx       por industria: nombre gigante y su pantalla
│   │   ├── Base.tsx           base común: contador y diagrama
│   │   ├── Detalle.tsx        detalle por industria (acordeón)
│   │   ├── Pasos.tsx          cómo funciona, con el dibujo de puntos
│   │   ├── Particulas.tsx     el dibujo de puntos (canvas)
│   │   ├── Hud.tsx            Onvision vs otros (comparativa)
│   │   ├── Precios.tsx        precio mensual o anual y el plan
│   │   ├── Registro.tsx       prueba de 15 días
│   │   ├── ChatPrueba.tsx     Onvi: el chat que arma la prueba
│   │   ├── Activar.tsx        elegí tu industria y pagá
│   │   ├── Pie.tsx            pie con el logo grande y la hora de CR
│   │   ├── Chrome.tsx         escena, película, WhatsApp y barra para pagar
│   │   ├── ui.tsx             piezas chicas (etiquetas, flechas, íconos)
│   │   ├── data.ts            industrias, colores, precio y escenas
│   │   ├── sitio.css          colores, letras y piezas comunes
│   │   └── secciones.css      el diseño de cada sección
│   └── CustomCursor.tsx       el cursor del sitio
└── lib/                       textos, industrias, precio y cliente de Onvo
public/
├── product/                   las pantallas reales de los 10 sistemas
├── logo-eye.png               el ojo de Onvision en blanco
└── logo-eye-accent.png        el ojo de Onvision en color
```

Los textos, las industrias y el precio salen de `src/lib/content.ts`; lo de
cada industria en "Por industria", de `src/lib/sectores.ts`. Las pantallas de
cada sistema, de `src/lib/sistema-demo.ts`.

Con "reducir movimiento" activado en el sistema, no hay intro, ni scroll
suave, ni animaciones.

## Publicarla en Vercel

1. En Vercel: **Add New → Project** e importá este repositorio.
2. Cargá las variables de `.env.example` en **Settings → Environment Variables**.
3. Asignale su propio dominio (por ejemplo `verticales.onvisiondigital.com`).

## Qué sale del sitio

- Cómo funciona, Industrias, Compará, Precios y Módulos son secciones de esta
  misma página; el menú baja hasta cada una.
- El aviso de pago confirmado (webhook de Onvo) sigue llegando a la landing
  oficial, porque es la dirección que Onvo tiene configurada.
