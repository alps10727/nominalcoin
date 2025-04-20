
import ErrorAlert from "../alerts/ErrorAlert";
import OfflineAlert from "../alerts/OfflineAlert";
import { AlertCircle } from "lucide-react";

interface FormErrorDisplayProps {
  error: string | null;
  formError: string | null;
  isOffline: boolean;
  referralError?: string | null;
  warningMessage?: string | null;
}

const FormErrorDisplay = ({ 
  error, 
  formError, 
  isOffline, 
  referralError,
  warningMessage 
}: FormErrorDisplayProps) => {
  return (
    <>
      {/* Rate limit or warning messages */}
      {warningMessage && (
        <ErrorAlert message={warningMessage} variant="warning" />
      )}
      
      {/* Regular errors (auth errors etc.) */}
      {(error || formError) && (
        <ErrorAlert message={error || formError} />
      )}
      
      {/* Referral-specific errors shown separately */}
      {referralError && (
        <div className="mb-4 p-3 bg-red-50/90 border border-red-200 text-red-600 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
          <span className="text-sm">{referralError}</span>
        </div>
      )}
      
      {isOffline && <OfflineAlert />}
    </>
  );
};

export default FormErrorDisplay;
