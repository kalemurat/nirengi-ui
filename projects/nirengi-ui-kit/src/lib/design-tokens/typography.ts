/**
 * UI Kit typography design tokens.
 * Font families, sizes, weights, and line-height values.
 *
 * @see https://tailwindcss.com/docs/font-size
 */

/**
 * Font family definitions.
 */
export interface FontFamily {
  /** Sans-serif font family */
  sans: string[];
  /** Serif font family */
  serif: string[];
  /** Monospace font family */
  mono: string[];
}

/**
 * Font size and line-height combination.
 */
export interface FontSizeConfig {
  /** Font size (rem or px) */
  fontSize: string;
  /** Line height */
  lineHeight: string;
}

/**
 * Font size scale.
 */
export interface FontSizes {
  xs: FontSizeConfig;
  sm: FontSizeConfig;
  base: FontSizeConfig;
  lg: FontSizeConfig;
  xl: FontSizeConfig;
  '2xl': FontSizeConfig;
  '3xl': FontSizeConfig;
  '4xl': FontSizeConfig;
  '5xl': FontSizeConfig;
  '6xl': FontSizeConfig;
  '7xl': FontSizeConfig;
  '8xl': FontSizeConfig;
  '9xl': FontSizeConfig;
}

/**
 * Font weight values.
 */
export interface FontWeights {
  thin: string;
  extralight: string;
  light: string;
  normal: string;
  medium: string;
  semibold: string;
  bold: string;
  extrabold: string;
  black: string;
}

/**
 * Default font families.
 */
export const designTokenFontFamily: FontFamily = {
  sans: [
    'Inter',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
  mono: ['Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
};

/**
 * Default font sizes.
 * Based on the Tailwind CSS font size system.
 */
export const designTokenFontSizes: FontSizes = {
  xs: { fontSize: '0.75rem', lineHeight: '1rem' },
  sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
  base: { fontSize: '1rem', lineHeight: '1.5rem' },
  lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },
  xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },
  '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },
  '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' },
  '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' },
  '5xl': { fontSize: '3rem', lineHeight: '1' },
  '6xl': { fontSize: '3.75rem', lineHeight: '1' },
  '7xl': { fontSize: '4.5rem', lineHeight: '1' },
  '8xl': { fontSize: '6rem', lineHeight: '1' },
  '9xl': { fontSize: '8rem', lineHeight: '1' },
};

/**
 * Default font weights.
 */
export const designTokenFontWeights: FontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

