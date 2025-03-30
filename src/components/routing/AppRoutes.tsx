
import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "../dashboard/LoadingScreen";

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

// PrivateRoute component for protected routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  const [waitingTooLong, setWaitingTooLong] = useState(false);
  
  // Show loading message sooner for better user experience
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setWaitingTooLong(true);
      }, 1500);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);
  
  // Auto-redirection timer
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    
    if (loading && waitingTooLong) {
      redirectTimer = setTimeout(() => {
        window.location.href = "/sign-in";
      }, 4000);
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
  // Prefetch main pages for faster navigation
  useEffect(() => {
    const prefetchPages = async () => {
      const importPromises = [
        import("@/pages/Index"),
        import("@/pages/Profile"),
        import("@/components/MobileNavigation")
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
