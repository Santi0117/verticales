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

```
src/
├── app/
│   ├── page.tsx               la página (en "/")
│   ├── layout.tsx             fuentes, cursor y estilos base
│   ├── fonts.ts               Geist, Geist Mono e Instrument Serif
│   ├── api/checkout/          crea el link de pago en Onvo
│   └── activar/exito/         después de pagar, manda a la app del vertical
├── components/
│   ├── verticales/            las piezas de la página
│   │   ├── VerticalesPage.tsx arma todo y maneja la selección y el pago
│   │   ├── Nav.tsx            menú flotante
│   │   ├── Hero.tsx           portada con las pantallas de cada sistema
│   │   ├── Ribbon.tsx         cinta con las 10 industrias
│   │   ├── Steps.tsx          elegí · pagá · entrá
│   │   ├── Selector.tsx       lista de industrias y panel con su pantalla
│   │   ├── Checkout.tsx       resumen y botón de pagar
│   │   ├── StickyBar.tsx      barra fija para ir a pagar
│   │   ├── Footer.tsx         pie con el logo grande
│   │   ├── data.ts            industrias, colores y precio
│   │   └── verticales.css     todo el diseño
│   └── CustomCursor.tsx       el cursor del sitio
└── lib/                       textos, industrias, precio y cliente de Onvo
public/
├── product/                   las pantallas reales de los 10 sistemas
└── logo-eye-accent.png        el ojo de Onvision
```

Los textos, las industrias y el precio salen de `src/lib/content.ts`. Las
pantallas de cada sistema, de `src/lib/sistema-demo.ts`.

## Publicarla en Vercel

1. En Vercel: **Add New → Project** e importá este repositorio.
2. Cargá las variables de `.env.example` en **Settings → Environment Variables**.
3. Asignale su propio dominio (por ejemplo `verticales.onvisiondigital.com`).

## Qué sale del sitio

- Cómo funciona, Industrias, Compará, Precios y Módulos llevan a
  `onvisiondigital.com/producto`, que es donde viven esas secciones.
- El aviso de pago confirmado (webhook de Onvo) sigue llegando a la landing
  oficial, porque es la dirección que Onvo tiene configurada.
