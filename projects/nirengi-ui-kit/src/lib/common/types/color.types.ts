import { ColorVariant } from '../enums/color-variant.enum';

export type ColorVariantType = `${ColorVariant}`;

/** Compatible with Tailwind CSS color scale. */
export type ColorShade =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '950';

/**
 * @example
 * const color: IColorConfig = {
 *   variant: 'primary',
 *   shade: '600'
 * };
 */
export interface IColorConfig {
  variant: ColorVariantType;
  /** @default '500' */
  shade?: ColorShade;
}

export type ColorValue = ColorVariantType | IColorConfig;
