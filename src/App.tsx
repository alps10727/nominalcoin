
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

// Optimize lazy loading with preload hints
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

// Pre-import the MobileNavigation to reduce loading time
const MobileNavigation = lazy(() => import("./components/MobileNavigation"));

// Optimized QueryClient config for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 300, // Faster retry
      refetchOnWindowFocus: false,
      staleTime: 20000, // Increased cache time to 20 seconds
      gcTime: 300000,
    }
  }
});

// More efficient PrivateRoute component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  const [waitingTooLong, setWaitingTooLong] = useState(false);
  
  // Show loading message sooner for better user experience
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setWaitingTooLong(true);
      }, 1500); // Reduced from 3000ms to 1500ms for faster feedback
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);
  
  // Faster auto-redirection
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    
    if (loading && waitingTooLong) {
      redirectTimer = setTimeout(() => {
        window.location.href = "/sign-in";
      }, 4000); // Reduced from 5000ms to 4000ms
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

// Main AppRoutes component with optimized routes
const AppRoutes = () => {
  // Prefetch main pages for faster navigation
  useEffect(() => {
    const prefetchPages = async () => {
      // Prefetch main pages to improve navigation speed
      const importPromises = [
        import("./pages/Index"),
        import("./pages/Profile"),
        import("./components/MobileNavigation")
      ];
      
      try {
        await Promise.all(importPromises);
        console.log("Prefetched main pages for faster navigation");
      } catch (error) {
        console.error("Failed to prefetch pages:", error);
      }
    };
    
    prefetchPages();
  }, []);

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

// Optimized App component
const App = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Faster app initialization
    const startTime = performance.now();
    
    // Reduced delay before showing UI
    const timer = setTimeout(() => {
      setReady(true);
    }, 50); // Reduced from 100ms to 50ms
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
      
      // Log performance metrics
      const loadTime = performance.now() - startTime;
      console.log(`Uygulama yükleme süresi: ${loadTime.toFixed(0)}ms`);
    };
  }, []);
  
  if (isOffline) {
    return <LoadingScreen forceOffline={true} message="İnternet bağlantısı bulunamadı" />;
  }
  
  if (!ready) {
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
                  <div className="flex flex-col min-h-screen pb-16">
                    <AppRoutes />
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
