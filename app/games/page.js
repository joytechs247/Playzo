'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import GameCard from '@/components/GameCard';
import AdSlot from '@/components/AdSlot';
import { getAllGames, searchGames, getGamesByCategory } from '@/lib/fetchGames';

const GAMES_PER_PAGE = 12;

function GamesListContent() {
  const searchParams = useSearchParams();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('trending');

  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  // Load games on mount
  useEffect(() => {
    async function loadGames() {
      setIsLoading(true);
      try {
        const allGames = await getAllGames();
        setGames(allGames);
      } catch (error) {
        console.error('Error loading games:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadGames();
  }, []);

  // Filter games based on search and category
  useEffect(() => {
    let filtered = games;

    if (searchQuery) {
      filtered = games.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory || categoryQuery) {
      const category = selectedCategory || categoryQuery;
      filtered = filtered.filter(game =>
        game.categories.some(cat => cat.toLowerCase().includes(category.toLowerCase()))
      );
    }

    // Sort
    if (sortBy === 'trending') {
      filtered.sort((a, b) => (b.plays || 0) - (a.plays || 0));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'new') {
      filtered.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
    } else if (sortBy === 'a-z') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredGames(filtered);
    setCurrentPage(1);
  }, [games, searchQuery, selectedCategory, categoryQuery, sortBy]);

  // Get unique categories
  const categories = [...new Set(games.flatMap(g => g.categories))].sort();

  // Paginate
  const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
  const endIndex = startIndex + GAMES_PER_PAGE;
  const paginatedGames = filteredGames.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);

  return (
    <>
      {/* Page Header */}
      <div className="games-header bg-gradient-to-b from-playzo-dark to-playzo-darker/50 py-12">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-headline font-black text-white mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Games'}
          </h1>
          <p className="text-playzo-cyan/70 text-lg">
            {filteredGames.length} games found
          </p>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="filters-section bg-playzo-dark/50 sticky top-16 z-30 py-4 border-b border-playzo-cyan/20">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Sort */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <label className="text-playzo-cyan font-semibold text-sm">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-playzo-darker border border-playzo-cyan/30 rounded-lg text-white text-sm"
              >
                <option value="trending">Trending</option>
                <option value="rating">Top Rated</option>
                <option value="new">Newest</option>
                <option value="a-z">A-Z</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <label className="text-playzo-cyan font-semibold text-sm">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-playzo-darker border border-playzo-cyan/30 rounded-lg text-white text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory) && (
              <Link
                href="/games"
                className="px-4 py-2 text-sm text-playzo-pink hover:text-playzo-warm transition-colors font-semibold"
              >
                Clear Filters
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="games-content py-12">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-playzo-pink border-b-2 border-playzo-cyan" />
              </div>
              <p className="mt-4 text-playzo-cyan">Loading games...</p>
            </div>
          ) : paginatedGames.length > 0 ? (
            <>
              <div className="game-grid">
                {paginatedGames.map((game) => (
                  <GameCard key={game.slug} game={game} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  {currentPage > 1 && (
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="px-4 py-2 bg-playzo-darker border border-playzo-cyan/30 text-playzo-cyan hover:bg-playzo-cyan hover:text-playzo-navy rounded-lg transition-colors"
                    >
                      ← Previous
                    </button>
                  )}

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-playzo-pink text-white'
                              : 'bg-playzo-darker border border-playzo-cyan/30 text-playzo-cyan hover:border-playzo-pink'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && <span className="text-playzo-cyan">...</span>}
                  </div>

                  {currentPage < totalPages && (
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="px-4 py-2 bg-playzo-darker border border-playzo-cyan/30 text-playzo-cyan hover:bg-playzo-cyan hover:text-playzo-navy rounded-lg transition-colors"
                    >
                      Next →
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">😿</div>
              <h3 className="text-2xl font-headline font-bold text-playzo-cyan mb-2">No Games Found</h3>
              <p className="text-playzo-cyan/70 mb-6">Try adjusting your filters or search terms</p>
              <Link href="/games" className="text-playzo-pink hover:text-playzo-warm transition-colors font-bold">
                Back to All Games →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Ad Slot */}
      <div className="py-8 bg-playzo-dark/50">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <AdSlot slotId="9876543210" format="horizontal" />
        </div>
      </div>
    </>
  );
}

function GamesSkeleton() {
  return (
    <div className="games-skeleton py-12">
      <div className="max-w-container mx-auto px-4 lg:px-8">
        <div className="game-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="card-base p-4 animate-pulse">
              <div className="w-full bg-playzo-darker rounded-lg" style={{ paddingBottom: '75%' }} />
              <div className="mt-4 h-4 bg-playzo-darker rounded w-3/4" />
              <div className="mt-2 h-3 bg-playzo-darker rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={<GamesSkeleton />}>
      <GamesListContent />
    </Suspense>
  );
}
