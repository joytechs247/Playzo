'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { realtimeDb } from '@/lib/firebaseConfig';
import { ref, push, set, onValue, off } from 'firebase/database';
import Link from 'next/link';
import { getAllGames } from '@/lib/fetchGames';
import SEOHead from '@/components/SEOHead';

export default function PlayTogetherPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    async function loadGames() {
      const allGames = await getAllGames();
      setGames(allGames.slice(0, 50)); // Just a subset for selection
    }
    loadGames();

    if (!realtimeDb) {
      setLoading(false);
      return;
    }

    const roomsRef = ref(realtimeDb, 'rooms');
    const handleRooms = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const roomList = Object.entries(data).map(([id, room]) => ({
          id,
          ...room
        })).filter(r => r.status === 'active');
        setRooms(roomList);
      } else {
        setRooms([]);
      }
      setLoading(false);
    };

    onValue(roomsRef, handleRooms);
    return () => off(roomsRef, 'value', handleRooms);
  }, []);

  const createRoom = async (e) => {
    e.preventDefault();
    if (!user || !selectedGame || !roomName) return;

    setCreating(true);
    try {
      const roomsRef = ref(realtimeDb, 'rooms');
      const newRoomRef = push(roomsRef);
      const game = games.find(g => g.slug === selectedGame);

      await set(newRoomRef, {
        name: roomName,
        gameSlug: selectedGame,
        gameTitle: game?.title || selectedGame,
        hostId: user.uid,
        hostName: user.displayName,
        createdAt: Date.now(),
        status: 'active',
        players: {
          [user.uid]: {
            name: user.displayName,
            photo: user.photoURL,
            isReady: true
          }
        }
      });

      setRoomName('');
      setSelectedGame('');
      alert(`Room "${roomName}" created! Sharing link coming soon.`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Play Together - Playzo" 
        description="Real-time co-op gaming rooms. Play with friends together." 
      />
      <div className="py-12">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">👥</div>
            <h1 className="text-4xl font-headline font-black text-white mb-4">Play Together</h1>
            <p className="text-xl text-playzo-cyan/70 mb-8 max-w-2xl mx-auto">
              Create a room, invite friends, and play synchronized games in real-time.
            </p>

            {!user ? (
              <div className="bg-playzo-darker/50 border border-playzo-pink/30 p-6 rounded-xl inline-block">
                <p className="text-playzo-pink font-bold mb-4">Login to create game rooms!</p>
                <Link href="/account" className="btn-primary">
                  Login / Sign Up
                </Link>
              </div>
            ) : (
              <div className="max-w-xl mx-auto card-base p-8 border-playzo-cyan/30">
                <h2 className="text-2xl font-headline font-bold text-white mb-6">Create a New Room</h2>
                <form onSubmit={createRoom} className="space-y-4 text-left">
                  <div>
                    <label className="block text-playzo-cyan text-sm font-bold mb-2">Room Name</label>
                    <input 
                      type="text" 
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="w-full bg-playzo-dark border border-playzo-cyan/30 rounded-lg px-4 py-2 text-white focus:border-playzo-pink outline-none"
                      placeholder="Squad Goals"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-playzo-cyan text-sm font-bold mb-2">Select Game</label>
                    <select 
                      value={selectedGame}
                      onChange={(e) => setSelectedGame(e.target.value)}
                      className="w-full bg-playzo-dark border border-playzo-cyan/30 rounded-lg px-4 py-2 text-white focus:border-playzo-pink outline-none"
                      required
                    >
                      <option value="">Choose a game...</option>
                      {games.map(game => (
                        <option key={game.slug} value={game.slug}>{game.title}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={creating}
                    className="w-full btn-primary py-3 disabled:opacity-50 shadow-neon-pink"
                  >
                    {creating ? 'Creating...' : 'Create Room 🚀'}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-headline font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-playzo-pink">🌐</span>
              Active Public Rooms
            </h2>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-playzo-pink border-b-2 border-playzo-cyan mx-auto"></div>
              </div>
            ) : rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div key={room.id} className="card-base p-6 hover:border-playzo-pink transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-headline font-bold text-white group-hover:text-playzo-pink transition-colors">
                          {room.name}
                        </h3>
                        <p className="text-playzo-cyan/70 text-sm">{room.gameTitle}</p>
                      </div>
                      <div className="bg-playzo-pink/10 text-playzo-pink text-xs font-bold px-2 py-1 rounded">
                        {Object.keys(room.players || {}).length} Players
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-playzo-cyan/50 text-xs">Host: {room.hostName}</span>
                    </div>
                    <button className="w-full py-2 bg-playzo-darker border border-playzo-cyan/30 text-playzo-cyan hover:bg-playzo-cyan hover:text-playzo-navy rounded-lg font-bold transition-all">
                      Join Room
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 card-base border-dashed border-playzo-cyan/20">
                <p className="text-playzo-cyan/50 mb-4">No active rooms found.</p>
                <p className="text-sm text-playzo-cyan/30 italic">Be the first to create one!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
