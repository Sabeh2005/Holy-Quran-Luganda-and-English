import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Ayah } from "@/types";
import AyahListItem from "@/components/AyahListItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const fetchSurahDetail = async (surahId: number) => {
  const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,en.sahih`);
  if (!response.ok) {
    throw new Error("Failed to fetch Surah details.");
  }
  const data = await response.json();
  const arabicEdition = data.data[0];
  const englishEdition = data.data[1];

  const combinedAyahs: Ayah[] = arabicEdition.ayahs.map((ayah: any, index: number) => ({
    ...ayah,
    englishText: englishEdition.ayahs[index].text,
  }));

  return {
    name: arabicEdition.name,
    englishName: arabicEdition.englishName,
    englishNameTranslation: arabicEdition.englishNameTranslation,
    ayahs: combinedAyahs,
  };
};

const SurahPage = () => {
  const { surahId } = useParams<{ surahId: string }>();
  const id = Number(surahId);

  const { data: surah, isLoading, error } = useQuery({
    queryKey: ["surah", id],
    queryFn: () => fetchSurahDetail(id),
    enabled: !isNaN(id),
  });

  const [activeAyah, setActiveAyah] = useState<Ayah | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && activeAyah) {
        if (audioRef.current.src !== activeAyah.audio) {
          audioRef.current.src = activeAyah.audio;
        }
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, activeAyah]);

  const handlePlay = (ayah: Ayah) => {
    if (activeAyah?.number === ayah.number) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveAyah(ayah);
      setIsPlaying(true);
    }
  };

  if (isNaN(id)) {
    return <div className="text-center p-8">Invalid Surah number.</div>;
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-8 w-1/3" />
        <div className="space-y-4 mt-8">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-destructive">An error occurred: {(error as Error).message}</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Button asChild variant="outline" className="mb-8">
        <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Surah List</Link>
      </Button>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">{surah?.englishName}</h1>
        <p className="text-2xl font-arabic">{surah?.name}</p>
        <p className="text-muted-foreground">{surah?.englishNameTranslation}</p>
      </div>
      <div className="space-y-4">
        {surah?.ayahs.map((ayah) => (
          <AyahListItem
            key={ayah.number}
            ayah={ayah}
            isPlaying={isPlaying && activeAyah?.number === ayah.number}
            onPlay={() => handlePlay(ayah)}
          />
        ))}
      </div>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
};

export default SurahPage;