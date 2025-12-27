'use client';

import { useEffect } from 'react';

export default function AdSlot({ slotId, format = 'responsive', style = {} }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (error) {
        console.warn('AdSense error:', error);
      }
    }
  }, [slotId]);

  // Only render if AdSense client ID is configured
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT) {
    return null;
  }

  const adStyle = {
    display: 'block',
    ...style,
  };

  return (
    <div className="ad-slot-wrapper my-4">
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
