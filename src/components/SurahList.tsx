import { useQuery } from "@tanstack/react-query";
import { SurahInfo } from "@/types";
import SurahListItem from "./SurahListItem";
import { Skeleton } from "@/components/ui/skeleton";

const fetchSurahs = async (): Promise<SurahInfo[]> => {
  const response = await fetch("https://api.alquran.cloud/v1/surah");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.data;
};

const SurahList = () => {
  const { data: surahs, isLoading, error } = useQuery<SurahInfo[]>({
    queryKey: ["surahs"],
    queryFn: fetchSurahs,
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-destructive">An error occurred: {(error as Error).message}</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">The Holy Quran</h1>
      <div className="space-y-4">
        {surahs?.map((surah) => (
          <SurahListItem key={surah.number} surah={surah} />
        ))}
      </div>
    </div>
  );
};

export default SurahList;