import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer bg-gradient-to-t from-playzo-darker via-playzo-navy to-transparent border-t border-playzo-cyan/20 mt-20">
      <div className="max-w-container mx-auto px-4 lg:px-8 py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div className="footer-about">
            <h3 className="text-2xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-playzo-pink to-playzo-cyan mb-4">
              Playzo
            </h3>
            <p className="text-playzo-cyan/70 text-sm">
              The ultimate browser gaming hub. Play instantly, compete globally, and have fun!
            </p>
          </div>

          {/* Games */}
          <div className="footer-games">
            <h4 className="font-headline font-bold text-playzo-pink mb-4">Games</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/games" className="text-playzo-cyan/70 hover:text-playzo-pink transition-colors text-sm">
                  Browse Games
                </Link>
              </li>
              <li>
                <Link href="/games?category=trending" className="text-playzo-cyan/70 hover:text-playzo-pink transition-colors text-sm">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/games?category=new" className="text-playzo-cyan/70 hover:text-playzo-pink transition-colors text-sm">
                  New Games
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-playzo-cyan/70 hover:text-playzo-pink transition-colors text-sm">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="footer-community">
            <h4 className="font-headline font-bold text-playzo-pink mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-playzo-cyan/70 hover:text-playzo-pink transition-colors text-sm">
                  My Profile
                </Link>
              </li>
              <li>
                <a href="#" className="text-playzo-cyan/70 hover:text-playzo-pink transition-colors text-sm">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-playzo-cyan/70 hover:text-playzo-pink transition-colors text-sm">
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-legal">
            <h4 className="font-headline font-bold text-playzo-pink mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-playzo-cyan/70 hover:text-playzo-pink transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-playzo-cyan/70 hover:text-playzo-pink transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-playzo-cyan/70 hover:text-playzo-pink transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-playzo-cyan/20 my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-playzo-cyan/50 text-xs text-center md:text-left">
            © 2024 Playzo. All rights reserved. Games embedded from third-party providers.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-playzo-cyan/50 hover:text-playzo-pink transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.469v6.766z" />
              </svg>
            </a>
            <a href="#" className="text-playzo-cyan/50 hover:text-playzo-pink transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-1 11-4s1-6.75 0-7c-1-1.5-4-1-5.5 0" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
