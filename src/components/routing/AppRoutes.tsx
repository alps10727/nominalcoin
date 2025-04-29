
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingScreen from "../dashboard/LoadingScreen";
import ErrorBoundary from "./ErrorBoundary";
import PrivateRoute from "./PrivateRoute";
import PageTransition from "./PageTransition";
import { usePagePreloading } from "@/hooks/routing/usePagePreloading";
import SignIn from "@/pages/SignIn";
import Index from "@/pages/Index";
import SignUp from "@/pages/SignUp";
import Upgrades from "@/pages/Upgrades"; // Direct import to avoid lazy-loading issues

const NotFound = lazy(() => import("@/pages/NotFound"));
const Profile = lazy(() => import("@/pages/Profile"));
const History = lazy(() => import("@/pages/History"));
const Tasks = lazy(() => import("@/pages/Tasks"));
const MiningUpgrades = lazy(() => import("@/pages/MiningUpgrades"));
const Statistics = lazy(() => import("@/pages/Statistics"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const Referral = lazy(() => import("@/pages/Referral"));
const Notifications = lazy(() => import("@/pages/Notifications"));

const AppRoutes = () => {
  usePagePreloading();

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <PageTransition>
              <Index />
            </PageTransition>
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
        
        <Route path="/referral" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="Referans sayfası yükleniyor..." />}>
              <PageTransition>
                <Referral />
              </PageTransition>
            </Suspense>
          </PrivateRoute>
        } />
        
        <Route path="/upgrades" element={
          <PrivateRoute>
            {/* Doğrudan içe aktarma, lazy loading olmadan */}
            <PageTransition>
              <Upgrades />
            </PageTransition>
          </PrivateRoute>
        } />
        
        <Route path="/notifications" element={
          <PrivateRoute>
            <Suspense fallback={<LoadingScreen message="Bildirimler yükleniyor..." />}>
              <PageTransition>
                <Notifications />
              </PageTransition>
            </Suspense>
          </PrivateRoute>
        } />
        
        <Route path="/sign-in" element={
          <PageTransition>
            <SignIn />
          </PageTransition>
        } />
        
        <Route path="/sign-up" element={
          <PageTransition>
            <SignUp />
          </PageTransition>
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
