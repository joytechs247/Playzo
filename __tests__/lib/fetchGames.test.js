import { getAllGames, searchGames } from '@/lib/fetchGames';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
}));

describe('fetchGames', () => {
  const mockGamesData = [
    {
      id: '1',
      title: 'Flappy Bird',
      embed_url: 'https://example.com/flappy',
      thumbnail: 'https://example.com/thumb1.jpg',
      description: 'A challenging bird game',
      categories: ['Action', 'Arcade'],
      publisher: 'Game Dev Co',
      rating: 4.5,
      plays: 1000,
      width: 800,
      height: 600,
    },
    {
      id: '2',
      title: 'Puzzle Master',
      embed_url: 'https://example.com/puzzle',
      thumbnail: 'https://example.com/thumb2.jpg',
      description: 'A fun puzzle game',
      categories: ['Puzzle'],
      publisher: 'Puzzle Games Inc',
      rating: 4.2,
      plays: 500,
      width: 640,
      height: 480,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllGames', () => {
    it('should fetch games from the source', async () => {
      const axios = require('axios');
      axios.get.mockResolvedValue({ data: mockGamesData });

      const games = await getAllGames();

      expect(games).toHaveLength(2);
      expect(games[0].title).toBe('Flappy Bird');
      expect(games[1].title).toBe('Puzzle Master');
    });

    it('should generate unique slugs for games', async () => {
      const axios = require('axios');
      axios.get.mockResolvedValue({ data: mockGamesData });

      const games = await getAllGames();

      expect(games[0].slug).toBeDefined();
      expect(games[1].slug).toBeDefined();
      expect(games[0].slug).not.toBe(games[1].slug);
    });

    it('should handle network errors gracefully', async () => {
      const axios = require('axios');
      axios.get.mockRejectedValue(new Error('Network error'));

      const games = await getAllGames();

      expect(games).toEqual([]);
    });
  });

  describe('searchGames', () => {
    it('should search games by title', async () => {
      const axios = require('axios');
      axios.get.mockResolvedValue({ data: mockGamesData });

      const results = await searchGames('Flappy');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Flappy Bird');
    });

    it('should search games by description', async () => {
      const axios = require('axios');
      axios.get.mockResolvedValue({ data: mockGamesData });

      const results = await searchGames('puzzle');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Puzzle Master');
    });

    it('should return empty array for no matches', async () => {
      const axios = require('axios');
      axios.get.mockResolvedValue({ data: mockGamesData });

      const results = await searchGames('NonexistentGame');

      expect(results).toHaveLength(0);
    });

    it('should be case-insensitive', async () => {
      const axios = require('axios');
      axios.get.mockResolvedValue({ data: mockGamesData });

      const results = await searchGames('FLAPPY');

      expect(results).toHaveLength(1);
    });
  });
});
