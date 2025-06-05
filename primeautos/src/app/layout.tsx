import Navbar from "@/components/Navbar";
import LanguageSwitcher from "@/components/LanguageSwitcher"; // Componente para cambiar idioma
import { Roboto } from "next/font/google";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import './globals.css';
import ChatbotWidget from "@/components/ChatBoxWidget";
import { AuthProvider } from "@/utils/auth";
//import '../utils/i18n';
//import '../styles/tailwind.css';


export const metadata = {
  title: "Taller Prime Autos",
  description: "Prime Autos profesional que ofrece servicios de reparación, mantenimiento e instalación de accesorios para tu vehículo.",
  openGraph: {
    title: "Prime Autos - Taller de Coches",
    description:
      "Prime Autos es un taller de coches profesional que ofrece servicios de reparación, mantenimiento e instalación de accesorios para tu vehículo.",
    //url: "https://www.primeautos.com", // URL canónica de tu sitio
    type: "website", // Tipo de contenido (website, article, etc.)
    locale: "es_ES", // Código de idioma (por ejemplo, español de España)
    siteName: "Prime Autos",
    /*images: [
      {
        url: "https://www.primeautos.com/og-image.jpg", // URL de la imagen representativa
        width: 1200,
        height: 630,
        alt: "Prime Autos - Taller de Coches",
      },
    ],*/
  },
  /*alternates: {
    canonical: "https://www.primeautos.com",
    languages: {
      es: "https://www.primeautos.com/",
      en: "https://www.primeautos.com/en",
    },
  },*/
  robots: {
    index: true,
    follow: true,
  },
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  style: ["italic", "normal"],
  subsets: ["latin"],
});

export default function RootLayout({  
  children,
}: {
  children: React.ReactNode;
}) {
  return( 
    <LanguageProvider>
      <AuthProvider>
        <html lang="es">
          <head>
            <title>Taller Prime Autos</title>
          </head>
          <body className={roboto.className}>
            <Navbar />
            {children}
            <ChatbotWidget />
            <Footer />
          </body>
        </html>
      </AuthProvider>
    </LanguageProvider>
  );
};
