
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "./LanguageContext";

type CoinContextType = {
  balance: number;
  addCoins: (amount: number) => void;
  subtractCoins: (amount: number) => boolean;
};

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export const CoinProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useLanguage();
  const [balance, setBalance] = useState<number>(() => {
    // Try to get balance from localStorage
    const savedBalance = localStorage.getItem("futureCoinBalance");
    return savedBalance ? parseFloat(savedBalance) : 0;
  });

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("futureCoinBalance", balance.toString());
  }, [balance]);

  const addCoins = (amount: number) => {
    if (amount <= 0) return;
    
    setBalance(prev => {
      const newBalance = prev + amount;
      return parseFloat(newBalance.toFixed(2));
    });
  };

  const subtractCoins = (amount: number) => {
    if (amount <= 0) return true;
    
    if (balance >= amount) {
      setBalance(prev => {
        const newBalance = prev - amount;
        return parseFloat(newBalance.toFixed(2));
      });
      return true;
    } else {
      toast({
        title: t('balance.insufficient'),
        description: t('balance.insufficientDesc'),
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <CoinContext.Provider value={{ balance, addCoins, subtractCoins }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoinContext = () => {
  const context = useContext(CoinContext);
  if (context === undefined) {
    throw new Error("useCoinContext must be used within a CoinProvider");
  }
  return context;
};
