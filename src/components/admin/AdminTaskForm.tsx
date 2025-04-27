
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

const AdminTaskForm = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: 0,
    totalRequired: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser?.is_admin) {
      toast.error('Bu işlem için yetkiniz yok');
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.from('tasks').insert({
        title: formData.title,
        description: formData.description,
        reward: formData.reward,
        total_required: formData.totalRequired,
      });

      if (error) throw error;

      toast.success('Görev başarıyla eklendi');
      setFormData({
        title: '',
        description: '',
        reward: 0,
        totalRequired: 1
      });
    } catch (error) {
      console.error('Görev eklenirken hata:', error);
      toast.error('Görev eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser?.is_admin) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-navy-800/50 rounded-lg border border-navy-700">
      <h2 className="text-lg font-semibold text-white mb-4">Yeni Görev Ekle</h2>
      
      <div>
        <Input
          placeholder="Görev başlığı"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div>
        <Textarea
          placeholder="Görev açıklaması"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            type="number"
            placeholder="Ödül miktarı"
            value={formData.reward}
            onChange={(e) => setFormData(prev => ({ ...prev, reward: Number(e.target.value) }))}
            required
            min={0}
            step={0.1}
          />
        </div>
        
        <div>
          <Input
            type="number"
            placeholder="Gereken ilerleme"
            value={formData.totalRequired}
            onChange={(e) => setFormData(prev => ({ ...prev, totalRequired: Number(e.target.value) }))}
            required
            min={1}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Ekleniyor...' : 'Görevi Ekle'}
      </Button>
    </form>
  );
};

export default AdminTaskForm;
