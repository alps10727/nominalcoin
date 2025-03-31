
import { Suspense, lazy, useEffect, useState, useMemo } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "../dashboard/LoadingScreen";
import { toast } from "sonner";
import { errorLog } from "@/utils/debugUtils";

// Lazy-loaded pages
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
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasError, navigate]);

  if (hasError) {
    return <LoadingScreen message="Bir hata oluştu. Sayfa yeniden yükleniyor..." />;
  }

  return <>{children}</>;
};

// PrivateRoute component - optimize edildi
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  const [waitingTooLong, setWaitingTooLong] = useState(false);
  
  // Sadece yükleme durumunda zamanlayıcıyı başlat
  useEffect(() => {
    if (!loading) return;
    
    const timer = setTimeout(() => {
      setWaitingTooLong(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // Yükleme durumu değiştiğinde otomatik yönlendirme
  useEffect(() => {
    if (!loading || !waitingTooLong) return;
    
    const redirectTimer = setTimeout(() => {
      window.location.href = "/sign-in";
    }, 4000);
    
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

const AppRoutes = () => {
  // Ana sayfaları önden yükleme - memoize edildi
  useEffect(() => {
    const prefetchPages = async () => {
      try {
        await Promise.all([
          import("@/pages/Index"),
          import("@/pages/Profile"),
          import("@/components/MobileNavigation")
        ]);
        console.log("Ana sayfalar daha hızlı gezinme için önceden yüklendi");
      } catch (error) {
        errorLog("AppRoutes", "Sayfaları önceden yükleme başarısız oldu:", error);
      }
    };
    
    // Sadece bir kez çalıştır
    prefetchPages();
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="Ana sayfa yükleniyor..." />}>
              <Index />
            </Suspense>
          </PrivateRoute>
        } />
        
        {/* Diğer rotaları koruyoruz */}
        <Route path="/profile" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="Profil yükleniyor..." />}>
              <Profile />
            </Suspense>
          </PrivateRoute>
        } />
        <Route path="/history" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="Geçmiş yükleniyor..." />}>
              <History />
            </Suspense>
          </PrivateRoute>
        } />
        <Route path="/referral" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="Referans sistemi yükleniyor..." />}>
              <Referral />
            </Suspense>
          </PrivateRoute>
        } />
        <Route path="/tasks" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="Görevler yükleniyor..." />}>
              <Tasks />
            </Suspense>
          </PrivateRoute>
        } />
        <Route path="/mining/upgrades" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="Yükseltmeler yükleniyor..." />}>
              <MiningUpgrades />
            </Suspense>
          </PrivateRoute>
        } />
        <Route path="/statistics" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="İstatistikler yükleniyor..." />}>
              <Statistics />
            </Suspense>
          </PrivateRoute>
        } />
        <Route path="/sign-in" element={
          <Suspense fallback={<LoadingScreen message="Giriş sayfası yükleniyor..." />}>
            <SignIn />
          </Suspense>
        } />
        <Route path="/sign-up" element={
          <Suspense fallback={<LoadingScreen message="Kayıt sayfası yükleniyor..." />}>
            <SignUp />
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<LoadingScreen message="Sayfa yükleniyor..." />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;
