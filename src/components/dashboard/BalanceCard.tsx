
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Diamond } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-purple-900/80 rounded-xl p-4 shadow-lg border border-purple-700/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl transform -translate-x-5 translate-y-5"></div>
      
      <div className="flex items-center mb-3 relative z-10">
        <div className="p-1.5 mr-2">
          <Diamond className="text-purple-300 h-5 w-5" />
        </div>
        <span className="text-purple-300 font-medium text-lg">Your FC Balance</span>
      </div>
      
      <div className="flex flex-col space-y-2 relative z-10">
        <h1 className="text-5xl font-bold text-white">
          {balance.toLocaleString()} <span className="text-lg font-medium text-purple-300">FC</span>
        </h1>
        <p className="text-purple-300/80 text-sm">Total earned Future Coin</p>
        
        {/* Status bar with glow effect */}
        <div className="w-full bg-purple-800/60 rounded-full h-1.5 my-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full relative"
            style={{ width: '45%' }}
          >
            <div className="absolute inset-0 bg-white/20 blur-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
