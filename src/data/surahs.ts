export interface Surah {
  id: number;
  name: string;
  englishName: string;
  audioUrl: string;
}

export const surahs: Surah[] = [
  {
    id: 1,
    name: "سورة الفاتحة",
    englishName: "Al-Fatiha",
    audioUrl: "https://server7.mp3quran.net/afs/001.mp3",
  },
  {
    id: 2,
    name: "سورة البقرة",
    englishName: "Al-Baqarah",
    audioUrl: "https://server7.mp3quran.net/afs/002.mp3",
  },
];