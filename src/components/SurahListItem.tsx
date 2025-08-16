import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { Surah } from "@/data/surahs";

interface SurahListItemProps {
  surah: Surah;
  isPlaying: boolean;
  onPlay: () => void;
}

const SurahListItem = ({ surah, isPlaying, onPlay }: SurahListItemProps) => {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold">
            {surah.id}
          </div>
          <div>
            <p className="font-semibold">{surah.englishName}</p>
            <p className="text-sm text-muted-foreground">{surah.name}</p>
          </div>
        </div>
        <Button onClick={onPlay} variant="ghost" size="icon">
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SurahListItem;