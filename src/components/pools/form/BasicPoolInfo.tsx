
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicPoolInfoProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  level: number;
  setLevel: (level: number) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
}

const BasicPoolInfo = ({
  name,
  setName,
  description,
  setDescription,
  level,
  setLevel,
  isPublic,
  setIsPublic
}: BasicPoolInfoProps) => {
  return (
    <>
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
    </>
  );
};

export default BasicPoolInfo;
