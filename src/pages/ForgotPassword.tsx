
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      debugLog("ForgotPassword", "Sending password reset email to:", email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      });
      
      if (error) throw error;
      
      setSuccess(true);
      toast.success("Şifre sıfırlama talimatları email adresinize gönderildi");
    } catch (error) {
      errorLog("ForgotPassword", "Error sending reset email:", error);
      toast.error("Şifre sıfırlama emaili gönderilemedi: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-navy-950 to-blue-950">
      <Card className="w-full max-w-md shadow-xl border-none bg-gradient-to-br from-navy-900/90 to-navy-950/90 backdrop-blur-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">Şifremi Unuttum</CardTitle>
          <CardDescription className="text-gray-300">
            {success
              ? "Emailinizi kontrol edin ve gönderilen talimatları izleyin."
              : "Email adresinize şifre sıfırlama bağlantısı göndereceğiz."}
          </CardDescription>
        </CardHeader>
        
        {!success ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-200">
                  Email adresiniz
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
                    disabled={loading || success}
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col space-y-4 pt-0">
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading || success}
              >
                {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
              </Button>
              
              <Link
                to="/sign-in"
                className="flex items-center text-sm text-purple-400 hover:text-purple-300"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Giriş sayfasına dön
              </Link>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4 pt-2">
            <div className="bg-green-900/20 text-green-400 p-3 rounded-md text-sm">
              Şifre sıfırlama bağlantısı email adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.
            </div>
            
            <div className="flex justify-center pt-2">
              <Link
                to="/sign-in"
                className="flex items-center text-sm text-purple-400 hover:text-purple-300"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Giriş sayfasına dön
              </Link>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
