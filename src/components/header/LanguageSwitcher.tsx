
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
import { useState } from "react";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as any);
    setIsOpen(false);
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="p-2 rounded-full hover:bg-gray-800 transition-colors group relative overflow-hidden"
        >
          {/* Hover effect background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-800/90 to-indigo-800/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Active state indicator */}
          <div className={`absolute bottom-0.5 w-4 h-0.5 rounded-full bg-purple-400 left-1/2 -translate-x-1/2 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
          
          <Globe className="h-6 w-6 text-purple-300 relative z-10 transition-transform duration-300 group-hover:scale-110" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 text-gray-100 rounded-xl shadow-lg p-2 w-36"
      >
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("en")}
          className={`cursor-pointer rounded-lg mb-1 ${language === "en" ? "bg-purple-900/50 text-purple-200" : "hover:bg-gray-700/70"}`}
        >
          English {language === "en" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("tr")}
          className={`cursor-pointer rounded-lg mb-1 ${language === "tr" ? "bg-purple-900/50 text-purple-200" : "hover:bg-gray-700/70"}`}
        >
          Türkçe {language === "tr" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("zh")}
          className={`cursor-pointer rounded-lg mb-1 ${language === "zh" ? "bg-purple-900/50 text-purple-200" : "hover:bg-gray-700/70"}`}
        >
          中文 {language === "zh" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("es")}
          className={`cursor-pointer rounded-lg mb-1 ${language === "es" ? "bg-purple-900/50 text-purple-200" : "hover:bg-gray-700/70"}`}
        >
          Español {language === "es" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("ru")}
          className={`cursor-pointer rounded-lg mb-1 ${language === "ru" ? "bg-purple-900/50 text-purple-200" : "hover:bg-gray-700/70"}`}
        >
          Русский {language === "ru" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700 my-1" />
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("fr")}
          className={`cursor-pointer rounded-lg mb-1 ${language === "fr" ? "bg-purple-900/50 text-purple-200" : "hover:bg-gray-700/70"}`}
        >
          Français {language === "fr" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("de")}
          className={`cursor-pointer rounded-lg mb-1 ${language === "de" ? "bg-purple-900/50 text-purple-200" : "hover:bg-gray-700/70"}`}
        >
          Deutsch {language === "de" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("ar")}
          className={`cursor-pointer rounded-lg mb-1 ${language === "ar" ? "bg-purple-900/50 text-purple-200" : "hover:bg-gray-700/70"}`}
        >
          العربية {language === "ar" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("pt")}
          className={`cursor-pointer rounded-lg ${language === "pt" ? "bg-purple-900/50 text-purple-200" : "hover:bg-gray-700/70"}`}
        >
          Português {language === "pt" && "✓"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
