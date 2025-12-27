'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function StandalonePlayer({ game }) {
  const { updatePlayTime } = useAuth();
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    // Start tracking when component mounts
    startTimeRef.current = Date.now();

    // Periodically update play time in background (every 1 minute)
    timerRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - startTimeRef.current) / 1000);
      
      if (elapsedSeconds >= 60) {
        updatePlayTime(60, game.slug);
        startTimeRef.current = currentTime; // Reset start time for next interval
      }
    }, 60000);

    // Update on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      const finalTime = Date.now();
      const finalElapsed = Math.floor((finalTime - startTimeRef.current) / 1000);
      if (finalElapsed > 5) { // Only save if played for more than 5 seconds
        updatePlayTime(finalElapsed, game.slug);
      }
    };
  }, [game.slug, updatePlayTime]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col overflow-hidden">
      <div className="flex-1 relative">
        <iframe
          src={game.embedUrl}
          className="absolute inset-0 w-full h-full border-0"
          title={game.title}
          allowFullScreen
          allow="autoplay; fullscreen; pointer-lock; gamepad; accelerometer; gyroscope; payment; web-share"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-modals allow-orientation-lock allow-presentation allow-top-navigation-by-user-activation"
        />
      </div>
    </div>
  );
}
