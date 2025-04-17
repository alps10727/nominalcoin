
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import MobileNavigation from "@/components/MobileNavigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen relative overflow-hidden">
        {/* Enhanced space background with visible colors */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Base gradient with lighter colors */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-darkPurple-900 to-navy-900"></div>
          
          {/* Enhanced nebula overlay with better visibility */}
          <div className="absolute inset-0 fc-deep-nebula opacity-30"></div>
          
          {/* Constellation pattern with increased opacity */}
          <div className="absolute inset-0 bg-galaxy opacity-10"></div>
          
          {/* Enhanced starfield with more stars */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 250 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-star-twinkle"
                style={{
                  width: Math.random() < 0.85 ? '1px' : Math.random() < 0.97 ? '2px' : '3px',
                  height: Math.random() < 0.85 ? '1px' : Math.random() < 0.97 ? '2px' : '3px',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3, // Increased min opacity
                  animationDuration: `${Math.random() * 5 + 2}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
          
          {/* Enhanced glowing nebula formations with lighter colors */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-darkPurple-800/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-navy-800/20 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 right-1/4 w-1/4 h-1/4 bg-navy-800/15 rounded-full blur-2xl"></div>
          
          {/* Deep space dust clouds with increased opacity */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-0 left-0 w-full h-full bg-noise-pattern mix-blend-overlay"></div>
          </div>
        </div>
        
        <Toaster />
        <Sonner />
        
        <Header />
        
        <main className="flex-1 relative z-10">
          <Suspense fallback={<LoadingScreen message="Sayfa yükleniyor..." />}>
            {children}
          </Suspense>
        </main>
        
        <MobileNavigation />
      </div>
    </TooltipProvider>
  );
};

export default AppLayout;
