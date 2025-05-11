
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
import { sendPasswordResetEmail } from "@/services/passwordService";
import { useLanguage } from "@/contexts/LanguageContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      console.log("Sending password reset email:", email);
      await sendPasswordResetEmail(email);
      toast.success(t("auth.passwordResetSent") || "Password reset link has been sent to your email");
      setSent(true);
    } catch (error) {
      console.error("Password reset error:", error);
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes("user-not-found")) {
        setError(t("auth.userNotFound") || "No user found with this email address.");
      } else if (errorMessage.includes("invalid-email")) {
        setError(t("auth.invalidEmail") || "Invalid email address.");
      } else if (errorMessage.includes("network-request-failed") || errorMessage.includes("timeout")) {
        setError(t("auth.connectionIssue") || "Connection issue. Please check your internet connection.");
      } else {
        setError((t("auth.operationFailed") || "Operation failed: ") + errorMessage);
      }
      toast.error(t("auth.passwordResetFailed") || "Failed to send password reset link");
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
                <CardTitle className="text-2xl font-bold">{t("auth.emailSent") || "Email Sent"}</CardTitle>
                <CardDescription>
                  {t("auth.passwordResetEmailSent") || "Password reset link has been sent to your email"}
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">{t("auth.forgotPassword") || "Forgot Password"}</CardTitle>
                <CardDescription>
                  {t("auth.enterEmailForReset") || "Enter your email address to get a password reset link"}
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
                        placeholder={t("auth.enterYourEmail") || "Enter your email address"}
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
                        {t("auth.sending") || "Sending..."}
                      </div>
                    ) : (
                      t("auth.sendPasswordResetLink") || "Send Password Reset Link"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t("auth.checkEmailForInstructions") || "Check your email and click the link to reset your password. Don't forget to check your spam folder."}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSent(false)}
                >
                  {t("auth.tryAgain") || "Try Again"}
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              <Link to="/sign-in" className="inline-flex items-center text-primary hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("auth.backToLogin") || "Back to login page"}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
