import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SurahInfo } from "@/types";

interface SurahListItemProps {
  surah: SurahInfo;
}

const SurahListItem = ({ surah }: SurahListItemProps) => {
  return (
    <Link to={`/surah/${surah.number}`}>
      <Card className="h-full hover:border-primary transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shrink-0">
            {surah.number}
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg">{surah.englishName}</p>
              <p className="font-arabic text-2xl text-primary">{surah.name}</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
              <span>{surah.englishNameTranslation}</span>
              <span className="text-xs">•</span>
              <span>{surah.numberOfAyahs} verses</span>
            </div>
          </div>
          <Badge variant="outline" className="capitalize self-start mt-1">{surah.revelationType}</Badge>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SurahListItem;