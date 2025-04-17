
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserData, saveUserData, loadUserData } from '@/utils/storage';
import { useDataUpgrader } from './useDataUpgrader';
import { debugLog, errorLog } from '@/utils/debugUtils';
import { toast } from 'sonner';

export function useSupabaseDataManager(userId: string | undefined) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { upgradeData } = useDataUpgrader();

  // Load user data from Supabase
  const loadUserData = async (): Promise<UserData | null> => {
    if (!userId) return null;
    
    try {
      // Get user profile from Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!profile) {
        return null;
      }
      
      // Convert profile to UserData format
      const userData: UserData = {
        userId: profile.id,
        name: profile.name || '',
        balance: profile.balance || 0,
        miningRate: profile.mining_rate || 0.003,
        miningActive: profile.mining_active || false,
        miningTime: profile.mining_time || 0,
        miningPeriod: profile.mining_period || 21600,
        miningSession: profile.mining_session || 0,
        miningEndTime: profile.mining_end_time,
        miningStartTime: profile.mining_start_time,
        progress: profile.progress || 0,
        lastSaved: profile.last_saved || Date.now(),
        isAdmin: profile.is_admin || false,
        upgrades: []  // Initialize with empty upgrades array
      };
      
      // Cache user data locally
      saveUserData(userData);
      
      return userData;
    } catch (error) {
      errorLog('useSupabaseDataManager', 'Kullanıcı verileri yüklenirken hata:', error);
      
      // Try to load from local cache as fallback
      const localData = loadUserData();
      return localData;
    }
  };

  // Update user data in Supabase
  const updateUserData = useCallback(async (data: Partial<UserData>): Promise<void> => {
    if (!userId) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // First, update local storage for instant feedback
      const currentData = loadUserData();
      
      // Ensure currentData is valid, if not create a default object with required fields
      const baseData: UserData = currentData || {
        userId: userId,
        balance: 0,
        miningRate: 0.003,
        lastSaved: Date.now(),
        miningActive: false,
        miningTime: 0,
        miningPeriod: 21600,
        miningSession: 0
      };
      
      const updatedData: UserData = { 
        ...baseData, 
        ...data, 
        lastSaved: Date.now(),
        userId: userId // Ensure userId is set
      };
      
      saveUserData(updatedData);
      
      // Prepare data for Supabase (snake_case)
      const dbData = {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.balance !== undefined && { balance: data.balance }),
        ...(data.miningRate !== undefined && { mining_rate: data.miningRate }),
        ...(data.miningActive !== undefined && { mining_active: data.miningActive }),
        ...(data.miningTime !== undefined && { mining_time: data.miningTime }),
        ...(data.miningPeriod !== undefined && { mining_period: data.miningPeriod }),
        ...(data.miningSession !== undefined && { mining_session: data.miningSession }),
        ...(data.miningEndTime !== undefined && { mining_end_time: data.miningEndTime }),
        ...(data.miningStartTime !== undefined && { mining_start_time: data.miningStartTime }),
        ...(data.progress !== undefined && { progress: data.progress }),
        last_saved: Date.now()
      };
      
      // Update Supabase
      const { error } = await supabase
        .from('profiles')
        .update(dbData)
        .eq('id', userId);
      
      if (error) throw error;
      
      debugLog('useSupabaseDataManager', 'Veri başarıyla güncellendi:', dbData);
      
      // If update includes upgrades, record them
      if (data.upgrades && data.upgrades.length > 0) {
        // Process each upgrade in the array
        for (const upgrade of data.upgrades) {
          await upgradeData(
            userId, 
            upgrade.id, 
            upgrade.level || 1, 
            upgrade.rateBonus || 0
          );
        }
      }
      
    } catch (error) {
      errorLog('useSupabaseDataManager', 'Veri güncellenirken hata:', error);
      toast.error('Veri güncellenemedi, lütfen tekrar deneyin.');
    } finally {
      setIsUpdating(false);
    }
  }, [userId, upgradeData]);
  
  return { loadUserData, updateUserData, isUpdating, upgradeData };
}
