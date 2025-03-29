
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import History from "./pages/History";
import Referral from "./pages/Referral";
import Tasks from "./pages/Tasks";
import MiningUpgrades from "./pages/MiningUpgrades";
import Statistics from "./pages/Statistics";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MobileNavigation from "./components/MobileNavigation";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Mobil durum çubuğunu yönetmek için
  useEffect(() => {
    // iOS veya Android için durum çubuğu rengini ayarlıyoruz
    document.documentElement.style.setProperty('--sat', '0');
    
    // iOS'ta tam ekran modu için
    if (window.navigator && 
        window.navigator.userAgent && 
        window.navigator.userAgent.indexOf('CriOS') > -1) {
      // Chrome iOS için durum çubuğu ayarları
      document.body.classList.add('ios-chrome');
    }
    
    // iOS için güvenli alan ayarları
    const setIOSHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    window.addEventListener('resize', setIOSHeight);
    setIOSHeight();
    
    return () => {
      window.removeEventListener('resize', setIOSHeight);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="flex flex-col min-h-screen pb-16"> {/* Alt navigasyon için boşluk */}
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/referral" element={<Referral />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/mining/upgrades" element={<MiningUpgrades />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <MobileNavigation />
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
