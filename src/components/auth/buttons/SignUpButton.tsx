
import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";

interface SignUpButtonProps {
  loading: boolean;
  isOffline: boolean;
}

const SignUpButton = ({ loading, isOffline }: SignUpButtonProps) => {
  return (
    <Button type="submit" className="w-full" disabled={loading || isOffline}>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
          Hesap oluşturuluyor...
        </div>
      ) : isOffline ? (
        <div className="flex items-center justify-center">
          <WifiOff className="h-4 w-4 mr-2" />
          Çevrimdışı
        </div>
      ) : (
        "Kayıt Ol"
      )}
    </Button>
  );
};

export default SignUpButton;
