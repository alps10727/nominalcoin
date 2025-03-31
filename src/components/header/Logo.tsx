
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center group">
      <div className="p-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 mr-2 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300">
        <Zap className="h-5 w-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-xl tracking-tight uppercase bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
          Future
        </span>
        <span className="text-xs text-emerald-400/80 -mt-1">Quantum Mining</span>
      </div>
    </Link>
  );
};
