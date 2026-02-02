/**
 * UI Kit breakpoint (responsive) design token'ları.
 * Responsive tasarım için ekran boyutu eşik değerleri.
 *
 * @see https://tailwindcss.com/docs/responsive-design
 */

/**
 * Breakpoint tanımları arayüzü.
 */
export interface Breakpoints {
  /** Küçük ekranlar (mobil) - 640px */
  sm: string;
  /** Orta ekranlar (tablet) - 768px */
  md: string;
  /** Büyük ekranlar (laptop) - 1024px */
  lg: string;
  /** Ekstra büyük ekranlar (desktop) - 1280px */
  xl: string;
  /** 2x büyük ekranlar (geniş desktop) - 1536px */
  '2xl': string;
}

/**
 * Varsayılan breakpoint değerleri.
 * Tailwind CSS breakpoint sistemini temel alır.
 */
export const designTokenBreakpoints: Breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/**
 * Breakpoint'leri media query formatında dönüştüren helper.
 *
 * @param breakpoint - Breakpoint değeri
 * @returns Media query string'i
 *
 * @example
 * const mediaQuery = getMediaQuery(designTokenBreakpoints.md);
 * // '@media (min-width: 768px)'
 */
export function getMediaQuery(breakpoint: string): string {
  return `@media (min-width: ${breakpoint})`;
}
