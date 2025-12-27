'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseConfig';
import { ACHIEVEMENTS } from '@/lib/achievements';

const AuthContext = createContext({
  user: null,
  userData: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  updatePlayTime: async (seconds) => {},
  incrementGamesPlayed: async (gameSlug) => {},
  claimDailyReward: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch or create user document in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        
        // Listen for user data changes
        const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // Initialize user data
            const initialData = {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
              email: user.email,
              xp: 0,
              weeklyXp: 0,
              coins: 0,
              playTime: 0,
              gamesPlayed: 0,
              lastGamesPlayed: [],
              preferredCategories: [],
              achievements: [],
              lastLogin: new Date().toISOString(),
              createdAt: new Date().toISOString()
            };
            setDoc(userDocRef, initialData);
            setUserData(initialData);
          }
        });

        return () => unsubDoc();
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updatePlayTime = async (seconds, gameSlug) => {
    if (!user || !db) return;

    const userDocRef = doc(db, 'users', user.uid);
    const newPlayTime = (userData?.playTime || 0) + seconds;
    
    // Check for new achievements
    const earnedAchievements = ACHIEVEMENTS.filter(ach => {
      if (userData?.achievements?.includes(ach.id)) return false;
      
      if (ach.requirement.type === 'playTime') {
        return newPlayTime >= ach.requirement.value;
      }
      // Add other requirement types here if needed
      return false;
    });

    const updates = {
      playTime: increment(seconds),
    };

    if (earnedAchievements.length > 0) {
      updates.achievements = arrayUnion(...earnedAchievements.map(a => a.id));
      updates.xp = increment(earnedAchievements.reduce((acc, ach) => acc + ach.reward.xp, 0));
      updates.coins = increment(earnedAchievements.reduce((acc, ach) => acc + ach.reward.coins, 0));
      
      // Notify user or log achievement
      console.log('Earned Achievements:', earnedAchievements);
    }

    // Also add some small XP/Coins for playtime
    // e.g., 1 XP per 10 seconds
    const xpGain = Math.floor(seconds / 10);
    if (xpGain > 0) {
      updates.xp = (updates.xp || 0) + increment(xpGain);
      updates.weeklyXp = (updates.weeklyXp || 0) + increment(xpGain);
    }

    try {
      await updateDoc(userDocRef, updates);
    } catch (error) {
      console.error('Error updating play time:', error);
    }
  };

  const incrementGamesPlayed = async (gameSlug, gameCategories = []) => {
    if (!user || !db) return;

    const userDocRef = doc(db, 'users', user.uid);

    // Update history and preferences
    const updates = {
      gamesPlayed: increment(1),
      lastGamesPlayed: arrayUnion(gameSlug)
    };

    if (gameCategories.length > 0) {
      updates.preferredCategories = arrayUnion(...gameCategories);
    }

    if (!userData?.achievements?.includes('first_play')) {
      const ach = ACHIEVEMENTS.find(a => a.id === 'first_play');
      updates.achievements = arrayUnion('first_play');
      updates.xp = increment(ach.reward.xp);
      updates.weeklyXp = increment(ach.reward.xp);
      updates.coins = increment(ach.reward.coins);
    }

    try {
      await updateDoc(userDocRef, updates);
    } catch (error) {
      console.error('Error incrementing games played:', error);
    }
  };

  const claimDailyReward = async () => {
    if (!user || !db) return;

    const today = new Date().toISOString().split('T')[0];
    if (userData?.lastRewardDate === today) return;

    const userDocRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDocRef, {
        coins: increment(50),
        xp: increment(100),
        weeklyXp: increment(100),
        lastRewardDate: today
      });
      return { success: true, coins: 50, xp: 100 };
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, logout, updatePlayTime, incrementGamesPlayed, claimDailyReward }}>
      {children}
    </AuthContext.Provider>
  );
}
