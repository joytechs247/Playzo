'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { db, storage } from '@/lib/firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, increment, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Link from 'next/link';
import SEOHead from '@/components/SEOHead';

export default function MemeChallengesPage() {
  const { user, userData } = useAuth();
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'memes'), orderBy('votes', 'desc'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memeList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMemes(memeList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user || !file || !title) return;

    setUploading(true);
    try {
      let imageUrl = '';
      if (storage) {
        const storageRef = ref(storage, `memes/${user.uid}_${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      } else {
        // Fallback for demo if storage is not configured
        imageUrl = URL.createObjectURL(file);
      }

      await addDoc(collection(db, 'memes'), {
        title,
        imageUrl,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL,
        votes: 0,
        voters: [],
        createdAt: serverTimestamp()
      });

      setTitle('');
      setFile(null);
      setShowUpload(false);
      alert('Meme uploaded successfully! 🚀');
    } catch (error) {
      console.error('Error uploading meme:', error);
      alert('Failed to upload meme. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleVote = async (memeId, voters = []) => {
    if (!user) {
      alert('Please log in to vote!');
      return;
    }

    if (voters.includes(user.uid)) {
      alert('You already voted for this meme!');
      return;
    }

    try {
      const memeRef = doc(db, 'memes', memeId);
      await updateDoc(memeRef, {
        votes: increment(1),
        voters: [...voters, user.uid]
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <>
      <SEOHead 
        title="Meme Challenges - Playzo" 
        description="Create and vote on gaming memes and funny moments. Win XP and rewards!" 
      />
      <div className="py-12">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">😂</div>
            <h1 className="text-4xl font-headline font-black text-white mb-4">Meme Challenges</h1>
            <p className="text-xl text-playzo-cyan/70 mb-8 max-w-2xl mx-auto">
              Share your funniest gaming moments and compete for the top spot!
            </p>

            {!user ? (
              <div className="bg-playzo-darker/50 border border-playzo-pink/30 p-6 rounded-xl inline-block">
                <p className="text-playzo-pink font-bold mb-4">Login to participate in challenges!</p>
                <Link href="/account" className="btn-primary">
                  Login / Sign Up
                </Link>
              </div>
            ) : (
              <button 
                onClick={() => setShowUpload(!showUpload)}
                className="btn-primary"
              >
                {showUpload ? 'Cancel Upload' : 'Submit a Meme'}
              </button>
            )}
          </div>

          {showUpload && user && (
            <div className="max-w-xl mx-auto mb-12 card-base p-8 border-playzo-pink animate-slide-up">
              <h2 className="text-2xl font-headline font-bold text-white mb-6">Submit Your Meme</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-playzo-cyan text-sm font-bold mb-2">Meme Title / Caption</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-playzo-dark border border-playzo-cyan/30 rounded-lg px-4 py-2 text-white focus:border-playzo-pink outline-none"
                    placeholder="When you finally beat the boss..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-playzo-cyan text-sm font-bold mb-2">Upload Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full text-playzo-cyan/70 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-playzo-pink file:text-white hover:file:bg-playzo-warm"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="w-full btn-primary py-3 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Post Meme 🚀'}
                </button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-playzo-pink border-b-2 border-playzo-cyan mx-auto"></div>
              </div>
            ) : memes.length > 0 ? (
              memes.map((meme) => (
                <div key={meme.id} className="card-base overflow-hidden flex flex-col group">
                  <div className="relative aspect-video bg-black">
                    <img 
                      src={meme.imageUrl} 
                      alt={meme.title}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-playzo-pink/50 flex items-center gap-2">
                      <span className="text-playzo-pink">🔥</span>
                      <span className="text-white font-bold">{meme.votes}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-headline font-bold text-white mb-4 line-clamp-2">
                        {meme.title}
                      </h3>
                      <div className="flex items-center gap-3 mb-6">
                        <img 
                          src={meme.userPhoto || 'https://via.placeholder.com/40'} 
                          className="w-8 h-8 rounded-full border border-playzo-cyan/30"
                          alt={meme.userName}
                        />
                        <span className="text-playzo-cyan/70 text-sm font-medium">@{meme.userName}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleVote(meme.id, meme.voters)}
                      disabled={user && meme.voters?.includes(user.uid)}
                      className={`w-full py-3 rounded-xl font-headline font-bold transition-all flex items-center justify-center gap-2 ${
                        user && meme.voters?.includes(user.uid)
                        ? 'bg-playzo-darker text-playzo-cyan/30 border border-playzo-cyan/10 cursor-not-allowed'
                        : 'bg-playzo-pink/10 hover:bg-playzo-pink text-playzo-pink hover:text-white border border-playzo-pink/30 hover:shadow-neon-pink'
                      }`}
                    >
                      <span>{user && meme.voters?.includes(user.uid) ? 'Voted' : 'Upvote'}</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-playzo-cyan/50">
                No memes yet. Be the first to share a laugh!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
