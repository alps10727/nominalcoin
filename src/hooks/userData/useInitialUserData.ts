
import { useState } from "react";
import { UserData, loadUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

export function useInitialUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'firebase' | 'cache' | 'local' | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [lastLoadedUserId, setLastLoadedUserId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(!!loadUserData());

  return {
    userData,
    setUserData,
    loading,
    setLoading,
    dataSource,
    setDataSource,
    errorOccurred,
    setErrorOccurred,
    loadAttempt,
    setLoadAttempt,
    lastLoadedUserId,
    setLastLoadedUserId,
    isInitialized,
    setIsInitialized
  };
}
