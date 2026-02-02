import { Size } from '../enums/size.enum';

/**
 * ⚠️ IMPORTANT: This file is now for REFERENCE purposes only.
 *
 * Real size values are defined in the `projects/nirengi-ui-kit/tailwind.config.js` file
 * under theme.extend.height and theme.extend.spacing.
 *
 * These mappings are kept to remind you which Tailwind class to use in TypeScript code.
 * To change values, edit the tailwind.config.js file.
 */

/**
 * Tailwind height classes corresponding to Size enum values.
 * Determines the heights of components.
 *
 * ⚠️ Real values: tailwind.config.js > theme.extend.height
 *
 * @example
 * // Usage in SCSS
 * &--sm {
 *   @apply h-component-sm;  // 32px
 * }
 */
export const SIZE_HEIGHT_CLASS_MAP: Record<Size, string> = {
  [Size.XSmall]: 'h-component-xs', // 24px - defined in tailwind.config.js
  [Size.Small]: 'h-component-sm', // 32px
  [Size.Medium]: 'h-component-md', // 36px
  [Size.Large]: 'h-component-lg', // 40px
  [Size.XLarge]: 'h-component-xl', // 48px
} as const;

/**
 * Tailwind padding classes corresponding to Size enum values.
 * Used for horizontal padding.
 *
 * ⚠️ Real values: Tailwind default + theme.extend.spacing
 *
 * @example
 * &--md {
 *   @apply px-3.5;  // 14px (0.875rem)
 * }
 */
export const SIZE_PADDING_CLASS_MAP: Record<Size, string> = {
  [Size.XSmall]: 'px-2', // 8px
  [Size.Small]: 'px-3', // 12px
  [Size.Medium]: 'px-3.5', // 14px - tailwind.config.js > spacing
  [Size.Large]: 'px-5', // 20px
  [Size.XLarge]: 'px-6', // 24px
} as const;

/**
 * Tailwind text size classes corresponding to Size enum values.
 *
 * ⚠️ Real values: Tailwind default fontSize
 *
 * @example
 * &--sm {
 *   @apply text-sm;  // 0.875rem / 14px
 * }
 */
export const SIZE_TEXT_CLASS_MAP: Record<Size, string> = {
  [Size.XSmall]: 'text-xs', // 0.75rem / 12px
  [Size.Small]: 'text-sm', // 0.875rem / 14px
  [Size.Medium]: 'text-sm', // 0.875rem / 14px
  [Size.Large]: 'text-base', // 1rem / 16px
  [Size.XLarge]: 'text-lg', // 1.125rem / 18px
} as const;

/**
 * Tailwind gap classes corresponding to Size enum values.
 * Flex/Grid gap values.
 *
 * ⚠️ Real values: Tailwind default gap
 *
 * @example
 * &--md {
 *   @apply gap-1.5;  // 0.375rem / 6px
 * }
 */
export const SIZE_GAP_CLASS_MAP: Record<Size, string> = {
  [Size.XSmall]: 'gap-1', // 0.25rem / 4px
  [Size.Small]: 'gap-1.5', // 0.375rem / 6px
  [Size.Medium]: 'gap-1.5', // 0.375rem / 6px
  [Size.Large]: 'gap-2', // 0.5rem / 8px
  [Size.XLarge]: 'gap-2.5', // 0.625rem / 10px
} as const;

/**
 * Icon sizes (pixels) corresponding to Size enum values.
 * Width/height values for SVG icons.
 *
 * @example
 * const iconSize = SIZE_ICON_MAP[Size.Medium]; // '16px'
 */
export const SIZE_ICON_MAP: Record<Size, string> = {
  [Size.XSmall]: '12px',
  [Size.Small]: '14px',
  [Size.Medium]: '16px',
  [Size.Large]: '18px',
  [Size.XLarge]: '20px',
} as const;

/**
 * Tailwind border-radius classes corresponding to Size enum values.
 *
 * ⚠️ Real values: Tailwind default borderRadius
 *
 * @example
 * &--md {
 *   @apply rounded-md;  // 0.375rem / 6px
 * }
 */
export const SIZE_RADIUS_CLASS_MAP: Record<Size, string> = {
  [Size.XSmall]: 'rounded', // 0.25rem / 4px
  [Size.Small]: 'rounded-md', // 0.375rem / 6px
  [Size.Medium]: 'rounded-md', // 0.375rem / 6px
  [Size.Large]: 'rounded-lg', // 0.5rem / 8px
  [Size.XLarge]: 'rounded-lg', // 0.5rem / 8px
} as const;

// ============================================================================
// BACKWARD COMPATIBILITY - Deprecated
// ============================================================================
// Exporting old constants but marking as deprecated

/**
 * @deprecated Use Tailwind config. Switch to SIZE_HEIGHT_CLASS_MAP.
 */
export const SIZE_HEIGHT_MAP = SIZE_HEIGHT_CLASS_MAP;

/**
 * @deprecated Use Tailwind config. Switch to SIZE_PADDING_CLASS_MAP.
 */
export const SIZE_PADDING_MAP = SIZE_PADDING_CLASS_MAP;

/**
 * @deprecated Use Tailwind config. Switch to SIZE_TEXT_CLASS_MAP.
 */
export const SIZE_TEXT_MAP = SIZE_TEXT_CLASS_MAP;

/**
 * @deprecated Use Tailwind config. Switch to SIZE_GAP_CLASS_MAP.
 */
export const SIZE_GAP_MAP = SIZE_GAP_CLASS_MAP;

/**
 * @deprecated Use Tailwind config. Switch to SIZE_RADIUS_CLASS_MAP.
 */
export const SIZE_RADIUS_MAP = SIZE_RADIUS_CLASS_MAP;

