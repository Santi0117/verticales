import type { NextConfig } from "next";
import path from "path";
import { SISTEMA_ANTERIOR } from "./src/lib/site-url";

const nextConfig: NextConfig = {
  turbopack: {
    // Una carpeta de más arriba tiene su propio pnpm-lock.yaml y confunde a
    // Turbopack sobre dónde empieza el proyecto.
    root: path.resolve(__dirname),
  },
  /**
   * Esta página vive en sistema.onvisiondigital.com, donde antes estaba el
   * sistema anterior: sus enlaces viejos caen acá, con sus parámetros
   * intactos (/activar?vertical=… abre Activar con la industria elegida).
   */
  async redirects() {
    return [
      { source: "/activar", destination: "/", permanent: false },
      { source: "/producto", destination: "/", permanent: false },
    ];
  },
  /**
   * Los avisos de pago (Onvo y TiloPay) que lleguen a la dirección vieja
   * pasan tal cual al sistema anterior, que es el que los atiende.
   */
  async rewrites() {
    return [
      { source: "/api/webhooks/:path+", destination: `${SISTEMA_ANTERIOR}/api/webhooks/:path+` },
      { source: "/api/pagos/:path+", destination: `${SISTEMA_ANTERIOR}/api/pagos/:path+` },
    ];
  },
};

export default nextConfig;
