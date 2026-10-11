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
        // Clean light canvas
        canvas: '#f8fafc',
        surface: '#f1f5f9',
        'surface-raised': '#ffffff',
        border: '#e2e8f0',
        'border-strong': '#cbd5e1',

        // Text hierarchy
        ink: '#0f172a',
        'ink-secondary': '#475569',
        'ink-tertiary': '#64748b',
        'ink-disabled': '#94a3b8',

        // Sidebar — deep slate (premium contrast)
        sidebar: {
          bg: '#0f172a',
          hover: '#1e293b',
          active: '#334155',
          border: '#1e293b',
          text: '#cbd5e1',
          'text-muted': '#64748b',
          'text-active': '#ffffff',
        },

        // Brand — fresh teal
        brand: '#0d9488',
        'brand-hover': '#0f766e',
        'brand-light': '#ccfbf1',
        'brand-border': '#5eead4',

        // Semantic colors
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

        info: '#2563eb',
        'info-bg': '#eff6ff',
        'info-border': '#bfdbfe',
        'info-text': '#1d4ed8',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(15 23 42 / 0.04), 0 1px 2px -1px rgb(15 23 42 / 0.06)',
        'card-md': '0 4px 12px -2px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.05)',
        'card-lg': '0 10px 25px -5px rgb(15 23 42 / 0.1), 0 8px 10px -6px rgb(15 23 42 / 0.04)',
        glow: '0 0 20px -4px rgb(13 148 136 / 0.35)',
        'glow-lg': '0 0 32px -6px rgb(13 148 136 / 0.45)',
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
          '0%, 100%': { boxShadow: '0 0 6px -2px rgb(13 148 136 / 0.4)' },
          '50%': { boxShadow: '0 0 18px -4px rgb(13 148 136 / 0.6)' },
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
