import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { setNestedValue } from '@/utils/setNestedValue';

type UpdatePayload = Record<string, { es?: string; en?: string }>;

export async function POST(req: NextRequest) {
  try {
    const updates: UpdatePayload = await req.json();

    const esPath = path.join(process.cwd(), 'src', 'locales', 'es.json');
    const enPath = path.join(process.cwd(), 'src', 'locales', 'en.json');

    const esData = fs.existsSync(esPath) ? JSON.parse(fs.readFileSync(esPath, 'utf8')) : {};
    const enData = fs.existsSync(enPath) ? JSON.parse(fs.readFileSync(enPath, 'utf8')) : {};

    for (const key in updates) {
      if (updates[key].es) {
        setNestedValue(esData, key, updates[key].es!);
      }
      if (updates[key].en) {
        setNestedValue(enData, key, updates[key].en!);
      }
    }

    fs.writeFileSync(esPath, JSON.stringify(esData, null, 2), 'utf8');
    fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al actualizar traducciones:", error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar las traducciones' },
      { status: 500 }
    );
  }
}
