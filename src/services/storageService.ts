
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

const STORAGE_BUCKET = 'user_files';

/**
 * Dosya yükleme fonksiyonu
 */
export async function uploadFile(
  file: File,
  userId: string,
  folder: string = 'general'
): Promise<string | null> {
  try {
    debugLog("storageService", "Dosya yükleniyor:", file.name);
    
    // Dosya yolu oluştur
    const filePath = `${folder}/${userId}/${Date.now()}_${file.name}`;
    
    // Dosyayı yükle
    const { data, error } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error("Dosya yüklenirken bir hata oluştu.");
    }
    
    // Yükleme başarılı, dosya URL'sini al
    const { data: urlData } = supabase
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
    
    debugLog("storageService", "Dosya başarıyla yüklendi:", urlData.publicUrl);
    
    return urlData.publicUrl;
  } catch (error) {
    errorLog("storageService", "Dosya yükleme hatası:", error);
    throw error;
  }
}

/**
 * Dosya silme fonksiyonu
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    debugLog("storageService", "Dosya siliniyor:", filePath);
    
    // URL'den dosya yolunu ayıkla
    const path = filePath.split(`${STORAGE_BUCKET}/`)[1];
    
    if (!path) {
      throw new Error("Geçersiz dosya yolu");
    }
    
    // Dosyayı sil
    const { error } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .remove([path]);
    
    if (error) {
      throw error;
    }
    
    debugLog("storageService", "Dosya başarıyla silindi");
    return true;
  } catch (error) {
    errorLog("storageService", "Dosya silme hatası:", error);
    return false;
  }
}

/**
 * Kullanıcıya ait dosyaları listeleme fonksiyonu
 */
export async function listUserFiles(
  userId: string,
  folder: string = 'general'
): Promise<string[]> {
  try {
    const path = `${folder}/${userId}`;
    
    const { data, error } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .list(path);
    
    if (error) {
      throw error;
    }
    
    // Dosya URL'lerini oluştur
    const fileUrls = data.map(file => {
      const { data: urlData } = supabase
        .storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(`${path}/${file.name}`);
      
      return urlData.publicUrl;
    });
    
    return fileUrls;
  } catch (error) {
    errorLog("storageService", "Dosya listeleme hatası:", error);
    return [];
  }
}
