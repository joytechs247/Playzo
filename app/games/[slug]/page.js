import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGameBySlug, getAllGames, getRelatedGames } from '@/lib/fetchGames';
import GamePlayer from '@/components/GamePlayer';
import GameCard from '@/components/GameCard';
import AdSlot from '@/components/AdSlot';

export const revalidate = 3600; // ISR

// Generate static params for known game slugs
export async function generateStaticParams() {
  const games = await getAllGames();
  return games.map((game) => ({
    slug: game.slug,
  }));
}

// Dynamic metadata for each game page
export async function generateMetadata({ params }) {
  const game = await getGameBySlug(params.slug);

  if (!game) {
    return {
      title: 'Game Not Found',
      description: 'The game you are looking for does not exist.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://playzo.vercel.app';
  const gameUrl = `${baseUrl}/games/${game.slug}`;
  const ogImage = game.thumbnail || `${baseUrl}/og-default.png`;

  return {
    title: `${game.title} — Play on Playzo`,
    description: game.description.substring(0, 160),
    keywords: [...game.categories, 'browser game', 'free game', 'online game'].join(', '),
    openGraph: {
      type: 'website',
      url: gameUrl,
      title: game.title,
      description: game.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: game.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: game.title,
      description: game.description.substring(0, 160),
      images: [ogImage],
    },
    alternates: {
      canonical: gameUrl,
    },
  };
}

async function generateJsonLd(game) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://playzo.vercel.app';
  const gameUrl = `${baseUrl}/games/${game.slug}`;
  const ogImage = game.thumbnail || `${baseUrl}/og-default.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description,
    url: gameUrl,
    image: ogImage,
    author: {
      '@type': 'Organization',
      name: game.publisher || 'Unknown Publisher',
    },
    applicationCategory: 'Game',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: game.rating ? {
      '@type': 'AggregateRating',
      ratingValue: game.rating,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
  };
}

export default async function GameDetailPage({ params }) {
  const game = await getGameBySlug(params.slug);

  if (!game) {
    notFound();
  }

  const [relatedGames, jsonLd] = await Promise.all([
    getRelatedGames(game.slug),
    generateJsonLd(game),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="breadcrumb bg-playzo-dark/50 py-3 border-b border-playzo-cyan/20">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-playzo-cyan/70">
            <Link href="/" className="hover:text-playzo-pink transition-colors">Home</Link>
            <span>/</span>
            <Link href="/games" className="hover:text-playzo-pink transition-colors">Games</Link>
            <span>/</span>
            <span className="text-playzo-pink">{game.title}</span>
          </div>
        </div>
      </div>

      {/* Game Header */}
      <div className="game-header bg-gradient-to-b from-playzo-dark to-playzo-darker/50 py-12">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Thumbnail */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="rounded-lg overflow-hidden card-base">
                <div className="w-full bg-playzo-darker/50 relative" style={{ paddingBottom: '75%' }}>
                  {game.thumbnail && (
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="space-y-6">
                {/* Title and Rating */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-headline font-black text-white mb-4">
                    {game.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    {/* Rating */}
                    {game.rating && (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-playzo-warm">{game.rating.toFixed(1)}</span>
                        <div className="text-lg text-playzo-cyan">★★★★★</div>
                      </div>
                    )}

                    {/* Plays */}
                    {game.plays > 0 && (
                      <div className="text-playzo-cyan/70">
                        {(game.plays / 1000).toFixed(0)}k plays
                      </div>
                    )}

                    {/* Publisher */}
                    {game.publisher && (
                      <div className="text-playzo-cyan/70">
                        by <span className="font-semibold">{game.publisher}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Categories */}
                {game.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {game.categories.map((category) => (
                      <Link
                        key={category}
                        href={`/games?category=${encodeURIComponent(category)}`}
                        className="px-3 py-1 bg-playzo-pink/20 text-playzo-cyan hover:bg-playzo-pink/40 rounded-full text-sm font-semibold transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="prose prose-invert max-w-none">
                  <p className="text-playzo-cyan/80 text-lg leading-relaxed">
                    {game.description}
                  </p>
                </div>

                {/* Game Specs */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-playzo-darker/50 rounded-lg card-base">
                  {game.width && game.height && (
                    <div>
                      <div className="text-xs text-playzo-cyan/70 mb-1">Resolution</div>
                      <div className="font-bold text-playzo-pink">{game.width}x{game.height}</div>
                    </div>
                  )}
                  {game.releaseDate && (
                    <div>
                      <div className="text-xs text-playzo-cyan/70 mb-1">Released</div>
                      <div className="font-bold text-playzo-warm">
                        {new Date(game.releaseDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-playzo-cyan/70 mb-1">Type</div>
                    <div className="font-bold text-playzo-cyan">Browser Game</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Player */}
      <div className="game-player-section py-12 bg-playzo-dark/50">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-headline font-bold text-white mb-2">Play the Game</h2>
            <p className="text-playzo-cyan/70">Click the play button to start. No downloads required!</p>
          </div>
          <GamePlayer game={game} />
        </div>
      </div>

      {/* Ad Slot */}
      <div className="py-8">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <AdSlot slotId="4567890123" format="horizontal" />
        </div>
      </div>

      {/* Game Instructions */}
      {game.instructions && (
        <div className="instructions-section py-12">
          <div className="max-w-container mx-auto px-4 lg:px-8">
            <div className="card-base p-8 space-y-4">
              <h3 className="text-2xl font-headline font-bold text-white">How to Play</h3>
              <div className="text-playzo-cyan/80 whitespace-pre-line">
                {game.instructions}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Section - Content Only (no interactive elements in Server Component) */}
      <div className="share-section py-8 bg-playzo-dark/50">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <h3 className="text-lg font-headline font-bold text-white mb-4">Share This Game</h3>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=Play%20${encodeURIComponent(game.title)}%20on%20Playzo&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/games/${game.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-1 11-4s1-6.75 0-7c-1-1.5-4-1-5.5 0" />
              </svg>
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/games/${game.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-1.194c-.765 0-1.389.645-1.389 1.467v1.533h2.583v2.375h-2.583v7.625h-2.916v-7.625h-2.083v-2.375h2.083v-.959c0-2.164 1.312-3.641 3.582-3.641 1.02 0 1.899.093 2.154.134v2.498z" />
              </svg>
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Related Games */}
      {relatedGames.length > 0 && (
        <div className="related-section py-12">
          <div className="max-w-container mx-auto px-4 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-2">
                Similar Games
              </h2>
              <p className="text-playzo-cyan/70">You might also like these games</p>
            </div>

            <div className="game-grid">
              {relatedGames.map((relGame) => (
                <GameCard key={relGame.slug} game={relGame} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Final Ad Slot */}
      <div className="py-8 bg-playzo-dark/50">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <AdSlot slotId="1357924680" format="horizontal" />
        </div>
      </div>
    </>
  );
}
