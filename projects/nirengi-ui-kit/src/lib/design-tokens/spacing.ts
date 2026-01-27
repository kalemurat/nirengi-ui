/**
 * UI Kit spacing (boşluk) design token'ları.
 * Tailwind CSS spacing sistemiyle uyumlu.
 * 
 * @see https://tailwindcss.com/docs/customizing-spacing
 */

/**
 * Spacing değerleri arayüzü.
 * 0'dan 96'ya kadar spacing skalası.
 */
export interface SpacingScale {
  /** 0px */
  0: string;
  /** 1px (0.25rem) */
  px: string;
  /** 2px (0.125rem) */
  0.5: string;
  /** 4px (0.25rem) */
  1: string;
  /** 6px (0.375rem) */
  1.5: string;
  /** 8px (0.5rem) */
  2: string;
  /** 10px (0.625rem) */
  2.5: string;
  /** 12px (0.75rem) */
  3: string;
  /** 14px (0.875rem) */
  3.5: string;
  /** 16px (1rem) */
  4: string;
  /** 20px (1.25rem) */
  5: string;
  /** 24px (1.5rem) */
  6: string;
  /** 28px (1.75rem) */
  7: string;
  /** 32px (2rem) */
  8: string;
  /** 36px (2.25rem) */
  9: string;
  /** 40px (2.5rem) */
  10: string;
  /** 44px (2.75rem) */
  11: string;
  /** 48px (3rem) */
  12: string;
  /** 56px (3.5rem) */
  14: string;
  /** 64px (4rem) */
  16: string;
  /** 80px (5rem) */
  20: string;
  /** 96px (6rem) */
  24: string;
  /** 112px (7rem) */
  28: string;
  /** 128px (8rem) */
  32: string;
  /** 144px (9rem) */
  36: string;
  /** 160px (10rem) */
  40: string;
  /** 176px (11rem) */
  44: string;
  /** 192px (12rem) */
  48: string;
  /** 208px (13rem) */
  52: string;
  /** 224px (14rem) */
  56: string;
  /** 240px (15rem) */
  60: string;
  /** 256px (16rem) */
  64: string;
  /** 288px (18rem) */
  72: string;
  /** 320px (20rem) */
  80: string;
  /** 384px (24rem) */
  96: string;
}

/**
 * Varsayılan spacing skalası.
 * Tailwind CSS'in varsayılan spacing sistemini kullanır.
 */
export const designTokenSpacing: SpacingScale = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem'
};
