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
  let parsedVerses = 0;

  // Regex to capture each Surah block
  const surahRegex = /Essuula (\d+):([\s\S]*?)(?=Essuula \d+:|$)/g;
  let surahMatch;

  while ((surahMatch = surahRegex.exec(text)) !== null) {
    const surahNumber = parseInt(surahMatch[1], 10);
    const surahContent = surahMatch[2].trim();

    if (isNaN(surahNumber)) continue;

    if (!translation[surahNumber]) {
      translation[surahNumber] = {};
    }

    // Split the content into verses. The separator is a number followed by a dot.
    const verseParts = surahContent.split(/(?=\d+\.\s)/).filter(s => s.trim());

    for (const part of verseParts) {
      const trimmedPart = part.trim();
      const verseMatch = trimmedPart.match(/^(\d+)\.\s*([\s\S]*)/);
      
      if (verseMatch) {
        const ayahNumber = parseInt(verseMatch[1], 10);
        const ayahText = verseMatch[2].replace(/--+$/, '').trim();

        if (!isNaN(ayahNumber) && ayahText) {
          translation[surahNumber][ayahNumber] = ayahText;
          parsedVerses++;
        }
      }
    }
  }

  if (parsedVerses === 0) {
    const fileSnippet = text.substring(0, 500);
    throw new Error(`Failed to parse any verses from the file. Content: "${fileSnippet}"`);
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