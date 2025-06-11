"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Input from "@/components/Inputs";
import Button from "@/components/Button";

export default function AdminTranslationsPanel() {
  const [missingKeys, setMissingKeys] = useState<{
    completamente_faltantes: Record<string, { es: string; en: string }>;
    parcialmente_traducidas: Record<string, { es?: string; en?: string }>;
  }>({
    completamente_faltantes: {},
    parcialmente_traducidas: {}
  });

  const [updates, setUpdates] = useState<Record<string, { es?: string; en?: string }>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchMissingKeys = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/translations/missing");
      setMissingKeys(res.data.missing);
    } catch (error) {
      console.error("Error al obtener las claves faltantes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissingKeys();
  }, []);

  const handleInputChange = (key: string, lang: "es" | "en", value: string) => {
    setUpdates((prev) => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value }
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Filtrar solo las claves con valores no vacíos
      const filteredUpdates = Object.entries(updates).reduce((acc, [key, langs]) => {
        const es = langs.es?.trim();
        const en = langs.en?.trim();

        if (es || en) {
          acc[key] = {};
          if (es) acc[key].es = es;
          if (en) acc[key].en = en;
        }

        return acc;
      }, {} as Record<string, { es?: string; en?: string }>);

      if (Object.keys(filteredUpdates).length === 0) {
        setMessage("No hay traducciones para guardar.");
        return;
      }

      const res = await axios.post("/api/translations/update", filteredUpdates);

      if (res.data.success) {
        setMessage("Traducciones actualizadas correctamente.");
        fetchMissingKeys();
        setUpdates({});
      } else {
        setMessage("Ocurrió un error al actualizar las traducciones.");
      }
    } catch (error) {
      console.error("Error guardando las traducciones", error);
      setMessage("Error al guardar las traducciones.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Panel de Traducciones Multilingüe</h1>

      {loading && <p>Cargando...</p>}
      {!loading && (
        <>
          <h2 className="text-xl font-bold mt-4 mb-2 text-red-600">🔴 Claves completamente faltantes</h2>
          {Object.keys(missingKeys.completamente_faltantes).length === 0 ? (
            <p className="text-gray-600">No hay claves completamente faltantes.</p>
          ) : (
            Object.entries(missingKeys.completamente_faltantes).map(([key]) => (
              <div key={key} className="mb-4">
                <label className="block font-bold mb-1">{key}</label>
                <Input
                  type="text"
                  name={`${key}_es`}
                  value={updates[key]?.es || ""}
                  onChange={(e) => handleInputChange(key, "es", e.target.value)}
                  placeholder="Traducción en español"
                  label="ES"
                  className="w-full"
                />
                <Input
                  type="text"
                  name={`${key}_en`}
                  value={updates[key]?.en || ""}
                  onChange={(e) => handleInputChange(key, "en", e.target.value)}
                  placeholder="Translation in English"
                  label="EN"
                  className="w-full mt-2"
                />
              </div>
            ))
          )}

          <h2 className="text-xl font-bold mt-6 mb-2 text-yellow-600">🟡 Claves parcialmente traducidas</h2>
          {Object.keys(missingKeys.parcialmente_traducidas).length === 0 ? (
            <p className="text-gray-600">No hay claves parcialmente traducidas.</p>
          ) : (
            Object.entries(missingKeys.parcialmente_traducidas)
              .filter(([, langs]) => !langs.es || !langs.en)
              .map(([key, langs]) => (
                <div key={key} className="mb-4">
                  <label className="block font-bold mb-1">{key}</label>
                  <Input
                    type="text"
                    name={`${key}_es`}
                    value={updates[key]?.es || langs.es || ""}
                    onChange={(e) => handleInputChange(key, "es", e.target.value)}
                    placeholder="Completar traducción en español"
                    label="ES"
                    className="w-full"
                  />
                  <Input
                    type="text"
                    name={`${key}_en`}
                    value={updates[key]?.en || langs.en || ""}
                    onChange={(e) => handleInputChange(key, "en", e.target.value)}
                    placeholder="Complete translation in English"
                    label="EN"
                    className="w-full mt-2"
                  />
                </div>
              ))
          )}

          <Button
            buttonLabel="Guardar Traducciones"
            onButtonClick={handleSave}
            buttonType="dark"
            className="mt-4"
            disabled={loading}
          />

          {message && <p className="mt-2 text-green-600">{message}</p>}
        </>
      )}
    </div>
  );
}
