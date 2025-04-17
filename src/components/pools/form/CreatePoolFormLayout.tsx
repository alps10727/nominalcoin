
import React from 'react';
import { Button } from "@/components/ui/button";
import { PoolFormData } from "@/services/pools/poolCreator";

interface CreatePoolFormLayoutProps {
  children: React.ReactNode;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const CreatePoolFormLayout = ({ children, loading, onSubmit }: CreatePoolFormLayoutProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {children}
      
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Oluşturuluyor..." : "Havuz Oluştur"}
      </Button>
    </form>
  );
};

export default CreatePoolFormLayout;
