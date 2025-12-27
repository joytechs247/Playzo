/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        playzo: {
          pink: '#FF6EC7',
          cyan: '#6EFCFF',
          navy: '#0F172A',
          warm: '#FFC870',
          soft: '#FFFFFF',
          dark: '#1a1a2e',
          darker: '#16213e',
          accent: '#FF6EC7',
        },
      },
      fontFamily: {
        headline: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
        ],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
      },
      boxShadow: {
        neon: '0 0 10px rgba(255, 110, 199, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 110, 199, 0.8)',
        'neon-cyan': '0 0 20px rgba(110, 252, 255, 0.8)',
        'neon-lg': '0 0 30px rgba(255, 110, 199, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255, 110, 199, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 110, 199, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      spacing: {
        gutter: '1.5rem',
      },
      maxWidth: {
        container: '1400px',
      },
    },
  },
  plugins: [],
};
