import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Highlights = Record<string, string>; // key: "surah-ayah", value: color

interface HighlightContextType {
  highlights: Highlights;
  addHighlight: (surah: number, ayah: number, color: string) => void;
  removeHighlight: (surah: number, ayah: number) => void;
  getHighlightColor: (surah: number, ayah: number) => string | undefined;
}

const HighlightContext = createContext<HighlightContextType | undefined>(undefined);

const getInitialHighlights = (): Highlights => {
  if (typeof window === 'undefined') return {};
  try {
    const item = window.localStorage.getItem('quranHighlights');
    return item ? JSON.parse(item) : {};
  } catch (error) {
    console.error('Error reading highlights from localStorage', error);
    return {};
  }
};

export const HighlightProvider = ({ children }: { children: ReactNode }) => {
  const [highlights, setHighlights] = useState<Highlights>(getInitialHighlights);

  useEffect(() => {
    try {
      window.localStorage.setItem('quranHighlights', JSON.stringify(highlights));
    } catch (error) {
      console.error('Error saving highlights to localStorage', error);
    }
  }, [highlights]);

  const addHighlight = (surah: number, ayah: number, color: string) => {
    const key = `${surah}-${ayah}`;
    setHighlights(prev => ({ ...prev, [key]: color }));
  };

  const removeHighlight = (surah: number, ayah: number) => {
    const key = `${surah}-${ayah}`;
    setHighlights(prev => {
      const newHighlights = { ...prev };
      delete newHighlights[key];
      return newHighlights;
    });
  };

  const getHighlightColor = (surah: number, ayah: number) => {
    const key = `${surah}-${ayah}`;
    return highlights[key];
  };

  return (
    <HighlightContext.Provider value={{ highlights, addHighlight, removeHighlight, getHighlightColor }}>
      {children}
    </HighlightContext.Provider>
  );
};

export const useHighlight = () => {
  const context = useContext(HighlightContext);
  if (context === undefined) {
    throw new Error('useHighlight must be used within a HighlightProvider');
  }
  return context;
};