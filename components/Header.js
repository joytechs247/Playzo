'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/games?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="header sticky top-0 z-40 w-full bg-gradient-to-b from-playzo-navy via-playzo-darker/95 to-transparent backdrop-blur-md border-b border-playzo-cyan/20">
      <div className="max-w-container mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="header-logo flex-shrink-0">
            <div className="text-2xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-playzo-pink to-playzo-cyan hover:from-playzo-cyan hover:to-playzo-pink transition-all duration-300">
              ▶ Playzo
            </div>
          </Link>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center gap-6">
            <Link href="/games" className="nav-link text-playzo-cyan hover:text-playzo-pink transition-colors font-semibold">
              Games
            </Link>
            <Link href="/categories" className="nav-link text-playzo-cyan hover:text-playzo-pink transition-colors font-semibold">
              Categories
            </Link>
            <Link href="/leaderboard" className="nav-link text-playzo-cyan hover:text-playzo-pink transition-colors font-semibold">
              Leaderboard
            </Link>
          </nav>

          
          <div className="flex items-center gap-3 ml-auto">
            
            <form onSubmit={handleSearch} className={`search-form transition-all duration-300 ${isSearchOpen ? 'w-64' : 'w-10'}`}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  className={`w-full px-4 py-2 bg-playzo-darker border border-playzo-cyan/30 rounded-lg text-white placeholder-playzo-cyan/50 focus:outline-none focus:border-playzo-pink focus:shadow-neon transition-all duration-300 ${
                    !isSearchOpen && 'px-0 border-0'
                  }`}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-playzo-cyan hover:text-playzo-pink transition-colors"
                  aria-label="Search"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>  */}

          {/* Auth Button */}
          {/* <Link href="/account" className="hidden sm:flex px-4 py-2 bg-playzo-pink hover:bg-playzo-warm text-white font-bold rounded-lg transition-all duration-300 hover:shadow-neon-lg items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Sign In</span>
            </Link> */}

          {/* Mobile Menu Toggle */}
          {/* <button className="md:hidden p-2 text-playzo-cyan hover:text-playzo-pink transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button> */}
          {/* </div> */}
        </div>
      </div>
    </header>
  );
}
