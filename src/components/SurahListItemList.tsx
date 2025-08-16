import { Link } from "react-router-dom";
import { SurahInfo } from "@/types";
import { Badge } from "@/components/ui/badge";

interface SurahListItemListProps {
  surah: SurahInfo;
}

const SurahListItemList = ({ surah }: SurahListItemListProps) => {
  return (
    <Link to={`/surah/${surah.number}`}>
      <div className="p-4 flex items-center gap-4 rounded-lg hover:bg-muted transition-colors border">
        <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shrink-0">
          {surah.number}
        </div>
        <div className="flex-grow">
          <p className="font-bold text-lg">{surah.englishName}</p>
          <p className="text-muted-foreground text-sm">{surah.englishNameTranslation}</p>
        </div>
        <div className="text-right">
          <p className="font-arabic text-2xl text-primary">{surah.name}</p>
          <div className="flex items-center justify-end gap-2 text-muted-foreground text-sm mt-1">
            <Badge variant="outline" className="capitalize">{surah.revelationType}</Badge>
            <span>{surah.numberOfAyahs} verses</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SurahListItemList;