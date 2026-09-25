export type SistemaId =
  | "clinicas"
  | "restaurantes"
  | "retail"
  | "constructoras"
  | "talleres"
  | "abogados"
  | "bienes-raices"
  | "ganaderia"
  | "agricultura"
  | "personal";

export type SistemaVertical = {
  id: SistemaId;
  name: string;
  product: string;
  image: string;
  alt: string;
  bg: string;
};

export const sistemaVerticals: SistemaVertical[] = [
  {
    id: "clinicas",
    name: "Salud",
    product: "Onvision Salud",
    image: "/product/clinicas-panel-hq.webp",
    alt: "Agenda semanal de Onvision Salud",
    bg: "#0b1a2e",
  },
  {
    id: "restaurantes",
    name: "Restaurante",
    product: "Onvision Restaurante",
    image: "/product/restaurantes-panel-hq.webp",
    alt: "Pase de cocina de Onvision Restaurante",
    bg: "#eef3f8",
  },
  {
    id: "retail",
    name: "Retail",
    product: "Onvision Retail",
    image: "/product/retail-pos-hq2.webp",
    alt: "POS de Onvision Retail",
    bg: "#f7f4ef",
  },
  {
    id: "constructoras",
    name: "Obras",
    product: "Onvision Obras",
    image: "/product/constructoras-panel-hq2.webp",
    alt: "Proyecto Residencial Los Cedros en Onvision Obras",
    bg: "#f4efe8",
  },
  {
    id: "talleres",
    name: "Taller",
    product: "Onvision Taller",
    image: "/product/talleres-panel-hq.webp",
    alt: "Tablero de órdenes de Onvision Taller",
    bg: "#f4f4f5",
  },
  {
    id: "abogados",
    name: "Legal",
    product: "Onvision Legal",
    image: "/product/abogados-panel-hq.webp",
    alt: "Panel de plazos y expedientes de Onvision Legal",
    bg: "#f6f0ea",
  },
  {
    id: "bienes-raices",
    name: "Inmobiliaria",
    product: "Onvision Inmobiliaria",
    image: "/product/inmobiliaria-panel-hq2.webp",
    alt: "Cartera de propiedades de Onvision Inmobiliaria",
    bg: "#f1ece4",
  },
  {
    id: "ganaderia",
    name: "Ganadero",
    product: "Onvision Ganadero",
    image: "/product/ganaderia-panel-hq.webp",
    alt: "Producción de quesos en Onvision Ganadero",
    bg: "#eef6f1",
  },
  {
    id: "agricultura",
    name: "Agrícola",
    product: "Onvision Agrícola",
    image: "/product/agricultura-panel-hq.webp",
    alt: "Parcelas y cosecha de Onvision Agrícola",
    bg: "#eef6e8",
  },
  {
    id: "personal",
    name: "Personal",
    product: "Onvision Personal",
    image: "/product/personal-panel-hq.webp",
    alt: "Presupuesto del hogar en Onvision Personal",
    bg: "#efeaf8",
  },
];
