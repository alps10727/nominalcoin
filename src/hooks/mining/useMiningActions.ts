
import { MiningState } from '@/types/mining';
import { UserData } from '@/types/storage'; // Changed from @/utils/storage to @/types/storage
import { useAuth } from '@/contexts/AuthContext';
import { debugLog, errorLog } from '@/utils/debugUtils';
import { toast } from 'sonner';

export function useMiningActions(
  state: MiningState, 
  setState: React.Dispatch<React.SetStateAction<MiningState>>
) {
  const { userData, currentUser, updateUserData } = useAuth();
  
  const handleStartMining = async () => {
    if (state.isLoading) {
      debugLog("useMiningActions", "Yükleme sırasında madencilik başlatma isteği engellendi");
      return;
    }
    
    try {
      const miningPeriod = 6 * 60 * 60; // 6 saat = 21600 saniye
      const now = Date.now();
      const miningEndTime = now + miningPeriod * 1000; // Bitiş zamanını mutlak olarak ayarla
      
      debugLog("useMiningActions", `Mining başlatılıyor: ${now}, bitiş: ${miningEndTime}, fark: ${miningPeriod}s`);
      
      // State'i güncelle
      setState(prev => ({
        ...prev,
        miningActive: true,
        miningTime: miningPeriod,
        miningPeriod: miningPeriod,
        progress: 0,
        miningSession: 0,
        miningEndTime: miningEndTime, // Always store absolute end time for recovery
        miningStartTime: now // Add start time for better tracking
      }));
      
      // Kullanıcı oturum açmışsa, Firebase'e kaydet
      if (currentUser && updateUserData) {
        try {
          const updates: Partial<UserData> = {
            miningActive: true,
            miningTime: miningPeriod,
            miningPeriod: miningPeriod,
            miningSession: 0,
            miningEndTime: miningEndTime, // Ensure this is stored in Firebase too
            miningStartTime: now, // Store start time as well
            lastSaved: now
          };
          
          await updateUserData(updates);
          debugLog("useMiningActions", "Mining durumu Firebase'e kaydedildi");
        } catch (error) {
          // İnternet bağlantısı yoksa çevrimdışı modda devam et
          errorLog("useMiningActions", "Firebase'e kaydetme başarısız, yerel modda devam ediliyor:", error);
        }
      }
      
      // Success notification
      toast.success("Madencilik başlatıldı", {
        description: "6 saatlik madencilik süreci başladı",
        duration: 3000
      });
    } catch (error) {
      errorLog("useMiningActions", "Mining başlatılırken hata:", error);
      toast.error("Mining başlatılırken bir hata oluştu");
    }
  };
  
  const handleStopMining = async () => {
    if (state.isLoading) {
      debugLog("useMiningActions", "Yükleme sırasında madencilik durdurma isteği engellendi");
      return;
    }
    
    try {
      // Kazanılan bakiyeyi hesapla
      const currentBalance = state.balance || 0;
      const miningSession = state.miningSession || 0;
      
      // State'i güncelle
      setState(prev => ({
        ...prev,
        miningActive: false,
        miningTime: prev.miningPeriod, // Reset to full time
        progress: 0,
        miningEndTime: undefined, // Clear end time
        miningStartTime: undefined // Clear start time
      }));
      
      // Kazanılan miktar görünümü
      if (miningSession > 0) {
        toast.success(`+${miningSession.toFixed(3)} coin kazandınız!`, {
          duration: 4000
        });
      }
      
      debugLog("useMiningActions", "Mining durduruldu", { 
        currentBalance, 
        earnedInSession: miningSession 
      });
      
      // Kullanıcı oturum açmışsa, Firebase'e kaydet
      if (currentUser && updateUserData) {
        try {
          const updates: Partial<UserData> = {
            miningActive: false,
            miningTime: state.miningPeriod, // Reset to full time
            balance: currentBalance,
            miningEndTime: undefined, // Clear end time in Firebase too
            miningStartTime: undefined, // Clear start time
            lastSaved: Date.now()
          };
          
          await updateUserData(updates);
          debugLog("useMiningActions", "Mining durumu Firebase'e kaydedildi");
        } catch (error) {
          // İnternet bağlantısı yoksa çevrimdışı modda devam et
          errorLog("useMiningActions", "Firebase'e kaydetme başarısız, yerel modda devam ediliyor:", error);
        }
      }
    } catch (error) {
      errorLog("useMiningActions", "Mining durdurulurken hata:", error);
      toast.error("Mining durdurulurken bir hata oluştu");
    }
  };
  
  return { handleStartMining, handleStopMining };
}
