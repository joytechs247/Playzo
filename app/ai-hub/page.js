'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getAIRecommendations, getUserInsights } from '@/lib/recommendations';
import GameCard from '@/components/GameCard';
import Link from 'next/link';
import SEOHead from '@/components/SEOHead';

export default function AIHubPage() {
  const { userData, user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (user) {
        const recs = await getAIRecommendations(userData);
        const ins = getUserInsights(userData);
        setRecommendations(recs);
        setInsights(ins);
      }
      setLoading(false);
    }
    loadData();
  }, [userData, user]);

  return (
    <>
      <SEOHead 
        title="AI Gaming Hub - Playzo" 
        description="Personalized game recommendations powered by AI." 
      />
      <div className="py-12">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">🤖</div>
            <h1 className="text-4xl font-headline font-black text-white mb-4">AI Gaming Hub</h1>
            <p className="text-xl text-playzo-cyan/70 mb-8 max-w-2xl mx-auto">
              Personalized game recommendations powered by Playzo AI.
            </p>
          </div>

          {!user ? (
            <div className="max-w-2xl mx-auto text-center card-base p-12">
              <h2 className="text-2xl font-headline font-bold text-white mb-6">Unlock Your Personalized Hub</h2>
              <p className="text-playzo-cyan/70 mb-8">
                Sign in to see AI-powered game recommendations based on your unique play style and history.
              </p>
              <Link href="/account" className="btn-primary">
                Login / Sign Up
              </Link>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-playzo-pink border-b-2 border-playzo-cyan"></div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Recommendations Section */}
              <div>
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-2xl font-headline font-bold text-white flex items-center gap-3">
                    <span className="text-playzo-pink">✨</span>
                    Recommended For You
                  </h2>
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-playzo-cyan hover:text-white text-sm transition-colors"
                  >
                    Refresh Suggestions
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {recommendations.map(game => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </div>

              {/* Insights Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card-base p-8 border-playzo-cyan/30">
                  <h3 className="text-xl font-headline font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-playzo-warm">📊</span>
                    Gaming Insights
                  </h3>
                  {insights && insights.topCategories.length > 0 ? (
                    <div className="space-y-6">
                      <div>
                        <p className="text-playzo-cyan/50 text-xs uppercase tracking-wider font-bold mb-3">Top Categories</p>
                        <div className="flex flex-wrap gap-2">
                          {insights.topCategories.map(cat => (
                            <span key={cat.name} className="px-3 py-1 bg-playzo-darker border border-playzo-pink/30 rounded-full text-white text-sm">
                              {cat.name} <span className="text-playzo-pink ml-1">({cat.count})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-playzo-cyan/10">
                        <div>
                          <p className="text-playzo-cyan/50 text-xs uppercase tracking-wider font-bold mb-1">Total Plays</p>
                          <p className="text-2xl font-black text-white">{insights.totalGamesPlayed}</p>
                        </div>
                        <div>
                          <p className="text-playzo-cyan/50 text-xs uppercase tracking-wider font-bold mb-1">Time Played</p>
                          <p className="text-2xl font-black text-white">{insights.totalPlayTime}m</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-playzo-cyan/50 text-center py-10">Play more games to unlock insights!</p>
                  )}
                </div>

                <div className="card-base p-8 border-playzo-pink/30">
                  <h3 className="text-xl font-headline font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-playzo-pink">⚡</span>
                    Pro Tip
                  </h3>
                  <div className="bg-playzo-dark/50 p-6 rounded-xl border border-playzo-warm/20">
                    <p className="text-playzo-cyan/80 leading-relaxed italic">
                      "Looks like you're a fan of <span className="text-playzo-pink font-bold">{insights?.topCategories[0]?.name || 'new games'}</span>! 
                      Check out the latest releases in that category to boost your XP faster."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-playzo-cyan/50 mb-8 italic">
              Powered by Playzo's Advanced Recommendation Engine
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
