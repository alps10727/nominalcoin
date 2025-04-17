import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "@/components/ui/Loading";
import Referral from "@/pages/Referral";

// Lazy load components
const Home = lazy(() => import("@/pages/Home"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Profile = lazy(() => import("@/pages/Profile"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AdminPanel = lazy(() => import("@/pages/AdminPanel"));

const appRoutes = [
  { path: "/", element: <Home /> },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/profile", element: <Profile /> },
  { path: "/admin", element: <AdminPanel /> },
  { path: "/referral", element: <Referral /> },
];

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {appRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
