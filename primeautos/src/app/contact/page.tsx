"use client";

import React, { useState } from "react";
import axios from "axios";
import Input from "@/components/Inputs"; 
import Button from "@/components/Button"; 
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactUs() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");


  const t = useTranslations();
  const { locale } = useLanguage(); 


  const handleInvalid = (
    e: React.InvalidEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.currentTarget;

    if (target.value.trim() === "") {
      if (locale === "en") {
        target.setCustomValidity("Please fill out this field");
      } else {
        target.setCustomValidity("Rellene este campo");
      }
    }
  };

  const handleInput = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    e.currentTarget.setCustomValidity("");
  };


  const contactUsTranslations = {
    title: t.contactUs.title,
    description: t.contactUs.description,
    messageTitle: t.contactUs.messageTitle,
    namePlaceholder: t.contactUs.namePlaceholder,
    nameLabel: t.contactUs.nameLabel,
    emailPlaceholder: t.contactUs.emailPlaceholder,
    emailLabel: t.contactUs.emailLabel,
    messagePlaceholder: t.contactUs.messagePlaceholder,
    messageLabel: t.contactUs.messageLabel,
    submitButton: t.contactUs.submitButton,
    workshopButton: t.contactUs.workshopButton,
    successMessage: t.contactUs.successMessage,
    errorMessage: t.contactUs.errorMessage,
    addressTitle: t.contactUs.addressTitle,
    addressSubtitle: t.contactUs.addressSubtitle,
    hoursTitle: t.contactUs.hoursTitle,
    hoursDetail: t.contactUs.hoursDetail,
    hoursDetail2: t.contactUs.hoursDetail2,
    phoneLabel: t.contactUs.phoneLabel,
    phoneNumber: t.contactUs.phoneNumber,
    emailInfoLabel: t.contactUs.emailInfoLabel,
    emailInfo: t.contactUs.emailInfo
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { name, email, message };

    try {
      const response = await axios.post("/api/sendContactForm", formData, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.data.success) {
        alert(contactUsTranslations.successMessage);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert(contactUsTranslations.errorMessage);
    }
  };

  return (
    <section id="contacto" className="bg-gray-30 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título e introducción */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {contactUsTranslations.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {contactUsTranslations.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulario de Contacto */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {contactUsTranslations.messageTitle}
            </h3>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {/* Campo Nombre */}
              <Input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onInvalid={handleInvalid}
                onInput={handleInput}
                placeholder={contactUsTranslations.namePlaceholder}
                label={contactUsTranslations.nameLabel}
                required
                className="w-full"
              />
              {/* Campo Correo Electrónico */}
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onInvalid={handleInvalid}
                onInput={handleInput}
                placeholder={contactUsTranslations.emailPlaceholder}
                label={contactUsTranslations.emailLabel}
                required
                className="w-full"
              />
              {/* Campo Mensaje */}
              <Input
                type="textarea"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onInvalid={handleInvalid}
                onInput={handleInput}
                placeholder={contactUsTranslations.messagePlaceholder}
                label={contactUsTranslations.messageLabel}
                required
                className="w-full"
              />
              <Button
                buttonLabel={contactUsTranslations.submitButton}
                onButtonClick={() => {}} 
                buttonHtmlType="submit"
                buttonType="dark"
                className="w-full"
              />
            </form>
          </div>
          {/* Sección de Dirección */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {contactUsTranslations.addressTitle}
            </h3>
            <p className="mt-4 text-gray-600">
              {contactUsTranslations.addressSubtitle}
            </p>
            <p className="mt-2 text-gray-800 font-medium">
              Prime Auto<br />
              C/ Ficticia 123<br />
              Elche, CP 45678<br />
              España
            </p>
            <p className="mt-4 text-gray-600">
              {contactUsTranslations.hoursTitle}<br />
              {contactUsTranslations.hoursDetail}<br />
              {contactUsTranslations.hoursDetail2}<br />
            </p>
            <p className="mt-4 text-gray-600">
              {contactUsTranslations.phoneLabel}{" "}
              <span className="font-medium">
                {contactUsTranslations.phoneNumber}
              </span>
            </p>
            <p className="mt-2 text-gray-600">
              {contactUsTranslations.emailInfoLabel}{" "}
              <span className="font-medium">
                {contactUsTranslations.emailInfo}
              </span>
            </p>
          </div>
        </div>

        {/* Mapa de Google */}
        <div className="mt-6">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m21!1m12!1m3!1d25053.770621264088!2d-0.6258688!3d38.28595225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m6!3e6!4m0!4m3!3m2!1d38.301109127592575!2d-0.6225214030602553!5e0!3m2!1ses!2ses!4v1744283379788!5m2!1ses!2ses"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            title="Ubicación de Prime Autos"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
