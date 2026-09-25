import type { Metadata } from "next";
import VerticalesPage from "@/components/verticales/VerticalesPage";

export const metadata: Metadata = {
  title: "Activá tu software — Onvision",
  description:
    "Elegí tu industria, pagá con tarjeta (₡10,500/mes en CRC) y creá tu cuenta el mismo día.",
};

export default function Page() {
  return <VerticalesPage year={new Date().getFullYear()} />;
}
