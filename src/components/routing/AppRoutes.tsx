
import { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { toast } from "sonner";
import { errorLog } from "@/utils/debugUtils";
import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { privateRoutes, publicRoutes } from "./routeConfig";

const AppRoutes = () => {
  // Ana sayfaları önden yükleme
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
        {/* Render private routes */}
        {privateRoutes.map((route) => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={route.element} 
          />
        ))}
        
        {/* Render public routes */}
        {publicRoutes.map((route) => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={route.element} 
          />
        ))}
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;
