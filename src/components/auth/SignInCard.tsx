
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { debugLog } from "@/utils/debugUtils";

interface SignInCardProps {
  onSubmit: (email: string, password: string) => Promise<boolean>;
  error: string | null;
  loading: boolean;
  isOffline?: boolean;
}

const SignInCard = ({ onSubmit, error, loading, isOffline }: SignInCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    debugLog("SignInCard", "Form gönderiliyor", { email });
    
    const success = await onSubmit(email, password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border border-purple-900/20 bg-gradient-to-tr from-navy-900/90 to-navy-950/80 backdrop-blur-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          NOMINAL Giriş Yap
        </CardTitle>
        <CardDescription className="text-gray-300">
          {isOffline
            ? "Çevrimdışı moddasınız. Sınırlı özellikler kullanılabilir."
            : "Hesabınıza giriş yaparak kazanmaya devam edin."}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-2">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-200">
              E-posta
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="ornek@mail.com"
                className="pl-9 bg-navy-900/50 border-purple-900/30 placeholder:text-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="text-sm font-medium text-gray-200">
                Şifre
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                Şifremi Unuttum
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-9 bg-navy-900/50 border-purple-900/30 placeholder:text-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="rounded-md bg-red-900/20 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex-col space-y-4 pt-0">
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
          
          <div className="text-center text-sm text-gray-400">
            Hesabınız yok mu?{" "}
            <Link to="/sign-up" className="text-purple-400 hover:text-purple-300">
              Kaydol
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignInCard;
