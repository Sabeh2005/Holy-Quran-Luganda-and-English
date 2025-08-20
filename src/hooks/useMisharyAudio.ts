import { useQuery } from "@tanstack/react-query";

const AUDIO_LIST_URL = 'https://ndlvawhavwyvqergzvng.supabase.co/storage/v1/object/public/Links%20of%20Audios/Qari%20Mishary.txt';

const fetchAudioLinks = async (): Promise<string[]> => {
  const response = await fetch(AUDIO_LIST_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch Mishary audio links.');
  }
  const text = await response.text();
  if (!text) {
    throw new Error('Mishary audio links file is empty.');
  }
  const links = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (links.length === 0) {
    throw new Error('No links found in Mishary audio file after parsing.');
  }
  return links;
};

export const useMisharyAudio = () => {
  return useQuery<string[]>({
    queryKey: ['misharyAudioLinks'],
    queryFn: fetchAudioLinks,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};