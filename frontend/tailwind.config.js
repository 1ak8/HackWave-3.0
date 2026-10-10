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
        apple: {
          bg: '#f5f5f7',
          surface: '#ffffff',
          border: 'rgba(0, 0, 0, 0.07)',
          'border-subtle': 'rgba(0, 0, 0, 0.04)',
          text: '#1d1d1f',
          secondary: '#6e6e73',
          tertiary: '#86868b',
          blue: '#0071e3',
          'blue-hover': '#0077ed',
          'blue-light': '#f0f6ff',
          green: '#34c759',
          'green-light': '#ecfdf3',
          orange: '#ff9500',
          'orange-light': '#fff8eb',
          red: '#ff3b30',
          'red-light': '#fef2f2',
          purple: '#af52de',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Plus Jakarta Sans"',
          '"Helvetica Neue"',
          'sans-serif'
        ],
        mono: [
          '"SF Mono"',
          'Menlo',
          'Monaco',
          '"JetBrains Mono"',
          'Consolas',
          'monospace'
        ]
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'apple-card': '0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'apple-elevated': '0 16px 40px -6px rgba(0, 0, 0, 0.07), 0 6px 16px -3px rgba(0, 0, 0, 0.03)',
        'apple-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.06)'
      },
      borderRadius: {
        'apple-xl': '18px',
        'apple-2xl': '24px',
        'apple-3xl': '32px'
      }
    },
  },
  plugins: [],
}
