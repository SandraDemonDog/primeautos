export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((o: unknown, key: string) => {
    if (typeof o === "object" && o !== null && key in o) {
      return (o as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function findMissingKeys(
  baseData: Record<string, unknown>,
  targetData: Record<string, unknown>
) {
  const completelyMissing: Record<string, { es: string; en: string }> = {};
  const partiallyMissing: Record<string, { es: string; en: string }> = {};

  const checkKeys = (obj: Record<string, unknown>, path = "") => {
    Object.keys(obj).forEach((key) => {
      const currentPath = path ? `${path}.${key}` : key;
      const value = obj[key];

      if (typeof value === "object" && value !== null) {
        checkKeys(value as Record<string, unknown>, currentPath);
      } else {
        const targetValue = getNestedValue(targetData, currentPath);

        if (targetValue === undefined) {
          completelyMissing[currentPath] = { es: "", en: "" };
        } else if (!targetValue) {
          partiallyMissing[currentPath] = { es: "", en: "" };
        }
      }
    });
  };

  checkKeys(baseData);

  return {
    completamente_faltantes: completelyMissing,
    parcialmente_traducidas: partiallyMissing,
  };
}
