/** @see https://tailwindcss.com/docs/font-size */

export interface IFontFamily {
  sans: string[];
  serif: string[];
  mono: string[];
}

export interface IFontSizeConfig {
  fontSize: string;
  lineHeight: string;
}

export interface IFontSizes {
  xs: IFontSizeConfig;
  sm: IFontSizeConfig;
  base: IFontSizeConfig;
  lg: IFontSizeConfig;
  xl: IFontSizeConfig;
  '2xl': IFontSizeConfig;
  '3xl': IFontSizeConfig;
  '4xl': IFontSizeConfig;
  '5xl': IFontSizeConfig;
  '6xl': IFontSizeConfig;
  '7xl': IFontSizeConfig;
  '8xl': IFontSizeConfig;
  '9xl': IFontSizeConfig;
}

export interface IFontWeights {
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

export const designTokenFontFamily: IFontFamily = {
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

/** Based on the Tailwind CSS font size system. */
export const designTokenFontSizes: IFontSizes = {
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

export const designTokenFontWeights: IFontWeights = {
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
