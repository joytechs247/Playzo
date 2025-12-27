import Link from 'next/link';
import { getAllCategories, getGamesByCategory } from '@/lib/fetchGames';

export const metadata = {
  title: 'Game Categories',
  description: 'Browse games by category on Playzo. Find action, puzzle, strategy, and more game types.',
};

export const revalidate = 3600;

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  const categoryCards = await Promise.all(
    categories.slice(0, 24).map(async (category) => {
      const games = await getGamesByCategory(category);
      return {
        name: category,
        count: games.length,
      };
    })
  );

  const icons = {
    action: '⚔️',
    puzzle: '🧩',
    strategy: '♟️',
    sport: '⚽',
    adventure: '🗺️',
    arcade: '🕹️',
    racing: '🏎️',
    shooter: '🎯',
  };

  return (
    <>
      {/* Page Header */}
      <div className="categories-header bg-gradient-to-b from-playzo-dark to-playzo-darker/50 py-12">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-headline font-black text-white mb-4">
            Game Categories
          </h1>
          <p className="text-playzo-cyan/70 text-lg">
            Browse {categories.length} different game categories
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="py-12">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCards.map((category) => {
              const icon = Object.entries(icons).find(([key]) =>
                category.name.toLowerCase().includes(key)
              )?.[1] || '🎮';

              return (
                <Link
                  key={category.name}
                  href={`/games?category=${encodeURIComponent(category.name)}`}
                  className="group card-base p-8 text-center hover:border-playzo-pink/60 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-playzo-cyan/70">
                    {category.count} games
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
