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
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          card: '#ffffff',
        },
        heal: {
          light: '#ecfdf5',
          border: '#a7f3d0',
          accent: '#059669',
          text: '#065f46',
        },
        warning: {
          light: '#fffbeb',
          border: '#fde68a',
          accent: '#d97706',
          text: '#92400e',
        },
        danger: {
          light: '#fef2f2',
          border: '#fecaca',
          accent: '#dc2626',
          text: '#991b1b',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'glow-brand': '0 0 20px -3px rgba(79, 70, 229, 0.25)',
        'glow-heal': '0 0 20px -3px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
