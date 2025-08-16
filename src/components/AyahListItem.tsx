import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { Ayah } from "@/types";
import { Badge } from "./ui/badge";

interface AyahListItemProps {
  ayah: Ayah;
  isPlaying: boolean;
  onPlay: () => void;
}

const AyahListItem = ({ ayah, isPlaying, onPlay }: AyahListItemProps) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <Badge variant="secondary">Verse {ayah.numberInSurah}</Badge>
          <Button onClick={onPlay} variant="ghost" size="icon">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </div>
        <p className="text-2xl font-arabic text-right leading-loose">{ayah.text}</p>
        <div>
          <p className="font-semibold">English Translation:</p>
          <p className="text-muted-foreground">{ayah.englishText}</p>
        </div>
        <div>
          <p className="font-semibold">Luganda Translation:</p>
          <p className="text-muted-foreground italic">[Luganda translation not yet available]</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AyahListItem;