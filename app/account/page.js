'use client';

import { useAuth } from '@/components/AuthProvider';
import { ACHIEVEMENTS, calculateLevel, xpForNextLevel, getTitle } from '@/lib/achievements';
import Link from 'next/link';
import { useState } from 'react';

export default function AccountPage() {
  const { user, userData, loading, signInWithGoogle, logout, claimDailyReward } = useAuth();
  const [claimStatus, setClaimStatus] = useState(null);

  const handleClaim = async () => {
    const res = await claimDailyReward();
    if (res?.success) {
      setClaimStatus(`Claimed! +${res.coins} Coins, +${res.xp} XP`);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-playzo-pink border-b-2 border-playzo-cyan mx-auto mb-4" />
          <p className="text-playzo-cyan">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="account-login py-20">
        <div className="max-w-container mx-auto px-4 lg:px-8 text-center">
          <div className="text-6xl mb-6">👤</div>
          <h1 className="text-4xl font-headline font-black text-white mb-4">Sign In to Your Account</h1>
          <p className="text-playzo-cyan/70 mb-8 text-lg max-w-2xl mx-auto">
            Create an account to save your progress, earn rewards, and compete on the leaderboards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={signInWithGoogle}
              className="btn-primary shadow-neon-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  const level = calculateLevel(userData?.xp || 0);
  const nextXp = xpForNextLevel(level);
  const currentLevelXp = xpForNextLevel(level - 1);
  const progress = ((userData?.xp || 0) - currentLevelXp) / (nextXp - currentLevelXp) * 100;

  return (
    <div className="account-dashboard py-12">
      <div className="max-w-container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-headline font-black text-white">My Profile</h1>
          <button onClick={logout} className="btn-outline text-sm py-2 px-4">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card-base p-8">
              <div className="text-center mb-6 relative">
                <img 
                  src={userData?.photoURL || 'https://via.placeholder.com/150'} 
                  alt={userData?.displayName}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-playzo-pink"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-playzo-pink text-white text-xs font-bold px-2 py-1 rounded-full">
                  LEVEL {level}
                </div>
              </div>
              <h2 className="text-2xl font-headline font-bold text-white text-center mb-2">{userData?.displayName}</h2>
              <p className="text-playzo-cyan/70 text-center mb-6">Playzo Member</p>
              
              <div className="mb-6">
                <div className="flex justify-between text-xs text-playzo-cyan/70 mb-1">
                  <span>XP: {userData?.xp || 0}</span>
                  <span>Next Level: {nextXp}</span>
                </div>
                <div className="w-full bg-playzo-darker h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-playzo-pink to-playzo-cyan transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-playzo-darker rounded-lg flex justify-between items-center">
                  <div className="text-xs text-playzo-cyan/70">Total XP</div>
                  <div className="text-xl font-bold text-playzo-pink">{userData?.xp || 0}</div>
                </div>
                <div className="p-4 bg-playzo-darker rounded-lg flex justify-between items-center">
                  <div className="text-xs text-playzo-cyan/70">Coins</div>
                  <div className="text-xl font-bold text-playzo-warm">{userData?.coins || 0} 🪙</div>
                </div>
                <div className="p-4 bg-playzo-darker rounded-lg flex justify-between items-center">
                  <div className="text-xs text-playzo-cyan/70">Achievements</div>
                  <div className="text-xl font-bold text-playzo-cyan">{userData?.achievements?.length || 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Reward Card */}
            <div className="card-base p-8 bg-gradient-to-r from-playzo-darker to-playzo-pink/10 border-playzo-pink/30">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-2xl font-headline font-bold text-white mb-2">Daily Reward</h3>
                  <p className="text-playzo-cyan/70">Claim your daily bonus of 50 Coins and 100 XP!</p>
                </div>
                <div>
                  {userData?.lastRewardDate === new Date().toISOString().split('T')[0] ? (
                    <button disabled className="btn-outline opacity-50 cursor-not-allowed">
                      Claimed Today ✓
                    </button>
                  ) : (
                    <button
                      onClick={handleClaim}
                      className="btn-primary shadow-neon-pink px-8"
                    >
                      Claim Now! 🎁
                    </button>
                  )}
                </div>
              </div>
              {claimStatus && (
                <div className="mt-4 p-3 bg-playzo-pink/20 text-playzo-pink text-center rounded-lg font-bold animate-pulse">
                  {claimStatus}
                </div>
              )}
            </div>

            <div className="card-base p-8">
              <h3 className="text-2xl font-headline font-bold text-white mb-6">Gamer Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-playzo-darker rounded-lg">
                  <div className="text-xs text-playzo-cyan/70 mb-1">Total Playtime</div>
                  <div className="text-3xl font-bold text-playzo-cyan">{formatTime(userData?.playTime || 0)}</div>
                </div>
                <div className="p-4 bg-playzo-darker rounded-lg">
                  <div className="text-xs text-playzo-cyan/70 mb-1">Games Played</div>
                  <div className="text-3xl font-bold text-playzo-pink">{userData?.gamesPlayed || 0}</div>
                </div>
              </div>
            </div>

            <div className="card-base p-8">
              <h3 className="text-2xl font-headline font-bold text-white mb-6">My Achievements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map((ach) => {
                  const isEarned = userData?.achievements?.includes(ach.id);
                  return (
                    <div 
                      key={ach.id} 
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        isEarned 
                          ? 'bg-playzo-darker border-playzo-pink/30 opacity-100' 
                          : 'bg-playzo-darker/50 border-white/5 opacity-50'
                      }`}
                    >
                      <div className="text-4xl">{ach.icon}</div>
                      <div>
                        <div className={`font-bold ${isEarned ? 'text-white' : 'text-gray-500'}`}>{ach.title}</div>
                        <div className="text-xs text-playzo-cyan/70">{ach.description}</div>
                        {isEarned && (
                          <div className="text-[10px] text-playzo-pink mt-1 font-bold uppercase tracking-wider">Unlocked!</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
