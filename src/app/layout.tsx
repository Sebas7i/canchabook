import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700", "900"] });

export const viewport: Viewport = {
  themeColor: "#2E8B1E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "CanchaBook - Reserva tu cancha favorita",
  description: "La plataforma líder para reservar canchas deportivas en tiempo real. Fútbol, Tenis, Pádel y más.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CanchaBook",
  },
};

export default function RootLayout({
  children,
}: Readage.ReactElement<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen pb-24 md:pb-0">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
