import type { Metadata } from "next";
import CustomCursor from "@/components/CustomCursor";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/logo-icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col font-sans">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
