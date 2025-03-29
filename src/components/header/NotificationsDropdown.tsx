
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export const NotificationsDropdown = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-gray-800 transition-colors relative">
          <Bell className="h-6 w-6 text-indigo-300" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-gray-100">
        <DropdownMenuItem className="cursor-pointer">
          <div className="flex flex-col">
            <span className="font-medium">{t('mining.successful')}</span>
            <span className="text-xs text-gray-400">{t('mining.successfulDesc', "0.1")}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="cursor-pointer">
          <div className="flex flex-col">
            <span className="font-medium">{t('mining.started')}</span>
            <span className="text-xs text-gray-400">{t('mining.startedDesc')}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
