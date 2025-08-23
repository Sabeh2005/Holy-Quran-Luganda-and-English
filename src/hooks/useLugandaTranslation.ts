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

  // Split the entire text by "Surah X:" markers. The capturing group keeps the surah number.
  const surahsText = text.split(/Surah (\d+):/i);

  // We start at index 1 because the first element of the split array is the text before the first "Surah" marker.
  // We increment by 2 to process pairs of [surahNumber, surahContent].
  for (let i = 1; i < surahsText.length; i += 2) {
    const surahNumber = parseInt(surahsText[i], 10);
    const surahContent = surahsText[i + 1];
    
    if (!surahNumber || !surahContent) continue;
    
    translation[surahNumber] = {};
    
    // Split the content of one surah by "Ayah Y:" markers.
    const ayahsText = surahContent.split(/Ayah (\d+):/i);
    
    // Similar logic, process pairs of [ayahNumber, ayahContent].
    for (let j = 1; j < ayahsText.length; j += 2) {
        const ayahNumber = parseInt(ayahsText[j], 10);
        const ayahContent = ayahsText[j + 1];
        
        if (!ayahNumber || !ayahContent) continue;
        
        // Clean the text: remove asterisks, replace newlines with spaces, and trim whitespace.
        const cleanedContent = ayahContent.replace(/\*\*/g, '').replace(/\r?\n/g, ' ').trim();
        
        if (cleanedContent) {
          translation[surahNumber][ayahNumber] = cleanedContent;
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
    queryKey: ["lugandaTranslation_v12_new_parser"],
    queryFn: fetchAndParseTranslation,
    staleTime: Infinity, 
    gcTime: Infinity,
  });
};