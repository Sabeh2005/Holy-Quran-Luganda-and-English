import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Bookmark, Copy, Share2 } from "lucide-react";
import { Ayah } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type LugandaTranslationData = Record<number, Record<number, string>> | undefined;

interface AyahListItemProps {
  ayah: Ayah;
  surahNumber: number;
  displayVerseNumber: number;
  isPlaying: boolean;
  onPlay: () => void;
  lugandaTranslation: LugandaTranslationData;
  isBismillah?: boolean;
}

const AyahListItem = ({ ayah, surahNumber, displayVerseNumber, isPlaying, onPlay, lugandaTranslation, isBismillah = false }: AyahListItemProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    const lugandaText = !isBismillah 
      ? (lugandaTranslation?.[surahNumber]?.[ayah.numberInSurah] || "[Luganda translation not available]") 
      : "";
      
    const textToCopy = `${ayah.text}\n\n${ayah.englishText}${lugandaText ? `\n\n${lugandaText}` : ''}\n\n- Surah ${surahNumber}, Verse ${displayVerseNumber}`;
    
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard!",
      description: `Verse ${displayVerseNumber} has been copied.`,
    });
  };

  const renderLugandaContent = () => {
    if (isBismillah) {
      return <p className="text-muted-foreground italic">[This is an invocation, not part of the numbered verses of the Surah text itself.]</p>;
    }

    if (lugandaTranslation === undefined) {
      return <Skeleton className="h-6 w-full" />;
    }
    
    const translation = lugandaTranslation?.[surahNumber]?.[ayah.numberInSurah];
    
    if (translation) {
      return <p className="text-muted-foreground">{translation}</p>;
    }
    
    return <p className="text-muted-foreground italic">[Luganda translation not available for this verse]</p>;
  };

  return (
    <Card className="bg-muted/30 border-0">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center text-sm text-primary">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs">
              {displayVerseNumber}
            </div>
            <span>Surah {surahNumber}, Verse {displayVerseNumber}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button onClick={onPlay} variant="ghost" size="icon">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <p className="text-3xl font-arabic text-right leading-loose">{ayah.text}</p>
        
        <Tabs defaultValue="luganda" className="w-full">
          <TabsList>
            <TabsTrigger value="luganda">Luganda</TabsTrigger>
            <TabsTrigger value="english">English</TabsTrigger>
          </TabsList>
          <TabsContent value="luganda" className="p-4 bg-background rounded-md mt-2">
            {renderLugandaContent()}
          </TabsContent>
          <TabsContent value="english" className="p-4 bg-background rounded-md mt-2">
            <p className="text-muted-foreground">{ayah.englishText}</p>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end items-center gap-2 pt-2 border-t">
           <Button variant="ghost" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AyahListItem;