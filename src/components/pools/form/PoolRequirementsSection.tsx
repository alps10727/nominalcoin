
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface RequirementFieldProps {
  id: string;
  label: string;
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  value: number;
  setValue: (value: number) => void;
  placeholder: string;
}

const RequirementField = ({
  id,
  label,
  isEnabled,
  setIsEnabled,
  value,
  setValue,
  placeholder
}: RequirementFieldProps) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <Switch 
        id={id}
        checked={isEnabled}
        onCheckedChange={setIsEnabled}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
    
    {isEnabled && (
      <Input
        type="number"
        min="0"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        placeholder={placeholder}
      />
    )}
  </div>
);

interface PoolRequirementsSectionProps {
  requireMinBalance: boolean;
  setRequireMinBalance: (require: boolean) => void;
  minBalance: number;
  setMinBalance: (value: number) => void;
  requireMinDays: boolean;
  setRequireMinDays: (require: boolean) => void;
  minDays: number;
  setMinDays: (value: number) => void;
  requireMinRank: boolean;
  setRequireMinRank: (require: boolean) => void;
  minRank: number;
  setMinRank: (value: number) => void;
}

const PoolRequirementsSection = (props: PoolRequirementsSectionProps) => {
  return (
    <div className="pt-4 border-t">
      <h3 className="font-medium text-lg mb-2">Katılım Gereksinimleri</h3>
      
      <div className="space-y-4">
        <RequirementField
          id="req-balance"
          label="Minimum Bakiye Gerektir"
          isEnabled={props.requireMinBalance}
          setIsEnabled={props.setRequireMinBalance}
          value={props.minBalance}
          setValue={props.setMinBalance}
          placeholder="Minimum bakiye miktarı"
        />
        
        <RequirementField
          id="req-days"
          label="Minimum Madencilik Günü Gerektir"
          isEnabled={props.requireMinDays}
          setIsEnabled={props.setRequireMinDays}
          value={props.minDays}
          setValue={props.setMinDays}
          placeholder="Minimum madencilik günü"
        />
        
        <RequirementField
          id="req-rank"
          label="Minimum Seviye Gerektir"
          isEnabled={props.requireMinRank}
          setIsEnabled={props.setRequireMinRank}
          value={props.minRank}
          setValue={props.setMinRank}
          placeholder="Minimum kullanıcı seviyesi"
        />
      </div>
    </div>
  );
};

export default PoolRequirementsSection;
