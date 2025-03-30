
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AppInitializer from "./components/app/AppInitializer";
import AppLayout from "./components/layout/AppLayout";
import AppRoutes from "./components/routing/AppRoutes";

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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AuthProvider>
              <AppInitializer>
                <AppLayout>
                  <AppRoutes />
                </AppLayout>
              </AppInitializer>
            </AuthProvider>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
