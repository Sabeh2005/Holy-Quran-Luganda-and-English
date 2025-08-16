import { Link } from "react-router-dom";
import { SurahInfo } from "@/types";

interface SurahListItemListProps {
  surah: SurahInfo;
}

const SurahListItemList = ({ surah }: SurahListItemListProps) => {
  return (
    <Link to={`/surah/${surah.number}`}>
      <div className="p-4 flex items-center gap-4 rounded-lg hover:bg-muted transition-colors border">
        <div className="text-primary font-bold text-lg w-8 text-center shrink-0">
          {surah.number}
        </div>
        <div className="flex-grow">
          <p className="font-bold text-lg">{surah.englishName}</p>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
            <span>{surah.englishNameTranslation}</span>
          </div>
        </div>
        <div className="text-right">
            <p className="font-arabic text-2xl text-primary">{surah.name}</p>
            <p className="text-muted-foreground text-sm">{surah.numberOfAyahs} verses</p>
        </div>
      </div>
    </Link>
  );
};

export default SurahListItemList;