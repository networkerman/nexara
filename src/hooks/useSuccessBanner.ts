import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SuccessBannerState } from '@/types/campaign';

export function useSuccessBanner() {
  const [bannerState, setBannerState] = useState<SuccessBannerState>({
    show: false,
    campaignId: null
  });
  
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const published = searchParams.get('published');
    const campaignId = searchParams.get('campaignId');
    const channel = searchParams.get('channel');
    
    if (published === 'true') {
      setBannerState({
        show: true,
        campaignId,
        message: 'Published. Execution handed off to Adobe; metrics will sync back to Adobe. No customer data stored on Netcore.'
      });
      
      // Auto-scroll to newly published campaign after data loads
      if (campaignId) {
        setTimeout(() => {
          const campaignRow = document.getElementById(`campaign-${campaignId}`);
          if (campaignRow) {
            campaignRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
      
      // Hide banner after 10 seconds
      const timer = setTimeout(() => {
        setBannerState(prev => ({ ...prev, show: false }));
      }, 10000);
      
      // Clear URL params
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('published');
      newSearchParams.delete('campaignId');
      newSearchParams.delete('channel');
      setSearchParams(newSearchParams, { replace: true });
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams]);

  const hideBanner = () => {
    setBannerState(prev => ({ ...prev, show: false }));
  };

  return {
    bannerState,
    hideBanner
  };
}
