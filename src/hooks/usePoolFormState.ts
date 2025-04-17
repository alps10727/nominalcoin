
import { useState } from "react";
import { PoolFormData } from "@/services/pools/poolCreator";

export function usePoolFormState() {
  // Basic form values
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
  
  // Build form data object from state
  const buildPoolFormData = (): PoolFormData => ({
    name: name.trim(),
    description: description.trim(),
    level: Number(level),
    isPublic,
    requirements: {
      minBalance: requireMinBalance ? Number(minBalance) : undefined,
      minDays: requireMinDays ? Number(minDays) : undefined,
      minRank: requireMinRank ? Number(minRank) : undefined
    }
  });
  
  return {
    // Basic info state
    name, setName,
    description, setDescription,
    level, setLevel,
    isPublic, setIsPublic,
    
    // Requirements state
    requireMinBalance, setRequireMinBalance,
    minBalance, setMinBalance,
    requireMinDays, setRequireMinDays,
    minDays, setMinDays,
    requireMinRank, setRequireMinRank,
    minRank, setMinRank,
    
    // Form data builder
    buildPoolFormData
  };
}
