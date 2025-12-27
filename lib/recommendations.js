import { getAllGames } from './fetchGames';

/**
 * AI-lite Recommendation Engine
 * Recommends games based on user's preferred categories and play history
 */
export async function getAIRecommendations(userData) {
  const allGames = await getAllGames();
  
  if (!userData || !userData.preferredCategories || userData.preferredCategories.length === 0) {
    // Return trending/featured if no user data
    return allGames.slice(0, 10).sort(() => 0.5 - Math.random()).slice(0, 4);
  }

  const { preferredCategories, lastGamesPlayed } = userData;
  
  // Calculate category weights
  const weights = {};
  preferredCategories.forEach(cat => {
    weights[cat] = (weights[cat] || 0) + 1;
  });

  // Score games based on category overlap
  const scoredGames = allGames
    .filter(game => !lastGamesPlayed?.includes(game.slug)) // Don't recommend already played games
    .map(game => {
      let score = 0;
      game.categories.forEach(cat => {
        if (weights[cat]) {
          score += weights[cat];
        }
      });
      // Add small randomness for discovery
      score += Math.random();
      return { ...game, score };
    });

  // Sort by score and return top recommendations
  return scoredGames
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

/**
 * Get insights into user gaming patterns
 */
export function getUserInsights(userData) {
  if (!userData || !userData.preferredCategories) return null;

  const categories = userData.preferredCategories;
  const counts = {};
  categories.forEach(cat => counts[cat] = (counts[cat] || 0) + 1);

  const topCategories = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }));

  return {
    topCategories,
    totalGamesPlayed: userData.gamesPlayed || 0,
    totalPlayTime: Math.floor((userData.playTime || 0) / 60) // minutes
  };
}
