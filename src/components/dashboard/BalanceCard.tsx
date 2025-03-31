
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Diamond } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="relative bg-gradient-to-br from-darkPurple-900/80 to-navy-900/80 rounded-xl p-4 shadow-lg border border-purple-800/20 overflow-hidden backdrop-blur-lg">
      {/* Cosmic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-40 h-40 -top-20 -right-20 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute w-40 h-40 -bottom-20 -left-20 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0tMjAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTQwIDIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00WiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      
      {/* Floating particles */}
      {Array.from({ length: 3 }).map((_, i) => (
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
        <Diamond className="text-indigo-400 h-5 w-5 mr-2" />
        <span className="text-indigo-100 font-medium">{t('balance.title')}</span>
      </div>
      
      <div className="flex flex-col space-y-2 relative z-10">
        <h1 className="text-3xl font-bold text-white">
          {balance.toLocaleString()} <span className="text-lg font-medium text-indigo-300">NC</span>
        </h1>
        <p className="text-indigo-200/90 text-sm">{t('balance.subtitle')}</p>
        
        {/* Progress bar to show account status */}
        <div className="w-full bg-darkPurple-800/50 rounded-full h-1.5 mt-2 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-500 h-full rounded-full w-1/3"></div>
        </div>
        
        {/* Stats with enhanced styling */}
        <div className="flex justify-between text-xs pt-1">
          <div className="text-indigo-300/80 px-2 py-0.5 rounded-full bg-indigo-900/20 backdrop-blur-sm">
            {t('balance.today')}: <span className="text-green-400">+0.76 NC</span>
          </div>
          <div className="text-indigo-300/80 px-2 py-0.5 rounded-full bg-indigo-900/20 backdrop-blur-sm">
            {t('balance.week')}: <span className="text-green-400">+3.52 NC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
