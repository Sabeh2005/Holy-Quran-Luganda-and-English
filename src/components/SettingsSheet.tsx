import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "./ui/button";

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsSheet = ({ open, onOpenChange }: SettingsSheetProps) => {
  const {
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize,
    themeColor,
    setThemeColor,
    voiceLanguage,
    setVoiceLanguage
  } = useSettings();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your Quran reading experience.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid gap-3">
            <Label htmlFor="arabic-font-size">Arabic Font Size: {arabicFontSize}px</Label>
            <Slider
              id="arabic-font-size"
              min={20}
              max={60}
              step={1}
              value={[arabicFontSize]}
              onValueChange={(value) => setArabicFontSize(value[0])}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="translation-font-size">Translation Font Size: {translationFontSize}px</Label>
            <Slider
              id="translation-font-size"
              min={12}
              max={24}
              step={1}
              value={[translationFontSize]}
              onValueChange={(value) => setTranslationFontSize(value[0])}
            />
          </div>
          <div className="grid gap-3">
            <Label>Theme Color</Label>
            <div className="flex gap-2 flex-wrap">
              <Button variant={themeColor === 'green' ? 'default' : 'outline'} onClick={() => setThemeColor('green')}>Green</Button>
              <Button variant={themeColor === 'blue' ? 'default' : 'outline'} onClick={() => setThemeColor('blue')}>Blue</Button>
              <Button variant={themeColor === 'purple' ? 'default' : 'outline'} onClick={() => setThemeColor('purple')}>Purple</Button>
              <Button variant={themeColor === 'gold' ? 'default' : 'outline'} onClick={() => setThemeColor('gold')}>Gold</Button>
              <Button variant={themeColor === 'rose' ? 'default' : 'outline'} onClick={() => setThemeColor('rose')}>Rose</Button>
              <Button variant={themeColor === 'orange' ? 'default' : 'outline'} onClick={() => setThemeColor('orange')}>Orange</Button>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="voice-language">Voice Search Language</Label>
            <Select value={voiceLanguage} onValueChange={(value) => setVoiceLanguage(value as any)}>
              <SelectTrigger id="voice-language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English</SelectItem>
                <SelectItem value="ar-SA">Arabic (العربية)</SelectItem>
                <SelectItem value="lg-UG">Luganda</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Note: Voice recognition for Luganda may not be supported by your browser.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};