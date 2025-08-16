import { useQuery } from "@tanstack/react-query";
import { SurahInfo } from "@/types";
import SurahListItemGrid from "./SurahListItemGrid";
import SurahListItemList from "./SurahListItemList";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { LayoutGrid, List, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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

  const [view, setView] = useState("grid");

  if (error) {
    return <div className="text-center text-destructive">An error occurred: {(error as Error).message}</div>;
  }

  return (
    <div className="bg-background rounded-xl p-4 md:p-6 border">
      <div className="flex items-center gap-2 mb-6">
        <ToggleGroup type="single" value={view} onValueChange={(value) => { if (value) setView(value); }} defaultValue="grid">
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grid
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4 mr-2" />
            List
          </ToggleGroupItem>
          <ToggleGroupItem value="browse" aria-label="Browse">
            <Search className="h-4 w-4 mr-2" />
            Browse
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : (
        <>
          {view === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {surahs?.map((surah) => (
                <SurahListItemGrid key={surah.number} surah={surah} />
              ))}
            </div>
          )}
          {view === 'list' && (
            <div className="flex flex-col gap-2">
              {surahs?.map((surah) => (
                <SurahListItemList key={surah.number} surah={surah} />
              ))}
            </div>
          )}
           {view === 'browse' && (
            <div className="text-center p-8 text-muted-foreground">
              Browse view is not yet implemented.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SurahList;