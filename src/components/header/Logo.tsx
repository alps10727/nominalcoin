
import { Coins } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-1 relative group">
      <div className="flex items-center justify-center relative">
        {/* Glowing background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 rounded-full blur-md 
                       group-hover:from-purple-500/50 group-hover:to-indigo-500/50 transition-all duration-300"></div>
        
        {/* Icon */}
        <div className="relative z-10 bg-gradient-to-br from-purple-900/80 to-darkPurple-800 p-2 rounded-full border border-purple-500/30 
                      group-hover:border-purple-400/60 transition-all duration-300">
          <Coins className="h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
        </div>
        
        {/* Orbital particle */}
        <div className="absolute h-1.5 w-1.5 rounded-full bg-purple-400/70 opacity-0 group-hover:opacity-100 
                       transition-opacity duration-300 animate-circular-rotate" 
             style={{ animationDuration: '3s' }}></div>
      </div>
      
      {/* Text with animated gradient on hover */}
      <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300
                     group-hover:from-purple-200 group-hover:to-indigo-200 transition-all duration-300">FC</span>
    </Link>
  );
};
