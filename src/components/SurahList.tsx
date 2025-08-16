import { useQuery } from "@tanstack/react-query";
import { SurahInfo } from "@/types";
import SurahListItem from "./SurahListItem";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

const fetchSurahs = async (): Promise<SurahInfo[]> => {
  const response = await fetch("https://api.alquran.cloud/v1/surah");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.data;
};

type FilterType = "all" | "meccan" | "medinan";

const SurahList = () => {
  const { data: surahs, isLoading, error } = useQuery<SurahInfo[]>({
    queryKey: ["surahs"],
    queryFn: fetchSurahs,
  });

  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSurahs = surahs
    ?.filter((surah) => {
      if (filter === "all") return true;
      return surah.revelationType.toLowerCase() === filter;
    })
    .filter((surah) => {
      const term = searchTerm.toLowerCase();
      return (
        surah.englishName.toLowerCase().includes(term) ||
        surah.name.toLowerCase().includes(term) ||
        surah.englishNameTranslation.toLowerCase().includes(term) ||
        String(surah.number).includes(term)
      );
    });

  if (error) {
    return <div className="text-center text-destructive">An error occurred: {(error as Error).message}</div>;
  }

  return (
    <div className="bg-background rounded-xl p-4 md:p-6 border">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search Surahs, translations..."
            className="pl-10 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All (114)</Button>
        <Button variant={filter === 'meccan' ? 'default' : 'outline'} onClick={() => setFilter('meccan')}>Meccan (86)</Button>
        <Button variant={filter === 'medinan' ? 'default' : 'outline'} onClick={() => setFilter('medinan')}>Medinan (28)</Button>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSurahs?.map((surah) => (
            <SurahListItem key={surah.number} surah={surah} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SurahList;