
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Diamond, TrendingUp, Clock, Award } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <div className="relative bg-gradient-to-br from-darkPurple-900/90 to-navy-900/90 rounded-xl p-4 shadow-lg border border-purple-800/30 overflow-hidden backdrop-blur-lg">
      {/* Cosmic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-40 h-40 -top-20 -right-20 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute w-40 h-40 -bottom-20 -left-20 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-indigo-900/10"></div>
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0tMjAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTQwIDIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00WiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      
      {/* Animated particles */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 bg-purple-300/20 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float-data ${2 + i}s ease-out infinite`,
            animationDelay: `${i * 0.3}s`
          }}
        />
      ))}
      
      <div className="flex items-center mb-2 relative z-10">
        <div className="bg-indigo-900/30 p-1.5 rounded-lg mr-2 border border-indigo-500/20">
          <Diamond className="text-indigo-300 h-4 w-4" />
        </div>
        <span className="text-indigo-100 font-medium">{t('balance.title')}</span>
      </div>
      
      <div className="flex flex-col space-y-2 relative z-10">
        <h1 className="text-3xl font-bold text-white">
          {balance.toLocaleString()} <span className="text-lg font-medium text-indigo-300">NC</span>
        </h1>
        <p className="text-indigo-200/90 text-sm">{t('balance.subtitle')}</p>
        
        {/* Status bar */}
        <div className="w-full bg-darkPurple-800/60 rounded-full h-1.5 my-1 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-600 to-purple-500 h-full rounded-full"
            style={{ width: '45%' }}
          ></div>
        </div>
        
        {/* Enhanced statistics grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center space-x-1.5 bg-indigo-900/20 px-2 py-1.5 rounded-lg border border-indigo-500/20">
            <TrendingUp className="h-3 w-3 text-green-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-indigo-300/90">{t('balance.today')}</span>
              <span className="text-xs font-medium text-green-400">+0.76 NC</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1.5 bg-purple-900/20 px-2 py-1.5 rounded-lg border border-purple-500/20">
            <Clock className="h-3 w-3 text-indigo-300" />
            <div className="flex flex-col">
              <span className="text-[10px] text-indigo-300/90">{t('balance.week')}</span>
              <span className="text-xs font-medium text-green-400">+3.52 NC</span>
            </div>
          </div>
          
          {/* Additional stats visible on mobile for better gap-filling */}
          {isMobile && (
            <>
              <div className="flex items-center space-x-1.5 bg-navy-900/20 px-2 py-1.5 rounded-lg border border-navy-500/20">
                <Award className="h-3 w-3 text-amber-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-indigo-300/90">{t('balance.bonus')}</span>
                  <span className="text-xs font-medium text-amber-400">+25%</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1.5 bg-darkPurple-900/20 px-2 py-1.5 rounded-lg border border-darkPurple-500/20">
                <Diamond className="h-3 w-3 text-purple-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-indigo-300/90">{t('balance.level')}</span>
                  <span className="text-xs font-medium text-purple-400">Pro</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
