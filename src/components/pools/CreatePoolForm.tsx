import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CreatePoolFormProps {
  onSuccess?: (poolId: string) => void;
}

const CreatePoolForm = ({ onSuccess }: CreatePoolFormProps) => {
  const [loading, setLoading] = useState(false);
  
  // Form values
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<number>(1);
  const [isPublic, setIsPublic] = useState(true);
  
  // Requirements
  const [requireMinBalance, setRequireMinBalance] = useState(false);
  const [minBalance, setMinBalance] = useState<number>(0);
  const [requireMinDays, setRequireMinDays] = useState(false);
  const [minDays, setMinDays] = useState<number>(0);
  const [requireMinRank, setRequireMinRank] = useState(false);
  const [minRank, setMinRank] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Havuz ismi zorunludur");
      return;
    }
    
    setLoading(true);
    
    try {
      // Create pool object
      const poolData = {
        name: name.trim(),
        description: description.trim(),
        level: Number(level),
        isPublic,
        requirements: {
          minBalance: requireMinBalance ? Number(minBalance) : undefined,
          minDays: requireMinDays ? Number(minDays) : undefined,
          minRank: requireMinRank ? Number(minRank) : undefined
        }
      };
      
      // Generate a mock pool ID
      const poolId = `${poolData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-6)}`;
      
      setTimeout(() => {
        setLoading(false);
        toast.success("Havuz başarıyla oluşturuldu!");
        if (onSuccess) {
          onSuccess(poolId);
        }
      }, 1000);
    } catch (error) {
      toast.error("Havuz oluşturulamadı: " + (error as Error).message);
      console.error("Pool creation error:", error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Havuz İsmi</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Havuz ismi"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Havuza katılımcılar için açıklama (opsiyonel)"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="level">Havuz Seviyesi</Label>
        <Select 
          value={String(level)} 
          onValueChange={(val) => setLevel(Number(val))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seviye seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Seviye 1 (100 üye)</SelectItem>
            <SelectItem value="2">Seviye 2 (250 üye)</SelectItem>
            <SelectItem value="3">Seviye 3 (500 üye)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="public"
          checked={isPublic}
          onCheckedChange={setIsPublic}
        />
        <Label htmlFor="public">Herkese Açık</Label>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="font-medium text-lg mb-2">Katılım Gereksinimleri</h3>
        
        <div className="space-y-4">
          {/* Minimum Balance Requirement */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="req-balance"
                checked={requireMinBalance}
                onCheckedChange={setRequireMinBalance}
              />
              <Label htmlFor="req-balance">Minimum Bakiye Gerektir</Label>
            </div>
            
            {requireMinBalance && (
              <Input
                type="number"
                min="0"
                value={minBalance}
                onChange={(e) => setMinBalance(Number(e.target.value))}
                placeholder="Minimum bakiye miktarı"
              />
            )}
          </div>
          
          {/* Minimum Mining Days Requirement */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="req-days"
                checked={requireMinDays}
                onCheckedChange={setRequireMinDays}
              />
              <Label htmlFor="req-days">Minimum Madencilik Günü Gerektir</Label>
            </div>
            
            {requireMinDays && (
              <Input
                type="number"
                min="0"
                value={minDays}
                onChange={(e) => setMinDays(Number(e.target.value))}
                placeholder="Minimum madencilik günü"
              />
            )}
          </div>
          
          {/* Minimum Rank Requirement */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="req-rank"
                checked={requireMinRank}
                onCheckedChange={setRequireMinRank}
              />
              <Label htmlFor="req-rank">Minimum Seviye Gerektir</Label>
            </div>
            
            {requireMinRank && (
              <Input
                type="number"
                min="0"
                value={minRank}
                onChange={(e) => setMinRank(Number(e.target.value))}
                placeholder="Minimum kullanıcı seviyesi"
              />
            )}
          </div>
        </div>
      </div>
      
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Oluşturuluyor..." : "Havuz Oluştur"}
      </Button>
    </form>
  );
};

export default CreatePoolForm;
