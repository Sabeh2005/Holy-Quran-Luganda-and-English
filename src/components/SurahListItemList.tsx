import { Link } from "react-router-dom";
import { SurahInfo } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface SurahListItemListProps {
  surah: SurahInfo;
}

const SurahListItemList = ({ surah }: SurahListItemListProps) => {
  return (
    <Link to={`/surah/${surah.number}`}>
      <Card className="hover:border-primary transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shrink-0">
            {surah.number}
          </div>
          <div className="flex-grow">
            <h3 className="font-bold text-lg">{surah.englishName}</h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm flex-wrap">
              <span>{surah.englishNameTranslation}</span>
              <Badge variant="outline" className="capitalize">{surah.revelationType}</Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="font-arabic text-2xl text-primary">{surah.name}</p>
            <p className="text-muted-foreground text-sm">{surah.numberOfAyahs} verses</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SurahListItemList;