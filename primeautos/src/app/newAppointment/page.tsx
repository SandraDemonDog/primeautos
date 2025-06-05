"use client";

import { useState } from "react";
import axios from "axios";
import Input from "@/components/Inputs";
import Button from "@/components/Button";

export default function NewAppointment() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setMessage("");

    try {
      const response = await axios.post("/api/appointments", {
        name,
        email,
        telephone,
        date,
        time,
      });

      if (response.data.success) {
        setMessage("Cita creada correctamente.");
        setName("");
        setEmail("");
        setTelephone("");
        setDate("");
        setTime("");
      } else {
        setMessage("Error al crear la cita.");
      }
    } catch (error) {
      console.error("Error al enviar la cita:", error);
      setMessage("Hubo un problema. Inténtalo más tarde.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Agendar Cita</h2>

      {message && <p className="text-center text-blue-600">{message}</p>}

      <form className="space-y-4">

        <Input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          required
          className="w-full"
          label="Nombre Completo"
        />

        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo Electrónico"
          required
          className="w-full"
          label="Correo Electrónico"
        />

        <Input
          type="number"
          name="telephone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          placeholder="Teléfono"
          required
          className="w-full"
          label="Teléfono"
        />

        <div className="flex justify-center">
          <Input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full max-w-sm"
            label="Fecha de la Cita"
          />
        </div>

        <Input
          type="time"
          name="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full"
          label="Hora de la Cita"
        />

        <Button
          buttonLabel="Agendar Cita"
          onButtonClick={handleSubmit}
          buttonType="light"
          className="w-full"
        />
      </form>
    </div>
  );
}
