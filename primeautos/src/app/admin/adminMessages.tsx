"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/Inputs";
import Button from "@/components/Button";
import axios from "axios";
import { useDebounce } from "use-debounce";


interface Message {
  _id?: string;
  name?: string;
  email?: string;
  message?: string;
}

export default function AdminMessagesPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/sendContactForm");
        setMessages(response.data.data);
      } catch (err) {
        setError("Error al cargar los mensajes.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.name ?? "").toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (msg.email ?? "").toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (msg.message ?? "").toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );


  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  const indexOfLastMessage = currentPage * itemsPerPage;
  const indexOfFirstMessage = indexOfLastMessage - itemsPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);

  const handleDeleteMessage = async (id: string) => {
    if (!id) {
    console.error("El id es inválido");
    return;
    }
    const stringId = id.toString();
    console.log("Intentando eliminar mensaje con id:", stringId);

    try {
      await axios.delete(`/api/sendContactForm/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      setError("Error al eliminar el mensaje.");
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };


  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Mensajes de Contacto</h1>

      <div className="mb-4">
        <Input
          type="text"
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar mensajes..."
          className="w-full"
        />
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-4">
        {currentMessages.map((msg) => (
          <li
            key={msg._id}
            className="border p-4 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            <div>
              <p className="font-semibold">
                {(msg.name ?? "Sin nombre")} - {(msg.email ?? "Sin email")}
              </p>
              <p>{msg.message}</p>
            </div>
            <div className="mt-2 sm:mt-0">
              <Button
                buttonLabel="Eliminar"
                onButtonClick={() => handleDeleteMessage(msg._id!)}
                buttonType="dark"
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              />
            </div>
          </li>
        ))}
      </ul>

      {filteredMessages.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Anterior
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1 ? "bg-gray-800 text-yellow-500" : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
