
import { Coins } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-1">
      <div className="flex items-center justify-center relative">
        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-sm"></div>
        <Coins className="h-6 w-6 text-purple-300" />
      </div>
    </Link>
  );
};
