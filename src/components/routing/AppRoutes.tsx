
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingScreen from "../dashboard/LoadingScreen";
import ErrorBoundary from "./ErrorBoundary";
import PrivateRoute from "./PrivateRoute";
import PageTransition from "./PageTransition";
import { usePagePreloading } from "@/hooks/routing/usePagePreloading";

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

const AppRoutes = () => {
  // Sayfaları önceden yükle
  usePagePreloading();

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
