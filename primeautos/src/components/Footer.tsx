
"use client";

import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

function Footer() {
  const t = useTranslations(); 
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="bg-gray-400 text-gray-100 py-8">
      <div className="container mx-auto px-6 lg:px-20">
        
        <div className="flex flex-wrap justify-between items-center">
          
          <div className="flex items-center gap-4 mb-6 lg:mb-0">
            <img
              src="/logoTaller.png"
              alt="Prime Autos Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="text-2xl font-bold text-yellow-500">Prime Autos</span>
          </div>
          <ul className="flex flex-col lg:flex-row lg:justify-end gap-4 text-2xl">
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
                  className="text-yellow-500 hover:text-yellow-400 transition duration-300 no-underline"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>


        <div className="mt-8 border-t border-gray-600 pt-6">
          <div className="flex flex-wrap justify-center lg:justify-between items-center">
            <p className="text-sm text-center lg:text-left text-gray-400">
              {t.footer.copyright.replace("{{year}}", currentYear.toString())}
            </p>

           
            <ul className="flex flex-col lg:flex-row lg:justify-end gap-4 text-sm">
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
                    className="text-yellow-500 hover:text-yellow-400 transition duration-300 no-underline"
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


