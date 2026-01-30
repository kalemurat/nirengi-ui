import { Size } from '../enums/size.enum';

/**
 * UI Kit için standart boyut değerlerinin tip tanımı.
 * Size enum'ındaki tüm değerleri string olarak temsil eder.
 */
export type SizeType = `${Size}`;

/**
 * Responsive boyut konfigürasyonu tipi.
 * Farklı ekran boyutları için farklı size değerleri tanımlanabilir.
 *
 * @example
 * const responsiveSize: ResponsiveSizeConfig = {
 *   base: 'sm',
 *   md: 'md',
 *   lg: 'lg'
 * };
 */
export interface ResponsiveSizeConfig {
  /** Mobil (varsayılan) boyut */
  base?: SizeType;
  /** Tablet boyut (≥768px) */
  md?: SizeType;
  /** Desktop boyut (≥1024px) */
  lg?: SizeType;
  /** Büyük ekran boyut (≥1280px) */
  xl?: SizeType;
}

/**
 * Component boyutlandırma için birleştirilmiş tip.
 * Tek bir boyut değeri veya responsive konfigürasyon kabul eder.
 */
export type SizeValue = SizeType | ResponsiveSizeConfig;
