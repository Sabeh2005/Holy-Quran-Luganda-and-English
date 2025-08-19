import { useQuery } from "@tanstack/react-query";

type LugandaTranslation = Record<number, Record<number, string>>;

const LUGANDA_TRANSLATION_URL = "https://ndlvawhavwyvqergzvng.supabase.co/storage/v1/object/public/Luganda%20Quran/Holy%20Quran%20Luganda.txt";

const fetchAndParseTranslation = async (): Promise<LugandaTranslation> => {
  const response = await fetch(LUGANDA_TRANSLATION_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch Luganda translation file.");
  }
  let text = await response.text();

  // Remove Byte Order Mark (BOM) if it exists
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }
  
  const translation: LugandaTranslation = {};
  const lines = text.split(/\r\n?|\n/);
  let validLines = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();
    // Skip comments and empty lines
    if (trimmedLine.startsWith('#') || trimmedLine === '') {
      continue;
    }

    const parts = trimmedLine.split('|');
    if (parts.length === 3) {
      const surah = parseInt(parts[0], 10);
      const ayah = parseInt(parts[1], 10);
      const translationText = parts[2].trim();

      if (!isNaN(surah) && !isNaN(ayah) && translationText) {
        if (!translation[surah]) {
          translation[surah] = {};
        }
        translation[surah][ayah] = translationText;
        validLines++;
      }
    }
  }

  // If after processing all lines, we have no translations, the file format is likely incorrect.
  if (validLines === 0 && lines.length > 1) {
      throw new Error(`Parsing failed: Processed ${lines.length} lines but found 0 valid translations.`);
  }

  return translation;
};

export const useLugandaTranslation = () => {
  return useQuery<LugandaTranslation>({
    // Changed queryKey to v2 to invalidate any potentially corrupt cache.
    queryKey: ["lugandaTranslation", "v2"],
    queryFn: fetchAndParseTranslation,
    staleTime: Infinity, 
    gcTime: Infinity,
  });
};