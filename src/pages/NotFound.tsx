
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="text-center relative">
        {/* Background elements */}
        <div className="absolute -z-10 inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-8xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">404</h1>
          <p className="text-xl text-indigo-200 mb-8">Sayfa bulunamadı</p>
          
          <div className="relative inline-block group">
            {/* Button background glow effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            
            <Button 
              variant="cosmic"
              className="relative z-10 py-2.5 px-6 text-base"
              onClick={() => window.location.href = '/'}
            >
              Ana Sayfaya Dön
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
