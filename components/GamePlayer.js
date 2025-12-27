'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthProvider';

export default function GamePlayer({ game }) {
  const { incrementGamesPlayed, updatePlayTime } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [playTimeSeconds, setPlayTimeSeconds] = useState(0);
  const iframeRef = useRef(null);

  // Auto-clear loading state after timeout
  useEffect(() => {
    let timeout;
    if (isLoading) {
      timeout = setTimeout(() => {
        setIsLoading(false);
        setLoadError(true);
      }, 15000); // 15 seconds timeout
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Track playtime
  useEffect(() => {
    let interval;
    if (isPlaying && !isLoading) {
      interval = setInterval(() => {
        setPlayTimeSeconds(prev => prev + 30);
        updatePlayTime(30, game.slug);
      }, 30000); // Track every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isLoading, game.slug, updatePlayTime]);

  const fallbackThumbnail = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FF6EC7;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%236EFCFF;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' font-size='24' font-family='Arial' fill='white' text-anchor='middle' dominant-baseline='middle' font-weight='bold'%3E${encodeURIComponent(game.title)}%3C/text%3E%3C/svg%3E`;

  const thumbnailUrl = !imageError && game.thumbnail ? game.thumbnail : fallbackThumbnail;

  const handlePlayClick = () => {
    setIsPlaying(true);
    setIsLoading(true);
    setLoadError(false);
    incrementGamesPlayed(game.slug, game.categories);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleOpenFullscreen = () => {
    window.open(`/play/${game.slug}`, '_blank', 'noopener,noreferrer');
  };

  const handleOpenInNewTab = () => {
    window.open(game.embedUrl, '_blank', 'noopener,noreferrer');
  };

  if (!game.embedUrl) {
    return (
      <div className="game-player-error w-full bg-playzo-darker rounded-lg p-8 text-center border-2 border-playzo-cyan/30">
        <svg className="w-16 h-16 mx-auto mb-4 text-playzo-pink/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-playzo-cyan mb-4">Game embed not available</p>
        <button
          onClick={handleOpenInNewTab}
          className="btn-open-external px-6 py-2 bg-playzo-pink hover:bg-playzo-warm text-white font-bold rounded-lg transition-colors"
        >
          Open Game in New Tab
        </button>
      </div>
    );
  }

  return (
    <div className="game-player-wrapper space-y-4">
      {/* Standalone/Fullscreen Button above the game */}
      <div className="flex justify-end">
        <button
          onClick={handleOpenFullscreen}
          className="px-4 py-2 bg-playzo-darker border border-playzo-pink text-playzo-pink hover:bg-playzo-pink hover:text-white rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-bold shadow-neon"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open Standalone Mode
        </button>
      </div>

      {!isPlaying ? (
        <div className="game-player-overlay relative w-full bg-gradient-to-br from-playzo-navy to-playzo-darker rounded-lg overflow-hidden">
          {/* Thumbnail or Fallback */}
          <div className="relative w-full bg-playzo-darker" style={{ paddingBottom: '75%' }}>
            <img
              src={thumbnailUrl}
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-playzo-pink/20 to-playzo-cyan/20" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayClick}
                className="play-button relative group"
                aria-label={`Play ${game.title}`}
              >
                {/* Outer glow ring */}
                <div className="absolute inset-0 bg-playzo-pink rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Main button */}
                <div className="relative w-20 h-20 bg-playzo-pink hover:bg-playzo-warm rounded-full shadow-neon-pink hover:shadow-neon-lg transition-all duration-300 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Instructions hint */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white text-sm font-semibold backdrop-blur-sm bg-black/50 py-2 px-3 rounded-lg">
                Click to Play
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="game-player-iframe-container relative w-full bg-black rounded-lg overflow-hidden">
          {/* Loading skeleton */}
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-playzo-navy via-playzo-darker to-playzo-navy animate-pulse z-10" />
          )}

          {/* Iframe */}
          <div
            className="relative w-full"
            style={{
              paddingBottom: `${(game.height / game.width) * 100}%`,
            }}
          >
            <iframe
              ref={iframeRef}
              src={game.embedUrl}
              className="absolute inset-0 w-full h-full border-0 rounded-lg shadow-2xl"
              title={game.title}
              allowFullScreen
              allow="autoplay; fullscreen; pointer-lock; gamepad; accelerometer; gyroscope; payment; web-share"
              loading="lazy"
              onLoad={handleIframeLoad}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-modals allow-orientation-lock allow-presentation allow-top-navigation-by-user-activation"
              style={{
                display: isLoading ? 'none' : 'block',
              }}
            />
          </div>

          {/* Fallback/Error message if iframe fails or takes too long */}
          {(loadError || (!isLoading && isPlaying)) && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg z-20 pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-center p-6 bg-playzo-darker rounded-xl border border-playzo-cyan/30 shadow-neon-lg max-w-xs">
                <p className="text-playzo-cyan mb-4 font-bold">Having trouble loading?</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setIsLoading(true); setLoadError(false); }}
                    className="px-4 py-2 bg-playzo-pink hover:bg-playzo-warm text-white rounded-lg text-sm font-bold transition-all pointer-events-auto"
                  >
                    Retry Loading
                  </button>
                  <button
                    onClick={handleOpenInNewTab}
                    className="px-4 py-2 bg-playzo-darker border border-playzo-cyan text-playzo-cyan hover:bg-playzo-cyan hover:text-playzo-navy rounded-lg text-sm font-bold transition-all pointer-events-auto"
                  >
                    Open in New Tab
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Controls below player */}
      <div className="game-player-controls flex gap-2">
        {isPlaying && (
          <button
            onClick={() => setIsPlaying(false)}
            className="px-4 py-2 bg-playzo-dark/50 hover:bg-playzo-darker border border-playzo-cyan/30 text-playzo-cyan rounded-lg transition-colors"
          >
            Close Game
          </button>
        )}
        <button
          onClick={handleOpenFullscreen}
          className="px-4 py-2 bg-playzo-pink hover:bg-playzo-warm text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span>Open in Fullscreen</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>
    </div>
  );
}
