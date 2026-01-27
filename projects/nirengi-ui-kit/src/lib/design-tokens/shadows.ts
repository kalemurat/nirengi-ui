/**
 * UI Kit shadow (gölge) design token'ları.
 * Box-shadow değerleri için kullanılır.
 * 
 * @see https://tailwindcss.com/docs/box-shadow
 */

/**
 * Shadow tanımları arayüzü.
 */
export interface Shadows {
  /** Gölge yok */
  none: string;
  /** Ekstra küçük gölge */
  xs: string;
  /** Küçük gölge */
  sm: string;
  /** Orta (varsayılan) gölge */
  md: string;
  /** Büyük gölge */
  lg: string;
  /** Ekstra büyük gölge */
  xl: string;
  /** 2x büyük gölge */
  '2xl': string;
  /** İç gölge */
  inner: string;
}

/**
 * Varsayılan shadow değerleri.
 * Tailwind CSS shadow sistemini temel alır.
 */
export const designTokenShadows: Shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
};
