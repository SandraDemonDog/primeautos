import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*i18n: {
    locales: ["en", "es"], // Idiomas soportados
    defaultLocale: "es",   // Idioma por defecto
  },*/
  output: "export",
  images: {
    unoptimized: true, //  Desactiva la optimización de imágenes para que funcione con 'next export'
  },
};

export default nextConfig;
