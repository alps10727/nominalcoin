
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  channel_id: string;
}

interface ReferralUser {
  id: string;
  name?: string;
  email?: string;
}

const ReferralChat = () => {
  const { currentUser, userData } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadReferrals = async () => {
      if (!currentUser || !userData) return;

      const referralIds = [...(userData.referrals || [])];
      if (userData.invitedBy) {
        referralIds.push(userData.invitedBy);
      }

      if (referralIds.length === 0) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email")
        .in("id", referralIds);

      if (error) {
        toast.error("Referanslar yüklenirken bir hata oluştu");
        return;
      }

      setReferrals(data || []);
      if (data && data.length > 0) {
        setSelectedReferral(data[0].id);
      }
    };

    loadReferrals();
  }, [currentUser, userData]);

  useEffect(() => {
    if (!selectedReferral) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("channel_type", "referral")
        .eq("channel_id", selectedReferral)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Mesajlar yüklenirken bir hata oluştu");
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`referral_messages_${selectedReferral}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `channel_type=eq.referral,channel_id=eq.${selectedReferral}`,
        },
        (payload: any) => {
          if (payload.new) {
            setMessages((current) => [...current, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedReferral]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !selectedReferral) {
      toast.error("Mesaj göndermek için giriş yapmalısınız");
      return;
    }

    if (!newMessage.trim()) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.from("messages").insert({
        content: newMessage,
        sender_id: currentUser.id,
        channel_type: "referral",
        channel_id: selectedReferral,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      });

      if (error) throw error;

      setNewMessage("");
    } catch (error) {
      toast.error("Mesaj gönderilirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  if (referrals.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">
          Henüz referans bağlantınız bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="mb-4">
        <Select
          value={selectedReferral || undefined}
          onValueChange={(value) => setSelectedReferral(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Referans seçin" />
          </SelectTrigger>
          <SelectContent>
            {referrals.map((referral) => (
              <SelectItem key={referral.id} value={referral.id}>
                {referral.name || referral.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === currentUser?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] break-words ${
                message.sender_id === currentUser?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
          className="resize-none"
          rows={1}
        />
        <Button type="submit" disabled={isLoading || !newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ReferralChat;
