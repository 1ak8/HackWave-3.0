/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#06070a',
          900: '#0a0c10',
          850: '#0e1117',
          800: '#141721',
          700: '#1c212f',
          600: '#282f42',
        },
        emerald: {
          glow: '#059669',
          accent: '#10b981',
          bright: '#34d399',
          surface: 'rgba(16, 185, 129, 0.08)',
        },
        amber: {
          glow: '#d97706',
          accent: '#f59e0b',
          bright: '#fbbf24',
          surface: 'rgba(245, 158, 11, 0.08)',
        },
        crimson: {
          glow: '#dc2626',
          accent: '#ef4444',
          bright: '#f87171',
          surface: 'rgba(239, 68, 68, 0.08)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
