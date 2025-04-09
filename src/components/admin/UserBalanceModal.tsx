
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserData } from "@/utils/storage";
import { useAdminActions } from "@/hooks/admin/useAdminActions";
import { toast } from "sonner";

interface UserBalanceModalProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserBalanceModal = ({ user, open, onOpenChange }: UserBalanceModalProps) => {
  const [newBalance, setNewBalance] = useState(user.balance?.toString() || "0");
  const [operation, setOperation] = useState<'set' | 'add' | 'subtract'>('set');
  const [loading, setLoading] = useState(false);
  
  const { updateUserBalance } = useAdminActions();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const currentBalance = user.balance || 0;
      let finalBalance = parseFloat(newBalance);
      
      if (operation === 'add') {
        finalBalance = currentBalance + finalBalance;
      } else if (operation === 'subtract') {
        finalBalance = currentBalance - finalBalance;
        
        // Negatif bakiye kontrolü
        if (finalBalance < 0) {
          finalBalance = 0;
          toast.warning("Bakiye negatif olamaz, 0 olarak ayarlandı.");
        }
      }
      
      await updateUserBalance(user.userId!, finalBalance);
      toast.success(`Kullanıcının bakiyesi başarıyla güncellendi: ${finalBalance.toFixed(4)}`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Bakiye güncellenirken hata oluştu: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bakiye Düzenleme</DialogTitle>
          <DialogDescription>
            {user.emailAddress || user.userId} kullanıcısının bakiyesini düzenleyin.
            Mevcut bakiye: {user.balance?.toFixed(4) || "0"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="operation">İşlem Tipi</Label>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant={operation === 'set' ? "default" : "outline"}
                onClick={() => setOperation('set')}
              >
                Yeni değer belirle
              </Button>
              <Button 
                type="button" 
                variant={operation === 'add' ? "default" : "outline"}
                onClick={() => setOperation('add')}
              >
                Ekle
              </Button>
              <Button 
                type="button" 
                variant={operation === 'subtract' ? "default" : "outline"}
                onClick={() => setOperation('subtract')}
              >
                Çıkar
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="balance">
              {operation === 'set' ? 'Yeni Bakiye' : 
               operation === 'add' ? 'Eklenecek Miktar' : 'Çıkarılacak Miktar'}
            </Label>
            <Input
              id="balance"
              type="number"
              step="0.0001"
              min="0"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              required
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "İşleniyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserBalanceModal;
