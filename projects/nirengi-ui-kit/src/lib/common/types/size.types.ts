import { Size } from '../enums/size.enum';

/**
 * Type definition for standard size values in UI Kit.
 * Represents all values in the Size enum as strings.
 */
export type SizeType = `${Size}`;

/**
 * Responsive size configuration type.
 * Allows defining different size values for different screen sizes.
 *
 * @example
 * const responsiveSize: ResponsiveSizeConfig = {
 *   base: 'sm',
 *   md: 'md',
 *   lg: 'lg'
 * };
 */
export interface ResponsiveSizeConfig {
  /** Mobile (default) size */
  base?: SizeType;
  /** Tablet size (≥768px) */
  md?: SizeType;
  /** Desktop size (≥1024px) */
  lg?: SizeType;
  /** Large screen size (≥1280px) */
  xl?: SizeType;
}

/**
 * Combined type for component sizing.
 * Accepts either a single size value or a responsive configuration.
 */
export type SizeValue = SizeType | ResponsiveSizeConfig;

