
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center group">
      <div className="p-2 rounded-full bg-gradient-to-r from-navy-800 to-darkPurple-800 mr-2 shadow-lg shadow-darkPurple-500/30 group-hover:shadow-darkPurple-500/50 transition-all duration-300">
        <Zap className="h-5 w-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-xl tracking-tight uppercase bg-gradient-to-r from-darkPurple-300 via-navy-300 to-indigo-300 bg-clip-text text-transparent">
          Nominal
        </span>
        <span className="text-xs text-darkPurple-400/80 -mt-1">Coin</span>
      </div>
    </Link>
  );
};
