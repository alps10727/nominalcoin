
import ErrorAlert from "../alerts/ErrorAlert";
import OfflineAlert from "../alerts/OfflineAlert";

interface FormErrorDisplayProps {
  error: string | null;
  formError: string | null;
  isOffline: boolean;
}

const FormErrorDisplay = ({ error, formError, isOffline }: FormErrorDisplayProps) => {
  return (
    <>
      {(error || formError) && (
        <ErrorAlert message={error || formError} />
      )}
      
      {isOffline && <OfflineAlert />}
    </>
  );
};

export default FormErrorDisplay;
