
import { useState, useEffect, useCallback } from 'react';
import { useTimer } from './useTimer';
import { useMiningCalculator } from './useMiningCalculator';
import { useMiningPersistence } from './useMiningPersistence';
import { useMiningInitialization } from './useMiningInitialization';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { calculateMiningRate } from '@/utils/miningCalculator';
import { debugLog } from '@/utils/debugUtils';

export function useMiningData() {
  // Supabase auth bağlamından verileri al
  const { user, userData, updateUserData, isOffline } = useSupabaseAuth();

  // İlk durumu oluştur
  const { state, setState } = useMiningInitialization();
  
  // Mining hesaplamaları
  const { calculateEarnings } = useMiningCalculator();
  
  // Timer hook'larını kullan
  const { 
    startTimer, 
    stopTimer, 
    time: remainingTime, 
    progress, 
    isActive,
    setTimeRemaining
  } = useTimer(state.miningTime);

  // Madencilik miktarını ayarla - ya userData'dan ya da varsayılan değer
  useEffect(() => {
    if (!userData) return;
    
    setState(prev => ({
      ...prev,
      userId: user?.id || 'local-user',
      balance: userData.balance || 0,
      miningRate: userData.miningRate || 0.003,
      miningActive: userData.miningActive || false,
      miningTime: userData.miningTime || prev.miningTime,
      miningPeriod: userData.miningPeriod || 21600,
      miningSession: userData.miningSession || 0
    }));

    // Süre bilgisini güncelle
    if (userData.miningTime && userData.miningTime > 0 && userData.miningActive) {
      setTimeRemaining(userData.miningTime);
    } else if (userData.miningActive && userData.miningEndTime) {
      const currentTime = Date.now();
      const endTime = userData.miningEndTime;
      
      if (endTime > currentTime) {
        const remainingTimeInSeconds = Math.floor((endTime - currentTime) / 1000);
        setTimeRemaining(remainingTimeInSeconds);
      } else {
        // Süre dolmuş
        setTimeRemaining(0);
      }
    }
    
  }, [userData, user]);
  
  // Hook local state'ini güncelle - mevcut duruma göre
  useEffect(() => {
    if (userData && userData.miningActive) {
      if (!isActive) startTimer();
    }
  }, [userData, isActive]);

  // Timer değişikliklerini lokaldeki mining state ile senkronize et
  useEffect(() => {
    if (state.isLoading) return;
    
    setState(prev => ({
      ...prev,
      miningTime: remainingTime,
      miningActive: isActive,
      progress
    }));
  }, [remainingTime, isActive, progress, state.isLoading]);

  // Madencilik tamamlandığında balans güncelleme
  useEffect(() => {
    // Süre dolduğunda ve madencilik aktifse
    if (remainingTime === 0 && state.miningActive && !state.isLoading) {
      const earnings = calculateEarnings(state.miningSession, state.miningRate);
      const newBalance = state.balance + earnings;
      
      setState(prev => ({
        ...prev,
        balance: newBalance,
        miningActive: false,
        miningSession: 0
      }));
      
      // Başarılı madencilik durumunu Supabase'e kaydet
      if (user && updateUserData) {
        updateUserData({
          balance: newBalance,
          miningActive: false,
          miningSession: 0,
          miningTime: 0
        }).then(() => {
          debugLog("useMiningData", "Mining complete, balance updated:", newBalance);
        }).catch(error => {
          console.error("Mining complete but failed to update data:", error);
        });
      }
    }
  }, [remainingTime, state.miningActive, state.isLoading]);

  // Verilerin kalıcılığını sağlamak için hook
  useMiningPersistence(state);

  // Mining başlatma fonksiyonu
  const handleStartMining = useCallback(async () => {
    if (state.miningActive) return;
    
    // Toplam madencilik süresi (6 saat)
    const miningPeriod = 6 * 60 * 60; // 6 hours in seconds
    
    // Mutlak bitiş zamanı (daha güvenilir zamanlama için)
    const miningEndTime = Date.now() + miningPeriod * 1000;
    
    // Yeni durum ayarla
    setState(prev => ({
      ...prev,
      miningActive: true,
      miningTime: miningPeriod,
      miningPeriod,
      miningSession: 0,
      miningEndTime,
      miningStartTime: Date.now(),
      progress: 0
    }));
    
    // Timer'ı başlat
    startTimer(miningPeriod);
    
    // Supabase'e kaydediyoruz
    if (user && updateUserData) {
      await updateUserData({
        miningActive: true,
        miningTime: miningPeriod,
        miningPeriod,
        miningSession: 0,
        miningEndTime,
        miningStartTime: Date.now(),
        progress: 0
      });
    }
  }, [state.miningActive, updateUserData, user]);

  // Mining durdurma fonksiyonu
  const handleStopMining = useCallback(async () => {
    if (!state.miningActive) return;
    
    // Kazanç hesapla
    const earnings = calculateEarnings(state.miningSession, state.miningRate);
    const newBalance = state.balance + earnings;
    
    // Durum güncelleme
    setState(prev => ({
      ...prev,
      balance: newBalance,
      miningActive: false,
      miningTime: 0,
      miningSession: 0,
      progress: 0
    }));
    
    // Timer'ı durdur
    stopTimer();
    
    // Supabase'e kaydediyoruz
    if (user && updateUserData) {
      await updateUserData({
        balance: newBalance,
        miningActive: false,
        miningTime: 0,
        miningSession: 0,
        miningEndTime: null,
        progress: 0
      });
    }
  }, [state.miningActive, state.balance, state.miningSession, updateUserData, user]);

  return {
    isLoading: state.isLoading,
    miningActive: state.miningActive,
    miningTime: remainingTime,
    progress,
    balance: state.balance,
    miningSession: state.miningSession,
    miningRate: state.miningRate, 
    handleStartMining,
    handleStopMining,
    isOffline
  };
}
