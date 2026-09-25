/**
 * El carrusel "Todo su negocio centralizado según su industria" de la
 * landing (CentralizedShowcase), con sus textos tal cual: resumen del
 * panel, lo que trae y lo que hace ONVI en cada industria.
 */

export type Spec = { title: string; description: string };

export type Sector = {
  id: string;
  name: string;
  detail: string;
  panelBody: string;
  specs: Spec[];
  highlight: Spec | null;
};

export const sectores: Sector[] = [
  {
    id: "retail",
    name: "Retail",
    detail: "POS · inventario · caja",
    panelBody:
      "POS, carrito y cobro en un solo flujo — escaneá, cobrá con SINPE o tarjeta y seguí vendiendo.",
    specs: [
      {
        title: "POS con código de barras",
        description: "Buscá o escaneá productos y cobrá sin salir del mostrador.",
      },
      {
        title: "Carrito y multi-pago",
        description: "Efectivo, SINPE, tarjeta, transferencia o fiado en el mismo cobro.",
      },
      {
        title: "Stock en vivo",
        description: "Unidades visibles en cada producto antes de vender de más.",
      },
      {
        title: "Cliente en la venta",
        description: "Asociá el tiquete al cliente y mantené el historial de compras.",
      },
    ],
    highlight: {
      title: "ONVI en tu tienda",
      description: "Señales de qué reponer y dónde se te va el margen — sin hojas de cálculo.",
    },
  },
  {
    id: "constructoras",
    name: "Constructoras",
    detail: "Obra · avance · costos",
    panelBody:
      "Proyectos, avance físico y presupuesto en un solo panel — sabé qué obra va y qué requiere acción.",
    specs: [
      {
        title: "Avance de obra por etapas",
        description: "Seguí el % físico y vinculalo a facturación parcial del contrato.",
      },
      {
        title: "Presupuesto y ejecutado",
        description: "Presupuesto, ejecutado, saldo y margen estimado por proyecto.",
      },
      {
        title: "Órdenes de compra",
        description: "Aprobá OC y materiales sin perder el rastro por obra.",
      },
      {
        title: "Cobros y alertas del día",
        description: "Cobros vencidos y pendientes que requieren atención hoy.",
      },
    ],
    highlight: {
      title: "ONVI en tu obra",
      description: "Qué proyectos se desvían de presupuesto y dónde apretar costos a tiempo.",
    },
  },
  {
    id: "restaurantes",
    name: "Restaurantes",
    detail: "Mesas · cocina · cobro",
    panelBody:
      "Pase de cocina, mesas y caja del turno — sabé qué pedido va atrasado antes de que se queje el cliente.",
    specs: [
      {
        title: "Pase de cocina",
        description: "Mesas con tiempo en vivo: a tiempo, apurado o atrasado.",
      },
      {
        title: "POS y mesas",
        description: "Tomá la orden y pasala a cocina sin papel ni gritos.",
      },
      {
        title: "Caja del turno",
        description: "Estado de caja, facturas pendientes y atajos para cobrar.",
      },
      {
        title: "Stock crítico",
        description: "Productos bajo mínimo visibles antes de que se acabe el menú.",
      },
    ],
    highlight: {
      title: "ONVI en tu local",
      description: "Qué mesas se atrasan y dónde se te va el margen del turno.",
    },
  },
  {
    id: "clinicas",
    name: "Clínicas",
    detail: "Agenda · pacientes",
    panelBody:
      "Agenda semanal, estados de cita y cobro programado — recepción ve el día completo de un vistazo.",
    specs: [
      {
        title: "Agenda día o semana",
        description: "Vista clara de citas libres, confirmadas o en sala.",
      },
      {
        title: "Estados de cita",
        description: "Programada, confirmada o en sala — sin llamadas cruzadas.",
      },
      {
        title: "Búsqueda de pacientes",
        description: "Encontrá al paciente y abrí la cita en segundos.",
      },
      {
        title: "Cobro programado",
        description: "Monto del día/semana a la vista antes de facturar.",
      },
    ],
    highlight: {
      title: "ONVI en tu clínica",
      description: "Huecos en agenda y citas que requieren seguimiento, sin Excel.",
    },
  },
  {
    id: "bienes-raices",
    name: "Inmobiliaria",
    detail: "Cartera · CRM",
    panelBody:
      "Ficha de propiedad, estado y agenda de visitas — cartera lista para cerrar y facturar.",
    specs: [
      {
        title: "Ficha de propiedad",
        description: "Fotos, tipo, operación y agente en un solo detalle.",
      },
      {
        title: "Estados de cartera",
        description: "Disponible, alquiler o venta — sin perder el seguimiento.",
      },
      {
        title: "Agendar visita",
        description: "Programá visitas desde la ficha sin salir del flujo.",
      },
      {
        title: "Compartir e imprimir",
        description: "Mandá la ficha al cliente o imprimila en un clic.",
      },
    ],
    highlight: {
      title: "ONVI en tu agencia",
      description: "Qué leads enfrían y qué propiedades se mueven — para empujar lo que sí convierte.",
    },
  },
  {
    id: "abogados",
    name: "Abogados",
    detail: "Expedientes · plazos",
    panelBody:
      "Expedientes, plazos hábiles y honorarios — protocolo y cartera en un solo panel.",
    specs: [],
    highlight: null,
  },
  {
    id: "ganaderia",
    name: "Ganadería",
    detail: "Lotes · ventas",
    panelBody:
      "Cabezas por lote, tratamientos y ventas — con factura cuando cobrás.",
    specs: [],
    highlight: null,
  },
  {
    id: "agricultura",
    name: "Agricultura",
    detail: "Parcelas · cosechas",
    panelBody:
      "Parcelas, costos por ciclo y ventas de cosecha con factura 4.4.",
    specs: [],
    highlight: null,
  },
  {
    id: "talleres",
    name: "Talleres",
    detail: "Órdenes · repuestos",
    panelBody:
      "Órdenes de trabajo, historial por placa y repuestos — del presupuesto a la factura.",
    specs: [],
    highlight: null,
  },
  {
    id: "personal",
    name: "Personal",
    detail: "Hogar · presupuesto",
    panelBody:
      "Presupuesto, deudas y cuesta de enero — finanzas de la casa, sin factura electrónica.",
    specs: [],
    highlight: null,
  },
];
