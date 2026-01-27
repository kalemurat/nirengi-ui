import { Size } from '../enums/size.enum';

/**
 * Boyut değerlerine karşılık gelen piksel yükseklik değerleri.
 * Component'lerin min-height değerlerini belirlemek için kullanılır.
 * 
 * @example
 * const buttonHeight = SIZE_HEIGHT_MAP[Size.Medium]; // '40px'
 */
export const SIZE_HEIGHT_MAP: Record<Size, string> = {
  [Size.XSmall]: '24px',
  [Size.Small]: '32px',
  [Size.Medium]: '40px',
  [Size.Large]: '48px',
  [Size.XLarge]: '56px'
} as const;

/**
 * Boyut değerlerine karşılık gelen padding değerleri.
 * Tailwind CSS class formatında.
 * 
 * @example
 * const buttonPadding = SIZE_PADDING_MAP[Size.Medium]; // 'px-4 py-2'
 */
export const SIZE_PADDING_MAP: Record<Size, string> = {
  [Size.XSmall]: 'px-2 py-1',
  [Size.Small]: 'px-3 py-1.5',
  [Size.Medium]: 'px-4 py-2',
  [Size.Large]: 'px-5 py-2.5',
  [Size.XLarge]: 'px-6 py-3'
} as const;

/**
 * Boyut değerlerine karşılık gelen text boyutu class'ları.
 * Tailwind CSS text size formatında.
 * 
 * @example
 * const fontSize = SIZE_TEXT_MAP[Size.Medium]; // 'text-base'
 */
export const SIZE_TEXT_MAP: Record<Size, string> = {
  [Size.XSmall]: 'text-xs',
  [Size.Small]: 'text-sm',
  [Size.Medium]: 'text-base',
  [Size.Large]: 'text-lg',
  [Size.XLarge]: 'text-xl'
} as const;

/**
 * Boyut değerlerine karşılık gelen icon boyutları (piksel).
 * 
 * @example
 * const iconSize = SIZE_ICON_MAP[Size.Medium]; // '20px'
 */
export const SIZE_ICON_MAP: Record<Size, string> = {
  [Size.XSmall]: '14px',
  [Size.Small]: '16px',
  [Size.Medium]: '20px',
  [Size.Large]: '24px',
  [Size.XLarge]: '28px'
} as const;

/**
 * Boyut değerlerine karşılık gelen border-radius değerleri.
 * Tailwind CSS rounded formatında.
 * 
 * @example
 * const borderRadius = SIZE_RADIUS_MAP[Size.Medium]; // 'rounded-md'
 */
export const SIZE_RADIUS_MAP: Record<Size, string> = {
  [Size.XSmall]: 'rounded-sm',
  [Size.Small]: 'rounded',
  [Size.Medium]: 'rounded-md',
  [Size.Large]: 'rounded-lg',
  [Size.XLarge]: 'rounded-xl'
} as const;
