import { useQuery } from "@tanstack/react-query";

type LugandaTranslation = Record<number, Record<number, string>>;

const LUGANDA_TRANSLATION_URL = "https://ndlvawhavwyvqergzvng.supabase.co/storage/v1/object/public/Luganda%20Quran/Holy%20Quran%20Luganda.txt";

const fetchAndParseTranslation = async (): Promise<LugandaTranslation> => {
  const response = await fetch(LUGANDA_TRANSLATION_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch Luganda translation file.");
  }
  const text = await response.text();
  const rawTranslation: LugandaTranslation = {};
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
        if (!rawTranslation[surah]) {
          rawTranslation[surah] = {};
        }
        rawTranslation[surah][ayah] = translationText;
      }
    }
  }

  // The API includes the Basmala as verse 1 for all Surahs except 9.
  // The translation file omits the Basmala translation, causing a 1-verse offset.
  // We need to adjust the verse numbers from the file to match the API.
  const adjustedTranslation: LugandaTranslation = {};

  for (const surahNumStr in rawTranslation) {
    const surahNumber = parseInt(surahNumStr, 10);
    if (isNaN(surahNumber)) continue;

    adjustedTranslation[surahNumber] = {};
    const surahAyahs = rawTranslation[surahNumber];

    // Surah 9 (At-Tawbah) has no Basmala, so numbering is correct. No adjustment needed.
    if (surahNumber === 9) {
      adjustedTranslation[surahNumber] = surahAyahs;
      continue;
    }

    // For all other Surahs, verse `X` in the file corresponds to verse `X+1` in the API.
    for (const ayahNumStr in surahAyahs) {
      const originalAyahNumber = parseInt(ayahNumStr, 10);
      if (isNaN(originalAyahNumber)) continue;

      const adjustedAyahNumber = originalAyahNumber + 1;
      adjustedTranslation[surahNumber][adjustedAyahNumber] = surahAyahs[originalAyahNumber];
    }
  }

  return adjustedTranslation;
};

export const useLugandaTranslation = () => {
  return useQuery<LugandaTranslation>({
    queryKey: ["lugandaTranslation"],
    queryFn: fetchAndParseTranslation,
    staleTime: Infinity, 
    gcTime: Infinity,
  });
};