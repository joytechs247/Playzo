import { getAllGames } from '@/lib/fetchGames';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://playzo.vercel.app';
  const games = await getAllGames();
  const lastModDate = new Date().toISOString();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Homepage
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}</loc>\n`;
  xml += `    <lastmod>${lastModDate}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // Games listing
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/games</loc>\n`;
  xml += `    <lastmod>${lastModDate}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n`;

  // Categories
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/categories</loc>\n`;
  xml += `    <lastmod>${lastModDate}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;

  // Leaderboard
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/leaderboard</loc>\n`;
  xml += `    <lastmod>${lastModDate}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>0.7</priority>\n`;
  xml += `  </url>\n`;

  // Individual game pages
  games.forEach((game) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/games/${game.slug}</loc>\n`;
    xml += `    <lastmod>${lastModDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // Legal pages
  ['privacy', 'terms', 'contact'].forEach((page) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/${page}</loc>\n`;
    xml += `    <lastmod>${lastModDate}</lastmod>\n`;
    xml += `    <changefreq>yearly</changefreq>\n`;
    xml += `    <priority>0.5</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}
