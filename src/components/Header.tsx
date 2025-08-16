import { Search, Bookmark, Moon, Sun } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/" className="flex items-center space-x-2">
            <div>
              <h1 className="font-bold">Al-Quran</h1>
              <p className="text-xs text-muted-foreground">Ahmadiyya - Uganda</p>
            </div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search verses, surahs..." className="pl-8" />
            </div>
          </div>
          <nav className="flex items-center">
            <Button variant="ghost" size="icon">
              <Bookmark className="h-5 w-5" />
              <span className="sr-only">Bookmarks</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;