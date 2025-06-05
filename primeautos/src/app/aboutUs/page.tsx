"use client";

import React, { useState } from "react";
import Link from "next/link";
import Input from "@/components/Inputs";
import Button from "@/components/Button";
import ImageComponent from "@/components/Image";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutUs() {

  const t = useTranslations();
  const { locale } = useLanguage(); 

  const aboutUsTranslations = {
    title: t.aboutUs.title,
    description: t.aboutUs.description,
    exploreServices: t.aboutUs.exploreServices,
    historyTitle: t.aboutUs.historyTitle,
    historyDescription: t.aboutUs.historyDescription,
    philosophyTitle: t.aboutUs.philosophyTitle,
    philosophyDescription: t.aboutUs.philosophyDescription,
    certificationTitle: t.aboutUs.certificationTitle,
    certificationDescription: t.aboutUs.certificationDescription,
    subscribeTitle: t.aboutUs.subscribeTitle,
    subscribeDescription: t.aboutUs.subscribeDescription,
    emailPlaceholder: t.aboutUs.emailPlaceholder,
    emailLabel: t.aboutUs.emailLabel,
    subscribeButton: t.aboutUs.subscribeButton,
  };

  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    alert(`${aboutUsTranslations.subscribeButton} exitosa para ${email}`);
    setEmail("");
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {aboutUsTranslations.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {aboutUsTranslations.description}
          </p>
          <Link href="/service" passHref>
            <Button
              buttonLabel={aboutUsTranslations.exploreServices}
              buttonType="dark"
              className="mt-8"
            />
          </Link>
        </div>

        <div className="bg-white mt-16 p-5">
          <h3 className="text-3xl font-bold text-center text-gray-900">
            {aboutUsTranslations.historyTitle}
          </h3>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-center">
              <p className="mt-14 text-lg text-gray-600 text-center">
                {aboutUsTranslations.historyDescription}
              </p>
            </div>
            <div className="mt-4">
              <ImageComponent
                src="/images/confianza.jpg"
                alt={aboutUsTranslations.historyTitle}
                width={700}
                height={500}
                className="rounded-full mx-auto p-3"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-100 mt-16 p-5">
          <h3 className="text-3xl font-bold text-center text-gray-900">
            {aboutUsTranslations.philosophyTitle}
          </h3>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mt-4">
              <ImageComponent
                src="/images/consola.jpg"
                alt={aboutUsTranslations.philosophyTitle}
                width={700}
                height={500}
                className="rounded-full mx-auto p-3"
              />
            </div>
            <div className="flex justify-center">
              <p className="mt-14 text-lg text-gray-600 text-center">
                {aboutUsTranslations.philosophyDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white mt-16 p-5">
          <h3 className="text-3xl font-bold text-center text-gray-900">
            {aboutUsTranslations.certificationTitle}
          </h3>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-center">
              <p className="mt-14 text-lg text-gray-600 text-center">
                {aboutUsTranslations.certificationDescription}
              </p>
            </div>
            <div className="mt-4">
              <ImageComponent
                src="/images/certificado.jpg"
                alt={aboutUsTranslations.certificationTitle}
                width={700}
                height={500}
                className="rounded-full mx-auto p-3"
              />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center text-gray-900">
            {aboutUsTranslations.subscribeTitle}
          </h3>
          <p className="text-center mt-4 text-lg text-gray-600">
            {aboutUsTranslations.subscribeDescription}
          </p>
          <form className="mt-8 max-w-md mx-auto space-y-4">
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={aboutUsTranslations.emailPlaceholder}
              label={aboutUsTranslations.emailLabel}
              required
              className="w-full"
            />
            <Button
              buttonLabel={aboutUsTranslations.subscribeButton}
              onButtonClick={handleSubscribe}
              buttonType="dark"
              className="w-full"
            />
          </form>
        </div>
      </div>
    </section>
  );
}
