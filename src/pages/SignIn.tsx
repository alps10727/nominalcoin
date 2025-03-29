
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  
  // Giriş işlemi uzun sürdüğünde kurtarma mekanizması
  useEffect(() => {
    console.log("SignIn component mounted");
    
    // Eğer giriş işlemi başlayıp 30 saniyeden fazla sürerse, otomatik olarak form sıfırlanır
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Giriş zaman aşımına uğradı, durum sıfırlanıyor");
        setLoading(false);
        setSubmitDisabled(false);
        toast.error("Giriş işlemi zaman aşımına uğradı. Lütfen tekrar deneyin.");
      }
    }, 30000);
    
    return () => {
      clearTimeout(timeoutId);
      console.log("SignIn component unmounted");
    };
  }, [loading]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitDisabled(true);
    
    try {
      console.log("Giriş işlemi başlatılıyor:", email);
      const success = await login(email, password);
      if (success) {
        navigate("/");
      } else {
        toast.error("Giriş yapılamadı, lütfen bilgilerinizi kontrol edin.");
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes("timeout") || errorMessage.includes("network")) {
        toast.error("Bağlantı sorunu. İnternet bağlantınızı kontrol edin.");
      } else {
        toast.error("Giriş yapılamadı: " + errorMessage);
      }
    } finally {
      setLoading(false);
      setSubmitDisabled(false);
    }
  };
  
  // Ana sayfa yüklenirken ekranı göster
  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Tekrar Hoşgeldiniz</CardTitle>
            <CardDescription>
              Devam etmek için hesabınıza giriş yapın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email adresinizi girin"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Şifre</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Şifremi unuttum?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Şifrenizi girin"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => {
                    setRememberMe(checked as boolean);
                  }}
                  disabled={loading}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Beni hatırla
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={loading || submitDisabled}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
                    Giriş yapılıyor...
                  </div>
                ) : (
                  "Giriş Yap"
                )}
              </Button>
            </form>
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
    </div>
  );
};

export default SignIn;
