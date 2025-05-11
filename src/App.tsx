
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { TasksProvider } from './contexts/TasksContext';
import AppInitializer from "./components/app/AppInitializer";
import AppLayout from "./components/layout/AppLayout";
import AppRoutes from "./components/routing/AppRoutes";
import { Suspense } from "react";
import LoadingScreen from "./components/dashboard/LoadingScreen";
import { Toaster } from "sonner";

// Optimize edilmiş QueryClient yapılandırması
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 300,
      refetchOnWindowFocus: false,
      staleTime: 20000,
      gcTime: 300000,
    }
  }
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AuthProvider>
              <TasksProvider>
                <AppInitializer>
                  <Suspense fallback={<LoadingScreen message="Yükleniyor..." />}>
                    <Toaster richColors position="top-center" />
                    <AppLayout>
                      <AppRoutes />
                    </AppLayout>
                  </Suspense>
                </AppInitializer>
              </TasksProvider>
            </AuthProvider>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
