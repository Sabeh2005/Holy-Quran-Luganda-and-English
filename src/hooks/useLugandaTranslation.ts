import { useQuery } from "@tanstack/react-query";

type LugandaTranslation = Record<number, Record<number, string>>;

const LUGANDA_TRANSLATION_URL = "https://ndlvawhavwyvqergzvng.supabase.co/storage/v1/object/public/Luganda%20Quran/Holy%20Quran%20Luganda.txt";

const fetchAndParseTranslation = async (): Promise<LugandaTranslation> => {
  const response = await fetch(LUGANDA_TRANSLATION_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch Luganda translation.");
  }
  const text = await response.text();
  
  const translation: LugandaTranslation = {};
  const lines = text.split('\n');

  for (const line of lines) {
    if (line.startsWith('#') || line.trim() === '') {
      continue;
    }

    const parts = line.split('|');
    if (parts.length === 3) {
      const surah = parseInt(parts[0], 10);
      const ayah = parseInt(parts[1], 10);
      const translationText = parts[2];

      if (!isNaN(surah) && !isNaN(ayah)) {
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
    staleTime: Infinity,
    gcTime: Infinity,
  });
};