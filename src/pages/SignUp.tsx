
import { useState, useEffect } from "react";
import SignUpForm from "../components/auth/SignUpForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "@/services/authService";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";
import { App } from '@capacitor/app';
import { validateReferralCodeFormat } from "@/utils/referral/validation/referralCodeValidator";
import { checkReferralCode } from "@/utils/referral/validateReferralCode";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check URL for referral code
  const [initialReferralCode, setInitialReferralCode] = useState<string>(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('ref') || '';
    return code.toUpperCase().trim(); // Normalize to uppercase and trim
  });
  
  const [isValidReferralCode, setIsValidReferralCode] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validate referral code when component mounts
  useEffect(() => {
    const validateInitialCode = async () => {
      if (initialReferralCode && initialReferralCode.length > 0) {
        try {
          setIsValidating(true);
          setValidationError(null);
          
          // First check basic format to provide immediate feedback
          if (!validateReferralCodeFormat(initialReferralCode)) {
            setIsValidReferralCode(false);
            setValidationError("Geçersiz referans kodu formatı");
            toast.error("Geçersiz referans kodu formatı");
            setIsValidating(false);
            return;
          }
          
          // Then check with backend
          const { valid, error: validationError } = await checkReferralCode(initialReferralCode);
          setIsValidReferralCode(valid);
          
          if (!valid) {
            debugLog("SignUp", "Invalid referral code detected", { 
              code: initialReferralCode, 
              error: validationError 
            });
            setValidationError(validationError || "Geçersiz referans kodu");
            toast.error(validationError || "Geçersiz referans kodu");
          } else {
            debugLog("SignUp", "Valid referral code detected", { code: initialReferralCode });
            toast.success("Geçerli referans kodu! Kayıt olduğunuzda 10 NC Token kazanacaksınız.");
          }
        } catch (err) {
          errorLog("SignUp", "Error validating referral code:", err);
          setIsValidReferralCode(false);
          setValidationError("Referans kodu doğrulanırken hata oluştu");
        } finally {
          setIsValidating(false);
        }
      }
    };
    
    validateInitialCode();
  }, [initialReferralCode]);

  // Android back button handler
  useEffect(() => {
    const handleBackButton = () => {
      // Prevent back button on registration page
      return false;
    };

    // Listen for back button events with Capacitor App plugin
    App.addListener('backButton', handleBackButton);

    // Remove listeners when component unmounts
    return () => {
      App.removeAllListeners();
    };
  }, []);

  const handleSignUp = async (name: string, email: string, password: string, referralCode?: string) => {
    try {
      setLoading(true);
      setError(null);
      setWarningMessage(null);
      
      // Normalize referral code
      let normalizedCode = referralCode ? referralCode.toUpperCase().trim() : null;
      
      // Validate referral code if provided
      let validReferral = true;
      let validationError = null;
      
      if (normalizedCode) {
        const result = await checkReferralCode(normalizedCode);
        validReferral = result.valid;
        validationError = result.error;
        
        if (!validReferral) {
          toast.error(validationError || "Geçersiz referans kodu. Kayıt işlemi referans kodu olmadan devam edecek.");
          debugLog("SignUp", "Invalid referral code on signup attempt", { 
            code: normalizedCode, 
            error: validationError 
          });
          normalizedCode = null;
        }
      }
      
      debugLog("SignUp", "Starting registration", { name, email, referralCode: normalizedCode });
      
      // Register the user with referral code
      const userCredential = await registerUser(email, password, {
        name,
        emailAddress: email,
        referralCode: normalizedCode
      });

      // Registration successful
      toast.success("Hesabınız başarıyla oluşturuldu!");
      
      // Show special message for referral code
      if (normalizedCode && validReferral) {
        toast.success("Referans kodunuz sayesinde 10 NC Token kazandınız!");
      }
      
      navigate("/");
    } catch (error: any) {
      errorLog("SignUp", "Registration error:", error);
      
      // Handle specific error cases
      if (error.code === "over_email_send_rate_limit" || 
          error.message?.includes("email rate limit exceeded")) {
        setWarningMessage("Email gönderim limiti aşıldı. Lütfen bir süre sonra tekrar deneyin.");
        setError(null);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-navy-950 to-blue-950">
      <Card className="w-full max-w-lg shadow-xl border-none bg-gradient-to-br from-navy-900/90 to-navy-950/90 backdrop-blur-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">Hesap Oluştur</CardTitle>
          <CardDescription className="text-gray-300">
            Yeni bir hesap oluşturarak Coin kazanmaya başlayın
          </CardDescription>
          {initialReferralCode && (
            <div className={`mt-2 text-sm py-1 px-2 rounded-md ${
              isValidating ? 'bg-gray-800/30 text-gray-300 animate-pulse' :
              isValidReferralCode === true ? 'bg-green-900/30 text-green-200' :
              isValidReferralCode === false ? 'bg-red-900/30 text-red-200' :
              'bg-gray-800/30 text-gray-300'
            }`}>
              {isValidating && 'Referans kodu doğrulanıyor: '}
              {!isValidating && isValidReferralCode === true && 'Geçerli referans kodu (+10 NC Token): '}
              {!isValidating && isValidReferralCode === false && (
                <>Geçersiz referans kodu: {validationError ? `(${validationError})` : ''}</>
              )}
              {!isValidating && isValidReferralCode === null && 'Referans kodu: '}
              <span className="font-mono font-bold">{initialReferralCode}</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <SignUpForm 
            onSubmit={handleSignUp} 
            loading={loading} 
            error={error}
            warningMessage={warningMessage}
            initialReferralCode={initialReferralCode} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
