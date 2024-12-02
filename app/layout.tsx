import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import { UserProvider } from './context/UserContext';
import Sidebar from './components/sidebar'; // Importa el componente Sidebar
import { LoadingProvider } from "./context/LoadingContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DenthosControl",
  description: "Generated by create next app",
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png']
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingProvider>
        <UserProvider>
          <div className="flex min-h-screen">
            {/* Sidebar siempre visible */}
            <Sidebar />
            {/* Contenido dinámico de la página */}
            <div className="flex-grow">{children}</div>
          </div>
        </UserProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}