import { ColorVariant } from '../enums/color-variant.enum';

/**
 * Type definition for standard color variant values in UI Kit.
 */
export type ColorVariantType = `${ColorVariant}`;

/**
 * Color shade/intensity type.
 * Compatible with Tailwind CSS color scale.
 */
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
 * Detailed color configuration.
 * Holds both variant and shade information together.
 *
 * @example
 * const color: ColorConfig = {
 *   variant: 'primary',
 *   shade: '600'
 * };
 */
export interface ColorConfig {
  /** Color variant */
  variant: ColorVariantType;
  /** Color shade (optional, default: '500') */
  shade?: ColorShade;
}

/**
 * Combined type for component coloring.
 * Accepts either a simple variant string or a detailed configuration.
 */
export type ColorValue = ColorVariantType | ColorConfig;

