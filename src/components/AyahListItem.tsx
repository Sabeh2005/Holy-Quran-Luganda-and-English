import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Bookmark, Copy, Share2, Sparkles } from "lucide-react";
import { Ayah } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/context/SettingsContext";
import { useHighlight } from "@/context/HighlightContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HighlightPopover } from "./HighlightPopover";

type LugandaTranslationData = Record<number, Record<number, string>> | undefined;

interface AyahListItemProps {
  ayah: Ayah;
  surahNumber: number;
  displayVerseNumber: number;
  isPlaying: boolean;
  onPlay: () => void;
  lugandaTranslation: LugandaTranslationData;
}

const AyahListItem = ({ ayah, surahNumber, displayVerseNumber, isPlaying, onPlay, lugandaTranslation }: AyahListItemProps) => {
  const { toast } = useToast();
  const { arabicFontSize, translationFontSize, arabicFontColor, translationFontColor } = useSettings();
  const { getHighlightColor, addHighlight, removeHighlight } = useHighlight();

  const highlightColor = getHighlightColor(surahNumber, displayVerseNumber);

  // Special handling for Bismillah which is always verse 1 (except for Surah 1 and 9)
  const isBismillah = displayVerseNumber === 1 && surahNumber !== 1 && surahNumber !== 9;
  const bismillahLuganda = "Ku Iw’erinnya lya Allah, Omusaasizi ennyo,Ow’ekisa ekingi.";
  const lugandaText = isBismillah ? bismillahLuganda : lugandaTranslation?.[surahNumber]?.[displayVerseNumber];

  const handleCopy = () => {
    const textToCopy = `${ayah.text}\n\n${ayah.englishText}\n\n${lugandaText || "[Luganda translation not available]"}\n\n- Surah ${surahNumber}, Verse ${displayVerseNumber}`;
    
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard!",
      description: `Verse ${displayVerseNumber} has been copied.`,
    });
  };

  const renderLugandaContent = () => {
    if (lugandaTranslation === undefined && !isBismillah) {
      return <Skeleton className="h-6 w-full" />;
    }
    
    if (lugandaText) {
      return <p className="text-muted-foreground" style={{ fontSize: `${translationFontSize}px`, color: translationFontColor || undefined }}>{lugandaText}</p>;
    }
    
    return <p className="text-muted-foreground italic" style={{ fontSize: `${translationFontSize}px`, color: translationFontColor || undefined }}>Luganda translation for this Surah is not yet available.</p>;
  };

  return (
    <Card 
      className="bg-muted/30 border-0 transition-colors"
      style={{ backgroundColor: highlightColor }}
    >
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sparkles className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <HighlightPopover 
                  onColorSelect={(color) => addHighlight(surahNumber, displayVerseNumber, color)}
                  onRemove={() => removeHighlight(surahNumber, displayVerseNumber)}
                  currentColor={highlightColor}
                />
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon">
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <p className="font-arabic text-right leading-loose" style={{ fontSize: `${arabicFontSize}px`, lineHeight: 1.8, color: arabicFontColor || undefined }}>{ayah.text}</p>
        
        <Tabs defaultValue="luganda" className="w-full">
          <TabsList>
            <TabsTrigger value="luganda">Luganda</TabsTrigger>
            <TabsTrigger value="english">English</TabsTrigger>
          </TabsList>
          <TabsContent value="luganda" className="p-4 bg-background rounded-md mt-2">
            {renderLugandaContent()}
          </TabsContent>
          <TabsContent value="english" className="p-4 bg-background rounded-md mt-2">
            <p className="text-muted-foreground" style={{ fontSize: `${translationFontSize}px`, color: translationFontColor || undefined }}>{ayah.englishText}</p>
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