import { ColorVariant } from '../enums/color-variant.enum';

/**
 * Renk varyantlarına karşılık gelen Tailwind CSS renk isimleri.
 * 
 * @example
 * const colorName = COLOR_VARIANT_MAP[ColorVariant.Primary]; // 'blue'
 */
export const COLOR_VARIANT_MAP: Record<ColorVariant, string> = {
  [ColorVariant.Primary]: 'blue',
  [ColorVariant.Secondary]: 'gray',
  [ColorVariant.Success]: 'green',
  [ColorVariant.Warning]: 'amber',
  [ColorVariant.Danger]: 'red',
  [ColorVariant.Info]: 'cyan',
  [ColorVariant.Neutral]: 'slate'
} as const;

/**
 * Renk varyantlarına karşılık gelen varsayılan tonlar.
 * Tailwind CSS renk skalasında (50-950).
 * 
 * @example
 * const defaultShade = COLOR_DEFAULT_SHADE_MAP[ColorVariant.Primary]; // '600'
 */
export const COLOR_DEFAULT_SHADE_MAP: Record<ColorVariant, string> = {
  [ColorVariant.Primary]: '600',
  [ColorVariant.Secondary]: '600',
  [ColorVariant.Success]: '600',
  [ColorVariant.Warning]: '500',
  [ColorVariant.Danger]: '600',
  [ColorVariant.Info]: '600',
  [ColorVariant.Neutral]: '500'
} as const;

/**
 * Renk varyantlarına karşılık gelen hover tonları.
 * Daha koyu ton kullanılır.
 * 
 * @example
 * const hoverShade = COLOR_HOVER_SHADE_MAP[ColorVariant.Primary]; // '700'
 */
export const COLOR_HOVER_SHADE_MAP: Record<ColorVariant, string> = {
  [ColorVariant.Primary]: '700',
  [ColorVariant.Secondary]: '700',
  [ColorVariant.Success]: '700',
  [ColorVariant.Warning]: '600',
  [ColorVariant.Danger]: '700',
  [ColorVariant.Info]: '700',
  [ColorVariant.Neutral]: '600'
} as const;

/**
 * Renk varyantlarına karşılık gelen text renk class'ları.
 * Light background için kullanılır.
 * 
 * @example
 * const textColor = COLOR_TEXT_MAP[ColorVariant.Primary]; // 'text-blue-600'
 */
export const COLOR_TEXT_MAP: Record<ColorVariant, string> = {
  [ColorVariant.Primary]: 'text-blue-600',
  [ColorVariant.Secondary]: 'text-gray-600',
  [ColorVariant.Success]: 'text-green-600',
  [ColorVariant.Warning]: 'text-amber-600',
  [ColorVariant.Danger]: 'text-red-600',
  [ColorVariant.Info]: 'text-cyan-600',
  [ColorVariant.Neutral]: 'text-slate-600'
} as const;

/**
 * Renk varyantlarına karşılık gelen background renk class'ları.
 * Solid button ve background kullanımları için.
 * 
 * @example
 * const bgColor = COLOR_BG_MAP[ColorVariant.Primary]; // 'bg-blue-600'
 */
export const COLOR_BG_MAP: Record<ColorVariant, string> = {
  [ColorVariant.Primary]: 'bg-blue-600',
  [ColorVariant.Secondary]: 'bg-gray-600',
  [ColorVariant.Success]: 'bg-green-600',
  [ColorVariant.Warning]: 'bg-amber-500',
  [ColorVariant.Danger]: 'bg-red-600',
  [ColorVariant.Info]: 'bg-cyan-600',
  [ColorVariant.Neutral]: 'bg-slate-500'
} as const;

/**
 * Renk varyantlarına karşılık gelen border renk class'ları.
 * 
 * @example
 * const borderColor = COLOR_BORDER_MAP[ColorVariant.Primary]; // 'border-blue-600'
 */
export const COLOR_BORDER_MAP: Record<ColorVariant, string> = {
  [ColorVariant.Primary]: 'border-blue-600',
  [ColorVariant.Secondary]: 'border-gray-600',
  [ColorVariant.Success]: 'border-green-600',
  [ColorVariant.Warning]: 'border-amber-500',
  [ColorVariant.Danger]: 'border-red-600',
  [ColorVariant.Info]: 'border-cyan-600',
  [ColorVariant.Neutral]: 'border-slate-500'
} as const;
