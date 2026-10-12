/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': ['0.84375rem', { lineHeight: '1.125rem' }],
        xs: ['0.875rem', { lineHeight: '1.25rem' }],
        sm: ['0.9375rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
      },
      colors: {
        // GitHub Primer Canvas & Surfaces
        canvas: '#f6f8fa',
        surface: '#f6f8fa',
        'surface-raised': '#ffffff',
        border: '#d0d7de',
        'border-strong': '#afb8c1',

        // GitHub Primer Typography
        ink: '#1f2328',
        'ink-secondary': '#656d76',
        'ink-tertiary': '#8c959f',
        'ink-disabled': '#afb8c1',

        // GitHub Sidebar
        sidebar: {
          bg: '#ffffff',
          hover: '#f3f4f6',
          active: '#eaeef2',
          border: '#d0d7de',
          text: '#656d76',
          'text-muted': '#8c959f',
          'text-active': '#1f2328',
        },

        // Brand — GitHub Primary Action Green
        brand: '#1f883d',
        'brand-hover': '#1a7f37',
        'brand-light': '#dafbe1',
        'brand-border': '#4ac26b',

        // GitHub Blue Accent
        accent: '#0969da',
        'accent-hover': '#0860ca',
        'accent-light': '#ddf4ff',
        'accent-border': '#54aeff',

        // GitHub Semantic Statuses
        success: '#1a7f37',
        'success-bg': '#dafbe1',
        'success-border': '#4ac26b',
        'success-text': '#1a7f37',

        warning: '#9a6700',
        'warning-bg': '#fff8c5',
        'warning-border': '#d4a72c',
        'warning-text': '#9a6700',

        danger: '#cf222e',
        'danger-bg': '#ffebe9',
        'danger-border': '#ff8182',
        'danger-text': '#cf222e',

        info: '#0969da',
        'info-bg': '#ddf4ff',
        'info-border': '#54aeff',
        'info-text': '#0969da',

        // GitHub Merged PR Purple (Used for Healed status)
        purple: {
          50: '#fbefff',
          100: '#f3e8ff',
          500: '#8250df',
          600: '#6e40c9',
          700: '#5a32a3',
          border: '#d8b9ff',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Noto Sans"', 'Helvetica', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"'],
        mono: ['ui-monospace', 'SFMono-Regular', '"SF Mono"', 'Menlo', 'Consolas', '"Liberation Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(27, 31, 36, 0.04)',
        'card-md': '0 3px 6px rgba(140, 149, 159, 0.15)',
        'card-lg': '0 8px 24px rgba(140, 149, 159, 0.2)',
        glow: '0 0 0 3px rgba(31, 136, 61, 0.2)',
        'glow-lg': '0 0 0 3px rgba(9, 105, 218, 0.3)',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.625rem',
        '2xl': '0.75rem',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 1px #4ac26b' },
          '50%': { boxShadow: '0 0 0 3px rgba(31, 136, 61, 0.35)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.25s ease-out both',
        'fade-in': 'fade-in 0.2s ease-out both',
        'slide-in-right': 'slide-in-right 0.25s ease-out both',
        shimmer: 'shimmer 2s linear infinite',
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
        'scale-in': 'scale-in 0.2s ease-out both',
      },
    },
  },
  plugins: [],
}
