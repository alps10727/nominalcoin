
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFile, deleteFile, listUserFiles } from "@/services/storageService";
import { toast } from "sonner";

interface FileUploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
}

export function useFileUpload() {
  const [state, setState] = useState<FileUploadState>({
    uploading: false,
    progress: 0,
    error: null
  });
  const { currentUser } = useAuth();

  /**
   * Dosya yükleme fonksiyonu
   */
  const uploadUserFile = async (
    file: File,
    folder: string = 'general'
  ): Promise<string | null> => {
    if (!currentUser) {
      toast.error("Dosya yüklemek için giriş yapmalısınız");
      return null;
    }

    try {
      setState({
        uploading: true,
        progress: 0,
        error: null
      });
      
      // Sahte ilerleme göstergesi
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 200);
      
      // Dosyayı yükle
      const url = await uploadFile(file, currentUser.id, folder);
      
      clearInterval(progressInterval);
      
      setState({
        uploading: false,
        progress: 100,
        error: null
      });
      
      toast.success("Dosya başarıyla yüklendi");
      return url;
    } catch (error) {
      setState({
        uploading: false,
        progress: 0,
        error: (error as Error).message
      });
      
      toast.error("Dosya yüklenirken bir hata oluştu: " + (error as Error).message);
      return null;
    }
  };

  /**
   * Dosya silme fonksiyonu
   */
  const deleteUserFile = async (fileUrl: string): Promise<boolean> => {
    if (!currentUser) {
      toast.error("Dosya silmek için giriş yapmalısınız");
      return false;
    }

    try {
      const success = await deleteFile(fileUrl);
      
      if (success) {
        toast.success("Dosya başarıyla silindi");
      } else {
        toast.error("Dosya silinirken bir hata oluştu");
      }
      
      return success;
    } catch (error) {
      toast.error("Dosya silinirken bir hata oluştu: " + (error as Error).message);
      return false;
    }
  };

  /**
   * Kullanıcıya ait dosyaları listeleme fonksiyonu
   */
  const getUserFiles = async (folder: string = 'general'): Promise<string[]> => {
    if (!currentUser) {
      toast.error("Dosyalarınızı görüntülemek için giriş yapmalısınız");
      return [];
    }

    try {
      return await listUserFiles(currentUser.id, folder);
    } catch (error) {
      toast.error("Dosyalar listelenirken bir hata oluştu");
      return [];
    }
  };

  return {
    uploadUserFile,
    deleteUserFile,
    getUserFiles,
    uploading: state.uploading,
    progress: state.progress,
    error: state.error
  };
}
