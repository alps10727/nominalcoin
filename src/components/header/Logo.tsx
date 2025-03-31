
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center group">
      <div className="p-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 mr-2 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
        <Zap className="h-5 w-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-xl tracking-tight uppercase bg-gradient-to-r from-purple-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
          Future
        </span>
        <span className="text-xs text-purple-400/80 -mt-1">Quantum Mining</span>
      </div>
    </Link>
  );
};
