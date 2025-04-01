
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Diamond, Pickaxe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMiningData } from '@/hooks/useMiningData';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  const { t } = useLanguage();
  const { miningRate } = useMiningData();
  
  return (
    <div className="bg-gradient-to-br from-darkPurple-900 to-navy-900 rounded-xl p-4 shadow-lg border border-purple-500/10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl transform -translate-x-5 translate-y-5"></div>
      
      <div className="flex items-center mb-2 relative z-10">
        <div className="bg-purple-500/20 p-2 rounded-lg mr-2 border border-purple-400/20">
          <Diamond className="text-purple-300 h-4 w-4" />
        </div>
        <span className="text-gray-100 font-medium">{t('balance.title')}</span>
      </div>
      
      <div className="flex flex-col space-y-2 relative z-10">
        <h1 className="text-3xl font-bold text-white">
          {balance.toLocaleString()} <span className="text-lg font-medium text-purple-300">NC</span>
        </h1>
        <p className="text-gray-300/90 text-sm">{t('balance.subtitle')}</p>
        
        {/* Status bar with glow effect */}
        <div className="w-full bg-gray-800/60 rounded-full h-1.5 my-1 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full relative"
            style={{ width: '45%' }}
          >
            <div className="absolute inset-0 bg-white/20 blur-sm"></div>
          </div>
        </div>
        
        {/* Mining rate button that redirects to tasks */}
        <Link to="/tasks" className="block">
          <Button 
            variant="purple" 
            size="sm" 
            className="w-full flex items-center justify-center bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/20 text-purple-300 group"
          >
            <span className="flex items-center">
              <Pickaxe className="mr-1 h-3.5 w-3.5 group-hover:text-white transition-colors duration-300" />
              <span className="group-hover:text-white transition-colors duration-300">{miningRate.toFixed(2)} NC/min</span>
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BalanceCard;
