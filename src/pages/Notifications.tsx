
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
    <div className="min-h-screen flex items-start justify-center pt-4">
      <div className="w-full max-w-lg px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">{t("notifications.title") || "Bildirimler"}</h1>
          <Bell className="h-5 w-5 text-purple-400" />
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)] rounded-lg border border-purple-700/20 bg-purple-900/5 backdrop-blur-sm">
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm">
                {t("notifications.empty") || "Bildirim bulunmuyor"}
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg transition-all ${
                      notification.read 
                        ? "bg-purple-900/20" 
                        : "bg-purple-800/30 border border-purple-500/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-full bg-purple-900/40">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-base">{notification.title}</h3>
                        <p className="text-gray-300 text-sm mt-0.5">{notification.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">{notification.time}</span>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-purple-400 hover:text-purple-300 text-xs py-1 h-7"
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
    </div>
  );
};

export default Notifications;
