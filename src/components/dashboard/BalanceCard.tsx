
import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Diamond, TrendingUp, ArrowUpRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  const { t } = useLanguage();
  const previousBalance = useRef(balance);
  
  // Show notification when balance changes significantly
  useEffect(() => {
    if (previousBalance.current !== 0 && balance > previousBalance.current) {
      toast.success(`Bakiye güncellendi: +${(balance - previousBalance.current).toFixed(2)} NC`, {
        style: { background: "#4338ca", color: "white", border: "1px solid #3730a3" },
        icon: '💰'
      });
    }
    previousBalance.current = balance;
  }, [balance]);
  
  // Format the balance with commas
  const formattedBalance = balance.toLocaleString();
  
  return (
    <div className="fc-card relative overflow-hidden group hover-lift transition-all duration-500">
      {/* Background elements */}
      <div className="absolute inset-0 fc-nebula opacity-60"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-600/5 rounded-full blur-2xl"></div>
      
      {/* Constellation background pattern */}
      <div className="absolute inset-0 bg-galaxy opacity-5"></div>
      
      {/* Content */}
      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="fc-icon-container">
              <Diamond className="text-purple-300 h-4 w-4" />
            </div>
            <span className="text-lg font-medium fc-gradient-text">NC Balance</span>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-purple-300/80 bg-purple-950/60 py-1 px-2 rounded-lg border border-purple-700/30">
            <TrendingUp className="h-3 w-3" />
            <span>+2.4%</span>
          </div>
        </div>
        
        {/* Balance display */}
        <div className="flex flex-col space-y-1 my-3">
          <h1 className="text-5xl font-bold text-white fc-glow-text tracking-tight">
            {formattedBalance} <span className="text-lg font-medium text-purple-300">NC</span>
          </h1>
          <p className="text-purple-300/80 text-sm">Earned NOMINAL Coin</p>
        </div>
        
        {/* Animated status bar */}
        <div className="fc-status-bar my-4">
          <div 
            className="fc-status-progress animate-pulse-slow"
            style={{ width: '45%' }}
          ></div>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-darkPurple-800/40 rounded-lg p-2 border border-purple-700/20">
            <div className="text-xs text-purple-300/70">Daily Mined</div>
            <div className="text-sm font-semibold text-white">+173.5 NC</div>
          </div>
          <div className="bg-darkPurple-800/40 rounded-lg p-2 border border-purple-700/20">
            <div className="text-xs text-purple-300/70">Current Value</div>
            <div className="text-sm font-semibold text-white">$215.38</div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <Button variant="ghost" size="sm" className="flex-1 bg-purple-900/50 border border-purple-700/30 hover:bg-purple-800/60">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            Transfer
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 bg-darkPurple-900/50 border border-purple-700/30 hover:bg-darkPurple-800/60">
            <AlertCircle className="h-4 w-4 mr-1" />
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
