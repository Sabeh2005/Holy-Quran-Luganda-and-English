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

  // Split the entire text by "Surah X:" markers.
  const surahsText = text.split(/Surah (\d+):/i);

  for (let i = 1; i < surahsText.length; i += 2) {
    const surahNumber = parseInt(surahsText[i], 10);
    const surahContent = surahsText[i + 1];
    
    if (!surahNumber || !surahContent) continue;
    
    translation[surahNumber] = {};
    
    // Split the content of one surah by "Ayah Y:" markers.
    const ayahsText = surahContent.split(/Ayah (\d+):/i);
    
    // This is the critical fix: handle text that appears *before* the first "Ayah" marker.
    // My previous parser ignored this, causing all subsequent verses to be misaligned.
    if (ayahsText.length > 1 && ayahsText[0].trim()) {
        const firstAyahNum = parseInt(ayahsText[1], 10);
        const initialContent = ayahsText[0].replace(/\*\*/g, '').replace(/\r?\n/g, ' ').trim();
        if (initialContent) {
            translation[surahNumber][firstAyahNum] = initialContent;
        }
    }
    
    // Process the rest of the ayahs
    for (let j = 1; j < ayahsText.length; j += 2) {
        const ayahNumber = parseInt(ayahsText[j], 10);
        const ayahContent = ayahsText[j + 1];
        
        if (!ayahNumber || !ayahContent) continue;
        
        const cleanedContent = ayahContent.replace(/\*\*/g, '').replace(/\r?\n/g, ' ').trim();
        
        if (cleanedContent) {
          if (translation[surahNumber][ayahNumber]) {
            // Append content if initial text was already added
            translation[surahNumber][ayahNumber] += ' ' + cleanedContent;
          } else {
            translation[surahNumber][ayahNumber] = cleanedContent;
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
    queryKey: ["lugandaTranslation_v13_alignment_fix"],
    queryFn: fetchAndParseTranslation,
    staleTime: Infinity, 
    gcTime: Infinity,
  });
};