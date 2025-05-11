
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoginButtonProps {
  loading: boolean;
}

const LoginButton = ({ loading }: LoginButtonProps) => {
  const { t } = useLanguage();
  
  return (
    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
          {t("auth.loggingIn") || "Logging in..."}
        </div>
      ) : (
        <>
          <LogIn className="h-4 w-4 mr-2" />
          {t("auth.login") || "Login"}
        </>
      )}
    </Button>
  );
};

export default LoginButton;
