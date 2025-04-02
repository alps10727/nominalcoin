
import { Coins } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-1 relative group">
      <div className="flex items-center justify-center relative">
        {/* Glowing background */}
        <div className="absolute inset-0 bg-gradient-to-r from-darkPurple-700/40 to-navy-700/40 rounded-full blur-md 
                       group-hover:from-darkPurple-600/60 group-hover:to-navy-600/60 transition-all duration-300"></div>
        
        {/* Icon */}
        <div className="relative z-10 bg-gradient-to-br from-darkPurple-950 to-navy-900 p-2 rounded-full border border-darkPurple-700/40 
                      group-hover:border-darkPurple-600/60 transition-all duration-300">
          <Coins className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
        </div>
        
        {/* Orbital particle */}
        <div className="absolute h-1.5 w-1.5 rounded-full bg-purple-500/70 opacity-0 group-hover:opacity-100 
                       transition-opacity duration-300 animate-circular-rotate" 
             style={{ animationDuration: '3s' }}></div>
      </div>
      
      {/* Text with animated gradient on hover */}
      <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-navy-400
                     group-hover:from-purple-300 group-hover:to-navy-300 transition-all duration-300">FC</span>
    </Link>
  );
};
