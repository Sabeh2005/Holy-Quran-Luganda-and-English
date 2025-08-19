import { useQuery } from "@tanstack/react-query";

type LugandaTranslation = Record<number, Record<number, string>>;

const LUGANDA_TRANSLATION_URL = "https://ndlvawhavwyvqergzvng.supabase.co/storage/v1/object/public/Luganda%20Quran/Holy%20Quran%20Luganda.txt";

const fetchAndParseTranslation = async (): Promise<LugandaTranslation> => {
  const response = await fetch(LUGANDA_TRANSLATION_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch Luganda translation file.");
  }
  
  const blob = await response.blob();
  const text = await blob.text();
  
  const rawTranslation: LugandaTranslation = {};
  const lines = text.split(/\r\n?|\n/);

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
        if (!rawTranslation[surah]) {
          rawTranslation[surah] = {};
        }
        rawTranslation[surah][ayah] = translationText;
      }
    }
  }

  // The Quran API includes "Bismillah" as verse 1 for all Surahs except 9,
  // shifting the verse numbers. The Luganda translation file does not.
  // We need to adjust the keys in our translation map to align with the API.
  const adjustedTranslation: LugandaTranslation = {};

  for (const surahKey in rawTranslation) {
    const surahNumber = parseInt(surahKey, 10);
    if (isNaN(surahNumber)) continue;

    // Surah 9 (At-Tawbah) does not start with Bismillah, so no adjustment is needed.
    if (surahNumber === 9) {
      adjustedTranslation[surahNumber] = rawTranslation[surahNumber];
      continue;
    }

    // For all other Surahs, shift the verse number key by +1.
    // e.g., Luganda file's verse 1 becomes key 2 to match the API's second verse.
    adjustedTranslation[surahNumber] = {};
    for (const ayahKey in rawTranslation[surahNumber]) {
      const ayahNumber = parseInt(ayahKey, 10);
      if (!isNaN(ayahNumber)) {
        adjustedTranslation[surahNumber][ayahNumber + 1] = rawTranslation[surahNumber][ayahNumber];
      }
    }
  }

  return adjustedTranslation;
};

export const useLugandaTranslation = () => {
  return useQuery<LugandaTranslation>({
    // Using a new queryKey to prevent using a stale, unadjusted cache.
    queryKey: ["lugandaTranslation_v4_adjusted"],
    queryFn: fetchAndParseTranslation,
    staleTime: Infinity, 
    gcTime: Infinity,
  });
};