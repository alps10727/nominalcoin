
import { Link, useLocation } from "react-router-dom";
import { Home, Award, ChevronUp, Settings, BarChart2, Users, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNavigation() {
  const location = useLocation();
  const path = location.pathname;

  // Navigation items with icons and paths
  const navItems = [
    { name: "Home", icon: <Home size={22} />, path: "/" },
    { name: "Upgrades", icon: <ChevronUp size={22} />, path: "/upgrades" },
    { name: "Chat", icon: <MessageCircle size={22} />, path: "/chat" },
    { name: "Referral", icon: <Users size={22} />, path: "/referral" },
    { name: "Profile", icon: <Settings size={22} />, path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-md border-t z-50 sm:hidden">
      <div className="grid grid-cols-5 h-full">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-colors",
              path === item.path
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <div>{item.icon}</div>
            <span className="text-[10px]">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
