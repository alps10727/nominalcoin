
import React from 'react';
import { TrendingUp, Coins, Timer, BarChart2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HeaderDecoration = () => {
  const { t } = useLanguage();
  
  return (
    <div className="w-full relative mb-2 bg-gradient-to-r from-darkPurple-900/90 via-navy-800/90 to-darkPurple-900/90 border-b border-purple-500/20">
      <div className="py-3">
        <div className="whitespace-nowrap flex items-center justify-between px-2">
          {/* Info item 1 */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/20">
            <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
            <span className="text-[10px] text-indigo-200">BTC: 36,742 USD</span>
          </div>
          
          {/* Info item 2 */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/20">
            <Coins className="h-3 w-3 mr-1 text-amber-400" />
            <span className="text-[10px] text-indigo-200">{t('balance.mining_active')}</span>
          </div>
          
          {/* Info item 3 */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-navy-900/30 border border-navy-500/20">
            <Timer className="h-3 w-3 mr-1 text-indigo-300" />
            <span className="text-[10px] text-indigo-200">{t('balance.bonus')}: +25%</span>
          </div>
          
          {/* Info item 4 */}
          <div className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/20">
            <BarChart2 className="h-3 w-3 mr-1 text-purple-400" />
            <span className="text-[10px] text-indigo-200">{t('balance.rate')}: 0.85 NC/h</span>
          </div>
        </div>
      </div>
      
      {/* Bottom separator with gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
    </div>
  );
};

export default HeaderDecoration;
