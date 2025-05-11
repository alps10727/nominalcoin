
import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SignUpButtonProps {
  loading: boolean;
  isOffline: boolean;
  disabled?: boolean;
}

const SignUpButton = ({ loading, isOffline, disabled }: SignUpButtonProps) => {
  const { t } = useLanguage();
  
  return (
    <Button 
      type="submit" 
      className={`w-full transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={loading || isOffline || disabled}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
          {t("auth.creatingAccount") || "Creating account..."}
        </div>
      ) : isOffline ? (
        <div className="flex items-center justify-center">
          <WifiOff className="h-4 w-4 mr-2" />
          {t("app.offline") || "Offline"}
        </div>
      ) : (
        t("auth.signUp") || "Sign Up"
      )}
    </Button>
  );
};

export default SignUpButton;
