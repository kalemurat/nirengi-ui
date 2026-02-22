/** @type {import('tailwindcss').Config} */

// Define color palette separately to reuse in semantic definitions
// Define color palette separately to reuse in semantic definitions
const palette = {
  // Base colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  current: 'currentColor',

  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  secondary: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  info: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
};

module.exports = {
  darkMode: 'class',
  content: ['./projects/nirengi-ui-kit/src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      /**
       * UI Kit Component Heights
       * Size enum değerlerine karşılık gelen yükseklik değerleri.
       */
      height: {
        'component-xs': '24px',
        'component-sm': '32px',
        'component-md': '36px',
        'component-lg': '40px',
        'component-xl': '48px',
      },

      /**
       * UI Kit Spacing Extensions
       */
      spacing: {
        3.5: '0.875rem',
      },

      // ===========================================
      // SEMANTIC TOKENS (Dark Mode Support)
      // ===========================================

      // 1. Text Colors
      textColor: {
        primary: {
          DEFAULT: 'var(--text-primary)',
          ...palette.primary,
        },
        secondary: {
          DEFAULT: 'var(--text-secondary)',
          ...palette.secondary,
        },
        tertiary: {
          DEFAULT: 'var(--text-tertiary)',
          ...palette.neutral, // Tertiary often maps to neutral/gray
        },
        disabled: 'var(--text-disabled)',
        inverse: 'var(--text-inverse)',
        brand: 'var(--text-brand)',
        // Palette colors for specific shades
        success: palette.success,
        warning: palette.warning,
        danger: palette.danger,
        info: palette.info,
        neutral: palette.neutral,
      },

      // 2. Background Colors
      backgroundColor: {
        primary: {
          DEFAULT: 'var(--bg-primary)',
          ...palette.primary,
        },
        secondary: {
          DEFAULT: 'var(--bg-secondary)',
          ...palette.secondary,
        },
        tertiary: {
          DEFAULT: 'var(--bg-tertiary)',
          ...palette.neutral,
        },
        inverse: 'var(--bg-inverse)',
        // Merge palettes to allow bg-success-50, etc.
        success: palette.success,
        warning: palette.warning,
        danger: palette.danger,
        info: palette.info,
        neutral: palette.neutral,
      },

      // 3. Border Colors
      borderColor: {
        default: 'var(--border-default)',
        subtle: 'var(--border-subtle)',
        strong: 'var(--border-strong)',
        // Merge palettes via colors below or explicitly here
        primary: palette.primary,
        secondary: palette.secondary,
        success: palette.success,
        warning: palette.warning,
        danger: palette.danger,
        info: palette.info,
        neutral: palette.neutral,
      },

      // 4. Ring Colors
      ringColor: {
        default: 'var(--border-default)',
        subtle: 'var(--border-subtle)',
        brand: 'var(--text-brand)',
        primary: palette.primary,
        secondary: palette.secondary,
        success: palette.success,
        warning: palette.warning,
        danger: palette.danger,
        info: palette.info,
        neutral: palette.neutral,
      },

      // 5. Placeholder Colors - Extend to match textColor for semantics
      placeholderColor: {
        primary: {
          DEFAULT: 'var(--text-primary)',
          ...palette.primary,
        },
        secondary: {
          DEFAULT: 'var(--text-secondary)',
          ...palette.secondary,
        },
        tertiary: {
          DEFAULT: 'var(--text-tertiary)',
          ...palette.neutral,
        },
        // Also allow raw palette usage
        success: palette.success,
        warning: palette.warning,
        danger: palette.danger,
        info: palette.info,
        neutral: palette.neutral,
      },

      // 6. Ring Offset Colors - Extend to match backgroundColor semantics
      ringOffsetColor: {
        primary: {
          DEFAULT: 'var(--bg-primary)',
          ...palette.primary,
        },
        secondary: {
          DEFAULT: 'var(--bg-secondary)',
          ...palette.secondary,
        },
        tertiary: {
          DEFAULT: 'var(--bg-tertiary)',
          ...palette.neutral,
        },
      },

      // Color palette - Design token'lardan gelen renkler
      colors: palette,

      // Font ailesi
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
