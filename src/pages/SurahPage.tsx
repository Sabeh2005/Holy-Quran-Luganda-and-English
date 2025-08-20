import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Ayah, SurahInfo } from "@/types";
import AyahListItem from "@/components/AyahListItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { lugandaSurahNames } from "@/data/lugandaSurahNames";
import { useLugandaTranslation } from "@/hooks/useLugandaTranslation";

const fetchSurahDetail = async (surahId: number) => {
  const [arabicRes, englishRes] = await Promise.all([
    fetch(`https://api.alquran.cloud/v1/surah/${surahId}/quran-uthmani`),
    fetch(`https://api.alquran.cloud/v1/surah/${surahId}/en.sahih`)
  ]);

  if (!arabicRes.ok || !englishRes.ok) {
    throw new Error("Failed to fetch Surah details.");
  }

  const arabicData = await arabicRes.json();
  const englishData = await englishRes.json();

  const arabicEdition = arabicData.data;
  const englishEdition = englishData.data;

  const combinedAyahs: Ayah[] = arabicEdition.ayahs.map((ayah: any, index: number) => ({
    ...ayah,
    englishText: englishEdition.ayahs[index].text,
  }));

  const surahInfo: Partial<SurahInfo> & { ayahs: Ayah[] } = {
    name: arabicEdition.name,
    englishName: arabicEdition.englishName,
    englishNameTranslation: arabicEdition.englishNameTranslation,
    numberOfAyahs: arabicEdition.numberOfAyahs,
    revelationType: arabicEdition.revelationType,
    ayahs: combinedAyahs,
    lugandaName: lugandaSurahNames[surahId - 1] || "",
  };
  return surahInfo;
};

const SurahPage = () => {
  const { surahId } = useParams<{ surahId: string }>();
  const navigate = useNavigate();
  const id = Number(surahId);

  const { data: surah, isLoading: isSurahLoading, error: surahError } = useQuery({
    queryKey: ["surah", id],
    queryFn: () => fetchSurahDetail(id),
    enabled: !isNaN(id),
  });

  const { data: lugandaTranslation, isLoading: isLugandaLoading, error: lugandaError } = useLugandaTranslation();

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

  const handlePlayAyah = (ayah: Ayah) => {
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

  const isLoading = isSurahLoading || isLugandaLoading;
  const error = surahError || lugandaError;

  if (isLoading) {
    return (
      <div className="bg-background rounded-xl p-4 md:p-8 border space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-16 w-1/2 mx-auto" />
        <Skeleton className="h-8 w-1/3 mx-auto" />
        <div className="space-y-4 mt-8">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-destructive">An error occurred: {(error as Error).message}</div>;
  }

  const handleNav = (offset: number) => {
    const nextId = id + offset;
    if (nextId > 0 && nextId < 115) {
      navigate(`/surah/${nextId}`);
    }
  };

  // Special handling for Surah Baqarah (id: 2)
  const isSurahBaqarah = id === 2;
  const bismillahAyah = isSurahBaqarah && surah?.ayahs.length > 0 ? surah.ayahs[0] : null;
  const verseAyahs = isSurahBaqarah ? surah?.ayahs.slice(1) || [] : surah?.ayahs || [];

  return (
    <div className="bg-background rounded-xl p-4 md:p-8 border">
      <div className="flex justify-between items-center mb-8">
        <Button asChild variant="ghost">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Surahs</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => handleNav(-1)} disabled={id <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleNav(1)} disabled={id >= 114}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">{surah?.englishName}</h1>
        {surah?.lugandaName && <p className="text-xl md:text-2xl text-muted-foreground mt-1">{surah.lugandaName}</p>}
        <p className="text-4xl md:text-5xl font-arabic my-2 text-primary">{surah?.name}</p>
        <p className="text-muted-foreground text-lg">{surah?.englishNameTranslation}</p>
        <div className="flex justify-center items-center gap-4 mt-4 text-muted-foreground">
          <Badge variant="secondary">Surah {id}</Badge>
          <Badge variant="secondary">{surah?.numberOfAyahs} verses</Badge>
          <Badge variant="secondary" className="capitalize">{surah?.revelationType}</Badge>
        </div>
        <Button className="mt-6">
          <Play className="mr-2 h-4 w-4" /> Play Surah
        </Button>
      </div>
      
      {/* Special Bismillah header for Surah Baqarah */}
      {isSurahBaqarah && bismillahAyah && (
        <div className="text-center my-8">
          <p className="font-arabic text-3xl">{bismillahAyah.text}</p>
          <p className="text-muted-foreground mt-2">In the name of Allah, the Most Gracious, the Most Merciful</p>
        </div>
      )}
      
      <div className="space-y-4">
        {verseAyahs.map((ayah) => (
          <AyahListItem
            key={ayah.number}
            ayah={ayah}
            surahNumber={id}
            displayVerseNumber={isSurahBaqarah ? ayah.numberInSurah - 1 : ayah.numberInSurah}
            isPlaying={isPlaying && activeAyah?.number === ayah.number}
            onPlay={() => handlePlayAyah(ayah)}
            lugandaTranslation={lugandaTranslation}
          />
        ))}
      </div>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
};

export default SurahPage;