
import React from 'react';
import { Stars, Zap, Coins, TrendingUp, Timer, BarChart2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HeaderDecoration = () => {
  const { t } = useLanguage();
  
  return (
    <div className="w-full relative overflow-hidden mb-2">
      {/* Enhanced background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-darkPurple-900/40 via-navy-800/40 to-darkPurple-900/40 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0tMjAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTQwIDIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00WiIvPjwvZz48L2c+PC9zdmc+')] opacity-5"></div>
      
      {/* Information scrolling element */}
      <div className="relative py-3">
        <div className="animate-data-stream whitespace-nowrap flex items-center justify-start">
          {/* Info item 1 */}
          <div className="inline-flex items-center px-3 py-1 mx-2 rounded-full bg-indigo-900/30 border border-indigo-500/20 backdrop-blur-sm">
            <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
            <span className="text-[10px] text-indigo-200">BTC: 36,742 USD</span>
          </div>
          
          {/* Info item 2 */}
          <div className="inline-flex items-center px-3 py-1 mx-2 rounded-full bg-purple-900/30 border border-purple-500/20 backdrop-blur-sm">
            <Coins className="h-3 w-3 mr-1 text-amber-400" />
            <span className="text-[10px] text-indigo-200">{t('balance.mining_active')}</span>
          </div>
          
          {/* Info item 3 */}
          <div className="inline-flex items-center px-3 py-1 mx-2 rounded-full bg-navy-900/30 border border-navy-500/20 backdrop-blur-sm">
            <Timer className="h-3 w-3 mr-1 text-indigo-300" />
            <span className="text-[10px] text-indigo-200">{t('balance.bonus')}: +25%</span>
          </div>
          
          {/* Info item 4 */}
          <div className="inline-flex items-center px-3 py-1 mx-2 rounded-full bg-indigo-900/30 border border-indigo-500/20 backdrop-blur-sm">
            <BarChart2 className="h-3 w-3 mr-1 text-purple-400" />
            <span className="text-[10px] text-indigo-200">{t('balance.rate')}: 0.85 NC/h</span>
          </div>
          
          {/* Info item 5 */}
          <div className="inline-flex items-center px-3 py-1 mx-2 rounded-full bg-purple-900/30 border border-purple-500/20 backdrop-blur-sm">
            <Zap className="h-3 w-3 mr-1 text-yellow-400" />
            <span className="text-[10px] text-indigo-200">{t('balance.network')}: 8.2M</span>
          </div>
          
          {/* Info item 6 (duplicate of 1 for infinite loop effect) */}
          <div className="inline-flex items-center px-3 py-1 mx-2 rounded-full bg-indigo-900/30 border border-indigo-500/20 backdrop-blur-sm">
            <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
            <span className="text-[10px] text-indigo-200">BTC: 36,742 USD</span>
          </div>
          
          {/* Info item 7 (duplicate of 2 for infinite loop effect) */}
          <div className="inline-flex items-center px-3 py-1 mx-2 rounded-full bg-purple-900/30 border border-purple-500/20 backdrop-blur-sm">
            <Coins className="h-3 w-3 mr-1 text-amber-400" />
            <span className="text-[10px] text-indigo-200">{t('balance.mining_active')}</span>
          </div>
        </div>
      </div>
      
      {/* Status indicators */}
      <div className="absolute top-0 left-0 right-0 flex justify-between p-1 opacity-50">
        <Stars className="h-2 w-2 text-purple-400 animate-pulse-slow" />
        <Zap className="h-2 w-2 text-amber-400 animate-pulse-slow" />
        <Stars className="h-2 w-2 text-indigo-400 animate-pulse-slow" />
      </div>
      
      {/* Bottom separator with gradient */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
    </div>
  );
};

export default HeaderDecoration;
