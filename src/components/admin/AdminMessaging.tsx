
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAdminActions } from "@/hooks/admin/useAdminActions";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminMessaging = () => {
  const [messageType, setMessageType] = useState<"all" | "specific">("all");
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { sendMessage } = useAdminActions();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!message.trim()) {
        toast.error("Lütfen bir mesaj yazın");
        return;
      }
      
      const recipientsList = messageType === "specific" 
        ? recipients.split(',').map(r => r.trim()).filter(r => r) 
        : [];
      
      await sendMessage({
        subject: subject.trim() || "Yönetici Bildirimi",
        message: message.trim(),
        to: messageType === "all" ? "all" : recipientsList,
        sentAt: Date.now(),
      });
      
      toast.success("Mesaj başarıyla gönderildi");
      
      // Formu temizle
      setSubject("");
      setMessage("");
      setRecipients("");
    } catch (error) {
      toast.error("Mesaj gönderilirken hata oluştu: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kullanıcılara Mesaj Gönder</CardTitle>
        <CardDescription>
          Uygulama üzerinden kullanıcılara bildirim mesajı gönderin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Alıcılar</Label>
            <RadioGroup value={messageType} onValueChange={(v: "all" | "specific") => setMessageType(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">Tüm kullanıcılar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="specific" />
                <Label htmlFor="specific">Belirli kullanıcılar</Label>
              </div>
            </RadioGroup>
            
            {messageType === "specific" && (
              <div className="pt-2">
                <Label htmlFor="recipients">
                  Alıcı E-postaları (virgülle ayırın)
                </Label>
                <Input
                  id="recipients"
                  placeholder="ornek@mail.com, diger@mail.com"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Konu</Label>
            <Input
              id="subject"
              placeholder="Mesaj konusu"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Mesaj</Label>
            <Textarea
              id="message"
              placeholder="Kullanıcılara gönderilecek mesaj..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Gönderiliyor..." : "Mesajı Gönder"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminMessaging;
