import Link from 'next/link';
import { getAllGames, getFeaturedGames, getTrendingGames, getAllCategories } from '@/lib/fetchGames';
import GameCard from '@/components/GameCard';
import AdSlot from '@/components/AdSlot';

export const metadata = {
  title: 'Playzo — Free Browser Games | Play, Share, Win',
  description: 'Play thousands of free browser games instantly. Join the community, climb leaderboards, and earn rewards on Playzo.',
  openGraph: {
    type: 'website',
    url: '/',
  },
};

export const revalidate = 3600; // ISR - revalidate every hour

async function generateJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Playzo',
    description: 'Free browser gaming portal',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://playzo.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://playzo.vercel.app'}/games?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export default async function HomePage() {
  const [featured, trending, categories] = await Promise.all([
    getFeaturedGames(5),
    getTrendingGames(8),
    getAllCategories(),
  ]);

  const jsonLd = await generateJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="hero relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-playzo-pink/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-playzo-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-container mx-auto px-4 lg:px-8 py-12 text-center">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <div className="text-6xl md:text-8xl font-headline font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-playzo-pink via-playzo-warm to-playzo-cyan">
                PLAYZO
              </span>
            </div>
          </div>

          {/* Tagline */}
          <div className="animate-slide-up space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-black leading-tight">
              Play <span className="text-transparent bg-clip-text bg-gradient-to-r from-playzo-pink to-playzo-cyan">Thousands</span> of Free Games
            </h1>
            <p className="text-xl md:text-2xl text-playzo-cyan/80 max-w-2xl mx-auto">
              Instant browser gaming. No downloads, no installation. Just pure gaming fun with friends.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link
                href="/games"
                className="btn-primary shadow-neon-lg hover:scale-105 transform transition-transform duration-300"
              >
                Start Playing
              </Link>
              <button
                className="btn-outline"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 text-center">
            <div className="card-base p-6">
              <div className="text-4xl font-black text-playzo-pink mb-2">5000+</div>
              <div className="text-playzo-cyan/70">Games Available</div>
            </div>
            <div className="card-base p-6">
              <div className="text-4xl font-black text-playzo-warm mb-2">100K+</div>
              <div className="text-playzo-cyan/70">Active Players</div>
            </div>
            <div className="card-base p-6">
              <div className="text-4xl font-black text-playzo-cyan mb-2">24/7</div>
              <div className="text-playzo-cyan/70">Always Online</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Carousel Section */}
      {featured.length > 0 && (
        <section className="featured-carousel py-16 bg-playzo-dark/50">
          <div className="max-w-container mx-auto px-4 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-headline font-black text-white mb-2">
                ⭐ Featured This Week
              </h2>
              <p className="text-playzo-cyan/70">Top-rated games handpicked for you</p>
            </div>

            <div className="game-grid">
              {featured.map((game) => (
                <div key={game.slug} className="animate-fade-in">
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ad Slot - Between Sections */}
      <div className="py-8">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <AdSlot slotId="7264071687" format="horizontal" />
        </div>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="categories py-16">
          <div className="max-w-container mx-auto px-4 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-headline font-black text-white mb-2">
                🎮 Browse by Category
              </h2>
              <p className="text-playzo-cyan/70">Find your favorite type of game</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 12).map((category) => (
                <Link
                  key={category}
                  href={`/games?category=${encodeURIComponent(category)}`}
                  className="group card-base p-4 text-center hover:border-playzo-pink/60 transition-all duration-300"
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="font-headline font-bold text-sm text-playzo-cyan group-hover:text-playzo-pink transition-colors">
                    {category.substring(0, 15)}
                  </h3>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/categories" className="text-playzo-pink hover:text-playzo-warm transition-colors font-bold">
                View All Categories →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trending Games Section */}
      {trending.length > 0 && (
        <section className="trending py-16 bg-playzo-dark/50">
          <div className="max-w-container mx-auto px-4 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-headline font-black text-white mb-2">
                  🔥 Trending Now
                </h2>
                <p className="text-playzo-cyan/70">Most played games this week</p>
              </div>
              <Link href="/games?sort=trending" className="text-playzo-pink hover:text-playzo-warm transition-colors font-bold hidden md:block">
                See All →
              </Link>
            </div>

            <div className="game-grid">
              {trending.slice(0, 8).map((game) => (
                <div key={game.slug} className="animate-fade-in">
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ad Slot - Bottom Section */}
      <div className="py-8">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <AdSlot slotId="1234567890" format="horizontal" />
        </div>
      </div>

      {/* CTA Section */}
      <section className="cta-section py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-playzo-pink/10 via-playzo-cyan/10 to-playzo-warm/10" />
        
        <div className="max-w-container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-black text-white mb-4">
            Ready to Join the Fun?
          </h2>
          <p className="text-xl text-playzo-cyan/80 mb-8 max-w-2xl mx-auto">
            Create an account to track your progress, earn rewards, and compete on the leaderboards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/games"
              className="btn-primary shadow-neon-lg hover:scale-105 transform transition-transform duration-300"
            >
              Explore Games
            </Link>
            <Link
              href="/account"
              className="btn-secondary"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
