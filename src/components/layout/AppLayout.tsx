
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import LoadingScreen from "@/components/dashboard/LoadingScreen";

// Pre-import the MobileNavigation to reduce loading time
const MobileNavigation = lazy(() => import("@/components/MobileNavigation"));

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-gray-950">
        <Toaster />
        <Sonner />
        <Suspense fallback={<LoadingScreen message="Sayfa yükleniyor..." />}>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <MobileNavigation />
        </Suspense>
      </div>
    </TooltipProvider>
  );
};

export default AppLayout;
