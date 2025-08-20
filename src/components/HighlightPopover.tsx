import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface HighlightPopoverProps {
  onColorSelect: (color: string) => void;
  onRemove: () => void;
  currentColor?: string;
}

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "rgba(255, 215, 0, 0.3)" },
  { name: "Green", value: "rgba(144, 238, 144, 0.4)" },
  { name: "Blue", value: "rgba(173, 216, 230, 0.5)" },
  { name: "Pink", value: "rgba(255, 182, 193, 0.4)" },
];

export const HighlightPopover = ({ onColorSelect, onRemove, currentColor }: HighlightPopoverProps) => {
  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        {HIGHLIGHT_COLORS.map(color => (
          <button
            key={color.name}
            onClick={() => onColorSelect(color.value)}
            className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 ${currentColor === color.value ? 'border-primary' : 'border-transparent'}`}
            style={{ backgroundColor: color.value.replace(/, \d\.\d\)/, ', 1)') }}
            aria-label={`Highlight ${color.name}`}
          />
        ))}
        <Button variant="ghost" size="icon" onClick={onRemove} aria-label="Remove highlight">
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};