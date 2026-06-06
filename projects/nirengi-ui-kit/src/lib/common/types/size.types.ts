import { Size } from '../enums/size.enum';

export type SizeType = `${Size}`;

/**
 * @example
 * const responsiveSize: IResponsiveSizeConfig = {
 *   base: 'sm',
 *   md: 'md',
 *   lg: 'lg'
 * };
 */
export interface IResponsiveSizeConfig {
  /** Mobile (default) size */
  base?: SizeType;
  /** Tablet size (≥768px) */
  md?: SizeType;
  /** Desktop size (≥1024px) */
  lg?: SizeType;
  /** Large screen size (≥1280px) */
  xl?: SizeType;
}

export type SizeValue = SizeType | IResponsiveSizeConfig;
