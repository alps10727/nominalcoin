
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export const NotificationsDropdown = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <Bell className="h-6 w-6 text-indigo-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-gray-100">
        <div className="py-2 px-4 text-center text-sm text-gray-400">
          Bildirim bulunmuyor
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
