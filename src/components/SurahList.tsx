import { useState, useRef, useEffect } from "react";
import { surahs, Surah } from "@/data/surahs";
import SurahListItem from "./SurahListItem";

const SurahList = () => {
  const [activeSurah, setActiveSurah] = useState<Surah | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && activeSurah) {
        if (audioRef.current.src !== activeSurah.audioUrl) {
          audioRef.current.src = activeSurah.audioUrl;
        }
        audioRef.current.play().catch(error => console.error("Audio play failed:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, activeSurah]);

  const handlePlay = (surah: Surah) => {
    if (activeSurah?.id === surah.id) {
      // Toggle play/pause for the same surah
      setIsPlaying(!isPlaying);
    } else {
      // Play a new surah
      setActiveSurah(surah);
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">The Holy Quran</h1>
      <div className="space-y-4">
        {surahs.map((surah) => (
          <SurahListItem
            key={surah.id}
            surah={surah}
            isPlaying={isPlaying && activeSurah?.id === surah.id}
            onPlay={() => handlePlay(surah)}
          />
        ))}
      </div>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
};

export default SurahList;