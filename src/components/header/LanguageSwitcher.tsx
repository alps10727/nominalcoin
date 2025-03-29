
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <Globe className="h-6 w-6 text-indigo-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-gray-100">
        <DropdownMenuItem 
          onClick={() => setLanguage("en")}
          className={`cursor-pointer ${language === "en" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
        >
          English {language === "en" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("tr")}
          className={`cursor-pointer ${language === "tr" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
        >
          Türkçe {language === "tr" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("zh")}
          className={`cursor-pointer ${language === "zh" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
        >
          中文 {language === "zh" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("es")}
          className={`cursor-pointer ${language === "es" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
        >
          Español {language === "es" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("ru")}
          className={`cursor-pointer ${language === "ru" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
        >
          Русский {language === "ru" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          onClick={() => setLanguage("fr")}
          className={`cursor-pointer ${language === "fr" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
        >
          Français {language === "fr" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("de")}
          className={`cursor-pointer ${language === "de" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
        >
          Deutsch {language === "de" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("ar")}
          className={`cursor-pointer ${language === "ar" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
        >
          العربية {language === "ar" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("pt")}
          className={`cursor-pointer ${language === "pt" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
        >
          Português {language === "pt" && "✓"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
