
"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";

function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations();
  const { user, loading } = useAuth(); 

  const renderAuthLink = () => {
    if (loading) return null;

    return user ? (
      <Link
        href={user.role === "admin" ? "/admin" : "/user"}
        className="text-lg font-medium no-underline hover:no-underline hover:text-yellow-900 transition"
      >
        {t.navbar.profile}
      </Link>
    ) : (
      <Link
        href="/login"
        className="text-lg font-medium no-underline hover:no-underline hover:text-yellow-900 transition"
      >
        {t.navbar.login}
      </Link>
    );
  };

  return (
    <nav className="bg-white text-yellow-600 shadow-lg border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between py-4 px-6 relative">
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center no-underline hover:no-underline">
            <Image
              src="/logoTaller.png"
              alt="Prime Autos Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="ml-3 text-2xl font-bold text-yellow-600">
              Prime Autos
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex flex-1 justify-center space-x-8">
          {[
            { name: t.navbar.home, href: "/" },
            { name: t.navbar.services, href: "/service" },
            { name: t.navbar.appointment, href: "/appointmentPage" },
            { name: t.navbar.aboutUs, href: "/aboutUs" },
            { name: t.navbar.contact, href: "/contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg font-medium no-underline hover:no-underline hover:text-yellow-900 transition ${
                pathname === link.href
                  ? "text-yellow-900 font-semibold"
                  : "text-yellow-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center">
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSwitcher />
            {renderAuthLink()}
          </div>

          <button
            className="block lg:hidden ml-4 focus:outline-none"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen ? "true" : "false"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md border-t border-gray-200 py-4 z-50">
          <ul className="flex flex-col items-center space-y-4">
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
                  className={`text-lg font-medium no-underline hover:no-underline hover:text-yellow-900 transition ${
                    pathname === link.href
                      ? "text-yellow-900 font-semibold"
                      : "text-yellow-600"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li onClick={() => setMenuOpen(false)}>{renderAuthLink()}</li>
            <li className="mt-4">
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
