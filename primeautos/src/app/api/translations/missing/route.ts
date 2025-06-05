
import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { findMissingKeys } from "@/utils/compareTranslations";
import { extractUsedTranslationKeys } from "@/utils/extractTranslationKeys";
import { getNestedValue } from "@/utils/compareTranslations";


export async function GET(req: NextRequest) {
  const baseLang = "en";
  const targetLang = req.nextUrl.searchParams.get("lang") === "en" ? "en" : "es";

  const basePath = path.join(process.cwd(), "src", "locales", `${baseLang}.json`);
  const targetPath = path.join(process.cwd(), "src", "locales", `${targetLang}.json`);

  try {
    const baseData = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const targetData = fs.existsSync(targetPath) ? JSON.parse(fs.readFileSync(targetPath, "utf8")) : {};

    const missing = findMissingKeys(baseData, targetData);


    const usedKeys = extractUsedTranslationKeys(path.join(process.cwd(), "src"));
    
    const notDefined: Record<string, true> = {};
    for (const key of usedKeys) {
      if (getNestedValue(baseData, key) === undefined && getNestedValue(targetData, key) === undefined) {
        notDefined[key] = true;
      }
    }

    return NextResponse.json({
      missing: {
        ...missing,
        usadas_no_definidas: Object.keys(notDefined).reduce((acc, key) => {
          acc[key] = { es: "", en: "" };
          return acc;
        }, {} as Record<string, { es: string; en: string }>)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { missing: { error: "Error al leer los archivos de traducción" } },
      { status: 500 }
    );
  }
}
