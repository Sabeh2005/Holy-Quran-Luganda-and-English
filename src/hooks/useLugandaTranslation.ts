import { useQuery } from "@tanstack/react-query";

type LugandaTranslation = Record<number, Record<number, string>>;

const LUGANDA_TRANSLATION_URL = "https://ndlvawhavwyvqergzvng.supabase.co/storage/v1/object/public/Luganda%20Quran/Holy%20Quran%20Luganda.txt";

const fetchAndParseTranslation = async (): Promise<LugandaTranslation> => {
  const response = await fetch(LUGANDA_TRANSLATION_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch Luganda translation file.");
  }
  const text = await response.text();
  const translation: LugandaTranslation = {};
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();
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

  // Adjust for Surah 1 (Al-Fatiha) due to missing Basmala in the translation file
  if (translation[1]) {
    const surah1 = translation[1];
    const adjustedSurah1: Record<number, string> = {};
    // The API includes Basmala as verse 1, but the translation file starts numbering
    // from the next verse. We need to shift the translation keys to match the API.
    // e.g., translation file's verse 1 is actually API's verse 2.
    for (const key in surah1) {
      const originalAyahNumber = parseInt(key, 10);
      if (!isNaN(originalAyahNumber)) {
        adjustedSurah1[originalAyahNumber + 1] = surah1[originalAyahNumber];
      }
    }
    translation[1] = adjustedSurah1;
  }

  return translation;
};

export const useLugandaTranslation = () => {
  return useQuery<LugandaTranslation>({
    queryKey: ["lugandaTranslation"],
    queryFn: fetchAndParseTranslation,
    staleTime: Infinity, 
    gcTime: Infinity,
  });
};