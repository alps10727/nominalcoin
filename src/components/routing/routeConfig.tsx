
import React, { lazy } from "react";
import { RouteObject } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PageTransition from "./PageTransition";
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
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));

// Helper to create a private route with suspense
const createPrivateRoute = (element: JSX.Element, loadingMessage: string) => {
  return (
    <PrivateRoute>
      <React.Suspense fallback={<LoadingScreen message={loadingMessage} />}>
        <PageTransition>
          {element}
        </PageTransition>
      </React.Suspense>
    </PrivateRoute>
  );
};

// Helper to create a public route with suspense
const createPublicRoute = (element: JSX.Element, loadingMessage: string) => {
  return (
    <React.Suspense fallback={<LoadingScreen message={loadingMessage} />}>
      <PageTransition>
        {element}
      </PageTransition>
    </React.Suspense>
  );
};

// Define route objects
export const privateRoutes: RouteObject[] = [
  {
    path: "/",
    element: createPrivateRoute(<Index />, "Ana sayfa yükleniyor..."),
  },
  {
    path: "/profile",
    element: createPrivateRoute(<Profile />, "Profil yükleniyor..."),
  },
  {
    path: "/history",
    element: createPrivateRoute(<History />, "Geçmiş yükleniyor..."),
  },
  {
    path: "/referral",
    element: createPrivateRoute(<Referral />, "Referans sistemi yükleniyor..."),
  },
  {
    path: "/tasks",
    element: createPrivateRoute(<Tasks />, "Görevler yükleniyor..."),
  },
  {
    path: "/mining/upgrades",
    element: createPrivateRoute(<MiningUpgrades />, "Yükseltmeler yükleniyor..."),
  },
  {
    path: "/statistics",
    element: createPrivateRoute(<Statistics />, "İstatistikler yükleniyor..."),
  },
];

export const publicRoutes: RouteObject[] = [
  {
    path: "/sign-in",
    element: createPublicRoute(<SignIn />, "Giriş sayfası yükleniyor..."),
  },
  {
    path: "/sign-up",
    element: createPublicRoute(<SignUp />, "Kayıt sayfası yükleniyor..."),
  },
  {
    path: "/forgot-password",
    element: createPublicRoute(<ForgotPassword />, "Şifre sıfırlama sayfası yükleniyor..."),
  },
  {
    path: "*",
    element: createPublicRoute(<NotFound />, "Sayfa yükleniyor..."),
  },
];
