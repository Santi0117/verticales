import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Una carpeta de más arriba tiene su propio pnpm-lock.yaml y confunde a
    // Turbopack sobre dónde empieza el proyecto.
    root: path.resolve(__dirname),
  },
  /** Enlaces viejos a /activar caen en la página, con sus parámetros intactos. */
  async redirects() {
    return [{ source: "/activar", destination: "/", permanent: false }];
  },
};

export default nextConfig;
