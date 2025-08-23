import { useQuery } from "@tanstack/react-query";

type LugandaTranslation = Record<number, Record<number, string>>;

const LUGANDA_TRANSLATION_URL = "https://ndlvawhavwyvqergzvng.supabase.co/storage/v1/object/public/Luganda%20Quran/Holy%20Quran%20Luganda%20new.txt";

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
  let lastAyahInSurah: number | null = null;

  for (const line of lines) {
    let processedLine = line.trim();
    if (!processedLine) continue;

    const surahMatch = processedLine.match(/Surah (\d+):/i);
    if (surahMatch) {
        currentSurah = parseInt(surahMatch[1], 10);
        if (!translation[currentSurah]) {
            translation[currentSurah] = {};
        }
        processedLine = processedLine.substring(surahMatch[0].length).trim();
        lastAyahInSurah = null;

        if (currentSurah === 1 && processedLine) {
            const parts = processedLine.split(/Ayah \d+:/i);
            for (let i = 1; i < parts.length; i++) {
                const verseText = parts[i].replace(/###.*$/, "").trim();
                if (verseText) {
                    translation[currentSurah][i] = verseText;
                }
            }
            continue;
        }
    }

    if (currentSurah && processedLine) {
        const ayahMatch = processedLine.match(/^Ayah (\d+):\s*(.*)/i);
        if (ayahMatch) {
            const ayahNum = parseInt(ayahMatch[1], 10);
            const ayahText = ayahMatch[2].trim();
            lastAyahInSurah = ayahNum;
            translation[currentSurah][ayahNum] = (translation[currentSurah][ayahNum] || '') + ayahText;
        } else if (lastAyahInSurah) {
            translation[currentSurah][lastAyahInSurah] += ' ' + processedLine;
        }
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
    queryKey: ["lugandaTranslation_v9_final_parser"],
    queryFn: fetchAndParseTranslation,
    staleTime: Infinity, 
    gcTime: Infinity,
  });
};