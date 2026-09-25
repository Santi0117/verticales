export const navLinks = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Industrias", href: "#industrias-imagenes" },
  { label: "Compará", href: "#comparativa" },
  { label: "Precios", href: "#precios" },
];

export const hero = {
  brand: "Onvision",
  line1: "Onvision ya tiene la solución",
  highlight: "para tu empresa",
  line2:
    "Facturación electrónica FE 4.4, inventario, POS y pagos SINPE en un solo sistema para gestionar tu empresa en Costa Rica y cumplir con Hacienda y TRIBU-CR.",
  priceNote: "₡10,500 / mes · todos los sectores · producto de Onvision Digital",
  ctaPrimary: "Activar Onvision",
  ctaSecondary: "Ver industrias",
  ctaSecondaryHref: "#industrias-imagenes",
};

export const baseFeatures = [
  { name: "Facturación 4.4", detail: "ATV · Hacienda" },
  { name: "Inventario", detail: "Stock en tiempo real" },
  { name: "SINPE Móvil", detail: "Pagos nativos" },
  { name: "CRC / USD", detail: "Multi-moneda" },
  { name: "Reportes IVA", detail: "Básicos incluidos" },
];

export const appsIntro = {
  title: "Una base común. Módulos según tu giro.",
  body: "Todas las empresas comparten facturación electrónica, inventario y pagos. Encima se activan los módulos de tu industria — sin ERP pesado ni consultoría de meses.",
};

export const problems = [
  {
    title: "Facturación electrónica 4.4",
    description:
      "Obligatoria por Hacienda (ATV), compleja y que cambia seguido. Los softwares extranjeros tardan en actualizarse; los locales básicos se quedan cortos.",
  },
  {
    title: "CCSS, aguinaldo y liquidaciones",
    description:
      "Reglas laborales de Costa Rica que los SaaS internacionales no manejan bien. Terminás reconciliando a mano en Excel.",
  },
  {
    title: "Pagos en CRC y USD",
    description:
      "Operar en dos monedas es normal aquí. La mayoría de plataformas extranjeras lo gestiona mal o con atajos frágiles.",
  },
  {
    title: "SINPE Móvil dominante",
    description:
      "Es el método de pago del día a día en CR — y casi ningún software internacional lo integra de verdad desde el inicio.",
  },
];

export const howItWorks = [
  {
    step: "01",
    title: "Elegí tu industria",
    description:
      "Restaurante, constructora, bienes raíces, clínica, retail, ganadería, agricultura o taller. Activás la vertical que necesitás — el núcleo ya viene incluido.",
  },
  {
    step: "02",
    title: "Personalizá",
    description:
      "Logo, datos de la empresa, cédula jurídica, moneda preferida y preferencias de cobro. Sin implementaciones de 3 meses.",
  },
  {
    step: "03",
    title: "Empezá a facturar",
    description:
      "Emití facturas electrónicas, controlá inventario y cobrá con SINPE. Si cambiás de giro, cambiás de vertical sin migrar datos.",
  },
];

export const verticals = [
  {
    id: "restaurantes",
    name: "Restaurantes y relacionados",
    subtitle: "Bares, sodas, cafeterías, food trucks",
    icon: "restaurant" as const,
    image: "/sectors/restaurantes.svg",
    pitch:
      "Dejá de pelear entre mesas, cocina y caja. Onvision une POS, comandas e IVA de comida preparada en un flujo pensado para el servicio real en Costa Rica.",
    helps: [
      "Acelerá el servicio: el mesero toma la orden en el POS y la cocina la ve al instante, con modificadores claros.",
      "Cerrá caja sin Excel: propinas, medios de pago y SINPE quedan cuadrados al final del turno.",
      "Facturá bien desde el primer día: IVA diferenciado (13% comida preparada) alineado con Hacienda 4.4.",
      "Controlá merma e inventario de insumos críticos sin un ERP pesado.",
    ],
    features: [
      "POS táctil para mesas",
      "Menú y modificadores",
      "Comandas por cocina",
      "Cierre de caja y propinas",
      "IVA diferenciado (13% comida preparada)",
    ],
  },
  {
    id: "retail",
    name: "Retail",
    subtitle: "Tiendas, salones, ferreterías y más",
    icon: "retail" as const,
    image: "/sectors/retail.svg",
    pitch:
      "Vendé más y perdé menos stock. El núcleo de facturación e inventario se adapta a tu tipo de tienda — no al revés.",
    helps: [
      "Cobrá rápido en mostrador con código de barras, multi-moneda y SINPE en el mismo flujo.",
      "Recibí alertas de stock mínimo antes de que se te acabe lo que más se vende.",
      "Organizá proveedores y órdenes de compra sin perder el hilo de costos.",
      "Separá categorías por giro (ferretería, salón, boutique) manteniendo la misma caja.",
    ],
    features: [
      "POS con lector de código de barras",
      "Stock con alertas",
      "Gestión de proveedores",
      "Sub-categorías por tipo de tienda",
    ],
  },
  {
    id: "clinicas",
    name: "Clínicas y sector médico",
    subtitle: "Médicos, dentistas, veterinarios, fisio",
    icon: "clinic" as const,
    image: "/sectors/clinicas.svg",
    pitch:
      "Agenda, expediente y cobro en un solo lugar. Menos llamadas perdidas, menos papeles y facturación electrónica lista para Hacienda.",
    helps: [
      "Reducí no-shows con agenda clara, recordatorios y estados de cita visibles para recepción.",
      "Tené el historial del paciente a mano en la consulta — sin buscar carpetas.",
      "Cobrás consulta o procedimiento y emitís factura 4.4 al momento.",
      "Separá flujos para medicina, dental, vet o fisio sin cambiar de sistema.",
    ],
    features: [
      "Agendamiento de citas",
      "Expediente digital del paciente",
      "Cobros por consulta / procedimiento",
      "Historial clínico básico",
    ],
  },
  {
    id: "abogados",
    name: "Abogados y notarios",
    subtitle: "Expedientes, plazos y protocolo",
    icon: "legal" as const,
    image: "/sectors/abogados.svg",
    pitch:
      "Los plazos en Costa Rica no perdonan. Onvision te ayuda a llevar expedientes, feriados y protocolo sin hojas sueltas.",
    helps: [
      "Calculá plazos en días hábiles con feriados de CR para no perder audiencias ni vencimientos.",
      "Organizá protocolo, instrumentos e índices quincenales en un solo panel.",
      "Dale seguimiento a sociedades y sus vencimientos antes de que se te pasen.",
      "Facturá honorarios con electrónica 4.4 y controlá cartera de clientes.",
    ],
    features: [
      "Plazos en días hábiles, con feriados de CR",
      "Protocolo, instrumentos e índices quincenales",
      "Cartera de sociedades y sus vencimientos",
      "Honorarios y factura electrónica",
    ],
  },
  {
    id: "constructoras",
    name: "Constructoras",
    subtitle: "Obra civil y desarrollo",
    icon: "construction" as const,
    image: "/sectors/constructoras.svg",
    pitch:
      "De la cotización al avance de obra con costos bajo control. Menos sorpresas en materiales y subcontratos.",
    helps: [
      "Seguí el avance por etapas y vinculalo a facturación parcial según el contrato.",
      "Centralizá cotizaciones, órdenes de compra y materiales por proyecto.",
      "Controlá subcontratistas y entregables sin perder el rastro de pagos.",
      "Mantené CRC/USD claros cuando comprás insumos importados.",
    ],
    features: [
      "Avance de obra por etapas",
      "Cotizaciones y contratos de proyecto",
      "Materiales y subcontratistas",
      "Órdenes de compra",
    ],
  },
  {
    id: "bienes-raices",
    name: "Bienes raíces",
    subtitle: "Agencias e inmobiliarias",
    icon: "realestate" as const,
    image: "/sectors/bienes-raices.svg",
    pitch:
      "Cartera, leads y comisiones en un solo sistema — listo para cerrar y facturar en CR.",
    helps: [
      "Publicá y filtrá propiedades en cartera sin perder el estado de cada una.",
      "Dale seguimiento a leads y visitas hasta el cierre.",
      "Generá contratos de compraventa o alquiler con menos fricción.",
      "Liquidá comisiones por agente con trazabilidad clara.",
    ],
    features: [
      "Propiedades en cartera",
      "Seguimiento de clientes y leads",
      "Contratos de compraventa y alquiler",
      "Comisiones por agente",
    ],
  },
  {
    id: "ganaderia",
    name: "Ganadería",
    subtitle: "Lotes, producción y ventas",
    icon: "livestock" as const,
    image: "/sectors/ganaderia.svg",
    pitch:
      "Sabé qué tenés en el campo, qué se trató y qué se vendió — con factura electrónica cuando cobrás.",
    helps: [
      "Registrá cabezas por lote y mové inventario sin perder el conteo.",
      "Llevá vacunas y tratamientos con historial por animal o grupo.",
      "Gestioná ventas de ganado y documentos en el mismo flujo.",
      "Revisá reportes de producción para decidir con datos, no con memoria.",
    ],
    features: [
      "Registro de cabezas por lote",
      "Vacunas y tratamientos",
      "Gestión de ventas de ganado",
      "Reportes de producción",
    ],
  },
  {
    id: "agricultura",
    name: "Agricultura",
    subtitle: "Parcelas, ciclos y cosechas",
    icon: "agriculture" as const,
    image: "/sectors/agricultura.svg",
    pitch:
      "Costos por ciclo, insumos y ventas con factura 4.4: claridad desde la parcela hasta el cobro.",
    helps: [
      "Mapeá parcelas y cultivos activos en una vista simple.",
      "Asigná insumos y costos por ciclo para saber si el cultivo rinde.",
      "Planificá cosechas y ventana de venta con menos improvisación.",
      "Emití factura electrónica al vender la producción.",
    ],
    features: [
      "Parcelas y cultivos",
      "Insumos y costos por ciclo",
      "Planificación de cosechas",
      "Ventas con factura electrónica",
    ],
  },
  {
    id: "talleres",
    name: "Talleres y servicios técnicos",
    subtitle: "Mecánica y equipo",
    icon: "workshop" as const,
    image: "/sectors/talleres.svg",
    pitch:
      "Órdenes de trabajo, historial por placa y repuestos bajo control — del presupuesto a la factura.",
    helps: [
      "Abrí órdenes de trabajo con diagnóstico, estado y responsable.",
      "Consultá historial por placa o número de serie en segundos.",
      "Mandá presupuestos a aprobación antes de gastar repuestos.",
      "Descontá inventario de piezas al cerrar el trabajo y facturá al cliente.",
    ],
    features: [
      "Órdenes de trabajo",
      "Historial por placa o serie",
      "Presupuestos y aprobaciones",
      "Inventario de repuestos",
    ],
  },
  {
    id: "personal",
    name: "Personal y hogar",
    subtitle: "Finanzas de la casa — sin factura electrónica",
    icon: "personal" as const,
    image: "/sectors/personal.svg",
    pitch:
      "Aguinaldo, marchamo y la cuesta de enero en un solo lugar. Presupuesto, deudas y metas para vos o para el hogar — sin mezclar con Hacienda.",
    helps: [
      "Anticipá la cuesta de enero: marchamo, matrículas y útiles contra el aguinaldo.",
      "Presupuestá el mes con sobres o la guía 50/30/20, sin inflar reportes con transferencias.",
      "Salí de deudas con avalancha o bola de nieve — y mirá cuánto cuesta la diferencia.",
      "Modo solo yo o hogar compartido. Sin cédula ni FE: esto no es un negocio ante ATV.",
    ],
    features: [
      "Cuesta de enero y calendario CR",
      "Presupuesto 50/30/20 y sobres",
      "Deudas, metas y patrimonio",
      "Modo PERSONAL u HOGAR",
    ],
  },
];

export const comparisonRows = [
  {
    label: "Precio base / mes",
    onvision: "₡10,500",
    alegra: "$10 (Pyme)",
    facturele: "~$5",
  },
  {
    label: "Límite de facturas",
    onvision: "Ilimitadas*",
    alegra: "50 / mes",
    facturele: "Ilimitadas",
  },
  {
    label: "Verticales por industria",
    onvision: "10 verticales",
    alegra: "No",
    facturele: "No",
  },
  {
    label: "SINPE Móvil nativo",
    onvision: "Sí",
    alegra: "Limitado",
    facturele: "No",
  },
  {
    label: "Multi-moneda CRC / USD",
    onvision: "Nativo",
    alegra: "Parcial",
    facturele: "Básico",
  },
  {
    label: "Hecho para Hacienda CR",
    onvision: "Desde el diseño",
    alegra: "Adaptado",
    facturele: "Solo facturación",
  },
];

export const pricingTiers = [
  {
    id: "unico",
    name: "Plan Onvision",
    subtitle:
      "Un solo precio para todas las industrias: núcleo + módulos de tu vertical",
    monthly: 10500,
    highlighted: true,
    badge: "Precio único",
    features: [
      "Facturas electrónicas ilimitadas",
      "Inventario completo",
      "SINPE Móvil y multi-moneda",
      "Módulos de la industria que elegís",
      "Reportes básicos de IVA",
      "Soporte en español para PYMEs",
      "Sin cobros ocultos por usuario",
    ],
  },
];

export const valueProps = [
  {
    title: "Local primero",
    description:
      "Construido sobre Hacienda y CCSS — no adaptado después de un producto extranjero.",
  },
  {
    title: "Un login, muchas industrias",
    description:
      "Si cambiás de giro, cambiás de vertical sin migrar datos ni empezar de cero.",
  },
  {
    title: "Listo hoy",
    description:
      "No es consultoría ni ERP pesado. Entrá, configurá y facturá el mismo día.",
  },
  {
    title: "SINPE nativo",
    description:
      "El método de pago que ya usan tus clientes, integrado desde el día uno.",
  },
  {
    title: "Precio justo",
    description:
      "₡10,500 al mes, todos los sectores. Facturas ilimitadas. Sin cobros ocultos.",
  },
  {
    title: "Verticalización real",
    description:
      "El diferenciador no es pelear por $5/mes: es un SaaS distinto por industria sobre el mismo núcleo.",
  },
];

export const sectorShowcase = {
  eyebrow: "El núcleo y tu giro",
  title: "Facturá, controlá stock, mirá la caja — y decidí con datos de tu industria.",
  cards: [
    {
      id: "fe",
      href: "#modulos",
      title: "Facturación electrónica 4.4",
      description:
        "XML, clave numérica y acuse de Hacienda / TRIBU-CR. El mismo núcleo en todas las verticales.",
      visual: "fe" as const,
      featured: true,
    },
    {
      id: "inventario",
      href: "#modulos",
      title: "Inventario en vivo",
      description:
        "Stock al segundo: ventas, compras y alertas de mínimo sin esperar el cierre del día.",
      visual: "stock" as const,
      featured: false,
    },
    {
      id: "finanzas",
      href: "#modulos",
      title: "Finanzas",
      description:
        "Caja del día, ingresos, egresos y SINPE — la plata de la empresa en un solo panel.",
      visual: "finanzas" as const,
      featured: false,
    },
    {
      id: "giros",
      href: "#industrias",
      title: "A tu giro",
      description:
        "Obra, cartera, POS, plazos, agenda clínica… cada industria trae su propio flujo, no un menú genérico.",
      visual: "giros" as const,
      featured: false,
    },
    {
      id: "ia",
      href: "#precios",
      title: "IA que te ayuda a decidir",
      description:
        "Señales sobre qué vender, qué reponer y dónde se te va el margen — para decidir con tu negocio, no a ciegas.",
      visual: "ia" as const,
      featured: false,
    },
  ],
};

export const waitlist = {
  title: "Empieza gratis 15 días",
  subtitle:
    "Sin tarjeta obligatoria. Contanos tu industria y te abrimos acceso. Onvision se adapta a tu empresa — no al revés.",
  benefits: [
    "Acceso completo a tu vertical durante la prueba",
    "Onboarding en español para PYMEs",
    "Soporte por WhatsApp y correo",
  ],
};
