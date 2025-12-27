import { notFound } from 'next/navigation';
import { getGameBySlug, getAllGames } from '@/lib/fetchGames';
import StandalonePlayer from '@/components/StandalonePlayer';

export const revalidate = 3600;

export async function generateStaticParams() {
  const games = await getAllGames();
  return games.map((game) => ({
    slug: game.slug,
  }));
}



export async function generateMetadata({ params }) {
  const game = await getGameBySlug(params.slug);
  if (!game) return { title: 'Game Not Found' };

  return {
    title: `${game.title} - Fullscreen Mode`,
    description: `Play ${game.title} in fullscreen on Playzo.`,
    robots: { index: false, follow: false }, // Don't index fullscreen pages to avoid SEO cannibalization
  };
}

export default async function FullscreenGamePage({ params }) {
  const game = await getGameBySlug(params.slug);

  if (!game) {
    notFound();
  }

  return <StandalonePlayer game={game} />;
}
