"use client";

import Input from "@/components/Inputs";
import Button from "@/components/Button";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";
import { useLanguage } from "@/contexts/LanguageContext";


interface Testimonial {
  _id?: string;
  name: string;
  comment: { es: string; en: string };
}

export default function TestimonialsForm() {

    const { locale } = useLanguage();

    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const [testimonialForm, setTestimonialForm] = useState<Testimonial>({ 
            name: "", 
            comment: { es: "", en: "" } 
    });

    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await axios.get("/api/testimonials");
                setTestimonials(response.data.data);
            } catch (err) {
                setError("Error al cargar los testimonios.");
            }
        };
        fetchTestimonials();
    }, []);


    const filteredTestimonials = testimonials.filter(
        (t) =>
        t.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        t.comment.es.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        t.comment.en.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
    const indexLast = currentPage * itemsPerPage;
    const indexFirst = indexLast - itemsPerPage;
    const currentTestimonials = filteredTestimonials.slice(indexFirst, indexLast);

    useEffect(() => {
      setCurrentPage(1);
    }, [debouncedSearchTerm]);


    const handleTestimonialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const endpoint = editingTestimonial
                ? `/api/testimonials/${editingTestimonial._id}`
                : "/api/testimonials";
            const method = editingTestimonial ? "PATCH" : "POST";

            const response = await axios({
                method,
                url: endpoint,
                data: testimonialForm,
            });

            if (editingTestimonial) {
                setTestimonials((prev)=> prev.map((t) => t._id === editingTestimonial._id ? response.data.data : t )
                );
                setEditingTestimonial(null);
            } else {
                setTestimonials((prev) => [...prev, response.data.data]);
            }

            setTestimonialForm({ name: "", comment: { es: "", en: "" } });
            } catch (err) {
            setError("Error al procesar el testimonio.");
            } finally {
            setLoading(false);
            }
    };

    const handleDeleteTestimonial = async (id: string) => {
        try {
        await axios.delete(`/api/testimonials/${id}`);
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
        setError("Error al eliminar el testimonio.");
        }
    };

    const handleEditTestimonial = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setTestimonialForm(testimonial);
    };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Panel de Testimonios</h1>
      
      {loading && <p>Cargando...</p>}
      {!loading && (
        <>
        <h2 className="text-2xl font-semibold mb-4">Testimonios</h2>
            <form onSubmit={handleTestimonialSubmit} className="space-y-4 mb-6">
              <Input
                type="text"
                name="name"
                value={testimonialForm.name}
                onChange={(e) =>
                  setTestimonialForm({ ...testimonialForm, name: e.target.value })
                }
                placeholder="Nombre"
                label="Nombre"
                required
                className="w-full"
              />
              <Input
                type="textarea"
                name="comment_es"
                value={testimonialForm.comment?.es || ""}
                onChange={(e) =>
                  setTestimonialForm({ ...testimonialForm, comment: { ...testimonialForm.comment, es: e.target.value } })
                }
                placeholder="Comentario en español"
                label="Comentario en español"
                required
                className="w-full"
              />
              <Input
                type="textarea"
                name="comment_en"
                value={testimonialForm.comment?.en || ""}
                onChange={(e) =>
                  setTestimonialForm({ ...testimonialForm, comment: { ...testimonialForm.comment, en: e.target.value } })
                }
                placeholder="Comentario en inglés"
                label="Comentario en inglés"
                required
                className="w-full"
              />
              <Button
                buttonLabel={loading ? "Procesando..." : editingTestimonial ? "Guardar Cambios" : "Agregar Testimonio"}
                buttonType="dark"
                buttonHtmlType="submit"
                className="w-full"
                disabled={loading}
              />
            </form>
            <ul className="space-y-4">
              {currentTestimonials.map((t) => (
                <li key={t._id} className="border p-4 rounded flex justify-between">
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p>{t.comment[locale as "es" | "en"]}</p>
                  </div>
                  <div className="flex space-x-4">
                    <Button
                      buttonLabel="Editar"
                      onButtonClick={() => handleEditTestimonial(t)}
                      buttonType="dark"
                      className="px-4 py-2 m-1 mb-6.5 pt-2.5 pb-2 pl-3.5 pr-3 rounded"
                    />
                    <Button
                      buttonLabel="Eliminar"
                      onButtonClick={() => handleDeleteTestimonial(t._id!)}
                      buttonType="dark"
                      className="px-4 py-2 m-1 mb-6.5 pt-2.5 pb-2 pl-3.5 pr-3 rounded"
                    />
                  </div>
                </li>
              ))}
            </ul>
            {filteredTestimonials.length > itemsPerPage && (
              <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-gray-800 text-yellow-400"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
            </>
          )}  
    </div>
  );
}
