# 🎮 Playzo — Free Browser Gaming Portal

A modern, playful Next.js gaming portal with thousands of free browser games, gamification features, and social leaderboards. Built with Next.js 14, Tailwind CSS, Firebase, and a vibrant neon aesthetic.

**Live Demo:** https://playzo.vercel.app

## ✨ Features

### Core Features
- ✅ **5000+ Auto-Fetched Games** — Automatically fetches and syncs games from external JSON source
- ✅ **Game Listing & Discovery** — Browse, filter, search, and sort games by category, popularity, and rating
- ✅ **Individual Game Pages** — SEO-optimized detail pages with meta tags, OG images, and structured data
- ✅ **Lazy-Loading Game Player** — Click-to-play iframe with fallback support
- ✅ **Responsive Design** — Mobile-first, accessible UI with Playzo's playful neon aesthetic
- ✅ **Full SEO** — Sitemap, robots.txt, canonical tags, JSON-LD, Open Graph, Twitter Cards
- ✅ **AdSense Ready** — Safe, Google-policy-compliant ad placement
- ✅ **Analytics** — Google Analytics 4 integration

### Gamification & Social
- 🏆 **Leaderboards** — Global and weekly rankings with XP scoring
- 🎁 **Achievements & Badges** — Unlock badges for milestones and challenges
- 👥 **User Profiles** — Track stats, badges, and XP
- 💬 **Social Sharing** — Twitter, Facebook, and link-copy sharing

### Optional Features (Stubbed)
- 🤖 **AI Personalization** — Recommendation engine (OpenAI integration point)
- 🎮 **Play Together** — Real-time co-op rooms (Firebase + WebRTC ready)
- 📸 **Meme Challenges** — User-generated content and voting system
- 🎖️ **Battle Pass System** — Seasonal progression and rewards

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Vercel account (optional, for deployment)
- Firebase project (optional, for gamification features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playzo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   See [Environment Variables](#-environment-variables) section below to fill in your values.

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📋 Environment Variables

Copy `.env.example` to `.env.local` and fill in the following:

### Required
- `NEXT_PUBLIC_BASE_URL` — Your domain (e.g., https://playzo.vercel.app)
- `NEXT_PUBLIC_GAMES_JSON` — Games JSON source URL (default: onlinegames.io)

### Google AdSense
- `NEXT_PUBLIC_ADSENSE_CLIENT` — Your AdSense client ID (ca-pub-XXXXX)

### Google Analytics
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Your GA4 Measurement ID (G-XXXXX)

### Firebase (Optional, required for gamification)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

### Optional
- `OPENAI_API_KEY` — For AI recommendations
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` — For monetization
- `CLOUDINARY_*` — For image optimization

## 🔧 Configuration

### AdSense Setup

1. **Get your Client ID**
   - Go to https://www.google.com/adsense/
   - Sign in and go to **Settings** → **Account**
   - Copy your **Publisher ID** (format: ca-pub-XXXXX)

2. **Add to `.env.local`**
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXX
   ```

3. **Ad Placements**
   - Homepage: Header banner and sidebar ads
   - Game pages: Below iframe player and between sections
   - Mobile: Sticky bottom banner

**Important:** Ads only appear when AdSense client ID is configured.

### Google Analytics Setup

1. **Create a GA4 property**
   - Go to https://analytics.google.com/
   - Create a new property named "Playzo"
   - Select "Web" and configure

2. **Get Measurement ID**
   - In GA4, go to **Data Streams** → Select your web stream
   - Copy the **Measurement ID** (format: G-XXXXX)

3. **Add to `.env.local`**
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXX
   ```

### Firebase Setup (for Gamification)

#### Create Firebase Project

1. **Go to Firebase Console**
   - Visit https://console.firebase.google.com/
   - Click **Create a project**
   - Name: "playzo"
   - Enable Google Analytics (optional)

2. **Register Web App**
   - In Firebase Console, click **Web** icon (`</>`)
   - Register app as "playzo"
   - Copy the config object

3. **Get Your Credentials**
   ```javascript
   // Firebase will show you something like:
   const firebaseConfig = {
     apiKey: "AIzaSyD_...",
     authDomain: "playzo-xxxxx.firebaseapp.com",
     projectId: "playzo-xxxxx",
     storageBucket: "playzo-xxxxx.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:...",
     databaseURL: "https://playzo-xxxxx.firebaseio.com"
   };
   ```

4. **Add to `.env.local`**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD_...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=playzo-xxxxx.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=playzo-xxxxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=playzo-xxxxx.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:...
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://playzo-xxxxx.firebaseio.com
   ```

#### Enable Firebase Services

1. **Authentication**
   - Go to **Build** → **Authentication**
   - Click **Get Started**
   - Enable **Google** and **Email/Password** providers

2. **Firestore Database**
   - Go to **Build** → **Firestore Database**
   - Click **Create database**
   - Start in **test mode** (for development)
   - Set rules for production:
   ```firestore
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own profile
       match /users/{uid} {
         allow read, write: if request.auth.uid == uid;
       }
       // Public read access to games and leaderboards
       match /leaderboards/{document=**} {
         allow read: if true;
         allow write: if false;
       }
       // Comments require auth
       match /comments/{document=**} {
         allow read: if true;
         allow create: if request.auth.uid != null;
         allow update, delete: if request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

3. **Storage (Optional, for user uploads)**
   - Go to **Build** → **Storage**
   - Click **Get Started**
   - Use default bucket

4. **Realtime Database (Optional, for Play Together)**
   - Go to **Build** → **Realtime Database**
   - Click **Create Database**
   - Start in test mode for development

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial Playzo deployment"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/import
   - Import your GitHub repo
   - Add environment variables from `.env.local`
   - Click **Deploy**

3. **Configure Domain (Optional)**
   - In Vercel project settings, add your custom domain
   - Update `NEXT_PUBLIC_BASE_URL` in production environment

### Manual Deployment

```bash
# Build for production
npm run build

# Start server
npm start
```

## 📁 Project Structure

```
playzo/
├── app/
│   ├── layout.js                 # Root layout with global setup
│   ├── page.js                   # Homepage with hero and sections
│   ├── globals.css               # Global Tailwind styles
│   ├── games/
│   │   ├── page.js              # Games listing with filters
│   │   └── [slug]/
│   │       └── page.js          # Dynamic game detail page
│   ├── categories/page.js        # Categories browser
│   ├── leaderboard/page.js       # Leaderboards page
│   ├── account/page.js           # User profile (Firebase auth)
│   ├── privacy/page.js           # Privacy policy
│   ├── terms/page.js             # Terms of service
│   ├── contact/page.js           # Contact form
│   └── api/
│       └── sitemap.xml/route.js  # Dynamic sitemap generation
├── components/
│   ├── Header.js                 # Navigation header
│   ├── Footer.js                 # Footer with links
│   ├── GameCard.js               # Game card component
│   ├── GamePlayer.js             # Lazy-loading iframe player
│   ├── SEOHead.js                # SEO meta component
│   └── AdSlot.js                 # AdSense slot component
├── lib/
│   ├── fetchGames.js             # Game data fetching & caching
│   └── firebaseConfig.js         # Firebase initialization
├── public/
│   ├── robots.txt                # Search engine rules
│   ├── manifest.json             # PWA manifest
│   └── [images]/                 # OG images, favicons
├── tailwind.config.js            # Tailwind theme (neon colors)
├── next.config.js                # Next.js configuration
├── postcss.config.js             # PostCSS setup
├── package.json                  # Dependencies
├── .env.example                  # Environment template
└── README.md                     # This file
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the Playzo theme:

```javascript
colors: {
  playzo: {
    pink: '#FF6EC7',      // Primary accent
    cyan: '#6EFCFF',      // Secondary accent
    navy: '#0F172A',      // Dark background
    warm: '#FFC870',      // Tertiary accent
    soft: '#FFFFFF',      // Light text/cards
  },
}
```

### Logo & Branding

- Replace logo text in `components/Header.js`
- Add custom logo SVG in `public/`
- Update favicon in `public/`

### Game Source

Change the games JSON source in `.env.local`:

```
NEXT_PUBLIC_GAMES_JSON=https://your-custom-api.com/games.json
```

**Required JSON format:**
```json
[
  {
    "id": "1",
    "title": "Game Name",
    "embed_url": "https://...",
    "thumbnail": "https://...",
    "description": "...",
    "categories": ["action", "arcade"],
    "publisher": "...",
    "rating": 4.5,
    "plays": 1000,
    "width": 800,
    "height": 600
  }
]
```

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### E2E Tests

```bash
npm run cypress:open  # Interactive
npm run test:e2e      # Headless
```

### Lighthouse Audit

```bash
npm run build
npm start
# Open Chrome DevTools → Lighthouse tab
```

Target scores:
- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 90+
- **SEO:** 100

## 📊 SEO Checklist

- ✅ **Meta Tags** — Title, description, canonical
- ✅ **Open Graph** — Social sharing previews
- ✅ **JSON-LD** — Structured data for games
- ✅ **Sitemap** — Dynamic at `/api/sitemap.xml`
- ✅ **Robots.txt** — Search engine directives
- ✅ **Mobile-Friendly** — Responsive design
- ✅ **Page Speed** — Image lazy-loading, ISR caching
- ✅ **Internal Linking** — Related games, categories
- ✅ **Alt Text** — All images have descriptions

## 🔒 Security & Best Practices

### Firebase Security Rules
- Never expose Firebase secret keys
- Use read-only rules for public data
- Require authentication for user-specific operations

### AdSense Policies
- Never place ads over game canvas
- No misleading ad placements
- Follow Google's content policies

### Content Security
- Sanitize user inputs (comments, uploads)
- Validate iframe sources
- Use sandbox attributes on iframes

## 📦 Optional Features Setup

### AI Recommendations (OpenAI)

1. Get API key from https://platform.openai.com/
2. Add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. Create `lib/recommendations.js` to integrate

### Stripe Payments (Coming Soon)

1. Create Stripe account at https://stripe.com
2. Add keys to `.env.local`
3. Implement checkout flow in `/account/checkout`

### Cloudinary Images

1. Sign up at https://cloudinary.com
2. Add credentials to `.env.local`
3. Update image URLs in game cards

## 🐛 Troubleshooting

### Games not loading?
- Check `NEXT_PUBLIC_GAMES_JSON` URL is accessible
- Verify JSON format matches schema
- Check browser console for CORS errors

### AdSense not showing?
- Ensure `NEXT_PUBLIC_ADSENSE_CLIENT` is set
- Check Google AdSense account status
- Wait 24-48 hours for new sites to be approved
- Verify ad slot IDs are correct

### Firebase errors?
- Ensure all environment variables are set
- Check Firebase project exists and is active
- Verify Firestore/Auth rules are configured
- Check browser console for detailed errors

### Lighthouse scores low?
- Enable image optimization: check `next/image` usage
- Implement lazy loading for below-fold content
- Minimize JavaScript bundles
- Use Next.js ISR for game pages

## 📈 Performance Tips

1. **Image Optimization** — Use `next/image` with proper sizing
2. **Code Splitting** — Dynamic imports for heavy components
3. **Caching** — ISR on game pages (revalidate: 3600)
4. **CDN** — Vercel auto-handles CDN
5. **Database Queries** — Firestore indexes for leaderboards
6. **Analytics** — Use GA4 events, not pageviews

## 🎯 Roadmap

### Phase 1 (MVP) ✅ Current
- Core game listing and discovery
- SEO optimization
- AdSense integration
- Firebase auth foundation

### Phase 2 (Gamification)
- Leaderboard system
- Achievement/badge system
- User profiles
- Social sharing

### Phase 3 (Advanced)
- AI recommendations (OpenAI)
- Play Together (WebRTC)
- Meme challenges (user uploads)
- Battle pass system

### Phase 4 (Monetization)
- Stripe integration
- Premium battle pass
- In-game cosmetics
- Creator fund

## 📞 Support

- **Email:** support@playzo.com
- **Twitter:** @playzo_games
- **Discord:** [Join Community](https://discord.gg/playzo)
- **GitHub Issues:** [Report Bugs](https://github.com/playzo/playzo/issues)

## 📄 License

MIT License — See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🙏 Acknowledgments

- Games from [onlinegames.io](https://www.onlinegames.io)
- Icons from [Heroicons](https://heroicons.com/)
- Inspired by playful modern design

---

**Built with ❤️ for gamers everywhere.**

*Playzo © 2024. All rights reserved.*
