import { useQuery } from "@tanstack/react-query";

const AUDIO_LIST_URL = 'https://ndlvawhavwyvqergzvng.supabase.co/storage/v1/object/public/Links%20of%20Audios/Qari%20Mishary.txt';

const fetchAudioLinks = async (): Promise<string[]> => {
  const response = await fetch(AUDIO_LIST_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch Mishary audio links.');
  }
  const text = await response.text();
  return text.split('\n').filter(line => line.trim() !== '');
};

export const useMisharyAudio = () => {
  return useQuery<string[]>({
    queryKey: ['misharyAudioLinks'],
    queryFn: fetchAudioLinks,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};