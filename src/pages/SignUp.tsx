
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
import { Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const navigate = useNavigate();
  const { register, loading: authLoading } = useAuth();
  
  // Kayıt işlemi uzun sürdüğünde kurtarma mekanizması
  useEffect(() => {
    // Sayfa yüklendiğinde
    console.log("SignUp component mounted");
    
    // Eğer kayıt işlemi başlayıp 30 saniyeden fazla sürerse, otomatik olarak form sıfırlanır
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Kayıt zaman aşımına uğradı, durum sıfırlanıyor");
        setLoading(false);
        setSubmitDisabled(false);
        toast.error("Kayıt işlemi zaman aşımına uğradı. Lütfen tekrar deneyin.");
      }
    }, 30000);
    
    return () => {
      clearTimeout(timeoutId);
      console.log("SignUp component unmounted");
    };
  }, [loading]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor, lütfen kontrol edin.");
      return;
    }

    if (!agreeTerms) {
      toast.error("Devam etmek için kullanım şartlarını kabul etmelisiniz.");
      return;
    }

    setLoading(true);
    setSubmitDisabled(true);
    
    try {
      console.log("Kayıt işlemi başlıyor...");
      const success = await register(email, password);
      
      if (success) {
        console.log("Kayıt başarılı, yönlendiriliyor...");
        toast.success("Hesabınız başarıyla oluşturuldu!");
        navigate("/sign-in");
      } else {
        console.log("Kayıt başarısız oldu");
        toast.error("Kayıt işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes("timeout") || errorMessage.includes("network")) {
        toast.error("Bağlantı sorunu. İnternet bağlantınızı kontrol edin.");
      } else {
        toast.error("Kayıt hatası: " + errorMessage);
      }
    } finally {
      // Her durumda yükleme durumunu kapat
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
            <CardTitle className="text-2xl font-bold">Hesap Oluştur</CardTitle>
            <CardDescription>
              Hesabınızı oluşturmak için bilgilerinizi girin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Adınızı ve soyadınızı girin"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
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
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Şifre oluşturun"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Şifrenizi tekrar girin"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => {
                    setAgreeTerms(checked as boolean);
                  }}
                  disabled={loading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Link to="/terms" className="text-primary hover:underline">
                    Kullanım şartlarını
                  </Link>{" "}
                  ve{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    gizlilik politikasını
                  </Link>{" "}
                  kabul ediyorum
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={loading || submitDisabled}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
                    Hesap oluşturuluyor...
                  </div>
                ) : (
                  "Kayıt Ol"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Zaten hesabınız var mı?{" "}
              <Link to="/sign-in" className="text-primary hover:underline">
                Giriş yap
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
