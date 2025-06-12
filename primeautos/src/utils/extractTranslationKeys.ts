import fs from "fs";
import path from "path";

export function extractUsedTranslationKeys(dir: string): string[] {
  const keys: string[] = [];

  const traverse = (currentPath: string) => {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".js")) {
        const content = fs.readFileSync(fullPath, "utf8");
        const regex = /t\(\s*['"`]([\w\d.]+)['"`]\s*\)/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
          if (match[1]) {
            keys.push(match[1]);
          }
        }
      }
    }
  };

  traverse(dir);

  return Array.from(new Set(keys));
}
