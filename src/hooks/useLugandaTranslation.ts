import { useQuery } from "@tanstack/react-query";
import { surah1LugandaTranslation } from "@/data/surah-1-luganda";
import { surah2LugandaTranslation } from "@/data/surah-2-luganda";

type LugandaTranslation = Record<number, Record<number, string>>;

const allTranslations: LugandaTranslation = {
  1: surah1LugandaTranslation,
  2: surah2LugandaTranslation,
  // Other surahs can be added here in the future
};

const fetchAllTranslations = async (): Promise<LugandaTranslation> => {
  // This function now returns the combined local data.
  // It's wrapped in a promise to maintain the async structure expected by react-query.
  return Promise.resolve(allTranslations);
};

export const useLugandaTranslation = () => {
  return useQuery<LugandaTranslation>({
    queryKey: ["lugandaTranslation_local"],
    queryFn: fetchAllTranslations,
    staleTime: Infinity, 
    gcTime: Infinity,
  });
};