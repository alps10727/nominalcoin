
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center text-teal-300 hover:text-teal-200 transition-colors">
      <div className="p-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-indigo-600 mr-2 shadow-lg shadow-cyan-500/20">
        <Zap className="h-5 w-5 text-white" />
      </div>
      <span className="font-bold text-lg tracking-tight uppercase bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
        Future
      </span>
    </Link>
  );
};
