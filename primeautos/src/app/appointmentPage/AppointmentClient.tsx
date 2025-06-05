
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic"; 
import axios from "axios";
import "react-calendar/dist/Calendar.css"; 
import Input from "@/components/Inputs";
import Button from "@/components/Button";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";


const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

interface Appointment {
  date: string; 
  time: string; 
}

const AppointmentClient: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
  });

  const [dateSelected, setDateSelected] = useState<Date | null>(null);
  const [timeSelected, setTimeSelected] = useState<string>("");
  const [timeAvailable, setTimeAvailable] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Spinner de carga

  const allTime = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

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


  const appointmentTranslations = {
    sectionTitle: t.appointment.sectionTitle,
    description: t.appointment.description,
    loadingTime: t.appointment.loadingTime,
    noAvailableHours: t.appointment.noAvailableHours,
    namePlaceholder: t.appointment.namePlaceholder,
    nameLabel: t.appointment.nameLabel,
    emailPlaceholder: t.appointment.emailPlaceholder,
    emailLabel: t.appointment.emailLabel,
    telephonePlaceholder: t.appointment.telephonePlaceholder,
    telephoneLabel: t.appointment.telephoneLabel,
    submitButton: t.appointment.submitButton,
    errorNoDateTime: t.appointment.errorNoDateTime,
    successMessage: t.appointment.successMessage,
    errorSubmit: t.appointment.errorSubmit,
    backToHome: t.appointment.backToHome,
    exploreServices: t.appointment.exploreServices,
  };

  useEffect(() => {
    if (dateSelected) {
      const fetchTimeBusy = async () => {
        try {
          setLoading(true);
          const dateFormatted = dateSelected.toLocaleDateString("sv-SE");
          const response = await axios.get(`/api/appointments?date=${dateFormatted}`);
          const timeBusy = response.data.data.map((appointment: Appointment) => appointment.time);

          setTimeAvailable(allTime.filter((time) => !timeBusy.includes(time)));
        } catch (error) {
          console.error("Error al obtener horas ocupadas:", error);
          setTimeAvailable([]);
        } finally {
          setLoading(false);
        }
      };

      fetchTimeBusy();
    }
  }, [dateSelected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Enviando formulario...");

    if (!dateSelected || !timeSelected) {
      setMessage(appointmentTranslations.errorNoDateTime);
      return;
    }
    // Estructura del cuerpo de la solicitud (requestBody)
    const requestBody = {
      name: formData.name,
      email: formData.email,
      telephone: formData.telephone,
      date: dateSelected.toLocaleDateString("sv-SE"), // Convierte a formato YYYY-MM-DD
      time: timeSelected,
      status: "Pendiente",
    };

    try {
      console.log("Cuerpo de la solicitud:", JSON.stringify(requestBody, null, 2));
    
      const response = await axios.post("/api/appointments", requestBody, {
        headers: {
          "Content-Type": "application/json", // Especifica que estás enviando JSON
        },
      });
      console.log("Respuesta de la API:", response.data);

      if (response.data.success) {
        setMessage(appointmentTranslations.successMessage);
        setFormData({ name: "", email: "", telephone: "" });
        setTimeSelected("");
        setDateSelected(null);
        setTimeAvailable([]);
      }
    } catch (error) {
      setMessage(appointmentTranslations.errorSubmit);
    }
  };

  return (
    <section id="appointment" className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-center text-3xl text-primary fw-bold">{appointmentTranslations.sectionTitle}</h2>
          <p className="text-center text-muted">
            {appointmentTranslations.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendario */}
          <div className="flex justify-center items-center p-2 mt-6 space-y-4">
          <Calendar
            onChange={(date) => {
              if (date instanceof Date) {
                setDateSelected(date);
              }
            }}
            value={dateSelected || new Date()}
            minDate={new Date()}
            locale={locale === "en" ? "en-US" : "es-ES"}
          />
        </div>
        
        {/* Horas disponibles */}
        <div>
        {dateSelected && (
        <div className="mt-4">
          <h4 className="text-center">
          {appointmentTranslations.sectionTitle}{" "}
          {dateSelected.toLocaleDateString(locale, { dateStyle: "long" })}
          </h4>
          <div className="d-flex flex-wrap justify-content-center">
            {loading ? (
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{appointmentTranslations.loadingTime}</span>
              </div>
            ) : timeAvailable.length > 0 ? (
              timeAvailable.map((time) => (
                <Button
                  key={time}
                  buttonLabel={time}
                  buttonType={
                    time === timeSelected ? "dark" : "light"
                  }
                  onButtonClick={() => setTimeSelected(time)}
                  className="m-0.5"
                />
              ))
            ) : (
              <p className="text-danger">{appointmentTranslations.noAvailableHours}</p>
            )}
          </div>
        </div>
      )}

      {/* Formulario */}
      {timeSelected && (
        <form onSubmit={handleSubmit} className="mt-4 px-3">
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onInvalid={handleInvalid}
            onInput={handleInput}
            placeholder={appointmentTranslations.namePlaceholder}
            label={appointmentTranslations.nameLabel}
            required
            className="w-full"
          />
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onInvalid={handleInvalid}
            onInput={handleInput}
            placeholder={appointmentTranslations.emailPlaceholder}
            label={appointmentTranslations.emailLabel}
            required
            className="w-full"
          />
          <Input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleInputChange}
            onInvalid={handleInvalid}
            onInput={handleInput}
            placeholder={appointmentTranslations.telephonePlaceholder}
            label={appointmentTranslations.telephoneLabel}
            required
            className="w-full"
          />
          <Button
            buttonLabel={appointmentTranslations.submitButton}
            buttonType="dark"
            buttonHtmlType="submit" 
            className="w-full"
          />
        </form>
      )}
      </div>
      </div>
      {/* Mensaje de confirmación */}
      {message && (
          <div className="bg-yellow-100 text-brown-700 mt-3 text-center p-5 rounded-lg shadow-lg">
            <p className="font-bold text-xl">{message}</p>

            <div className="mt-5 flex justify-center space-x-4">
              {/* Botón para volver al inicio (la ruta "/" es común) */}
              <Link href="/" passHref>
                  <Button
                    buttonLabel={
                      <span className="flex items-center justify-center">
                        <span className="mr-2">🔙</span> {appointmentTranslations.backToHome}
                      </span>
                    }
                    buttonType="dark"
                    className="px-6 py-3"
                  />
              </Link>
              {/* Botón para explorar servicios: redirige a "/services" si está en inglés, a "/servicios" si en español */}
              <Link href="/service" passHref>
                  <Button
                    buttonLabel={
                      <span className="flex items-center justify-center">
                        <span className="mr-2">🔍</span> {appointmentTranslations.exploreServices}
                      </span>
                    }
                    buttonType="light"
                    className="px-6 py-3"
                  />
              </Link>
            </div>
      </div>
    )}
  </div>
  </section>   
  );
};

export default AppointmentClient;

