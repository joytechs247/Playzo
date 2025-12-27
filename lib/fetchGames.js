import axios from 'axios';
import slugify from 'slugify';

const GAMES_SOURCE_URL = process.env.NEXT_PUBLIC_GAMES_JSON || 'https://www.onlinegames.io/media/plugins/genGames/embed.json';

// Cache to store games locally
let cachedGames = null;
let lastFetchTime = null;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Generate a slug from game title and ID
 */
function generateSlug(title, id) {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
  return `${baseSlug}-${id}`.substring(0, 100);
}

/**
 * Generate a fallback description
 */
function generateFallbackDescription(title) {
  return `Play ${title} on Playzo — instant browser game. Click Play to start the game in your browser.`;
}

/**
 * Extract categories from various possible fields
 */
function extractCategories(game) {
  const categories = [];

  if (game.tags) {
    if (Array.isArray(game.tags)) {
      categories.push(...game.tags);
    } else if (typeof game.tags === 'string') {
      categories.push(...game.tags.split(',').map(tag => tag.trim()));
    }
  }

  if (game.categories) {
    if (Array.isArray(game.categories)) {
      categories.push(...game.categories);
    } else if (typeof game.categories === 'string') {
      categories.push(...game.categories.split(',').map(cat => cat.trim()));
    }
  }

  if (game.genre) {
    if (Array.isArray(game.genre)) {
      categories.push(...game.genre);
    } else {
      categories.push(game.genre);
    }
  }

  // Remove duplicates and empty strings
  return [...new Set(categories.filter(Boolean))];
}

/**
 * Map raw game data to standardized format
 */
function mapGameData(rawGame, index) {
  const id = rawGame.id || rawGame.game_id || index;
  const title = rawGame.title || rawGame.name || 'Unknown Game';
  const slug = generateSlug(title, id);

  // Try multiple fields to find a valid embed URL
  let embedUrl = rawGame.embed
    || rawGame.embed_url
    || rawGame.url
    || rawGame.gameUrl
    || rawGame.game_url
    || rawGame.playUrl
    || rawGame.play_url
    || rawGame.iframeUrl
    || rawGame.iframe_url
    || '';

  // If URL is relative, make it absolute (assuming onlinegames.io as default host for legacy data)
  if (embedUrl && !embedUrl.startsWith('http') && !embedUrl.startsWith('//')) {
    embedUrl = 'https://www.onlinegames.io' + (embedUrl.startsWith('/') ? embedUrl : '/' + embedUrl);
  }

  return {
    id,
    slug,
    title,
    description: rawGame.description || generateFallbackDescription(title),
    embedUrl,
    thumbnail: rawGame.thumbnail || rawGame.image || rawGame.thumb || null,
    publisher: rawGame.publisher || rawGame.developer || 'Unknown',
    categories: extractCategories(rawGame),
    width: rawGame.width || 800,
    height: rawGame.height || 600,
    rating: rawGame.rating ? parseFloat(rawGame.rating) : null,
    plays: parseInt(rawGame.plays) || 0,
    releaseDate: rawGame.release_date || rawGame.releaseDate || null,
    instructions: rawGame.instructions || null,
    controls: rawGame.controls || null,
  };
}

/**
 * Fetch games from the source JSON
 */
async function fetchGamesFromSource() {
  try {
    let rawGames = [];

    // On server, try to read local files directly from filesystem
    if (typeof window === 'undefined' && GAMES_SOURCE_URL.startsWith('/')) {
      try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), 'public', GAMES_SOURCE_URL);
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(fileContent);
          rawGames = Array.isArray(data) ? data : data.games || [];
          console.log(`Loaded ${rawGames.length} games from local filesystem: ${filePath}`);
        } else {
          console.warn(`Local file not found via fs: ${filePath}`);
        }
      } catch (fsError) {
        console.error('Error reading local file via fs:', fsError.message);
      }
    }

    // If still empty (wasn't local or fs failed or was remote), use axios
    if (rawGames.length === 0) {
      let url = GAMES_SOURCE_URL;

      // On the client, use the API proxy to avoid CORS
      if (typeof window !== 'undefined' && url.startsWith('http')) {
        url = '/api/games';
      }

      // Handle relative URLs for axios on the server
      if (url.startsWith('/') && typeof window === 'undefined') {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        url = `${baseUrl}${url}`;
      }

      const response = await axios.get(url, {
        timeout: 10000,
      });
      rawGames = Array.isArray(response.data) ? response.data : response.data.games || [];
      console.log(`Loaded ${rawGames.length} games via axios from ${url}`);
    }

    const mappedGames = rawGames.map((game, index) => mapGameData(game, index));

    // Filter out games without valid embed URLs
    const validGames = mappedGames.filter(game => game.embedUrl && game.embedUrl.trim().length > 0);

    return validGames;
  } catch (error) {
    console.error(`Error fetching games from source (${GAMES_SOURCE_URL}):`, error.message);

    // Final fallback: if it's not already using /games.json, try to load it from fs as a last resort
    if (GAMES_SOURCE_URL !== '/games.json' && typeof window === 'undefined') {
      try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), 'public', 'games.json');
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(fileContent);
          const raw = Array.isArray(data) ? data : data.games || [];
          return raw.map((game, index) => mapGameData(game, index));
        }
      } catch (err) {
        // Ignore
      }
    }

    return [];
  }
}

/**
 * Get all games with caching
 */
export async function getAllGames() {
  const now = Date.now();
  
  // Return cached games if available and not expired
  if (cachedGames && lastFetchTime && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedGames;
  }
  
  const games = await fetchGamesFromSource();
  cachedGames = games;
  lastFetchTime = now;
  
  return games;
}

/**
 * Get a single game by slug
 */
export async function getGameBySlug(slug) {
  const games = await getAllGames();
  return games.find(game => game.slug === slug) || null;
}

/**
 * Get games by category
 */
export async function getGamesByCategory(category) {
  const games = await getAllGames();
  return games.filter(game => 
    game.categories.some(cat => 
      slugify(cat, { lower: true }).includes(slugify(category, { lower: true }))
    )
  );
}

/**
 * Get trending games (sorted by plays/popularity)
 */
export async function getTrendingGames(limit = 10) {
  const games = await getAllGames();
  return games
    .sort((a, b) => (b.plays || 0) - (a.plays || 0) || (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}

/**
 * Get new games (if release date is available)
 */
export async function getNewGames(limit = 10) {
  const games = await getAllGames();
  return games
    .filter(game => game.releaseDate)
    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
    .slice(0, limit);
}

/**
 * Get all unique categories
 */
export async function getAllCategories() {
  const games = await getAllGames();
  const categoriesSet = new Set();
  
  games.forEach(game => {
    game.categories.forEach(category => categoriesSet.add(category));
  });
  
  return Array.from(categoriesSet).sort();
}

/**
 * Search games by query
 */
export async function searchGames(query) {
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  const games = await getAllGames();
  const lowerQuery = query.toLowerCase();
  
  return games.filter(game =>
    game.title.toLowerCase().includes(lowerQuery) ||
    game.description.toLowerCase().includes(lowerQuery) ||
    game.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get featured games (top rated and most played)
 */
export async function getFeaturedGames(limit = 5) {
  const games = await getAllGames();
  return games
    .filter(game => game.rating >= 4 || game.plays > 1000)
    .sort((a, b) => {
      const aScore = (a.rating || 0) * 10 + (a.plays || 0);
      const bScore = (b.rating || 0) * 10 + (b.plays || 0);
      return bScore - aScore;
    })
    .slice(0, limit);
}

/**
 * Get related games (same category)
 */
export async function getRelatedGames(gameSlug, limit = 4) {
  const games = await getAllGames();
  const currentGame = games.find(g => g.slug === gameSlug);
  
  if (!currentGame) return [];
  
  return games
    .filter(game => 
      game.slug !== gameSlug &&
      game.categories.some(cat => currentGame.categories.includes(cat))
    )
    .slice(0, limit);
}

export default {
  getAllGames,
  getGameBySlug,
  getGamesByCategory,
  getTrendingGames,
  getNewGames,
  getAllCategories,
  searchGames,
  getFeaturedGames,
  getRelatedGames,
};
