type NestedObject = {
  [key: string]: unknown | NestedObject;
};

export function setNestedValue(obj: NestedObject, path: string, value: unknown): void {
  const keys = path.split(".");
  let current: NestedObject = obj;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      (current as NestedObject)[key] = value;
    } else {
      if (typeof current[key] !== "object" || current[key] === null) {
        current[key] = {};
      }
      current = current[key] as NestedObject;
    }
  });
}
