/**
 * UI Kit breakpoint (responsive) design tokens.
 * Screen size threshold values for responsive design.
 *
 * @see https://tailwindcss.com/docs/responsive-design
 */

/**
 * Breakpoint definitions interface.
 */
export interface Breakpoints {
  /** Small screens (mobile) - 640px */
  sm: string;
  /** Medium screens (tablet) - 768px */
  md: string;
  /** Large screens (laptop) - 1024px */
  lg: string;
  /** Extra large screens (desktop) - 1280px */
  xl: string;
  /** 2x large screens (wide desktop) - 1536px */
  '2xl': string;
}

/**
 * Default breakpoint values.
 * Based on Tailwind CSS breakpoint system.
 */
export const designTokenBreakpoints: Breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/**
 * Helper that converts breakpoints to media query format.
 *
 * @param breakpoint - Breakpoint value
 * @returns Media query string
 *
 * @example
 * const mediaQuery = getMediaQuery(designTokenBreakpoints.md);
 * // '@media (min-width: 768px)'
 */
export function getMediaQuery(breakpoint: string): string {
  return `@media (min-width: ${breakpoint})`;
}
