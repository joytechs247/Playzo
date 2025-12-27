import Link from 'next/link';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="not-found-page min-h-screen flex items-center justify-center py-12">
      <div className="text-center space-y-6 px-4">
        <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-playzo-pink to-playzo-cyan mb-4">
          404
        </div>

        <h1 className="text-5xl md:text-6xl font-headline font-black text-white">
          Page Not Found
        </h1>

        <p className="text-xl text-playzo-cyan/80 max-w-2xl mx-auto">
          Oops! The game you're looking for seems to have escaped the portal. Let's get you back on track!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/" className="btn-primary shadow-neon-lg">
            Back to Home
          </Link>
          <Link href="/games" className="btn-secondary">
            Browse Games
          </Link>
        </div>

        <div className="mt-12">
          <div className="text-6xl animate-bounce">🎮</div>
        </div>
      </div>
    </div>
  );
}
