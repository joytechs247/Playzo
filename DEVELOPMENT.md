# Playzo Development Guide

This guide explains the architecture, patterns, and key concepts in the Playzo codebase.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                   │
├─────────────────────────────────────────────────────────┤
│                    Pages & Routes                       │
│  (app/, app/games/, app/games/[slug]/, etc.)           │
├─────────────────────────────────────────────────────────┤
│                  Components & UI Layer                  │
│  (Header, Footer, GameCard, GamePlayer, etc.)          │
├─────────────────────────────────────────────────────────┤
│              Data Fetching & Business Logic             │
│  (lib/fetchGames.js, lib/firebaseConfig.js)            │
├─────────────────────────────────────────────────────────┤
│              External Services & APIs                   │
│  (onlinegames.io, Firebase, Google Analytics, AdSense) │
└─────────────────────────────────────────────────────────┘
```

## Core Modules

### 1. Game Data Layer (`lib/fetchGames.js`)

Handles all game data operations with caching:

```javascript
// Fetch and cache all games (1-hour TTL)
const games = await getAllGames();

// Get individual game by slug
const game = await getGameBySlug('flappy-bird-1');

// Search and filter
const results = await searchGames('puzzle');
const filtered = await getGamesByCategory('Action');

// Get specialized lists
const trending = await getTrendingGames(10);
const featured = await getFeaturedGames(5);
const related = await getRelatedGames(gameSlug);
```

**Caching Strategy:**
- In-memory cache for 1 hour
- Automatic cache invalidation
- Fallback to empty array on fetch failure

**Data Transformation:**
- Auto-generates unique slugs from title + ID
- Extracts categories from multiple fields
- Generates fallback descriptions
- Normalizes game metadata

### 2. Firebase Integration (`lib/firebaseConfig.js`)

Graceful Firebase initialization:

```javascript
import { app, auth, db, storage, realtimeDb } from '@/lib/firebaseConfig';

// Firebase is optional - app will work without it
if (auth) {
  // Use Firebase auth
}

if (db) {
  // Use Firestore
}

if (realtimeDb) {
  // Use Realtime Database for Play Together
}
```

**Services:**
- **Auth**: User authentication (Google, Email/Password)
- **Firestore**: User profiles, leaderboards, comments
- **Storage**: User uploads, screenshots
- **Realtime DB**: Play Together rooms, live chat

### 3. Pages & Routing

#### Static & Dynamic Pages

```
/ (Homepage)
  ├── generateStaticParams: None (cached via ISR)
  └── revalidate: 3600 (1 hour)

/games (Listing)
  ├── Client-side: Search, filter, pagination
  └── Cached via component-level data

/games/[slug] (Detail)
  ├── generateStaticParams(): All game slugs
  ├── generateMetadata(): Dynamic SEO per game
  └── revalidate: 3600

/categories
  ├── generateStaticParams: None
  └── Dynamic category list

/api/sitemap.xml (Dynamic)
  └── Returns XML sitemap with all games
```

**ISR Strategy:**
- Game list revalidates every hour (new games appear quickly)
- Game detail pages cached but revalidate on changes
- Search/filter happen client-side for better UX

### 4. Components

#### Header (`components/Header.js`)
- Sticky navigation with logo
- Search bar with inline submission
- Auth button
- Responsive mobile menu (stub)

#### GameCard (`components/GameCard.js`)
- Thumbnail with lazy loading fallback
- Hover effects with play button
- Categories/tags display
- Rating and publisher info
- Play count

#### GamePlayer (`components/GamePlayer.js`)
- Click-to-play overlay (prevents auto-load)
- Lazy iframe loading
- Loading skeleton
- Fallback "Open in New Tab" link
- Responsive aspect ratio

#### AdSlot (`components/AdSlot.js`)
- Google AdSense integration
- Responsive ad units
- Graceful degradation if AdSense not configured

#### Footer (`components/Footer.js`)
- Multi-column layout
- Quick links
- Social media
- Copyright info

### 5. SEO Implementation

#### Metadata Patterns

**Static Pages:**
```javascript
export const metadata = {
  title: 'Page Title',
  description: '...',
  openGraph: { ... },
};
```

**Dynamic Pages:**
```javascript
export async function generateMetadata({ params }) {
  const data = await getData(params.id);
  return {
    title: `${data.title} — Playzo`,
    description: data.description,
    openGraph: {
      images: [{ url: data.image }],
    },
  };
}
```

#### Structured Data

```javascript
// JSON-LD for games
{
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "Game Title",
  "url": "https://...",
  "image": "https://...",
  "author": { "@type": "Organization", "name": "Publisher" },
  "aggregateRating": {
    "ratingValue": 4.5,
    "bestRating": 5
  }
}
```

#### Sitemap Generation

Dynamic at `/api/sitemap.xml`:
- Homepage
- Main pages (/games, /categories, /leaderboard)
- All individual game pages
- Legal pages (/privacy, /terms, /contact)

### 6. Analytics & Ads

#### Google Analytics Integration

```javascript
// In layout.js
{process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
  <script async src={`https://www.googletagmanager.com/gtag/js?id=...`} />
)}
```

Events tracked:
- Page views (automatic)
- Game plays (manual trigger)
- Search queries
- Leaderboard views

#### AdSense Implementation

```javascript
// Ads only load if client ID is configured
<AdSlot slotId="7264071687" format="horizontal" />
```

**Placement Strategy:**
- Below header (desktop only)
- Between content sections
- Below game player (game pages)
- Sidebar (desktop, future)

**Important:** Ads never overlap game iframe due to layout separation.

## State Management

### Client-Side

Games listing uses React hooks:

```javascript
const [games, setGames] = useState([]);
const [filteredGames, setFilteredGames] = useState([]);
const [selectedCategory, setSelectedCategory] = useState('');
const [sortBy, setSortBy] = useState('trending');
```

**Pattern:**
1. Fetch all games once on mount
2. Filter/sort in memory
3. Update UI via hooks
4. No Redux/Zustand needed for current scope

### Server-Side

Data fetching patterns:

```javascript
// Server Component (default)
const data = await fetchGames(); // Cached

// Client Component
'use client';
useEffect(() => {
  const load = async () => {
    const data = await getAllGames();
    setGames(data);
  };
  load();
}, []);
```

### Firebase State

```javascript
// User auth state (in future Account page)
const [user, setUser] = useState(null);
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUser(user);
  });
  return unsubscribe;
}, []);
```

## Styling

### Tailwind Configuration

**Color Palette:**
```javascript
playzo: {
  pink: '#FF6EC7',    // Primary CTA, highlights
  cyan: '#6EFCFF',    // Text, secondary elements
  navy: '#0F172A',    // Main background
  warm: '#FFC870',    // Tertiary accent
  soft: '#FFFFFF',    // Light text, cards
}
```

**Utility Classes:**
```css
.card-base         /* Styled card with border/glow */
.btn-primary       /* Pink gradient button */
.btn-secondary     /* Cyan outline button */
.neon-glow         /* Pink shadow */
.gradient-text     /* Pink→Cyan text gradient */
.game-grid         /* Responsive game grid */
```

### Animations

**Defined in `tailwind.config.js`:**
- `fade-in`: 0.5s fade
- `slide-up`: Slide up from below
- `pulse-neon`: Neon glow pulse
- `float`: Subtle vertical float

**CSS Animations:**
```css
@keyframes shimmer { ... }  /* Loading skeleton */
```

## Error Handling

### Graceful Degradation

**Firebase Optional:**
```javascript
// App works without Firebase
if (db) {
  // Firestore features enabled
}
```

**Games JSON Fails:**
```javascript
try {
  const response = await axios.get(GAMES_SOURCE_URL);
} catch (error) {
  console.error('Error fetching games:', error.message);
  return [];  // Return empty, app shows "no games"
}
```

**AdSense Not Configured:**
```javascript
if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT) {
  return null;  // Don't render ad slot
}
```

**Iframe Fails to Load:**
```javascript
// Fallback "Open in New Tab" button
<button onClick={handleOpenInNewTab}>
  Open Game in New Tab
</button>
```

## Performance Optimization

### Image Optimization

```javascript
// ✅ Use next/image with lazy loading
<Image 
  src={url}
  alt="description"
  loading="lazy"
  onError={() => setImageError(true)}
/>

// ❌ Avoid regular <img> tags
```

### Code Splitting

Lazy load heavy components:

```javascript
const GamePlayer = dynamic(() => import('@/components/GamePlayer'), {
  loading: () => <div>Loading...</div>,
});
```

### Caching Layers

1. **HTTP Cache** (Vercel CDN)
   - ISR on game pages
   - 1-hour revalidation

2. **Next.js Cache** (Request level)
   - Game data fetching
   - Static props

3. **In-Memory Cache** (fetchGames.js)
   - 1-hour TTL
   - Prevents re-fetching

4. **Browser Cache**
   - 304 responses for unchanged content
   - Local storage for preferences

### Bundle Analysis

```bash
npm install --save-dev @next/bundle-analyzer
# Then run `npm run analyze` (requires next.config.js setup)
```

## Testing Strategy

### Unit Tests

```javascript
// Test data transformation
describe('fetchGames', () => {
  it('should generate unique slugs', () => {
    const game = mapGameData({ title: 'Test', id: '1' });
    expect(game.slug).toBeDefined();
  });
});
```

### Component Tests

```javascript
// Test component rendering
describe('GameCard', () => {
  it('should display game title', () => {
    render(<GameCard game={mockGame} />);
    expect(screen.getByText('Game Title')).toBeInTheDocument();
  });
});
```

### E2E Tests

```javascript
// Test user workflows
describe('Game Browse', () => {
  it('should filter games by category', () => {
    cy.visit('/games');
    cy.select('Action');
    cy.get('[data-testid="game-card"]').should('have.length.greaterThan', 0);
  });
});
```

## Deployment Checklist

### Before Deploying

- [ ] Test all pages locally
- [ ] Run `npm run build` successfully
- [ ] Test game fetch from source
- [ ] Verify environment variables
- [ ] Check SEO (meta tags, sitemap)
- [ ] Test AdSense placeholder
- [ ] Lighthouse score > 90

### After Deploying

- [ ] Test live site in browser
- [ ] Verify all links work
- [ ] Check Google Search Console
- [ ] Monitor analytics
- [ ] Check for JavaScript errors
- [ ] Test on mobile devices

## Future Enhancements

### Phase 2: Gamification
- Implement Firebase auth
- Create Firestore leaderboard system
- Build user profile pages
- Add XP and badge system

### Phase 3: Advanced Features
- AI recommendations (OpenAI)
- Play Together (WebRTC)
- Meme challenges (uploads)
- Battle pass (Firestore)

### Phase 4: Monetization
- Stripe payment integration
- Premium features
- Cosmetics shop
- Creator fund

## Debugging Tips

### Enable Debug Logging

```javascript
// In fetchGames.js
console.log('Fetching from:', GAMES_SOURCE_URL);
console.log('Cached games:', cachedGames?.length);

// In browser console
localStorage.debug = '*';
```

### Common Issues

**Games not loading:**
- Check NEXT_PUBLIC_GAMES_JSON is accessible
- Verify JSON format in browser DevTools Network tab
- Check CORS headers

**Slow page loads:**
- Check Network tab for large assets
- Verify images are being lazy-loaded
- Profile with Lighthouse

**AdSense not showing:**
- Wait 24-48 hours for new site approval
- Check Console for errors
- Verify client ID format (ca-pub-XXXXX)

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Google SEO Starter Guide](https://developers.google.com/search/docs)
- [Web Vitals](https://web.dev/vitals/)

---

Happy developing! 🎮✨
