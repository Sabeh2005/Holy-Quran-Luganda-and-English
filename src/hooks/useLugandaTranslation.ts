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
  const lines = text.split(/\r\n?|\n/);
  let parsedLines = 0;
  const lineRegex = /^(\d+)\|(\d+)\|(.*)$/;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('#') || trimmedLine === '') {
      continue;
    }

    const match = trimmedLine.match(lineRegex);

    if (match && match.length === 4) {
      const surah = parseInt(match[1], 10);
      const ayah = parseInt(match[2], 10);
      const translationText = match[3].trim();

      if (!isNaN(surah) && !isNaN(ayah) && translationText) {
        if (!translation[surah]) {
          translation[surah] = {};
        }
        translation[surah][ayah] = translationText;
        parsedLines++;
      }
    }
  }

  if (parsedLines === 0) {
    const fileSnippet = text.substring(0, 500);
    throw new Error(`Failed to parse any lines. File format may be incorrect. Start of file: "${fileSnippet}"`);
  }

  return translation;
};

export const useLugandaTranslation = () => {
  return useQuery<LugandaTranslation>({
    queryKey: ["lugandaTranslation_final_correct"],
    queryFn: fetchAndParseTranslation,
    staleTime: Infinity, 
    gcTime: Infinity,
  });
};