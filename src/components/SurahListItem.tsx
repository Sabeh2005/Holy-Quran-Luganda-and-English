import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { SurahInfo } from "@/types";

interface SurahListItemProps {
  surah: SurahInfo;
}

const SurahListItem = ({ surah }: SurahListItemProps) => {
  return (
    <Link to={`/surah/${surah.number}`} className="block hover:bg-accent rounded-lg">
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold">
              {surah.number}
            </div>
            <div>
              <p className="font-semibold">{surah.englishName}</p>
              <p className="text-sm text-muted-foreground">{surah.englishNameTranslation}</p>
            </div>
          </div>
          <p className="font-arabic text-lg">{surah.name}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SurahListItem;