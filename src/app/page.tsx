import type { Metadata } from "next";
import Sitio from "@/components/sitio/Sitio";

export const metadata: Metadata = {
  title: "Onvision — El SaaS hecho para empresas en Costa Rica",
  description:
    "Facturación electrónica 4.4, inventario, POS y pagos SINPE para tu industria. Elige tu industria, paga ₡10,500/mes con tarjeta y crea tu cuenta el mismo día.",
};

export default function Page() {
  return <Sitio year={new Date().getFullYear()} />;
}
