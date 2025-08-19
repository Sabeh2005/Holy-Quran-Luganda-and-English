import { useQuery } from "@tanstack/react-query";

type LugandaTranslation = Record<number, Record<number, string>>;

const LUGANDA_TRANSLATION_URL = "https://ndlvawhavwyvqergzvng.supabase.co/storage/v1/object/public/Luganda%20Quran/Holy%20Quran%20Luganda.txt";

const fetchAndParseTranslation = async (): Promise<LugandaTranslation> => {
  const response = await fetch(LUGANDA_TRANSLATION_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch Luganda translation file. Status: ${response.status}`);
  }
  
  const text = await response.text();
  if (!text) {
    throw new Error("Luganda translation file is empty.");
  }
  
  const translation: LugandaTranslation = {};
  const lines = text.split('\n');
  
  let currentSurah: number | null = null;
  let currentAyah: number | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue; // Skip empty lines

    // Check for Surah header
    const surahMatch = trimmedLine.match(/^Essuula (\d+):/);
    if (surahMatch) {
      currentSurah = parseInt(surahMatch[1], 10);
      if (!translation[currentSurah]) {
        translation[currentSurah] = {};
      }
      currentAyah = null; // Reset current ayah when a new surah starts
      continue;
    }

    // Check for Ayah start
    const ayahMatch = trimmedLine.match(/^(\d+)\.\s*(.*)/);
    if (ayahMatch && currentSurah) {
      currentAyah = parseInt(ayahMatch[1], 10);
      const ayahText = ayahMatch[2].trim();
      
      if (translation[currentSurah] && !isNaN(currentAyah)) {
        translation[currentSurah][currentAyah] = ayahText;
      }
      continue;
    }

    // If it's not a surah or a new ayah, it's a continuation of the previous ayah
    if (currentSurah && currentAyah && translation[currentSurah] && translation[currentSurah][currentAyah]) {
      translation[currentSurah][currentAyah] += ' ' + trimmedLine;
    }
  }

  // Clean up trailing hyphens from all verses
  for (const surahNum in translation) {
    for (const ayahNum in translation[surahNum]) {
      translation[surahNum][ayahNum] = translation[surahNum][ayahNum].replace(/--+$/, '').trim();
    }
  }

  if (Object.keys(translation).length === 0) {
    const fileSnippet = text.substring(0, 500);
    throw new Error(`Failed to parse any surahs from the file. Content: "${fileSnippet}"`);
  }

  return translation;
};


export const useLugandaTranslation = () => {
  return useQuery<LugandaTranslation>({
    queryKey: ["lugandaTranslation_v2_parser"],
    queryFn: fetchAndParseTranslation,
    staleTime: Infinity, 
    gcTime: Infinity,
  });
};