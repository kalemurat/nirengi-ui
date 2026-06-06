import { Size } from '../enums/size.enum';

export type SizeType = `${Size}`;

/**
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

export type SizeValue = SizeType | ResponsiveSizeConfig;
