
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CreditCard, TrendingUp, Clock } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg border border-teal-500/10">
      <div className="flex items-center mb-2">
        <div className="bg-teal-500/20 p-2 rounded-lg mr-2 border border-teal-400/20">
          <CreditCard className="text-teal-300 h-4 w-4" />
        </div>
        <span className="text-gray-100 font-medium">{t('balance.title')}</span>
      </div>
      
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-white">
          {balance.toLocaleString()} <span className="text-lg font-medium text-teal-300">NC</span>
        </h1>
        <p className="text-gray-300/90 text-sm">{t('balance.subtitle')}</p>
        
        {/* Status bar */}
        <div className="w-full bg-gray-800/60 rounded-full h-1.5 my-1">
          <div 
            className="bg-gradient-to-r from-teal-600 to-emerald-500 h-full rounded-full"
            style={{ width: '45%' }}
          ></div>
        </div>
        
        {/* Statistics grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center space-x-1.5 bg-teal-900/20 px-2 py-1.5 rounded-lg border border-teal-500/20">
            <TrendingUp className="h-3 w-3 text-green-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-300/90">{t('balance.today')}</span>
              <span className="text-xs font-medium text-green-400">+0.76 NC</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1.5 bg-emerald-900/20 px-2 py-1.5 rounded-lg border border-emerald-500/20">
            <Clock className="h-3 w-3 text-gray-300" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-300/90">{t('balance.week')}</span>
              <span className="text-xs font-medium text-green-400">+3.52 NC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
