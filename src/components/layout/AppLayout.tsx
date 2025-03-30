
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
      <Toaster />
      <Sonner />
      <Suspense fallback={<LoadingScreen message="Sayfa yükleniyor..." />}>
        <div className="flex flex-col min-h-screen pb-16">
          <Header />
          {children}
          <MobileNavigation />
        </div>
      </Suspense>
    </TooltipProvider>
  );
};

export default AppLayout;
