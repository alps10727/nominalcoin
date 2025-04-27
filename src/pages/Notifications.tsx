
import { useEffect, useState } from "react";
import { Bell, Check, Clock, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
  created_at: string;
  read: boolean;
}

const Notifications = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    }
  }, [currentUser]);

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error);
      toast.error('Bildirimler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Bildirim güncellenirken hata:', error);
      toast.error('Bildirim güncellenemedi');
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('tr', { numeric: 'auto' })
      .format(Math.ceil((date.getTime() - Date.now()) / (1000 * 60)), 'minute')
      .replace('-', '');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-400">Yükleniyor...</div>
      </div>
    );
  }

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
                          <span className="text-xs text-gray-400">{formatDate(notification.created_at)}</span>
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
