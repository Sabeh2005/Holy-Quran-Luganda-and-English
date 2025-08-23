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

  const surahsText = text.split(/Surah (\d+):/i);

  for (let i = 1; i < surahsText.length; i += 2) {
    const surahNumber = parseInt(surahsText[i], 10);
    const surahContent = surahsText[i + 1];
    
    if (!surahNumber || !surahContent) continue;
    
    translation[surahNumber] = {};
    
    const ayahsText = surahContent.split(/Ayah (\d+):/i);
    
    const verseOneCandidate = ayahsText[0].replace(/\*\*/g, '').replace(/\r?\n/g, ' ').trim();
    const hasUnlabeledFirstVerse = !!verseOneCandidate;

    if (hasUnlabeledFirstVerse) {
      translation[surahNumber][1] = verseOneCandidate;
    }
    
    for (let j = 1; j < ayahsText.length; j += 2) {
        const ayahLabelNumber = parseInt(ayahsText[j], 10);
        // If there was an unlabeled first verse, the labels are off by one.
        const actualAyahNumber = hasUnlabeledFirstVerse ? ayahLabelNumber + 1 : ayahLabelNumber;
        
        const ayahContent = ayahsText[j + 1];
        if (!ayahContent) continue;
        
        const cleanedContent = ayahContent.replace(/\*\*/g, '').replace(/\r?\n/g, ' ').trim();
        
        if (cleanedContent) {
          if (translation[surahNumber][actualAyahNumber]) {
             translation[surahNumber][actualAyahNumber] += ' ' + cleanedContent;
          } else {
             translation[surahNumber][actualAyahNumber] = cleanedContent;
          }
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
    queryKey: ["lugandaTranslation_v14_final_parser"],
    queryFn: fetchAndParseTranslation,
    staleTime: Infinity, 
    gcTime: Infinity,
  });
};