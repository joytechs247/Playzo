'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { calculateLevel } from '@/lib/achievements';

export default function LeaderboardPage() {
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('global'); // 'global' or 'weekly'

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const orderField = view === 'global' ? 'xp' : 'weeklyXp';
    const q = query(collection(db, 'users'), orderBy(orderField, 'desc'), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const players = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data()
      }));
      setTopPlayers(players);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [view]);

  const getRankBadge = (rank) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '⭐';
  };

  return (
    <>
      <div className="leaderboard-header bg-gradient-to-b from-playzo-dark to-playzo-darker/50 py-12">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-headline font-black text-white mb-4">
            🏆 Leaderboards
          </h1>
          <p className="text-playzo-cyan/70 text-lg">
            Compete with players worldwide and claim the top spot
          </p>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="flex gap-4 mb-8 border-b border-playzo-cyan/20">
            <button
              onClick={() => setView('global')}
              className={`pb-4 px-4 font-headline font-bold transition-all ${
                view === 'global' ? 'text-playzo-pink border-b-2 border-playzo-pink' : 'text-playzo-cyan/70 hover:text-playzo-cyan'
              }`}
            >
              Global XP
            </button>
            <button
              onClick={() => setView('weekly')}
              className={`pb-4 px-4 font-headline font-bold transition-all ${
                view === 'weekly' ? 'text-playzo-pink border-b-2 border-playzo-pink' : 'text-playzo-cyan/70 hover:text-playzo-cyan'
              }`}
            >
              Weekly Rankings
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-playzo-pink border-b-2 border-playzo-cyan"></div>
            </div>
          ) : topPlayers.length > 0 ? (
            <div className="space-y-4">
              {topPlayers.map((player) => (
                <div
                  key={player.id}
                  className={`card-base p-4 flex items-center justify-between transition-all duration-300 hover:border-playzo-pink/60 ${
                    player.rank <= 3 ? 'border-playzo-pink/40 bg-playzo-pink/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-playzo-pink to-playzo-cyan flex items-center justify-center text-white font-headline font-bold text-lg">
                      {player.rank}
                    </div>

                    <div className="flex items-center gap-4">
                      <img 
                        src={player.photoURL || 'https://via.placeholder.com/40'} 
                        alt={player.displayName}
                        className="w-10 h-10 rounded-full border border-playzo-cyan/30"
                      />
                      <div>
                        <h3 className="font-headline font-bold text-white text-lg">
                          {player.displayName}
                        </h3>
                        <p className="text-playzo-cyan/70 text-sm">
                          Level {calculateLevel(player.xp || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getRankBadge(player.rank)}</div>
                      <div>
                        <div className="font-headline font-bold text-playzo-pink text-lg">
                          {((view === 'global' ? player.xp : player.weeklyXp) || 0).toLocaleString()}
                        </div>
                        <div className="text-playzo-cyan/70 text-xs">XP</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-playzo-cyan/70">
              No players found. Be the first to join!
            </div>
          )}
        </div>
      </div>
    </>
  );
}
