
import { MiningState } from '@/types/mining';
import { UserData } from '@/utils/storage';
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
      const miningEndTime = Date.now() + miningPeriod * 1000; // Bitiş zamanını mutlak olarak ayarla
      
      // State'i güncelle
      setState(prev => ({
        ...prev,
        miningActive: true,
        miningTime: miningPeriod,
        miningPeriod: miningPeriod,
        progress: 0,
        miningSession: 0,
        miningEndTime: miningEndTime
      }));
      
      debugLog("useMiningActions", "Mining başlatıldı", { 
        miningPeriod, 
        endTime: new Date(miningEndTime).toLocaleString() 
      });
      
      // Kullanıcı oturum açmışsa, Firebase'e kaydet
      if (currentUser && updateUserData) {
        try {
          const updates: Partial<UserData> = {
            miningActive: true,
            miningTime: miningPeriod,
            miningPeriod: miningPeriod,
            miningSession: 0,
            miningEndTime: miningEndTime
          };
          
          await updateUserData(updates);
          debugLog("useMiningActions", "Mining durumu Firebase'e kaydedildi");
        } catch (error) {
          // İnternet bağlantısı yoksa çevrimdışı modda devam et
          // updateUserData içindeki mantık bu hatayı zaten ele alacağı için 
          // burada sadece loglama yapıyoruz ve kullanıcı akışını bozmuyoruz
          errorLog("useMiningActions", "Firebase'e kaydetme başarısız, yerel modda devam ediliyor:", error);
          
          // Toast mesajı updateUserData içinde gösterilecek, burada tekrarlamıyoruz
          // Mining devam etmeli, hata kullanıcıya bildirildi ama işlemi kesmiyor
        }
      }
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
        miningTime: 0,
        progress: 1,
        miningEndTime: undefined // End time'ı kaldır
      }));
      
      // Kazanılan miktar görünümü
      if (miningSession > 0) {
        toast.success(`+${miningSession.toFixed(3)} coin kazandınız!`);
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
            miningTime: 0,
            balance: currentBalance,
            miningEndTime: undefined
          };
          
          await updateUserData(updates);
          debugLog("useMiningActions", "Mining durumu Firebase'e kaydedildi");
        } catch (error) {
          // İnternet bağlantısı yoksa çevrimdışı modda devam et
          errorLog("useMiningActions", "Firebase'e kaydetme başarısız, yerel modda devam ediliyor:", error);
          // Mining durdurma işlemi yine de başarılı sayılmalı, kullanıcı akışını bozmuyoruz
        }
      }
    } catch (error) {
      errorLog("useMiningActions", "Mining durdurulurken hata:", error);
      toast.error("Mining durdurulurken bir hata oluştu");
    }
  };
  
  return { handleStartMining, handleStopMining };
}
