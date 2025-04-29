
import React, { useEffect } from 'react';
import { useAdMob } from '@/hooks/useAdMob';
import { debugLog } from '@/utils/debugUtils';

interface BannerAdContainerProps {
  className?: string;
}

const BannerAdContainer: React.FC<BannerAdContainerProps> = ({ className = '' }) => {
  const { showBannerAd, hideBannerAd, isLoading, pluginAvailable } = useAdMob();
  
  useEffect(() => {
    if (pluginAvailable) {
      debugLog('BannerAdContainer', 'Showing banner ad');
      showBannerAd();
    }
    
    return () => {
      if (pluginAvailable) {
        debugLog('BannerAdContainer', 'Hiding banner ad');
        hideBannerAd();
      }
    };
  }, [showBannerAd, hideBannerAd, pluginAvailable]);

  // In web preview or when plugin isn't available, show a placeholder
  if (!pluginAvailable) {
    return (
      <div className={`w-full h-[50px] bg-indigo-900/30 border border-indigo-800 rounded-md flex items-center justify-center text-xs text-gray-400 my-4 ${className}`}>
        Banner Reklam Alanı
        <span className="ml-2 px-1.5 py-0.5 bg-purple-900/50 rounded text-[10px]">Test</span>
      </div>
    );
  }
  
  // When on mobile with the plugin available, this div serves as spacing
  // The actual ad will be shown by the native SDK
  return (
    <div className={`h-[50px] my-4 ${className}`} id="banner-ad-container">
      {isLoading && (
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse flex space-x-1">
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerAdContainer;
