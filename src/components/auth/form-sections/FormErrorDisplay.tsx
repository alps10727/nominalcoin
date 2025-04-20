
import ErrorAlert from "../alerts/ErrorAlert";
import OfflineAlert from "../alerts/OfflineAlert";

interface FormErrorDisplayProps {
  error: string | null;
  formError: string | null;
  isOffline: boolean;
  referralError?: string | null;
  warningMessage?: string | null;
  
  // Çeviri anahtarları için yeni prop'lar ekledik
  errorKey?: string;
  formErrorKey?: string;
  referralErrorKey?: string;
  warningKey?: string;
  
  // Çeviri değişkenleri için
  errorArgs?: string[];
  formErrorArgs?: string[];
  referralErrorArgs?: string[];
  warningArgs?: string[];
}

const FormErrorDisplay = ({ 
  error, 
  formError, 
  isOffline, 
  referralError,
  warningMessage,
  errorKey,
  formErrorKey,
  referralErrorKey,
  warningKey,
  errorArgs,
  formErrorArgs,
  referralErrorArgs,
  warningArgs
}: FormErrorDisplayProps) => {
  return (
    <>
      {/* Rate limit veya uyarı mesajları */}
      {(warningMessage || warningKey) && (
        <ErrorAlert 
          message={warningMessage || ""} 
          variant="warning"
          translationKey={warningKey}
          translationArgs={warningArgs}
        />
      )}
      
      {/* Normal hatalar (auth hataları vs.) */}
      {(error || formError || errorKey || formErrorKey) && (
        <ErrorAlert 
          message={error || formError || ""} 
          translationKey={errorKey || formErrorKey}
          translationArgs={errorKey ? errorArgs : formErrorArgs}
        />
      )}
      
      {/* Referral'a özel hatalar ayrı gösteriliyor */}
      {(referralError || referralErrorKey) && (
        <ErrorAlert
          message={referralError || ""}
          translationKey={referralErrorKey}
          translationArgs={referralErrorArgs}
        />
      )}
      
      {isOffline && <OfflineAlert />}
    </>
  );
};

export default FormErrorDisplay;
