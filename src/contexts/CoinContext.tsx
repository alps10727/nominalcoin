
import React, { createContext, useState, useContext, ReactNode } from "react";

type CoinContextType = {
  balance: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
};

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export const CoinProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<number>(0);

  const addCoins = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const spendCoins = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  return (
    <CoinContext.Provider value={{ balance, addCoins, spendCoins }}>
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
