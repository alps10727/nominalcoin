
import React, { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { usePoolSystem } from "@/hooks/usePoolSystem";
import { usePoolFormState } from "@/hooks/usePoolFormState";
import { toast } from "sonner";
import CreatePoolFormLayout from "./form/CreatePoolFormLayout";
import BasicPoolInfo from "./form/BasicPoolInfo";
import PoolRequirementsSection from "./form/PoolRequirementsSection";

interface CreatePoolFormProps {
  onSuccess?: (poolId: string) => void;
}

const CreatePoolForm = ({ onSuccess }: CreatePoolFormProps) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { createPool } = usePoolSystem();
  const formState = usePoolFormState();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("Havuz oluşturmak için giriş yapmalısınız");
      return;
    }
    
    if (!formState.name.trim()) {
      toast.error("Havuz ismi zorunludur");
      return;
    }
    
    setLoading(true);
    
    try {
      // Get form data from state
      const poolData = formState.buildPoolFormData();
      
      const poolId = await createPool(poolData);
      
      if (poolId) {
        toast.success("Havuz başarıyla oluşturuldu!");
        if (onSuccess) {
          onSuccess(poolId);
        }
      } else {
        toast.error("Havuz oluşturulurken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Havuz oluşturulamadı: " + (error as Error).message);
      console.error("Pool creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreatePoolFormLayout loading={loading} onSubmit={handleSubmit}>
      <BasicPoolInfo
        name={formState.name}
        setName={formState.setName}
        description={formState.description}
        setDescription={formState.setDescription}
        level={formState.level}
        setLevel={formState.setLevel}
        isPublic={formState.isPublic}
        setIsPublic={formState.setIsPublic}
      />
      
      <PoolRequirementsSection
        requireMinBalance={formState.requireMinBalance}
        setRequireMinBalance={formState.setRequireMinBalance}
        minBalance={formState.minBalance}
        setMinBalance={formState.setMinBalance}
        requireMinDays={formState.requireMinDays}
        setRequireMinDays={formState.setRequireMinDays}
        minDays={formState.minDays}
        setMinDays={formState.setMinDays}
        requireMinRank={formState.requireMinRank}
        setRequireMinRank={formState.setRequireMinRank}
        minRank={formState.minRank}
        setMinRank={formState.setMinRank}
      />
    </CreatePoolFormLayout>
  );
};

export default CreatePoolForm;
