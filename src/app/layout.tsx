import type { Metadata, Viewport } from "next";
import CustomCursor from "@/components/CustomCursor";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/logo-icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffeb",
};

/**
 * La pantalla de arranque sale una vez por sesión y nunca con movimiento
 * reducido. Se decide antes de pintar, para que no parpadee.
 */
const ARRANQUE = `(function(){try{var d=document.documentElement;if(sessionStorage.getItem("ov-boot")||matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-boot","off")}else{sessionStorage.setItem("ov-boot","1")}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={fontVariables} data-boot="on" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ARRANQUE }} />
      </head>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
