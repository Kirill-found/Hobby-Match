/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // BRANDBOOK Colors
      colors: {
        // Primary Brand Color
        brand: {
          lime: '#BFFF00',
          'lime-dark': '#A3E000',
        },
        // Background Colors
        bg: {
          'deep-space': '#0D1117',
          'midnight': '#161B22',
          'elevated': '#1C2128',
        },
        // Text Colors
        text: {
          primary: '#FFFFFF',
          secondary: '#B4B4C8',
          muted: '#6E6E8F',
        },
        // Category Colors (from BRANDBOOK)
        category: {
          fitness: '#FF006B',    // Hot Pink
          travel: '#00D9FF',     // Cyan
          creative: '#9B51E0',   // Purple
          gaming: '#F59E0B',     // Amber
          learning: '#3B82F6',   // Blue
          food: '#EF4444',       // Red
        },
        // Telegram theme vars (optional)
        telegram: {
          bg: 'var(--tg-theme-bg-color, #0D1117)',
          text: 'var(--tg-theme-text-color, #FFFFFF)',
          button: 'var(--tg-theme-button-color, #BFFF00)',
        },
      },
      // BRANDBOOK Fonts
      fontFamily: {
        'space-grotesk': ["'Space Grotesk'", 'sans-serif'],
        'inter': ["'Inter'", 'sans-serif'],
        'sans': ["'Inter'", '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      // BRANDBOOK Border Radius (minimum 12px, prefer 20-24px)
      borderRadius: {
        'card': '20px',
        'card-lg': '24px',
        'button': '9999px', // pill-shaped
      },
      // BRANDBOOK Shadows (neon glow)
      boxShadow: {
        'neon': '0 0 20px rgba(191, 255, 0, 0.4)',
        'neon-strong': '0 0 30px rgba(191, 255, 0, 0.5)',
        'neon-soft': '0 0 12px rgba(191, 255, 0, 0.2)',
      },
      // BRANDBOOK Spacing (кратно 4px)
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
      },
    },
  },
  plugins: [],
}
