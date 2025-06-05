import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ["en", "es"], // Idiomas soportados
    defaultLocale: "es",   // Idioma por defecto
  },
};

export default nextConfig;
