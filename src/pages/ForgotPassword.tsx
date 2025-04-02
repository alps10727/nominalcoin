
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Mail, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      console.log("Şifre sıfırlama e-postası gönderiliyor:", email);
      await sendPasswordResetEmail(auth, email);
      toast.success("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi");
      setSent(true);
    } catch (error) {
      console.error("Şifre sıfırlama hatası:", error);
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes("user-not-found")) {
        setError("Bu e-posta adresi ile kayıtlı bir kullanıcı bulunamadı.");
      } else if (errorMessage.includes("invalid-email")) {
        setError("Geçersiz e-posta adresi.");
      } else if (errorMessage.includes("network-request-failed") || errorMessage.includes("timeout")) {
        setError("Bağlantı sorunu. İnternet bağlantınızı kontrol edin.");
      } else {
        setError("İşlem başarısız: " + errorMessage);
      }
      toast.error("Şifre sıfırlama bağlantısı gönderilemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 text-center">
            {sent ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl font-bold">E-posta Gönderildi</CardTitle>
                <CardDescription>
                  Şifre sıfırlama bağlantısı e-posta adresinize gönderildi
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">Şifremi Unuttum</CardTitle>
                <CardDescription>
                  Şifre sıfırlama bağlantısı için e-posta adresinizi girin
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {!sent ? (
              <>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                
                <form onSubmit={handleResetPassword} className="space-y-4">
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
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
                        Gönderiliyor...
                      </div>
                    ) : (
                      "Şifre Sıfırlama Bağlantısı Gönder"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  E-postanızı kontrol edin ve şifrenizi sıfırlamak için gelen bağlantıya tıklayın. Spam klasörünüzü de kontrol etmeyi unutmayın.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSent(false)}
                >
                  Tekrar Dene
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              <Link to="/sign-in" className="inline-flex items-center text-primary hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Giriş sayfasına dön
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
