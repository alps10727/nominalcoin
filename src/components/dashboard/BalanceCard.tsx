
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Diamond } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg border border-purple-500/10">
      <div className="flex items-center mb-2">
        <div className="bg-purple-500/20 p-2 rounded-lg mr-2 border border-purple-400/20">
          <Diamond className="text-purple-300 h-4 w-4" />
        </div>
        <span className="text-gray-100 font-medium">{t('balance.title')}</span>
      </div>
      
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-white">
          {balance.toLocaleString()} <span className="text-lg font-medium text-purple-300">NC</span>
        </h1>
        <p className="text-gray-300/90 text-sm">{t('balance.subtitle')}</p>
        
        {/* Status bar */}
        <div className="w-full bg-gray-800/60 rounded-full h-1.5 my-1">
          <div 
            className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full"
            style={{ width: '45%' }}
          ></div>
        </div>
        
        {/* The statistics grid has been removed as requested */}
        <div className="h-6"></div> {/* Empty space to maintain the card height */}
      </div>
    </div>
  );
};

export default BalanceCard;
