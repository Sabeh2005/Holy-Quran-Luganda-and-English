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
          <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shrink-0">
            {surah.number}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">{surah.englishName}</p>
              <p className="font-arabic text-2xl text-primary">{surah.name}</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm flex-wrap">
              <span>{surah.englishNameTranslation}</span>
              <Badge variant="outline" className="capitalize">{surah.revelationType}</Badge>
              <span>{surah.numberOfAyahs} verses</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SurahListItemGrid;