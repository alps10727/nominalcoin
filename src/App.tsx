
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { Suspense, lazy, useEffect, useState } from "react";
import LoadingScreen from "./components/dashboard/LoadingScreen";

// Sayfaları lazy loading ile yükle
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));
const History = lazy(() => import("./pages/History"));
const Referral = lazy(() => import("./pages/Referral"));
const Tasks = lazy(() => import("./pages/Tasks"));
const MiningUpgrades = lazy(() => import("./pages/MiningUpgrades"));
const Statistics = lazy(() => import("./pages/Statistics"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const MobileNavigation = lazy(() => import("./components/MobileNavigation"));

// QueryClient konfig - daha hızlı hata denemesi, daha az bekleme
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Sadece 1 kez dene
      retryDelay: 500, // Hızlı tekrar dene
      refetchOnWindowFocus: false,
      staleTime: 10000, // 10 saniye cache
      gcTime: 300000, // 5 dakika garbage collection
    }
  }
});

// Oturum kontrolü için wrapper component - daha hızlı zaman aşımı
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  const [waitingTooLong, setWaitingTooLong] = useState(false);
  
  // Eğer yükleme 3 saniyeden fazla sürerse, kullanıcıya farklı bir mesaj göster
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setWaitingTooLong(true);
      }, 3000); // 3 saniye timeout (daha hızlı)
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);
  
  // Otomatik yeniden yönlendirme - 8 saniyeden fazla beklerse
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    
    if (loading && waitingTooLong) {
      redirectTimer = setTimeout(() => {
        // 8 saniye beklediyse giriş sayfasına yönlendir
        window.location.href = "/sign-in";
      }, 5000); 
    }
    
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [loading, waitingTooLong]);
  
  if (loading) {
    return <LoadingScreen message={waitingTooLong ? "Kullanıcı bilgileri yüklenemiyor. Lütfen internet bağlantınızı kontrol edin..." : "Kullanıcı bilgileri yükleniyor..."} />;
  }
  
  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <PrivateRoute>
          <Index />
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      <Route path="/history" element={
        <PrivateRoute>
          <History />
        </PrivateRoute>
      } />
      <Route path="/referral" element={
        <PrivateRoute>
          <Referral />
        </PrivateRoute>
      } />
      <Route path="/tasks" element={
        <PrivateRoute>
          <Tasks />
        </PrivateRoute>
      } />
      <Route path="/mining/upgrades" element={
        <PrivateRoute>
          <MiningUpgrades />
        </PrivateRoute>
      } />
      <Route path="/statistics" element={
        <PrivateRoute>
          <Statistics />
        </PrivateRoute>
      } />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Offline durumunu izle
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // App başlatma iyileştirmesi - yükleme süresini ölç
    const startTime = performance.now();
    
    // Sayfa yüklenirken ekranın donmasını önlemek için kısa bir gecikme ekle
    const timer = setTimeout(() => {
      setReady(true);
    }, 100);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
      
      // Çıkışta yükleme süresini kaydet
      const loadTime = performance.now() - startTime;
      console.log(`Uygulama yükleme süresi: ${loadTime.toFixed(0)}ms`);
    };
  }, []);
  
  // Internet bağlantısı yoksa uygulamayı yükleme
  if (isOffline) {
    return <LoadingScreen forceOffline={true} message="İnternet bağlantısı bulunamadı" />;
  }
  
  if (!ready) {
    // Note: This initial loading screen is directly used without any context providers
    return <LoadingScreen message="Uygulama başlatılıyor..." />;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Suspense fallback={<LoadingScreen message="Sayfa yükleniyor..." />}>
                  <div className="flex flex-col min-h-screen pb-16"> {/* Alt navigasyon için boşluk */}
                    <AppRoutes />
                    <MobileNavigation />
                  </div>
                </Suspense>
              </TooltipProvider>
            </AuthProvider>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
