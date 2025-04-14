
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { generateSuggestedCode } from "@/services/referralService";

interface CustomCodeFormProps {
  onCancel: () => void;
  onCreateCode: (code: string) => Promise<void>;
}

export const CustomCodeForm = ({ onCancel, onCreateCode }: CustomCodeFormProps) => {
  const [newCustomCode, setNewCustomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Checks if the code is in valid format (3 letters + 3 digits)
  const isValidFormat = /^[A-Z]{3}\d{3}$/.test(newCustomCode);
  
  const handleGenerateCode = () => {
    // Generate a suggested code in the format 3 letters + 3 digits
    const suggestedCode = generateSuggestedCode();
    setNewCustomCode(suggestedCode);
  };
  
  const handleSubmit = async () => {
    if (!newCustomCode || !isValidFormat) return;
    
    setIsCreating(true);
    setError(null);
    
    try {
      // Create the custom code
      await onCreateCode(newCustomCode);
    } catch (err) {
      console.error("Özel kod oluşturma hatası:", err);
      setError("Özel kod oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="bg-navy-800/50 rounded-lg p-4 border border-purple-500/30 shadow-inner">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Özel referans kodunuzu oluşturun
      </label>
      <div className="flex gap-2 flex-col">
        <div className="flex items-center gap-2">
          <Input
            value={newCustomCode}
            onChange={(e) => setNewCustomCode(e.target.value.toUpperCase())}
            placeholder="Örn: ABC123"
            className="bg-navy-900/70 border-purple-500/30 text-white"
            maxLength={6}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleGenerateCode}
            className="border border-purple-500/30"
            type="button"
            title="Rastgele kod öner"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="outline"
          disabled={isCreating || !newCustomCode || !isValidFormat}
          onClick={handleSubmit}
          className="w-full border border-purple-500/30"
        >
          {isCreating ? "Oluşturuluyor..." : "Kaydet"}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-2">
          {error}
        </p>
      )}
      <p className="text-xs text-gray-400 mt-2">
        Format: 3 harf + 3 rakam (örn: ABC123). Kod benzersiz olmalıdır.
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="mt-2 text-gray-400 hover:text-white text-xs"
      >
        İptal
      </Button>
    </div>
  );
};
