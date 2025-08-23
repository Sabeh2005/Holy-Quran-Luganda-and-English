import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Ayah, SurahInfo } from "@/types";
import AyahListItem from "@/components/AyahListItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { lugandaSurahNames } from "@/data/lugandaSurahNames";
import { useLugandaTranslation } from "@/hooks/useLugandaTranslation";
import { useMisharyAudio } from "@/hooks/useMisharyAudio";
import { showError } from "@/utils/toast";

const BISMILLAH_TEXT = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

const BISMILLAH_AYAH: Ayah = {
  number: 0, // Using 0 as a unique identifier for our custom Bismillah object
  audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
  text: BISMILLAH_TEXT,
  englishText: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
  numberInSurah: 1,
  juz: 0, manzil: 0, page: 0, ruku: 0, hizbQuarter: 0, sajda: false,
};

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

  let finalAyahs = combinedAyahs;
  let finalNumberOfAyahs = arabicEdition.numberOfAyahs;

  // For all surahs except Al-Fatihah (1) and At-Tawbah (9)
  if (surahId !== 1 && surahId !== 9) {
    // First, clean the Bismillah from the API's first verse if it exists
    if (finalAyahs.length > 0 && finalAyahs[0].text.startsWith(BISMILLAH_TEXT)) {
      finalAyahs[0].text = finalAyahs[0].text.replace(BISMILLAH_TEXT, '').trim();
    }

    // Then, prepend our independent Bismillah and re-number all subsequent verses
    const shiftedAyahs = finalAyahs.map(ayah => ({
      ...ayah,
      numberInSurah: ayah.numberInSurah + 1,
    }));
    finalAyahs = [BISMILLAH_AYAH, ...shiftedAyahs];
    finalNumberOfAyahs += 1;
  }

  const surahInfo: Partial<SurahInfo> & { ayahs: Ayah[] } = {
    name: arabicEdition.name,
    englishName: arabicEdition.englishName,
    englishNameTranslation: arabicEdition.englishNameTranslation,
    numberOfAyahs: finalNumberOfAyahs,
    revelationType: arabicEdition.revelationType,
    ayahs: finalAyahs,
    lugandaName: lugandaSurahNames[surahId - 1] || "",
  };
  return surahInfo;
};

const SurahPage = () => {
  const { surahId } = useParams<{ surahId: string }>();
  const navigate = useNavigate();
  const id = Number(surahId);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const { data: surah, isLoading: isSurahLoading, error: surahError } = useQuery({
    queryKey: ["surah", id],
    queryFn: () => fetchSurahDetail(id),
    enabled: !isNaN(id),
  });

  const { data: lugandaTranslation, isLoading: isLugandaLoading, error: lugandaError } = useLugandaTranslation();
  const { data: misharyAudioLinks, isLoading: isMisharyLoading } = useMisharyAudio();

  const [activeAyah, setActiveAyah] = useState<Ayah | null>(null);
  const [isAyahPlaying, setIsAyahPlaying] = useState(false);
  const [isSurahPlaying, setIsSurahPlaying] = useState(false);

  const stopCurrentAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.removeAttribute('src');
      audioPlayerRef.current = null;
    }
    setIsAyahPlaying(false);
    setIsSurahPlaying(false);
    setActiveAyah(null);
  };

  useEffect(() => {
    return () => {
      stopCurrentAudio();
    };
  }, [id]);

  const playAudio = (src: string, onPlay: () => void, onEnd: () => void) => {
    stopCurrentAudio();
    const newAudio = new Audio(src);
    audioPlayerRef.current = newAudio;
    
    newAudio.play()
      .then(() => {
        onPlay();
      })
      .catch(err => {
        console.error("Audio playback error:", err);
        showError("Audio playback failed. Your browser might be blocking it.");
        stopCurrentAudio();
      });

    newAudio.onended = onEnd;
  };

  const handlePlayAyah = (ayah: Ayah) => {
    if (isAyahPlaying && activeAyah?.number === ayah.number && activeAyah?.numberInSurah === ayah.numberInSurah) {
      stopCurrentAudio();
    } else {
      playAudio(
        ayah.audio,
        () => {
          setActiveAyah(ayah);
          setIsAyahPlaying(true);
        },
        () => {
          setIsAyahPlaying(false);
          setActiveAyah(null);
        }
      );
    }
  };

  const handlePlaySurah = () => {
    if (isSurahPlaying) {
      stopCurrentAudio();
    } else {
      if (!misharyAudioLinks) {
        showError("Audio data is not loaded yet.");
        return;
      }
      const surahAudioSrc = misharyAudioLinks[id - 1];
      if (!surahAudioSrc) {
        showError("Could not find audio for this Surah.");
        return;
      }
      playAudio(
        surahAudioSrc,
        () => setIsSurahPlaying(true),
        () => setIsSurahPlaying(false)
      );
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
        <Button className="mt-6" onClick={handlePlaySurah} disabled={isMisharyLoading}>
          {isSurahPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isSurahPlaying ? 'Pause Surah' : 'Play Surah'}
        </Button>
      </div>
      
      <div className="space-y-4">
        {surah?.ayahs.map((ayah) => (
          <AyahListItem
            key={`${ayah.number}-${ayah.numberInSurah}`}
            ayah={ayah}
            surahNumber={id}
            displayVerseNumber={ayah.numberInSurah}
            isPlaying={isAyahPlaying && activeAyah?.number === ayah.number && activeAyah?.numberInSurah === ayah.numberInSurah}
            onPlay={() => handlePlayAyah(ayah)}
            lugandaTranslation={lugandaTranslation}
          />
        ))}
      </div>
    </div>
  );
};

export default SurahPage;