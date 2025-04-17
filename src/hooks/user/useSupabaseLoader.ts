
import { UserData } from "@/types/storage";
import { loadUserDataFromSupabase } from "@/services/userDataLoader";
import { debugLog } from "@/utils/debugUtils";
import { handleSupabaseConnectionError } from "@/utils/supabaseErrorHandler";
import { useSupabaseCacheManager } from "./useSupabaseCacheManager";

export function useSupabaseLoader() {
  const { getCachedData, setCachedData, manageCacheSize } = useSupabaseCacheManager();

  const loadSupabaseUserData = async (
    userId: string,
    timeoutMs: number = 10000
  ): Promise<{ data: UserData | null; source: 'supabase' | 'cache' | 'timeout' }> => {
    try {
      debugLog("useSupabaseLoader", "Supabase'den veriler yükleniyor...");
      
      // Check cache first
      const cachedData = getCachedData(userId);
      if (cachedData) {
        debugLog("useSupabaseLoader", "Kullanıcı verisi önbellekten yüklendi", userId);
        return { data: cachedData, source: 'cache' };
      }
      
      // Load from Supabase with timeout
      const timeoutPromise = new Promise<{ data: null; source: 'timeout' }>((resolve) => {
        setTimeout(() => {
          resolve({ data: null, source: 'timeout' });
        }, timeoutMs);
      });
      
      const supabasePromise = loadUserDataFromSupabase(userId).then(data => {
        if (data) {
          setCachedData(userId, data);
        }
        return { data, source: 'supabase' as const };
      });
      
      const result = await Promise.race([supabasePromise, timeoutPromise]);
      
      manageCacheSize(1000);
      return result;
      
    } catch (error) {
      handleSupabaseConnectionError(error, "useSupabaseLoader");
      return { data: null, source: 'timeout' };
    }
  };

  return { loadSupabaseUserData };
}
