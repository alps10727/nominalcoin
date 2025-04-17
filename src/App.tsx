
import { Toaster } from "sonner";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import { AuthProvider } from "./contexts/AuthContext"; // Add the old AuthProvider temporarily
import AppRoutes from "./components/routing/AppRoutes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SupabaseAuthProvider>
          <AuthProvider>
            <ThemeProvider>
              <LanguageProvider>
                <Toaster closeButton richColors position="top-center" />
                <AppRoutes />
              </LanguageProvider>
            </ThemeProvider>
          </AuthProvider>
        </SupabaseAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
