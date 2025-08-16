import SurahList from "@/components/SurahList";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <main>
        <SurahList />
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;