import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SurahInfo } from "@/types";

interface SurahListItemGridProps {
  surah: SurahInfo;
}

const SurahListItemGrid = ({ surah }: SurahListItemGridProps) => {
  return (
    <Link to={`/surah/${surah.number}`}>
      <Card className="h-full hover:border-primary transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shrink-0">
            {surah.number}
          </div>
          <div className="flex-grow grid grid-cols-2 items-center gap-x-2">
            {/* Row 1 */}
            <div>
              <h3 className="font-bold text-lg">{surah.englishName}</h3>
              {surah.lugandaName && <p className="text-sm text-muted-foreground">{surah.lugandaName}</p>}
            </div>
            <p className="font-arabic text-2xl text-primary justify-self-end">{surah.name}</p>
            
            {/* Row 2 */}
            <div className="flex items-center gap-2 text-muted-foreground text-sm flex-wrap">
              <span>{surah.englishNameTranslation}</span>
              <Badge variant="outline" className="capitalize">{surah.revelationType}</Badge>
            </div>
            <p className="text-muted-foreground text-sm justify-self-end">{surah.numberOfAyahs} verses</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SurahListItemGrid;