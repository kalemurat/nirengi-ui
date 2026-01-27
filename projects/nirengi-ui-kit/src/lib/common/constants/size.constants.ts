import { Size } from '../enums/size.enum';

/**
 * ⚠️ ÖNEMLİ: Bu dosya artık sadece REFERANS amaçlıdır.
 * 
 * Gerçek boyut değerleri `projects/nirengi-ui-kit/tailwind.config.js` dosyasında
 * theme.extend.height, theme.extend.spacing içinde tanımlıdır.
 * 
 * Bu mapping'ler, TypeScript kodunda hangi Tailwind class'ını kullanacağınızı
 * hatırlatmak için tutulmaktadır. Değer değişikliği yapmak için 
 * tailwind.config.js dosyasını düzenleyin.
 */

/**
 * Size enum değerlerine karşılık gelen Tailwind height class'ları.
 * Component'lerin yüksekliklerini belirler.
 * 
 * ⚠️ Gerçek değerler: tailwind.config.js > theme.extend.height
 * 
 * @example
 * // SCSS'de kullanım
 * &--sm {
 *   @apply h-component-sm;  // 32px
 * }
 */
export const SIZE_HEIGHT_CLASS_MAP: Record<Size, string> = {
  [Size.XSmall]: 'h-component-xs',   // 24px - tailwind.config.js'de tanımlı
  [Size.Small]: 'h-component-sm',    // 32px
  [Size.Medium]: 'h-component-md',   // 36px
  [Size.Large]: 'h-component-lg',    // 40px
  [Size.XLarge]: 'h-component-xl'    // 48px
} as const;

/**
 * Size enum değerlerine karşılık gelen Tailwind padding class'ları.
 * Horizontal padding için kullanılır.
 * 
 * ⚠️ Gerçek değerler: Tailwind default + theme.extend.spacing
 * 
 * @example
 * &--md {
 *   @apply px-3.5;  // 14px (0.875rem)
 * }
 */
export const SIZE_PADDING_CLASS_MAP: Record<Size, string> = {
  [Size.XSmall]: 'px-2',      // 8px
  [Size.Small]: 'px-3',       // 12px
  [Size.Medium]: 'px-3.5',    // 14px - tailwind.config.js > spacing
  [Size.Large]: 'px-5',       // 20px
  [Size.XLarge]: 'px-6'       // 24px
} as const;

/**
 * Size enum değerlerine karşılık gelen Tailwind text size class'ları.
 * 
 * ⚠️ Gerçek değerler: Tailwind default fontSize
 * 
 * @example
 * &--sm {
 *   @apply text-sm;  // 0.875rem / 14px
 * }
 */
export const SIZE_TEXT_CLASS_MAP: Record<Size, string> = {
  [Size.XSmall]: 'text-xs',     // 0.75rem / 12px
  [Size.Small]: 'text-sm',      // 0.875rem / 14px
  [Size.Medium]: 'text-sm',     // 0.875rem / 14px
  [Size.Large]: 'text-base',    // 1rem / 16px
  [Size.XLarge]: 'text-lg'      // 1.125rem / 18px
} as const;

/**
 * Size enum değerlerine karşılık gelen Tailwind gap class'ları.
 * Flex/Grid gap değerleri.
 * 
 * ⚠️ Gerçek değerler: Tailwind default gap
 * 
 * @example
 * &--md {
 *   @apply gap-1.5;  // 0.375rem / 6px
 * }
 */
export const SIZE_GAP_CLASS_MAP: Record<Size, string> = {
  [Size.XSmall]: 'gap-1',      // 0.25rem / 4px
  [Size.Small]: 'gap-1.5',     // 0.375rem / 6px
  [Size.Medium]: 'gap-1.5',    // 0.375rem / 6px
  [Size.Large]: 'gap-2',       // 0.5rem / 8px
  [Size.XLarge]: 'gap-2.5'     // 0.625rem / 10px
} as const;

/**
 * Size enum değerlerine karşılık gelen icon boyutları (piksel).
 * SVG icon'lar için width/height değerleri.
 * 
 * @example
 * const iconSize = SIZE_ICON_MAP[Size.Medium]; // '16px'
 */
export const SIZE_ICON_MAP: Record<Size, string> = {
  [Size.XSmall]: '12px',
  [Size.Small]: '14px',
  [Size.Medium]: '16px',
  [Size.Large]: '18px',
  [Size.XLarge]: '20px'
} as const;

/**
 * Size enum değerlerine karşılık gelen border-radius Tailwind class'ları.
 * 
 * ⚠️ Gerçek değerler: Tailwind default borderRadius
 * 
 * @example
 * &--md {
 *   @apply rounded-md;  // 0.375rem / 6px
 * }
 */
export const SIZE_RADIUS_CLASS_MAP: Record<Size, string> = {
  [Size.XSmall]: 'rounded',      // 0.25rem / 4px
  [Size.Small]: 'rounded-md',    // 0.375rem / 6px
  [Size.Medium]: 'rounded-md',   // 0.375rem / 6px
  [Size.Large]: 'rounded-lg',    // 0.5rem / 8px
  [Size.XLarge]: 'rounded-lg'    // 0.5rem / 8px
} as const;

// ============================================================================
// BACKWARD COMPATIBILITY - Deprecated
// ============================================================================
// Eski constant'ları export ediyoruz ama deprecated olarak işaretliyoruz

/**
 * @deprecated Tailwind config kullanın. SIZE_HEIGHT_CLASS_MAP'e geçin.
 */
export const SIZE_HEIGHT_MAP = SIZE_HEIGHT_CLASS_MAP;

/**
 * @deprecated Tailwind config kullanın. SIZE_PADDING_CLASS_MAP'e geçin.
 */
export const SIZE_PADDING_MAP = SIZE_PADDING_CLASS_MAP;

/**
 * @deprecated Tailwind config kullanın. SIZE_TEXT_CLASS_MAP'e geçin.
 */
export const SIZE_TEXT_MAP = SIZE_TEXT_CLASS_MAP;

/**
 * @deprecated Tailwind config kullanın. SIZE_GAP_CLASS_MAP'e geçin.
 */
export const SIZE_GAP_MAP = SIZE_GAP_CLASS_MAP;

/**
 * @deprecated Tailwind config kullanın. SIZE_RADIUS_CLASS_MAP'e geçin.
 */
export const SIZE_RADIUS_MAP = SIZE_RADIUS_CLASS_MAP;

