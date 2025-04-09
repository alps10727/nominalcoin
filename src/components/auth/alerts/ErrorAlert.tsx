
import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert = ({ message }: ErrorAlertProps) => {
  if (!message) return null;
  
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-start">
      <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default ErrorAlert;
