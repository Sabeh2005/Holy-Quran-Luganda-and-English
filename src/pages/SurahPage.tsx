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

  let combinedAyahs: Ayah[] = [];
  let numberOfAyahs = arabicEdition.numberOfAyahs;

  // Ahmadi Muslim Quran system:
  // - Surah 1 (Al-Fatihah): 7 verses (Bismillah is verse 1)
  // - Surah 9 (At-Tawbah): No Bismillah
  // - All other Surahs: Bismillah is verse 1, total verses = original + 1
  const shouldAddBismillah = surahId !== 9;
  
  if (shouldAddBismillah) {
    // For Surah Al-Fatihah (1), the API already includes Bismillah as verse 1
    // so we don't need to add it again
    if (surahId !== 1) {
      combinedAyahs.push({
        number: 0,
        audio: "",
        text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        englishText: "In the name of Allah, the Most Gracious, the Most Merciful.",
        numberInSurah: 1,
        juz: arabicEdition.ayahs[0].juz,
        manzil: arabicEdition.ayahs[0].manzil,
        page: arabicEdition.ayahs[0].page,
        ruku: arabicEdition.ayahs[0].ruku,
        hizbQuarter: arabicEdition.ayahs[0].hizbQuarter,
        sajda: false
      });
      numberOfAyahs += 1;
    }
  }

  // Add the rest of the verses with adjusted numbering
  arabicEdition.ayahs.forEach((ayah: any, index: number) => {
    // For Surah Al-Fatihah, use the existing verse numbering
    let verseNumber = ayah.numberInSurah;
    let arabicText = ayah.text;
    let englishText = englishEdition.ayahs[index].text;

    // For other Surahs (except 9), adjust numbering
    if (surahId !== 1 && surahId !== 9) {
      verseNumber = ayah.numberInSurah + 1;
    }

    // For Surah Al-Fatihah, we keep the text as is
    if (surahId === 1) {
      combinedAyahs.push({
        ...ayah,
        englishText,
        numberInSurah: verseNumber
      });
    } else {
      // For other Surahs, we need to remove Bismillah from the first verse
      // since we've already added it separately
      if (index === 0 && surahId !== 9) {
        // Remove Bismillah from the beginning of the verse if it exists
        const bismillah = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
        if (arabicText.startsWith(bismillah)) {
          arabicText = arabicText.replace(bismillah, "").trim();
        }
      }
      
      combinedAyahs.push({
        ...ayah,
        text: arabicText,
        englishText,
        numberInSurah: verseNumber
      });
    }
  });

  const surahInfo: Partial<SurahInfo> & { ayahs: Ayah[] } = {
    name: arabicEdition.name,
    englishName: arabicEdition.englishName,
    englishNameTranslation: arabicEdition.englishNameTranslation,
    numberOfAyahs,
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
      <div className="space-y-4">
        {surah?.ayahs.map((ayah) => (
          <AyahListItem
            key={`${id}-${ayah.numberInSurah}`}
            ayah={ayah}
            surahNumber={id}
            displayVerseNumber={ayah.numberInSurah}
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