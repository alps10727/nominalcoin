
import { MiningState, MiningData } from "@/types/mining";
import { useMiningProcess } from "./mining/useMiningProcess";
import { useMiningInitialization } from "./mining/useMiningInitialization";
import { useMiningActions } from "./mining/useMiningActions";
import { useMiningPersistence } from "./mining/useMiningPersistence";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Madencilik verileri için geliştirilmiş kanca
 * Firebase ve yerel depo senkronizasyonu ile güvenilir bakiye yönetimi
 */
export function useMiningData(): MiningData {
  // Mining verisini başlat
  const { state, setState } = useMiningInitialization();
  const latestStateRef = useRef(state);
  const { userData, isOffline } = useAuth();
  
  // Kalıcı bakiye durumu - her zaman en güvenilir kaynaktan alınır
  const [persistentBalance, setPersistentBalance] = useState<number>(() => {
    // Önce yerel depodan başlatılır
    const storedData = loadUserData();
    const initialBalance = storedData?.balance || 0;
    debugLog("useMiningData", "Initial balance from localStorage:", initialBalance);
    return initialBalance;
  });
  
  // En güncel durumu referansta tut
  useEffect(() => {
    latestStateRef.current = state;
    
    // Bakiye değiştiğinde persistentBalance'ı güncelle
    // State bakiyesi daha yüksekse ve yükleme durumunda değilse
    if (state.balance > persistentBalance && !state.isLoading) {
      debugLog("useMiningData", "Updating persistent balance:", state.balance);
      setPersistentBalance(state.balance);
    }
  }, [state, persistentBalance]);
  
  // Firebase verisi geldiğinde bakiyeyi kontrol et
  useEffect(() => {
    if (userData && userData.balance > persistentBalance) {
      debugLog("useMiningData", "Firebase'den daha yüksek bakiye alındı:", userData.balance);
      setPersistentBalance(userData.balance);
    }
  }, [userData, persistentBalance]);
  
  // Mining işlemlerini yönet
  useMiningProcess(state, setState);
  
  // Veri kalıcılığını sağla
  useMiningPersistence(state);
  
  // Mining kontrol aksiyonları
  const { handleStartMining, handleStopMining } = useMiningActions(state, setState);

  // Güvenli handler fonksiyonları
  const memoizedStartMining = useCallback(() => {
    console.log("Mining süreci başlatılıyor");
    // Zaten aktifse başlatmayı önle
    if (!latestStateRef.current.miningActive) {
      handleStartMining();
    } else {
      console.log("Mining zaten aktif, başlatma isteği görmezden geliniyor");
    }
  }, [handleStartMining]);

  const memoizedStopMining = useCallback(() => {
    console.log("Mining süreci durduruluyor");
    // Aktif değilse durdurma işlemi yapma
    if (latestStateRef.current.miningActive) {
      handleStopMining();
    } else {
      console.log("Mining aktif değil, durdurma isteği görmezden geliniyor");
    }
  }, [handleStopMining]);

  // Birleştirilmiş mining verilerini ve aksiyonlarını döndür
  return {
    ...state,
    balance: Math.max(persistentBalance, state.balance || 0), // Her zaman en yüksek güvenilir bakiyeyi kullan
    handleStartMining: memoizedStartMining,
    handleStopMining: memoizedStopMining,
    isOffline: isOffline // Çevrimdışı durumunu ekledik
  };
}

export type { MiningState } from '@/types/mining';
