
import { Suspense, lazy, useEffect, useState, useMemo } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "../dashboard/LoadingScreen";
import { toast } from "sonner";
import { errorLog } from "@/utils/debugUtils";

// Lazy-loaded pages with reduced loading timeout
const Index = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Profile = lazy(() => import("@/pages/Profile"));
const History = lazy(() => import("@/pages/History"));
const Referral = lazy(() => import("@/pages/Referral"));
const Tasks = lazy(() => import("@/pages/Tasks"));
const MiningUpgrades = lazy(() => import("@/pages/MiningUpgrades"));
const Statistics = lazy(() => import("@/pages/Statistics"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));

// Global hata yakalayıcı
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      errorLog("ErrorBoundary", "Kritik hata yakalandı:", event.error);
      toast.error("Bir hata oluştu. Lütfen sayfayı yenileyin.");
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    if (hasError) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000); // Daha hızlı yenileme
      return () => clearTimeout(timer);
    }
  }, [hasError, navigate]);

  if (hasError) {
    return <LoadingScreen message="Bir hata oluştu, sayfa yeniden yükleniyor..." />;
  }

  return <>{children}</>;
};

// PrivateRoute - hızlandırıldı
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  const [waitingTooLong, setWaitingTooLong] = useState(false);
  
  // Sadece yükleme durumunda zamanlayıcıyı başlat - süre kısaltıldı
  useEffect(() => {
    if (!loading) return;
    
    const timer = setTimeout(() => {
      setWaitingTooLong(true);
    }, 800); // 1500ms'den 800ms'ye düşürüldü
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // Yükleme durumu değiştiğinde otomatik yönlendirme - süre kısaltıldı
  useEffect(() => {
    if (!loading || !waitingTooLong) return;
    
    const redirectTimer = setTimeout(() => {
      window.location.href = "/sign-in";
    }, 2000); // 4000ms'den 2000ms'ye düşürüldü
    
    return () => clearTimeout(redirectTimer);
  }, [loading, waitingTooLong]);
  
  if (loading) {
    return <LoadingScreen message={waitingTooLong ? "Kullanıcı bilgileri yüklenemiyor. Lütfen internet bağlantınızı kontrol edin..." : "Kullanıcı bilgileri yükleniyor..."} />;
  }
  
  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }
  
  return <>{children}</>;
};

// Yeni: Sayfa geçişlerini optimize etmek için kullanılan bileşen
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    // Sayfa geçişlerinde kısa bir yükleme göster
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Çok kısa bir yükleme süresi
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  if (isLoading) {
    return <LoadingScreen message="Sayfa hazırlanıyor..." />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  // Ana sayfaları önden yükleme - memoize edildi
  useEffect(() => {
    const prefetchPages = async () => {
      try {
        // Tüm sayfaları önceden yükle
        const importPromises = [
          import("@/pages/Index"),
          import("@/pages/Profile"),
          import("@/pages/History"),
          import("@/pages/Referral"),
          import("@/pages/Tasks"),
          import("@/pages/MiningUpgrades"),
          import("@/components/MobileNavigation")
        ];
        
        // Sayfaları paralel olarak yükle
        await Promise.all(importPromises);
        console.log("Sayfalar daha hızlı gezinme için önceden yüklendi");
      } catch (error) {
        errorLog("AppRoutes", "Sayfaları önceden yükleme başarısız oldu:", error);
      }
    };
    
    // Hızlı erişim için ilk yükleme
    prefetchPages();
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="Ana sayfa yükleniyor..." />}>
              <PageTransition>
                <Index />
              </PageTransition>
            </Suspense>
          </PrivateRoute>
        } />
        
        <Route path="/profile" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="Profil yükleniyor..." />}>
              <PageTransition>
                <Profile />
              </PageTransition>
            </Suspense>
          </PrivateRoute>
        } />
        <Route path="/history" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="Geçmiş yükleniyor..." />}>
              <PageTransition>
                <History />
              </PageTransition>
            </Suspense>
          </PrivateRoute>
        } />
        <Route path="/referral" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="Referans sistemi yükleniyor..." />}>
              <PageTransition>
                <Referral />
              </PageTransition>
            </Suspense>
          </PrivateRoute>
        } />
        <Route path="/tasks" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="Görevler yükleniyor..." />}>
              <PageTransition>
                <Tasks />
              </PageTransition>
            </Suspense>
          </PrivateRoute>
        } />
        <Route path="/mining/upgrades" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="Yükseltmeler yükleniyor..." />}>
              <PageTransition>
                <MiningUpgrades />
              </PageTransition>
            </Suspense>
          </PrivateRoute>
        } />
        <Route path="/statistics" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="İstatistikler yükleniyor..." />}>
              <PageTransition>
                <Statistics />
              </PageTransition>
            </Suspense>
          </PrivateRoute>
        } />
        <Route path="/sign-in" element={
          <Suspense fallback={<LoadingScreen message="Giriş sayfası yükleniyor..." />}>
            <PageTransition>
              <SignIn />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/sign-up" element={
          <Suspense fallback={<LoadingScreen message="Kayıt sayfası yükleniyor..." />}>
            <PageTransition>
              <SignUp />
            </PageTransition>
          </Suspense>
        } />
        <Route path="/forgot-password" element={
          <Suspense fallback={<LoadingScreen message="Şifre sıfırlama sayfası yükleniyor..." />}>
            <PageTransition>
              <ForgotPassword />
            </PageTransition>
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<LoadingScreen message="Sayfa yükleniyor..." />}>
            <PageTransition>
              <NotFound />
            </PageTransition>
          </Suspense>
        } />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;
