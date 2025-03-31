
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
        {/* Cosmic background with enhanced visual elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Deep space gradient base */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-darkPurple-950 to-navy-950"></div>
          
          {/* Enhanced grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0tMjAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTQwIDIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00WiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
          
          {/* Enhanced nebula effects with more vibrant colors */}
          <div className="absolute top-0 w-full h-2/3 bg-gradient-to-b from-cyan-900/5 via-purple-900/5 to-transparent"></div>
          <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-cyan-900/5 via-purple-900/5 to-transparent"></div>
          
          {/* Enhanced energy cores with glow effect */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-1/3 h-1/3 bg-teal-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2.5s'}}></div>
        </div>
        
        {/* Enhanced starfield with more stars and varied sizes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-star-twinkle"
              style={{
                width: Math.random() < 0.8 ? '1px' : Math.random() < 0.95 ? '2px' : '3px',
                height: Math.random() < 0.8 ? '1px' : Math.random() < 0.95 ? '2px' : '3px',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8,
                animationDuration: `${Math.random() * 5 + 2}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
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
