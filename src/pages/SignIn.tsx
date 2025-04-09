
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import SignInContainer from "@/components/auth/SignInContainer";
import AdminLoginHandler from "@/components/auth/AdminLoginHandler";

const SignIn = () => {
  useEffect(() => {
    console.log("SignIn component mounted");
    return () => {
      console.log("SignIn component unmounted");
    };
  }, []);

  // Try to use auth context, but fallback gracefully if not ready
  const auth = (() => {
    try {
      return useAuth();
    } catch (err) {
      console.error("Auth context error:", err);
      return { loading: true };
    }
  })();
  
  // If page is loading, show loading screen
  if (auth.loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Separate admin login handler component */}
      <AdminLoginHandler />
      <SignInContainer />
    </div>
  );
};

export default SignIn;
