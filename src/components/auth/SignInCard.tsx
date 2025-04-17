
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { WifiOff } from "lucide-react";
import SignInForm from "@/components/auth/SignInForm";

interface SignInCardProps {
  onSubmit: (email: string, password: string) => Promise<boolean>;
  error: string | null;
  loading: boolean;
  isOffline: boolean;
}

const SignInCard = ({ onSubmit, error, loading, isOffline }: SignInCardProps) => {
  return (
    <div className="w-full max-w-md animate-fade-in">
      <Card className="border-none shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Tekrar Hoşgeldiniz</CardTitle>
          <CardDescription>
            Devam etmek için hesabınıza giriş yapın
          </CardDescription>
          
          {isOffline && (
            <div className="mt-2 flex items-center justify-center text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full">
              <WifiOff className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs font-medium">Çevrimdışı mod aktif</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <SignInForm 
            onSubmit={onSubmit}
            error={error}
            loading={loading}
            isOffline={isOffline}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Hesabınız yok mu?{" "}
            <Link to="/sign-up" className="text-primary hover:underline">
              Kayıt ol
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInCard;
