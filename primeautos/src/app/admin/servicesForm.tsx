"use client";

import Input from "@/components/Inputs";
import Button from "@/components/Button";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations"; 
import { useDebounce } from "use-debounce";


interface Service {
  _id?: string;
  name: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  price: string;
  vehicleType: "Automóvil" | "Motocicleta" | "Camión";
  featured: boolean;
}

export default function ServicesForm() {

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [error, setError] =useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { locale } = useLanguage();
  const t = useTranslations();

  const vehicleTypeOptions = [
  { value: "Automóvil", label: locale === "en" ? "Car" : "Automóvil" },
  { value: "Motocicleta", label: locale === "en" ? "Motorcycle" : "Motocicleta" },
  { value: "Camión", label: locale === "en" ? "Truck" : "Camión" },
];

  const [serviceForm, setServiceForm] = useState<Service>({
    name: { es: "", en: "" },
    description: { es: "", en: "" },
    price: "",
    vehicleType: "Automóvil",
    featured: false,
  
  });

  const [editingService, setEditingService] = useState<Service | null>(null);


    useEffect(() => {

        const fetchServices = async () => {
            try {
                const response = await axios.get("/api/services");
                setServices(response.data.data);
            } catch (err) {
                setError("Error al cargar los servicios.");
            }
        };
    
        fetchServices();

   }, []);

    const filteredServices = services.filter(
        (service) =>
            service.name.es.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            service.description.es.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            service.price.includes(debouncedSearchTerm)
    );

    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const indexLast = currentPage * itemsPerPage;
    const indexFirst = indexLast - itemsPerPage;
    const currentServices = filteredServices.slice(indexFirst, indexLast);

    useEffect(() => {
      setCurrentPage(1);
    }, [debouncedSearchTerm]);


    const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const endpoint = editingService ? `/api/services/${editingService._id}` : "/api/services";
      const method = editingService ? "PATCH" : "POST";

      const response = await axios({
        method,
        url: endpoint,
        data: serviceForm,
      });

      if (editingService) {
        setServices(
          services.map((service) =>
            service._id === editingService._id ? response.data.data : service
          )
        );
        setEditingService(null);
      } else {
        setServices([...services, response.data.data]);
      }

      setServiceForm({
         name: { es: "", en: "" }, 
         description: { es: "", en: "" }, 
         price: "", 
         vehicleType: "Automóvil", 
         featured: false, 
        });
    } catch (err) {
      setError("Error al procesar el servicio.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    setError(null); 
    try {
      await axios.delete(`/api/services/${id}`);
      setServices(services.filter((service) => service._id !== id));
    } catch (err) {
      setError("Error al eliminar el servicio.");
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm(service);
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      await axios.patch(`/api/services/${id}`, { featured: !isFeatured });
      setServices(
        services.map((service) =>
          service._id === id ? { ...service, featured: !isFeatured } : service
        )
      );
    } catch (err) {
      setError("Error al cambiar el estado del servicio destacado.");
    }
  };

  return (

     <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Panel de Servicios</h1>
      
      {loading && <p>Cargando...</p>}
      {!loading && (
        <>
            {error && <p className="text-red-600 text-center">{error}</p>}

            <Input
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                label=""
                required={false}
                className="block w-full px-4 py-2 rounded mb-4"
            />

            <div className="bg-white p-6 rounded-md shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Servicios</h2>

                <form onSubmit={handleServiceSubmit} className="space-y-4 mb-6">
                    <h3 className="font-bold">Nombre del Servicio</h3>
                    <Input
                        type="text"
                        name="name_es"
                        value={serviceForm.name.es}
                        onChange={(e) =>
                        setServiceForm({
                            ...serviceForm,
                            name: { ...serviceForm.name, es: e.target.value },
                        })
                        }
                        placeholder="Nombre del Servicio (ES)"
                        label="Nombre (ES)"
                        required
                        className="w-full"
                    />
                    <Input
                        type="text"
                        name="name_en"
                        value={serviceForm.name.en}
                        onChange={(e) =>
                        setServiceForm({
                            ...serviceForm,
                            name: { ...serviceForm.name, en: e.target.value },
                        })
                        }
                        placeholder="Nombre del Servicio (EN)"
                        label="Nombre (EN)"
                        required
                        className="w-full"
                    />
                    <h3 className="font-bold">Descripción del Servicio</h3>
                    <Input
                        type="textarea"
                        name="description_es"
                        value={serviceForm.description.es}
                        onChange={(e) =>
                        setServiceForm({
                            ...serviceForm,
                            description: { ...serviceForm.description, es: e.target.value },
                        })
                        }
                        placeholder="Descripción del Servicio (ES)"
                        label="Descripción (ES)"
                        required
                        className="w-full"
                    />
                    <Input
                        type="textarea"
                        name="description_en"
                        value={serviceForm.description.en}
                        onChange={(e) =>
                        setServiceForm({
                            ...serviceForm,
                            description: { ...serviceForm.description, en: e.target.value },
                        })
                        }
                        placeholder="Descripción del Servicio (EN)"
                        label="Descripción (EN)"
                        required
                        className="w-full"
                    />
                    <Input
                        type="text"
                        name="price"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                        placeholder="Precio"
                        label="Precio"
                        required
                        className="w-full"
                    />
                    <Input
                        type="select"
                        name="vehicleType"
                        value={serviceForm.vehicleType}
                        onChange={(e) =>
                        setServiceForm({
                            ...serviceForm,
                            vehicleType: e.target.value as "Automóvil" | "Motocicleta" | "Camión",
                        })
                        }
                        options={vehicleTypeOptions}
                        label={locale === "en" ? "Vehicle Type" : "Tipo de Vehículo"}
                        required
                        className="w-full"
                    />
                    <Button
                    buttonLabel={loading ? "Procesando..." : editingService ? "Actualizar Servicio" : "Agregar Servicio"}
                    buttonType="dark"
                    buttonHtmlType="submit"
                    className="w-full"
                    disabled={loading}
                    />
                </form>

                <ul className="space-y-4">
                    {currentServices.map((service) => (
                        <li key={service._id} className="flex justify-between items-center p-4 border rounded-md shadow-sm">
                            <div>
                                <p className="font-semibold">{service.name.es}</p>
                                <p className="text-sm text-gray-500">{service.description.es}</p>
                                <p className="text-sm text-gray-500">{service.price}</p>
                                <p className="text-sm text-gray-500">{service.vehicleType}</p>
                            </div>
                            <div className="flex space-x-4">
                                <Button
                                buttonLabel={service.featured ? "Quitar de Destacados" : "Añadir a Destacados"}
                                onButtonClick={() => handleToggleFeatured(service._id!, service.featured)}
                                buttonType="light"
                                className="px-4 py-2 m-1"
                                />
                                <Button
                                buttonLabel="Editar"
                                onButtonClick={() => handleEditService(service)}
                                buttonType="light"
                                className="px-4 py-2 m-1"
                                />
                                <Button
                                buttonLabel="Eliminar"
                                onButtonClick={() => handleDeleteService(service._id!)}
                                buttonType="light"
                                className="px-4 py-2 m-1"
                                />
                            </div>
                        </li>
                    ))}
                </ul>
                {filteredServices.length > itemsPerPage && (
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
                          ? "bg-gray-800 text-yellow-500"
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

            </div>
        </>
    )}
    </div>
  );
}

