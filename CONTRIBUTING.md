# Contributing to Playzo

Thank you for your interest in contributing to Playzo! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please treat all contributors with respect and courtesy.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/playzo.git
   cd playzo
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/playzo/playzo.git
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Fill in your development values
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Code Style

- **JavaScript**: Use standard JavaScript conventions (no TypeScript)
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS with our custom color palette
- **Naming**: Use descriptive, camelCase names for variables and functions
- **Comments**: Add comments for complex logic, not obvious code

### Tailwind Color Variables

Always use Playzo's custom colors from `tailwind.config.js`:

```javascript
// ✅ Good
<div className="text-playzo-pink hover:text-playzo-cyan">

// ❌ Bad
<div className="text-red-500 hover:text-blue-500">
```

## Commit Guidelines

- Use clear, descriptive commit messages
- Start with a verb: "Add", "Fix", "Update", "Refactor"
- Reference issues when applicable: "Fix #123"

Examples:
```
Add game search functionality
Fix loading state on game cards
Update Hero section styling
Refactor fetchGames.js for clarity
```

## Pull Request Process

1. Ensure your code follows the style guide
2. Update the README if you've made changes to configuration or setup
3. Add tests for new functionality
4. Ensure all tests pass:
   ```bash
   npm test
   ```
5. Test the build:
   ```bash
   npm run build
   npm start
   ```
6. Push your branch and create a Pull Request
7. Describe what your PR does and reference any related issues
8. Be responsive to feedback and review comments

## Testing

Write tests for all new features:

```bash
# Run tests
npm test

# Run specific test file
npm test -- fetchGames.test.js

# Run with coverage
npm test -- --coverage
```

Test file locations:
- Unit tests: `__tests__/lib/` or `__tests__/utils/`
- Component tests: `__tests__/components/`

## Performance Considerations

- Use `next/image` for all game thumbnails
- Implement lazy loading for below-fold content
- Minimize JavaScript bundle size
- Cache API responses appropriately
- Test Lighthouse scores before submitting PR

## Adding New Pages

1. Create a new file in `app/` directory
2. Add SEO metadata using `generateMetadata`
3. Add to sitemap generation in `app/api/sitemap.xml/route.js` if needed
4. Update navigation links in `components/Header.js` if applicable
5. Add tests for the new page

## Adding New Components

1. Create component in `components/`
2. Use functional components with hooks
3. Export as default export
4. Add PropTypes or JSDoc comments for props
5. Example:
   ```javascript
   /**
    * GameCard Component
    * @param {Object} game - Game data object
    * @param {string} game.title - Game title
    * @param {string} game.slug - Game URL slug
    */
   export default function GameCard({ game }) {
     return (...)
   }
   ```

## Database Schema (Firestore)

If working with Firebase, follow this structure:

```
/users/{uid}
  ├── email: string
  ├── displayName: string
  ├── avatar: string
  ├── xp: number
  ├── badges: array
  └── createdAt: timestamp

/leaderboards/{period}
  ├── userId: string
  ├── username: string
  ├── xp: number
  └── rank: number

/gameScores/{id}
  ├── userId: string
  ├── gameId: string
  ├── score: number
  └── timestamp: timestamp

/comments/{id}
  ├── userId: string
  ├── gameId: string
  ├── text: string
  ├── rating: number
  └── timestamp: timestamp
```

## Reporting Bugs

1. Check if the bug has already been reported
2. Create a clear, descriptive issue
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment (OS, browser, Node version)
   - Screenshots if applicable

## Feature Requests

1. Check existing issues to avoid duplicates
2. Clearly describe the feature and use case
3. Explain how it benefits users
4. Include wireframes or mockups if helpful

## Documentation

- Update README for setup changes
- Add comments for complex functions
- Document API routes and usage
- Include examples in documentation

## Questions?

- Open an issue for general questions
- Reach out at contributing@playzo.com
- Join our Discord community

## License

By contributing to Playzo, you agree that your contributions will be licensed under its MIT License.

Thank you for making Playzo better! 🎮✨
