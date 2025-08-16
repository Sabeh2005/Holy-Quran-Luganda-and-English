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
        <CardContent className="p-4 flex flex-col justify-between h-full min-h-[150px]">
          <div>
            <div className="flex justify-between items-center">
              <p className="font-bold text-xl">{surah.englishName}</p>
              <p className="font-arabic text-3xl text-primary">{surah.name}</p>
            </div>
            <p className="text-muted-foreground mt-1">{surah.englishNameTranslation}</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shrink-0">
              {surah.number}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
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