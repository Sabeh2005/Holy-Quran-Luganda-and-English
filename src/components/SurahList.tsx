import { useQuery } from "@tanstack/react-query";
import { SurahInfo } from "@/types";
import SurahListItemGrid from "./SurahListItemGrid";
import SurahListItemList from "./SurahListItemList";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { LayoutGrid, List, Search, Filter, Mic } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { lugandaSurahNames } from "@/data/lugandaSurahNames";
import { useSettings } from "@/context/SettingsContext";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { showError } from "@/utils/toast";

const fetchSurahs = async (): Promise<SurahInfo[]> => {
  const response = await fetch("https://api.alquran.cloud/v1/surah");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  const surahsWithLuganda: SurahInfo[] = data.data.map((surah: SurahInfo) => ({
    ...surah,
    lugandaName: lugandaSurahNames[surah.number - 1] || "",
  }));
  return surahsWithLuganda;
};

type FilterType = "all" | "meccan" | "medinan";

const SurahList = () => {
  const { data: surahs, isLoading, error } = useQuery<SurahInfo[]>({
    queryKey: ["surahs"],
    queryFn: fetchSurahs,
  });

  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [jumpToSurah, setJumpToSurah] = useState<string>("");

  const { voiceLanguage } = useSettings();
  const { isListening, transcript, startListening, error: voiceError } = useVoiceSearch(voiceLanguage);

  useEffect(() => {
    if (transcript) {
      setSearchTerm(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (voiceError) {
      showError(voiceError);
    }
  }, [voiceError]);

  const filteredSurahs = surahs
    ?.filter((surah) => {
      if (!jumpToSurah || jumpToSurah === "all") return true;
      return String(surah.number) === jumpToSurah;
    })
    .filter((surah) => {
      if (filter === "all") return true;
      return surah.revelationType.toLowerCase() === filter;
    })
    .filter((surah) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        surah.englishName.toLowerCase().includes(term) ||
        surah.name.toLowerCase().includes(term) ||
        surah.englishNameTranslation.toLowerCase().includes(term) ||
        (surah.lugandaName && surah.lugandaName.toLowerCase().includes(term)) ||
        String(surah.number).includes(term)
      );
    });

  if (error) {
    return <div className="text-center text-destructive">An error occurred: {(error as Error).message}</div>;
  }

  return (
    <div className="bg-background rounded-xl p-4 md:p-6 border">
      <div className="flex items-center justify-between mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search verses, Surahs, or translations..."
            className="pl-10 pr-12 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={startListening}
            disabled={isListening}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
          >
            <Mic className={`h-5 w-5 ${isListening ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
          </Button>
        </div>
        <Select onValueChange={(value) => setJumpToSurah(value)} value={jumpToSurah}>
          <SelectTrigger className="h-11">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Jump to Surah..." />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Surahs</SelectItem>
            {surahs?.map(surah => (
              <SelectItem key={surah.number} value={String(surah.number)}>
                {surah.number}. {surah.englishName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All (114)</Button>
        <Button variant={filter === 'meccan' ? 'default' : 'outline'} onClick={() => setFilter('meccan')}>Meccan (86)</Button>
        <Button variant={filter === 'medinan' ? 'default' : 'outline'} onClick={() => setFilter('medinan')}>Medinan (28)</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : (
        <>
          {view === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSurahs?.map((surah) => (
                <SurahListItemGrid key={surah.number} surah={surah} />
              ))}
            </div>
          )}
          {view === 'list' && (
            <div className="flex flex-col gap-2">
              {filteredSurahs?.map((surah) => (
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