"use client";

import React, { useState, useMemo, useCallback } from "react";
import axios from "axios";
import Input from "@/components/Inputs";
import Button from "@/components/Button";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";


type Service = {
  _id: string;
  name: string | { es: string; en: string };
  description: string | { es: string; en: string };
  price: string;
  vehicleType: "Automóvil" | "Motocicleta" | "Camión";
  averageRating?: number;
  ratings?: { rating: number; comment: string }[];
};


type LocalizedService = {
  _id: string;
  name: string;
  description: string;
  price: string;
  vehicleType: "Automóvil" | "Motocicleta" | "Camión";
  averageRating?: number;
  ratings?: { rating: number; comment: string }[];
};

interface ServicesClientProps {
  services: Service[];
}


const ServiceCard = React.memo(
  ({
    service,
    vehicleTypeLabelText,
    vehicleTypeMapping,
    ratingValue,
    onRate,
    commentValue,
    onCommentChange,
    onSubmit,
    texts,
  }: {
    service: LocalizedService;
    vehicleTypeLabelText: string;
    vehicleTypeMapping: Record<"Automóvil" | "Motocicleta" | "Camión", string>;
    ratingValue: number;
    onRate: (serviceId: string, value: number) => void;
    commentValue: string;
    onCommentChange: (serviceId: string, value: string) => void;
    onSubmit: (serviceId: string) => void;
    texts: {
      commentLabelText: string;
      commentPlaceholderText: string;
      rateThisServiceText: string;
      submitButtonText: string;
      ratingLabelText: string;
      noRatingsText: string;
    };
  }) => {
    return (
      <div className="p-6 border border-gray-300 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{service.name}</h2>
        <p className="text-gray-700 mb-4">{service.description}</p>
        <p className="text-yellow-600 font-bold text-lg mb-4">{service.price}</p>
        <p className="text-sm text-gray-500 italic">
          {vehicleTypeLabelText}: {vehicleTypeMapping[service.vehicleType]}
        </p>
        <p className="text-sm text-gray-500 italic">
          {texts.ratingLabelText}{" "}
          {typeof service.averageRating === "number" && service.averageRating > 0
            ? `${service.averageRating.toFixed(1)} ★`
            : texts.noRatingsText}
        </p>
        <div className="mt-4">
          <p className="font-semibold">{texts.rateThisServiceText}</p>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                buttonLabel="★"
                buttonType={star <= ratingValue ? "dark" : "light"}
                onButtonClick={() => onRate(service._id, star)}
              />
            ))}
          </div>
          <Input
            type="textarea"
            name={`comment-${service._id}`}
            value={commentValue}
            onChange={(e) => onCommentChange(service._id, e.target.value)}
            placeholder={texts.commentPlaceholderText}
            label={texts.commentLabelText}
            className="w-full mt-2"
          />
          <Button
            buttonLabel={texts.submitButtonText}
            buttonType="dark"
            onButtonClick={() => onSubmit(service._id)}
            className="mt-2"
          />
        </div>
      </div>
    );
  }
);

export function ServicesClient({ services }: ServicesClientProps) {
  const t = useTranslations();
  const { locale } = useLanguage(); 

  const localize = useCallback(
    (value: string | { es: string; en: string }): string =>
      typeof value === "object" ? value[locale as "es" | "en"] : value,
    [locale]
  );


  const texts = useMemo(() => ({
    titleText: localize(t.services.title),
    filterLabelText: localize(t.services.filterLabel),
    filterDefaultText: localize(t.services.filterDefault),
    commentPlaceholderText: localize(t.services.commentPlaceholder),
    commentLabelText: localize(t.services.commentLabel),
    submitButtonText: localize(t.services.submitButton),
    rateThisServiceText: localize(t.services.rateThisService),
    errorMessageText: localize(t.services.errorMessage),
    vehicleTypeLabelText: localize(t.services.vehicleTypeLabel),
    ratingLabelText: localize(t.services.ratingLabel),
    noRatingsText: t.services.noRatings
      ? localize(t.services.noRatings)
      : locale === "en"
      ? "No ratings"
      : "Sin valoraciones",
   
    vehicleTypesDisplayLocalized: {
      car: localize(t.services.vehicleTypes.display.car),
      motorcycle: localize(t.services.vehicleTypes.display.motorcycle),
      truck: localize(t.services.vehicleTypes.display.truck),
    },
    vehicleTypesModel: t.services.vehicleTypes.model, 
  }), [t, locale, localize]);


  const [filter, setFilter] = useState<string>(texts.filterDefaultText);


  React.useEffect(() => {
    setFilter(texts.filterDefaultText);
  }, [texts.filterDefaultText]);


  const [rating, setRating] = useState<{ [key: string]: number }>({});
  const [comment, setComment] = useState<{ [key: string]: string }>({});


  const updatedServices = useMemo<LocalizedService[]>(() => {
    return services.map((service) => ({
      _id: service._id,
      name:
        typeof service.name === "object"
          ? service.name[locale as "es" | "en"]
          : service.name,
      description:
        typeof service.description === "object"
          ? service.description[locale as "es" | "en"]
          : service.description,
      price: service.price,
      vehicleType: service.vehicleType,
      averageRating: service.averageRating,
      ratings: service.ratings,
    }));
  }, [services, locale]);


  const getModelFilter = useCallback(
    (selected: string) => {
      if (selected === texts.filterDefaultText) return selected;
      const keys = Object.keys(texts.vehicleTypesDisplayLocalized) as Array<
        keyof typeof texts.vehicleTypesDisplayLocalized
      >;
      const mapping = texts.vehicleTypesModel;
      for (const key of keys) {
        if (localize(t.services.vehicleTypes.display[key]) === selected) {
          return mapping[key];
        }
      }
      return selected;
    },
    [texts, localize, t]
  );

  const modelFilter = getModelFilter(filter);
  const filteredServices = useMemo(() => {
    return updatedServices.filter(
      (service) =>
        modelFilter === texts.filterDefaultText || service.vehicleType === modelFilter
    );
  }, [updatedServices, modelFilter, texts.filterDefaultText]);


  const vehicleTypeMapping: Record<"Automóvil" | "Motocicleta" | "Camión", string> = {
    Automóvil: locale === "en" ? "Car" : "Automóvil",
    Motocicleta: locale === "en" ? "Motorcycle" : "Motocicleta",
    Camión: locale === "en" ? "Truck" : "Camión",
  };


  const handleRating = useCallback((serviceId: string, ratingValue: number) => {
    setRating((prev) => ({ ...prev, [serviceId]: ratingValue }));
  }, []);

  const handleCommentChange = useCallback((serviceId: string, value: string) => {
    setComment((prev) => ({ ...prev, [serviceId]: value }));
  }, []);

  ServiceCard.displayName = "ServiceCard";

  const handleSubmit = useCallback(async (serviceId: string) => {
    if (!rating[serviceId] || rating[serviceId] < 1) {
      alert(
        locale === "en"
          ? "Please provide a rating."
          : "Por favor, ingresa una valoración."
      );
      return;
    }
    try {
      const payload = {
        serviceId,
        rating: rating[serviceId],
        comment: comment[serviceId] || "",
      };
      const response = await axios.post("/api/ratings", payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.success) {
        alert(
          locale === "en"
            ? "Thank you for your rating!"
            : "¡Gracias por tu valoración!"
        );
        setRating((prev) => ({ ...prev, [serviceId]: 0 }));
        setComment((prev) => ({ ...prev, [serviceId]: "" }));

      } else {
        alert(
          response.data.message ||
            (locale === "en"
              ? "Error submitting your rating."
              : "Error al enviar la valoración.")
        );
      }
    } catch {
      alert(
        locale === "en"
          ? "Error submitting your rating."
          : "Error al enviar la valoración. Intenta nuevamente."
      );
    }
  }, [rating, comment, locale]);

  return (
    <main className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">{texts.titleText}</h1>
      <div className="flex justify-center mb-8">
        <label className="mr-2 font-semibold">{texts.filterLabelText}:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
        >
          <option value={texts.filterDefaultText}>{texts.filterDefaultText}</option>
          <option value={texts.vehicleTypesDisplayLocalized.car}>
            {texts.vehicleTypesDisplayLocalized.car}
          </option>
          <option value={texts.vehicleTypesDisplayLocalized.motorcycle}>
            {texts.vehicleTypesDisplayLocalized.motorcycle}
          </option>
          <option value={texts.vehicleTypesDisplayLocalized.truck}>
            {texts.vehicleTypesDisplayLocalized.truck}
          </option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
            vehicleTypeLabelText={texts.vehicleTypeLabelText}
            vehicleTypeMapping={vehicleTypeMapping}
            ratingValue={rating[service._id] || 0}
            onRate={handleRating}
            commentValue={comment[service._id] || ""}
            onCommentChange={handleCommentChange}
            onSubmit={handleSubmit}
            texts={{
              commentLabelText: texts.commentLabelText,
              commentPlaceholderText: texts.commentPlaceholderText,
              rateThisServiceText: texts.rateThisServiceText,
              submitButtonText: texts.submitButtonText,
              ratingLabelText: texts.ratingLabelText,
              noRatingsText: texts.noRatingsText,
            }}
          />
        ))}
      </div>
    </main>
  );
}

export default ServicesClient;
