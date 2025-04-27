
import { useState } from "react";
import { Bell, Check, Clock, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  time: string;
  read: boolean;
}

const Notifications = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Madencilik Tamamlandı",
      message: "Başarıyla 0.5 NC kazandınız!",
      type: "success",
      time: "5 dakika önce",
      read: false
    },
    {
      id: 2,
      title: "Günlük Bonus",
      message: "Günlük bonusunuzu almayı unutmayın!",
      type: "info",
      time: "2 saat önce",
      read: false
    },
    {
      id: 3,
      title: "Yeni Görev",
      message: "Yeni bir görev mevcut: 10 madencilik yap",
      type: "warning",
      time: "1 gün önce",
      read: true
    }
  ]);

  const markAsRead = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "warning":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "info":
      default:
        return <Star className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("notifications.title") || "Bildirimler"}</h1>
        <Bell className="h-6 w-6 text-purple-400" />
      </div>

      <ScrollArea className="h-[70vh] rounded-lg border border-purple-700/20 bg-purple-900/10 backdrop-blur-sm">
        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t("notifications.empty") || "Bildirim bulunmuyor"}
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg transition-all ${
                    notification.read 
                      ? "bg-purple-900/30" 
                      : "bg-purple-800/40 border border-purple-500/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-purple-900/50">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{notification.title}</h3>
                      <p className="text-gray-300 mt-1">{notification.message}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-400">{notification.time}</span>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            Okundu olarak işaretle
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Notifications;
