
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import SignInContainer from "@/components/auth/SignInContainer";

const SignIn = () => {
  // Try to use auth context, but fallback gracefully if not ready
  const auth = (() => {
    try {
      return useAuth();
    } catch (err) {
      return { loading: true };
    }
  })();
  
  // Ana sayfa yüklenirken ekranı göster
  if (auth.loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <SignInContainer />
    </div>
  );
};

export default SignIn;
