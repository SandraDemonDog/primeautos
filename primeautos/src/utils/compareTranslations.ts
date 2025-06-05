

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((o, key) => (o ? o[key] : undefined), obj);
}

export function findMissingKeys(baseData: any, targetData: any) {
  const completelyMissing: Record<string, { es: string; en: string }> = {};
  const partiallyMissing: Record<string, { es: string; en: string }> = {};

  const checkKeys = (obj: any, path = "") => {
    Object.keys(obj).forEach((key) => {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof obj[key] === "object" && obj[key] !== null) {
        checkKeys(obj[key], currentPath);
      } else {
        const baseValue = obj[key];
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
  return { completamente_faltantes: completelyMissing, parcialmente_traducidas: partiallyMissing };
}
