
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

export function useSupabaseDataManager(userId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Kullanıcı verilerini Supabase'den yükle
  const loadUserData = async (): Promise<UserData | null> => {
    if (!userId) return null;
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        return createDefaultUserData();
      }
      
      // Veritabanından gelen dataları UserData formatına dönüştür
      const userData: UserData = {
        userId: data.id,
        balance: data.balance || 0,
        miningRate: data.mining_rate || 0.003,
        lastSaved: data.last_saved || Date.now(),
        miningActive: data.mining_active || false,
        miningTime: data.mining_time || 0,
        miningSession: data.mining_session || 0,
        miningPeriod: data.mining_period || 21600,
        miningEndTime: data.mining_end_time || undefined,
        progress: data.progress || 0,
        miningStartTime: data.mining_start_time || undefined,
        name: data.name || "",
        emailAddress: data.email || "",
        isAdmin: data.is_admin || false
      };
      
      debugLog("useSupabaseDataManager", "User data loaded:", userData);
      return userData;
    } catch (error) {
      errorLog("useSupabaseDataManager", "Error loading user data:", error);
      return createDefaultUserData();
    } finally {
      setIsLoading(false);
    }
  };

  // Kullanıcı verilerini Supabase'e kaydet
  const updateUserData = async (data: Partial<UserData>): Promise<void> => {
    if (!userId) return;
    setIsUpdating(true);
    
    try {
      // Snake_case formatına dönüştür (Supabase konvansiyonu)
      const updateData: Record<string, any> = {};
      
      if (data.balance !== undefined) updateData.balance = data.balance;
      if (data.miningRate !== undefined) updateData.mining_rate = data.miningRate;
      if (data.miningActive !== undefined) updateData.mining_active = data.miningActive;
      if (data.miningTime !== undefined) updateData.mining_time = data.miningTime;
      if (data.miningSession !== undefined) updateData.mining_session = data.miningSession;
      if (data.miningPeriod !== undefined) updateData.mining_period = data.miningPeriod;
      if (data.miningEndTime !== undefined) updateData.mining_end_time = data.miningEndTime;
      if (data.progress !== undefined) updateData.progress = data.progress;
      if (data.miningStartTime !== undefined) updateData.mining_start_time = data.miningStartTime;
      if (data.name !== undefined) updateData.name = data.name;
      
      // Her zaman son güncelleme zamanını ekle
      updateData.last_saved = Date.now();
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
      
      if (error) throw error;
      
      debugLog("useSupabaseDataManager", "User data updated:", updateData);
    } catch (error) {
      errorLog("useSupabaseDataManager", "Error updating user data:", error);
      toast.error("Veriler kaydedilirken bir hata oluştu");
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // Yükseltmeleri alma
  const loadUpgrades = async () => {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('upgrades')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      errorLog("useSupabaseDataManager", "Error loading upgrades:", error);
      return [];
    }
  };

  // Yükseltme satın alma
  const purchaseUpgrade = async (upgradeId: string, level: number, rateBonus: number) => {
    if (!userId) return false;
    
    try {
      const { error } = await supabase
        .from('upgrades')
        .upsert({
          user_id: userId,
          upgrade_id: upgradeId,
          level,
          rate_bonus: rateBonus
        });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      errorLog("useSupabaseDataManager", "Error purchasing upgrade:", error);
      return false;
    }
  };

  // Varsayılan kullanıcı verisi oluştur
  const createDefaultUserData = (): UserData => {
    return {
      userId: userId || undefined,
      balance: 0,
      miningRate: 0.003,
      lastSaved: Date.now(),
      miningActive: false,
      miningTime: 0,
      miningSession: 0,
      miningPeriod: 21600,
      progress: 0,
      name: "",
      emailAddress: "",
      isAdmin: false
    };
  };

  return {
    loadUserData,
    updateUserData,
    loadUpgrades,
    purchaseUpgrade,
    isLoading,
    isUpdating
  };
}
