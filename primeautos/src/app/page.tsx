
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/components/Button";
import ImageComponent from "@/components/Image";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";

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
  featured: boolean;
}

interface LocalizedService {
  _id?: string;
  name: string;
  description: string;
  price: string;
  featured: boolean;
}

interface Testimonial {
  name: string;
  comment: { es: string; en: string };
}


export default function Home() {

  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [localizedServices, setLocalizedServices] = useState<LocalizedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]); 
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations();

  const {locale} = useLanguage();
  
  const workshopData = {
    title: t.workshop.title,
    description: t.workshop.description,
    images: [
      "/images/taller.jpg",
      "/images/taller2.jpg",
      "/images/arreglando.jpg",
      "/images/arreglando2.jpg",
      "/images/ruedas.jpg",
      "/images/herramientas.jpg",
      "/images/cocheSubido.jpg"
    ],
  };

  useEffect(() => {

    const fetchData = async () => {
      try {
       
        const servicesResponse = await axios.get("/api/services");
        const allServices: Service[] = servicesResponse.data.data; 
        setServices(allServices);

        const featured = allServices.filter((service) => service.featured);
        setFeaturedServices(featured);
       

    
        const testimonialsResponse = await axios.get("/api/testimonials");
        const validTestimonials = testimonialsResponse.data.data.filter(
          (testimonial: Testimonial) => testimonial.name && testimonial.comment
        );
        setTestimonials(validTestimonials);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError(t.testimonials.noTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    const localized = featuredServices.map((service) => ({
      ...service,
      _id: service._id,
      name: service.name[locale as "es" | "en"],
      description: service.description[locale as "es" | "en"],
      price: service.price,
      featured: service.featured,
    }));
    setLocalizedServices(localized);
  }, [locale, featuredServices]);


  return (
    <main className="bg-gray-100 text-gray-900">
      {/* Banner Promocional */}
      <section className="relative bg-gray-800 text-white py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{workshopData.title}</h1>
          <p className="text-lg mb-6">{t.mainPage.bannerDescription}</p>
          {/* Botón: Ver Nuestros Servicios */}
          <Link href="/service" passHref>
            <Button
              buttonLabel={t.mainPage.viewServices}
              buttonType="dark" 
              className="mb-0"
            />
          </Link>
          
        </div>
      </section>

      {/* Información General */}
      <section className="container mx-auto py-12 px-6">
        <div className="bg-white mt-16 p-5">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            {t.mainPage.aboutUsTitle}
          </h2>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-center">
              <p className="mt-14 text-lg text-gray-600 text-center">
                {workshopData.description}
              </p>
            </div>
            <div className="mt-4">
              <ImageComponent
                src="/images/cocheSubido.jpg"
                alt={t.mainPage.aboutUsTitle}
                width={500}
                height={400}
                className="rounded-full mx-auto p-3"
              />
            </div>
          </div>
        </div>

      </section>

      {/* Servicios Destacados */}
      <section className="bg-white py-12">
        <h2 className="text-3xl font-bold text-center mb-8">{t.mainPage.featuredServicesTitle}</h2>
        {loading ? (
          <p className="text-center text-gray-600">{t.mainPage.loadingServices}</p>
        ) : (
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {localizedServices.map((service, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <ImageComponent
                  src={"/images/icono.png"}
                  alt={t.mainPage.serviceImageAlt} 
                  width={50}
                  height={50}
                  className="mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
                <p className="text-yellow-500 font-bold">{service.price}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Título y Descripción Separados */}
      <section className="container mx-auto py-8 text-center">
        <h2 className="text-3xl font-bold">{t.mainPage.workshopAndTeamTitle}</h2>
        <p className="text-lg text-gray-600 mt-2">{t.mainPage.workshopDescription}</p>
      </section>

      {/* Carrusel de Imágenes */}
      <section className="relative mx-auto max-w-[700px] h-[500px] overflow-hidden flex justify-center items-center">
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation
          spaceBetween={0}
          slidesPerView={1}
          className="rounded-lg shadow-lg"
        >
          {workshopData.images.map((src, index) => (
            <SwiperSlide key={index}>
              <ImageComponent
                src={src}
                alt={`${t.mainPage.workshopImageAlt} ${index + 1}`} 
                className="rounded-lg object-contain"
                width={1200}
                height={700}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Testimonios */}
      <section className="bg-gray-200 py-12 mt-8">
        <h2 className="text-3xl font-bold text-center mb-8">{t.mainPage.testimonialsTitle}</h2>
        {loading ? (
          <p className="text-center text-gray-600">{t.mainPage.loadingTestimonials}</p>
        ) : (
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
              >
                <p className="italic text-gray-700">"{testimonial.comment[locale as "es" | "en"]}"</p>
                <h4 className="text-lg font-semibold mt-4 text-yellow-500">
                  - {testimonial.name}
                </h4>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Llamada a la Acción */}
      <section className="bg-yellow-500 text-white py-12 text-center">
        <h2 className="text-3xl font-bold mb-6">{t.mainPage.callToActionTitle}</h2>
        <p className="text-lg mb-6">{t.mainPage.callToActionDescription}</p>
        {/* Botón: Reservar Cita */}
        <Link href="/appointmentPage" passHref>
                  <Button
                    buttonLabel={t.mainPage.callToActionButton}
                    buttonType="light"
                    className="mb-0"
                  />
        </Link>
      </section>
  </main>

  );
}
