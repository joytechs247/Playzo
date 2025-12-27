'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function GameCard({ game }) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackThumbnail = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FF6EC7;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%236EFCFF;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' font-size='24' font-family='Arial' fill='white' text-anchor='middle' dominant-baseline='middle' font-weight='bold'%3E${encodeURIComponent(game.title)}%3C/text%3E%3C/svg%3E`;

  const thumbnailUrl = !imageError && game.thumbnail ? game.thumbnail : fallbackThumbnail;

  return (
    <Link href={`/games/${game.slug}`}>
      <div className="game-card-container group cursor-pointer">
        <div className="game-card-image-wrapper overflow-hidden bg-gradient-to-br from-playzo-navy to-playzo-darker rounded-lg mb-3">
          <div className="relative w-full aspect-video transition-transform duration-300 group-hover:scale-110">
            <Image
              src={thumbnailUrl}
              alt={game.title}
              fill
              unoptimized={thumbnailUrl.startsWith('data:')}
              className="object-cover"
              onError={() => setImageError(true)}
              onLoad={() => setIsLoading(false)}
              priority={false}
              loading="lazy"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-playzo-navy via-playzo-darker to-playzo-navy animate-pulse" />
            )}
            
            {/* Hover overlay with play icon */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                <div
                  className="play-button relative w-16 h-16 bg-playzo-pink hover:bg-playzo-warm rounded-full shadow-neon-pink hover:shadow-neon-lg transition-all duration-300 flex items-center justify-center"
                >
                  <svg
                    className="w-8 h-8 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Title Only */}
        <h3 className="game-title font-headline font-bold text-lg text-white line-clamp-2 group-hover:text-playzo-pink transition-colors duration-300">
          {game.title}
        </h3>
      </div>
    </Link>
  );
}
