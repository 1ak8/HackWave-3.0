/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core neutrals — clean whites and grays
        canvas: '#ffffff',
        surface: '#fafafa',
        'surface-raised': '#ffffff',
        border: '#e5e7eb',
        'border-strong': '#d1d5db',

        // Text hierarchy
        ink: '#111827',
        'ink-secondary': '#6b7280',
        'ink-tertiary': '#9ca3af',
        'ink-disabled': '#d1d5db',

        // Sidebar — deep charcoal, Vercel/Linear style
        sidebar: {
          bg: '#111827',
          hover: '#1f2937',
          active: '#1f2937',
          border: '#1f2937',
          text: '#e5e7eb',
          'text-muted': '#6b7280',
          'text-active': '#ffffff',
        },

        // Accent — Vercel-style indigo/violet
        brand: '#6366f1',
        'brand-hover': '#4f46e5',
        'brand-light': '#eef2ff',
        'brand-border': '#c7d2fe',

        // Semantic colors — crisp and unambiguous
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
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-md': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        'card-lg': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        'inner-sm': 'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
