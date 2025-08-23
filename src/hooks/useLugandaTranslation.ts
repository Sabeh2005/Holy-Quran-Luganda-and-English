import { useQuery } from "@tanstack/react-query";
import { surah1LugandaTranslation } from "@/data/surah-1-luganda";
import { surah2LugandaTranslation } from "@/data/surah-2-luganda";
import { surah3LugandaTranslation } from "@/data/surah-3-luganda";
// ... imports for surahs 4-114 would be here

type LugandaTranslation = Record<number, Record<number, string>>;

// This object would contain all 114 imported translations
const allTranslations: LugandaTranslation = {
  1: surah1LugandaTranslation,
  2: surah2LugandaTranslation,
  3: surah3LugandaTranslation,
  // ... Other surahs would be added here
};

const fetchAllTranslations = async (): Promise<LugandaTranslation> => {
  // This function now returns the combined local data.
  // It's wrapped in a promise to maintain the async structure expected by react-query.
  return Promise.resolve(allTranslations);
};

export const useLugandaTranslation = () => {
  return useQuery<LugandaTranslation>({
    queryKey: ["lugandaTranslation_local_all"],
    queryFn: fetchAllTranslations,
    staleTime: Infinity, 
    gcTime: Infinity,
  });
};