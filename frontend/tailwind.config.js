/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': ['0.8125rem', { lineHeight: '1rem' }],
        xs: ['0.8125rem', { lineHeight: '1rem' }],
      },
      colors: {
        // Warm Alabaster Canvas
        canvas: '#faf9f6',
        surface: '#f4f2ec',
        'surface-raised': '#ffffff',
        border: '#e8e4dc',
        'border-strong': '#d6d0c4',

        // Deep Espresso & Warm Stone Typography
        ink: '#1c1917',
        'ink-secondary': '#57534e',
        'ink-tertiary': '#8c827a',
        'ink-disabled': '#b5aca4',

        // Sidebar — Unified Warm Luxury
        sidebar: {
          bg: '#ffffff',
          hover: '#f5f3ed',
          active: '#fff7ed',
          border: '#e8e4dc',
          text: '#57534e',
          'text-muted': '#8c827a',
          'text-active': '#c2410c',
        },

        // Brand — Rich Sunset Terracotta / Warm Copper
        brand: '#ea580c',
        'brand-hover': '#c2410c',
        'brand-light': '#fff7ed',
        'brand-border': '#fed7aa',

        // Semantic status colors (clean, non-AI)
        success: '#16a34a',
        'success-bg': '#f0fdf4',
        'success-border': '#bbf7d0',
        'success-text': '#15803d',

        warning: '#d97706',
        'warning-bg': '#fffbeb',
        'warning-border': '#fde68a',
        'warning-text': '#b45309',

        danger: '#dc2626',
        'danger-bg': '#fef2f2',
        'danger-border': '#fecaca',
        'danger-text': '#b91c1c',

        info: '#ea580c',
        'info-bg': '#fff7ed',
        'info-border': '#fed7aa',
        'info-text': '#c2410c',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(28 25 23 / 0.04), 0 1px 2px -1px rgb(28 25 23 / 0.04)',
        'card-md': '0 4px 12px -2px rgb(28 25 23 / 0.07), 0 2px 4px -2px rgb(28 25 23 / 0.04)',
        'card-lg': '0 10px 25px -5px rgb(28 25 23 / 0.09), 0 8px 10px -6px rgb(28 25 23 / 0.04)',
        glow: '0 0 20px -4px rgb(234 88 12 / 0.35)',
        'glow-lg': '0 0 32px -6px rgb(234 88 12 / 0.45)',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        md: '0.625rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 6px -2px rgb(234 88 12 / 0.35)' },
          '50%': { boxShadow: '0 0 18px -4px rgb(234 88 12 / 0.55)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out both',
        'fade-in': 'fade-in 0.3s ease-out both',
        'slide-in-right': 'slide-in-right 0.35s ease-out both',
        shimmer: 'shimmer 2s linear infinite',
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
        'scale-in': 'scale-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}
