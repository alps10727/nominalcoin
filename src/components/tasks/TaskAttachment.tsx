
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Paperclip, X, FileText, Image } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Progress } from "@/components/ui/progress";

interface TaskAttachmentProps {
  taskId: string;
  initialAttachmentUrl?: string;
  onAttachmentChange?: (url: string | null) => void;
}

const TaskAttachment = ({ 
  taskId, 
  initialAttachmentUrl, 
  onAttachmentChange 
}: TaskAttachmentProps) => {
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>(initialAttachmentUrl);
  const { uploadUserFile, deleteUserFile, uploading, progress } = useFileUpload();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Dosya boyut kontrolü (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Dosya boyutu 10MB'dan küçük olmalıdır");
      return;
    }
    
    try {
      const url = await uploadUserFile(file, `tasks/${taskId}`);
      
      if (url) {
        setAttachmentUrl(url);
        if (onAttachmentChange) {
          onAttachmentChange(url);
        }
      }
    } catch (error) {
      console.error("Dosya yükleme hatası:", error);
    }
  };
  
  const handleRemoveAttachment = async () => {
    if (!attachmentUrl) return;
    
    try {
      const success = await deleteUserFile(attachmentUrl);
      
      if (success) {
        setAttachmentUrl(undefined);
        if (onAttachmentChange) {
          onAttachmentChange(null);
        }
      }
    } catch (error) {
      console.error("Dosya silme hatası:", error);
    }
  };
  
  const getFileIcon = (url: string) => {
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      return <Image size={16} className="mr-1" />;
    }
    return <FileText size={16} className="mr-1" />;
  };
  
  const getFileName = (url: string) => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    // URL parametrelerini kaldır
    return fileName.split('?')[0];
  };
  
  return (
    <div className="space-y-2">
      {!attachmentUrl ? (
        <>
          <Button
            variant="outline"
            size="sm"
            className="w-full relative"
            disabled={uploading}
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Paperclip className="h-4 w-4 mr-1" />
            Dosya Ekle
          </Button>
          
          {uploading && (
            <Progress value={progress} className="h-2" />
          )}
        </>
      ) : (
        <Card className="p-2 flex items-center justify-between text-sm">
          <a 
            href={attachmentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center truncate max-w-[80%] text-blue-500 hover:text-blue-700"
          >
            {getFileIcon(attachmentUrl)}
            {getFileName(attachmentUrl)}
          </a>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveAttachment}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </Card>
      )}
    </div>
  );
};

export default TaskAttachment;
