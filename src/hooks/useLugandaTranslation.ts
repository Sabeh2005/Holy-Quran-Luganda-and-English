import { useQuery } from "@tanstack/react-query";

type LugandaTranslation = Record<number, Record<number, string>>;

const LUGANDA_TRANSLATION_URL = "https://ndlvawhavwyvqergzvng.supabase.co/storage/v1/object/public/Luganda%20Quran/Holy%20Quran%20Luganda.txt";

const fetchAndParseTranslation = async (): Promise<LugandaTranslation> => {
  const response = await fetch(LUGANDA_TRANSLATION_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch Luganda translation.");
  }
  let text = await response.text();

  // Remove Byte Order Mark (BOM) if it exists, as it can interfere with parsing
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }
  
  const translation: LugandaTranslation = {};
  // Use a more robust regex to split lines, handling different line endings (\n, \r, \r\n)
  const lines = text.split(/\r\n?|\n/);

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
      }
    }
  }

  return translation;
};

export const useLugandaTranslation = () => {
  return useQuery<LugandaTranslation>({
    queryKey: ["lugandaTranslation"],
    queryFn: fetchAndParseTranslation,
    staleTime: Infinity, // This data is static, so we don't need to refetch it.
    gcTime: Infinity,
  });
};