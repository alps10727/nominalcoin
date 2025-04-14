
import { useState } from "react";

export type UpdateStatus = 'idle' | 'success' | 'error' | 'offline';

export function useStatusManager() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateStatus, setLastUpdateStatus] = useState<UpdateStatus>('idle');
  
  const startUpdate = () => {
    setIsUpdating(true);
  };
  
  const finishUpdate = (status: UpdateStatus) => {
    setLastUpdateStatus(status);
    setIsUpdating(false);
  };
  
  return {
    isUpdating,
    lastUpdateStatus,
    startUpdate,
    finishUpdate
  };
}
