
import { UserData } from "@/types/storage";
import { loadUserDataFromSupabase } from "@/services/user/userDataLoaderService";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { handleSupabaseConnectionError } from "@/utils/supabaseErrorHandler";
import { useSupabaseCacheManager } from "./useSupabaseCacheManager";
import { toast } from "sonner";

export function useSupabaseLoader() {
  const { getCachedData, setCachedData, manageCacheSize } = useSupabaseCacheManager();

  const loadSupabaseUserData = async (
    userId: string,
    timeoutMs: number = 10000
  ): Promise<{ data: UserData | null; source: 'supabase' | 'cache' | 'timeout' }> => {
    try {
      debugLog("useSupabaseLoader", "Loading data from Supabase...", userId);
      
      // Check cache first
      const cachedData = getCachedData(userId);
      if (cachedData) {
        debugLog("useSupabaseLoader", "User data loaded from cache", userId);
        return { data: cachedData, source: 'cache' };
      }
      
      // Load from Supabase with timeout
      const timeoutPromise = new Promise<{ data: null; source: 'timeout' }>((resolve) => {
        setTimeout(() => {
          errorLog("useSupabaseLoader", "Supabase data loading timed out after", timeoutMs);
          resolve({ data: null, source: 'timeout' });
        }, timeoutMs);
      });
      
      const supabasePromise = loadUserDataFromSupabase(userId).then(data => {
        if (data) {
          debugLog("useSupabaseLoader", "Successfully loaded data from Supabase:", {
            userId, 
            balance: data.balance,
            name: data.name,
            referralCode: data.referralCode
          });
          setCachedData(userId, data);
        } else {
          errorLog("useSupabaseLoader", "No data found in Supabase for user:", userId);
          toast.error("Kullanıcı verileri bulunamadı. Lütfen tekrar giriş yapın.");
        }
        return { data, source: 'supabase' as const };
      });
      
      const result = await Promise.race([supabasePromise, timeoutPromise]);
      
      manageCacheSize(1000);
      return result;
      
    } catch (error) {
      handleSupabaseConnectionError(error, "useSupabaseLoader");
      errorLog("useSupabaseLoader", "Critical error loading user data:", error);
      return { data: null, source: 'timeout' };
    }
  };

  return { loadSupabaseUserData };
}
