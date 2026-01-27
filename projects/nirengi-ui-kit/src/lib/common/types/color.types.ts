import { ColorVariant } from '../enums/color-variant.enum';

/**
 * UI Kit için standart renk variant değerlerinin tip tanımı.
 */
export type ColorVariantType = `${ColorVariant}`;

/**
 * Renk yoğunluğu/tonu tipi.
 * Tailwind CSS'in renk skalasına uyumlu.
 */
export type ColorShade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';

/**
 * Detaylı renk konfigürasyonu.
 * Variant ve ton bilgisini birlikte tutar.
 * 
 * @example
 * const color: ColorConfig = {
 *   variant: 'primary',
 *   shade: '600'
 * };
 */
export interface ColorConfig {
  /** Renk varyantı */
  variant: ColorVariantType;
  /** Renk tonu (opsiyonel, varsayılan: '500') */
  shade?: ColorShade;
}

/**
 * Component renklendirme için birleştirilmiş tip.
 * Basit variant string'i veya detaylı konfigürasyon kabul eder.
 */
export type ColorValue = ColorVariantType | ColorConfig;
