
"use client";

import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-700 text-gray-100 py-8">
      <div className="container mx-auto px-6 lg:px-20">
        
        {/* Logo y Nombre */}
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/logoTaller.png"
              alt="Prime Autos Logo"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-2xl font-bold text-yellow-500">Prime Autos</span>
          </div>
        </div>

        {/* Menú de navegación */}
        <ul className="flex flex-col md:flex-row justify-center md:justify-end gap-4 text-lg mt-6">
          {[
            { name: t.navbar.home, href: "/" },
            { name: t.navbar.services, href: "/service" },
            { name: t.navbar.appointment, href: "/appointmentPage" },
            { name: t.navbar.aboutUs, href: "/aboutUs" },
            { name: t.navbar.contact, href: "/contact" },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-yellow-500 hover:text-yellow-400 transition duration-300"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Separador y derechos de autor */}
        <div className="mt-8 border-t border-gray-500 pt-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left text-gray-400">
              {t.footer.copyright.replace("{{year}}", currentYear.toString())}
            </p>

            {/* Links de políticas */}
            <ul className="flex flex-col md:flex-row justify-center md:justify-end gap-3 text-sm">
              {[
                { name: t.footer.legalNotice, href: "/aviso-legal" },
                { name: t.footer.privacyPolicy, href: "/politica-privacidad" },
                { name: t.footer.cookiesPolicy, href: "/politica-cookies" },
                { name: t.footer.cookiesSettings, href: "/configuracion-cookies" },
                { name: t.footer.accessibility, href: "/accesibilidad" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-yellow-500 hover:text-yellow-400 transition duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
