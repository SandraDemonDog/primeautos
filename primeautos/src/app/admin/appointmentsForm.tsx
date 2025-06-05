"use client";

import axios from "axios";
import Input from "@/components/Inputs";
import Button from "@/components/Button";
import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

interface Appointment {
  _id?: string;
  name: string;
  email: string;
  telephone: string;
  date: string;
  time: string;
  status: "Pendiente" | "Confirmada" | "Rechazada";
}

export default function AppointmentsForm() {
    const [appointments, setAppointments] = useState<Appointment[]>([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const [successMessage, setSuccessMessage] = useState<string>("");

    const [appointmentForm, setAppointmentForm] = useState<Appointment>({
        name: "",
        email: "",
        telephone: "",
        date: "",
        time: "",
        status: "Pendiente",
    });

    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const allHours = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];


    useEffect(() => {

        const fetchAppointments = async () => {
            try {
                const response = await axios.get("/api/appointments");
                setAppointments(response.data.data);
            } catch (err) {
                setError("Error al cargar las citas.");
            }
        };

        fetchAppointments();
    }, []);

    const filteredAppointments = appointments.filter(
      (appointment) =>
        appointment.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        appointment.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        appointment.telephone.includes(debouncedSearchTerm)
    );

    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

    const goToPreviousPage = () => {
      setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const goToNextPage = () => {
      setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    };


  const [timeBusy, setTimeBusy] = useState<string[]>([]);
  const [loadingTimeBusy, setLoadingTimeBusy] = useState(false);


  useEffect(() => {
    if (!appointmentForm.date) {
      setTimeBusy([]);
      return;
    }
    const fetchTimeBusy = async () => {
      try {
        setLoadingTimeBusy(true);
        const response = await axios.get(`/api/appointments?date=${appointmentForm.date}`);
        const busyTimes: string[] = response.data.data
          .filter((a: Appointment) => !editingAppointment || a._id !== editingAppointment._id) // excluir cita editada
          .map((a: Appointment) => a.time);
        setTimeBusy(busyTimes);
      } catch (error) {
        setTimeBusy([]);
      } finally {
        setLoadingTimeBusy(false);
      }
    };
    fetchTimeBusy();
  }, [appointmentForm.date, editingAppointment]);

  const availableHours = appointmentForm.time
    ? allHours.filter(
        (h) => !timeBusy.includes(h) || h === appointmentForm.time
      )
    : allHours.filter((h) => !timeBusy.includes(h));

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 
    try {
      const endpoint = editingAppointment ? `/api/appointments/${editingAppointment._id}` : "/api/appointments";
      const method = editingAppointment ? "PATCH" : "POST";

      const response = await axios({
        method,
        url: endpoint,
        data: appointmentForm,
      });

      if (editingAppointment) {
        setAppointments(
          appointments.map((appointment) =>
            appointment._id === editingAppointment._id ? response.data.data : appointment
          )
        );
        setSuccessMessage("Cita actualizada correctamente.");
        setEditingAppointment(null);
      } else {
        setAppointments([...appointments, response.data.data]);
        setSuccessMessage("Cita creada correctamente.");
      }

      setAppointmentForm({ 
        name: "",
        email: "",
        telephone: "",
        date: "",
        time: "",
        status: "Pendiente",
      });

      setTimeout(() => setSuccessMessage(""), 4000);

    } catch (err) {
      setError("Error al procesar la cita.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAppointment = async (id: string) => {
    try {
      const response = await axios.patch(`/api/appointments/${id}`, {
        status: "Confirmada", 
      });
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id ? { ...appointment, status: response.data.data.status } : appointment
        )
      ); 
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error al confirmar la cita:", err.message);
      } else {
        console.error("Error desconocido:", err);
      }
      setError("Error al confirmar la cita.");
    }
  };
  

  const handleDeleteAppointment = async (id: string) => {
    try {
      await axios.delete(`/api/appointments/${id}`);
      setAppointments(appointments.filter((a) => a._id !== id));
    } catch (err) {
      setError("Error al eliminar la cita.");
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setAppointmentForm({
      name: appointment.name || "",
      email: appointment.email || "",
      telephone: appointment.telephone || "",
      date: appointment.date ? appointment.date.split("T")[0] : "", 
      time: appointment.time || "",
      status: appointment.status || "Pendiente",
    });
  };

    useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);


  return (

    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Citas</h2>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded shadow">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleAppointmentSubmit} className="space-y-4 mb-6">
        <Input
          type="text"
          name="nombre"
          value={appointmentForm.name}
          onChange={(e) =>
            setAppointmentForm({ ...appointmentForm, name: e.target.value })
          }
          placeholder="Nombre"
          label="Nombre"
          required
          className="w-full"
        />
        <Input
          type="email"
          name="email"
          value={appointmentForm.email}
          onChange={(e) =>
            setAppointmentForm({ ...appointmentForm, email: e.target.value })
          }
          placeholder="Correo Electrónico"
          label="Correo Electrónico"
          required
          className="w-full"
        />
        <Input
          type="text"
          name="telefono"
          value={appointmentForm.telephone}
          onChange={(e) =>
            setAppointmentForm({ ...appointmentForm, telephone: e.target.value })
          }
          placeholder="Teléfono"
          label="Teléfono"
          required
          className="w-full"
        />
        <Input
          type="date"
          name="fecha"
          value={appointmentForm.date}
          onChange={(e) =>
            setAppointmentForm({ ...appointmentForm, date: e.target.value })
          }
          label="Fecha"
          required
          className="w-full"
        />
        {loadingTimeBusy ? (
          <p>Cargando horas disponibles...</p>
        ) : (
          <Input
            type="select"
            name="time"
            value={appointmentForm.time}
            onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
            options={[
              { value: "", label: "Selecciona una hora" },
              ...availableHours.map((h) => ({ value: h, label: h })),
            ]}
            label="Hora"
            required
            className="w-full"
          />
        )}
        <Input
          type="select"
          name="status"
          value={appointmentForm.status}
          onChange={(e) =>
            setAppointmentForm({
              ...appointmentForm,
              status: e.target.value as "Pendiente" | "Confirmada" | "Rechazada",
            })
          }
          options={[
            { value: "Pendiente", label: "Pendiente" },
            { value: "Confirmada", label: "Confirmada" },
            { value: "Rechazada", label: "Rechazada" },
          ]}
          label="Estado"
          required
          className="w-full"
        />
        <Button
          buttonLabel={loading ? "Procesando..." : "Agregar Cita"}
          buttonType="light"
          buttonHtmlType="submit"
          className="w-1/5"
          disabled={loading}
        />
      </form>
      <ul className="space-y-4">
        {currentAppointments.map((a) => (
          <li
            key={a._id}
            className="flex justify-between items-center p-4 border rounded-md shadow-sm"
          >
            <div>
              <p className="font-semibold">{a.name}</p>
              <p className="text-sm text-gray-500">{a.email}</p>
              <p className="text-sm text-gray-500">{a.telephone}</p>
              <p className="text-sm text-gray-500">{a.date.split("T")[0]}</p>
              <p className="text-sm text-gray-500">{a.time}</p>
              <p className="text-sm text-gray-500">{a.status}</p>
            </div>
            <div className="flex space-x-2">
              {a.status === "Pendiente" && (
                <Button
                  buttonLabel="Confirmar"
                  onButtonClick={() => {
                    console.log("Cita ID:", a._id);
                    handleConfirmAppointment(a._id!);
                  }}
                  buttonType="dark"
                  className="px-4 py-2 m-1 mb-6.5 pt-2.5 pb-2 pl-3.5 pr-3 rounded"
                />
              )}
              <Button
                buttonLabel="Editar"
                onButtonClick={() => handleEditAppointment(a)}
                buttonType="dark"
                className="px-4 py-2 m-1 mb-6.5 pt-2.5 pb-2 pl-3.5 pr-3 rounded"
              />
              <Button
                buttonLabel="Eliminar"
                onButtonClick={() => handleDeleteAppointment(a._id!)}
                buttonType="dark"
                className="px-4 py-2 m-1 mb-6.5 pt-2.5 pb-2 pl-3.5 pr-3 rounded"
              />
            </div>
          </li>
        ))}
      </ul>

      {filteredAppointments.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          {currentPage > 1 && (
            <button
              onClick={goToPreviousPage}
              className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
            >
              Anterior
            </button>
          )}

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-gray-800 text-yellow-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {index + 1}
            </button>
          ))}

          {currentPage < totalPages && (
            <button
              onClick={goToNextPage}
              className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
            >
              Siguiente
            </button>
          )}
        </div>
      )}
    </div>
  );
}
