export const ACHIEVEMENTS = [
  {
    id: 'first_play',
    title: 'Welcome Aboard!',
    description: 'Play your first game on Playzo.',
    requirement: { type: 'gamesPlayed', value: 1 },
    reward: { xp: 100, coins: 50 },
    icon: '🎮'
  },
  {
    id: 'play_10_min',
    title: 'Getting Started',
    description: 'Play for a total of 10 minutes.',
    requirement: { type: 'playTime', value: 600 }, // 10 mins in seconds
    reward: { xp: 200, coins: 100 },
    icon: '⏳'
  },
  {
    id: 'play_1_hour',
    title: 'Dedicated Gamer',
    description: 'Play for a total of 1 hour.',
    requirement: { type: 'playTime', value: 3600 }, // 1 hour in seconds
    reward: { xp: 1000, coins: 500 },
    icon: '🏆'
  },
  {
    id: 'game_master',
    title: 'Game Master',
    description: 'Play 50 different games.',
    requirement: { type: 'gamesPlayed', value: 50 },
    reward: { xp: 5000, coins: 2500 },
    icon: '👑'
  }
];

export const calculateLevel = (xp) => {
  // Simple leveling: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const getTitle = (level) => {
  if (level >= 50) return 'Playzo Legend 👑';
  if (level >= 30) return 'Gamer God ⚡';
  if (level >= 20) return 'Elite Player 🏆';
  if (level >= 10) return 'Pro Gamer ⭐';
  if (level >= 5) return 'Rising Star 🌟';
  return 'Newbie 🎮';
};

export const xpForNextLevel = (level) => {
  // Inverse of calculateLevel: xp = (level)^2 * 100
  return Math.pow(level, 2) * 100;
};
