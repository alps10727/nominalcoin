
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
      <div className="flex flex-col min-h-screen bg-indigo-950 relative overflow-hidden">
        {/* Cosmic background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Deep space gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-950"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0tMjAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTQwIDIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00WiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
          
          {/* Nebula effects */}
          <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-purple-900/5 to-transparent"></div>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-indigo-900/5 to-transparent"></div>
          
          {/* Energy cores */}
          <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-indigo-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        {/* Starfield */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: Math.random() < 0.9 ? '1px' : '2px',
                height: Math.random() < 0.9 ? '1px' : '2px',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7,
                animationDuration: `${Math.random() * 5 + 2}s`,
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
