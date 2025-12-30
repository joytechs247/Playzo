"use client"

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import SEOHead from '@/components/SEOHead';

export default function BattlePassPage() {
  const { userData } = useAuth();

  // Calculate battle pass tier and progress
  // Let's say 1000 XP per tier
  const totalXp = userData?.xp || 0;
  const currentTier = Math.floor(totalXp / 1000) + 1;
  const xpInCurrentTier = totalXp % 1000;
  const tierProgress = (xpInCurrentTier / 1000) * 100;

  const rewards = [
    { tier: 1, reward: 'Badge: Novice Gamer', requiredXp: 0 },
    { tier: 2, reward: 'Avatar: Blue Nebula', requiredXp: 1000 },
    { tier: 3, reward: '100 XP Boost', requiredXp: 2000 },
    { tier: 4, reward: 'Title: Rising Star', requiredXp: 3000 },
    { tier: 5, reward: 'Badge: Gaming Legend', requiredXp: 4000 },
    { tier: 6, reward: 'Avatar: Neon Samurai', requiredXp: 5000 },
    { tier: 7, reward: 'Exclusive: Golden Glow', requiredXp: 6000 },
  ];

  return (
    <>
      <SEOHead
        title="Battle Pass - Playzo"
        description="Seasonal progression system with exclusive rewards and cosmetics."
      />
      <div className="py-12">
        <div className="max-w-container mx-auto px-4 lg:px-8 text-center">
          <div className="text-6xl mb-6">⚔️</div>
          <h1 className="text-4xl font-headline font-black text-white mb-4">Battle Pass System</h1>
          <p className="text-xl text-playzo-cyan/70 mb-8 max-w-2xl mx-auto">
            Seasonal progression with exclusive rewards, cosmetics, and challenges.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="card-base p-8">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-2xl font-headline font-bold text-white mb-3">Seasonal Passes</h3>
              <p className="text-playzo-cyan/80">
                New season every 3 months with exclusive challenges, rewards, and cosmetics to unlock.
              </p>
            </div>

            <div className="card-base p-8">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-2xl font-headline font-bold text-white mb-3">Rewards & Cosmetics</h3>
              <p className="text-playzo-cyan/80">
                Earn XP, badges, avatars skins, and profile decorations as you progress through tiers.
              </p>
            </div>
          </div>

          {/* User Battle Pass Progress */}
          <div className="card-base p-12 max-w-3xl mx-auto mb-8 border-playzo-pink/50 bg-playzo-pink/5">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-headline font-bold text-white text-left">Season 1 Progress</h2>
              <div className="text-right">
                <span className="text-playzo-pink font-bold text-xl">Tier {currentTier}</span>
                <p className="text-playzo-cyan/50 text-xs">{(1000 - xpInCurrentTier).toLocaleString()} XP to next tier</p>
              </div>
            </div>

            <div className="space-y-6">
              {rewards.map((item) => {
                const isUnlocked = totalXp >= item.requiredXp;
                const isCurrent = currentTier === item.tier;
                let progress = 0;
                if (isUnlocked) {
                  if (totalXp >= item.requiredXp + 1000) {
                    progress = 100;
                  } else {
                    progress = ((totalXp - item.requiredXp) / 1000) * 100;
                  }
                }

                return (
                  <div key={item.tier} className={`text-left p-4 rounded-lg transition-all ${isCurrent ? 'bg-playzo-pink/10 border border-playzo-pink/30' : ''}`}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isUnlocked ? 'bg-playzo-pink text-white' : 'bg-playzo-darker text-playzo-cyan/30'}`}>
                          {item.tier}
                        </span>
                        <span className={`font-headline font-bold ${isUnlocked ? 'text-white' : 'text-playzo-cyan/30'}`}>
                          {item.reward}
                        </span>
                      </div>
                      {isUnlocked && progress < 100 ? (
                        <span className="text-sm text-playzo-warm font-bold">{Math.floor(progress)}%</span>
                      ) : isUnlocked ? (
                        <span className="text-xs bg-playzo-cyan/20 text-playzo-cyan px-2 py-1 rounded uppercase font-bold tracking-wider">Unlocked</span>
                      ) : (
                        <span className="text-xs text-playzo-cyan/30 uppercase font-bold tracking-wider">Locked</span>
                      )}
                    </div>
                    <div className="w-full h-2 bg-playzo-darker rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${isUnlocked ? 'bg-gradient-to-r from-playzo-pink to-playzo-cyan shadow-neon' : 'bg-transparent'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link href="/games" className="btn-primary shadow-neon-lg">
            Earn XP to Level Up
          </Link>
        </div>
      </div>
    </>
  );
}
