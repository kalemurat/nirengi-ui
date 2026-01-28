import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Heading seviye enum'ı.
 * HTML semantik başlık seviyelerini (h1-h6) temsil eder.
 */
export enum HeadingLevel {
  /** H1 - Sayfa başlığı, en yüksek seviye */
  H1 = 'h1',
  /** H2 - Ana bölüm başlığı */
  H2 = 'h2',
  /** H3 - Alt bölüm başlığı */
  H3 = 'h3',
  /** H4 - İçerik grubu başlığı */
  H4 = 'h4',
  /** H5 - Alt içerik başlığı */
  H5 = 'h5',
  /** H6 - En alt seviye başlık */
  H6 = 'h6'
}

/**
 * Heading hizalama enum'ı.
 * Başlığın yatay hizalamasını belirler.
 */
export enum HeadingAlign {
  /** Sola hizalı (varsayılan) */
  Left = 'left',
  /** Ortaya hizalı */
  Center = 'center',
  /** Sağa hizalı */
  Right = 'right'
}

/**
 * Heading font ağırlığı enum'ı.
 * Başlığın tipografik kalınlığını belirler.
 */
export enum HeadingWeight {
  /** Normal kalınlık (400) */
  Normal = 'normal',
  /** Orta kalınlık (500) */
  Medium = 'medium',
  /** Yarı kalın (600) */
  Semibold = 'semibold',
  /** Kalın (700) */
  Bold = 'bold',
  /** Çok kalın (800) */
  Extrabold = 'extrabold'
}

/**
 * Modern heading component'i.
 * Angular 20 signal-based API ve Tailwind + BEM metodolojisi kullanır.
 * 
 * ## Özellikler
 * - ✅ Signal tabanlı reaktif state yönetimi
 * - ✅ OnPush change detection stratejisi
 * - ✅ Computed signals ile class binding
 * - ✅ 6 farklı HTML semantik seviye (h1-h6)
 * - ✅ 5 farklı boyut (xs, sm, md, lg, xl)
 * - ✅ 7 farklı renk varyantı (primary, secondary, success, warning, danger, info, neutral)
 * - ✅ 3 farklı hizalama (left, center, right)
 * - ✅ 5 farklı font ağırlığı (normal, medium, semibold, bold, extrabold)
 * - ✅ Truncate ve line clamp desteği
 * - ✅ WCAG 2.1 AA accessibility standartları
 * - ✅ SEO optimized semantic HTML
 * 
 * ## Design System Entegrasyonu
 * Component, design system'deki merkezi değerleri kullanır:
 * - Font size: Tailwind default typography scale
 * - Colors: ColorVariant enum ile tutarlı renk paleti
 * - Spacing: Design token spacing değerleri
 * 
 * @example
 * // Basit kullanım
 * <nui-heading>Ana Başlık</nui-heading>
 * 
 * @example
 * // Seviye ve boyut ile
 * <nui-heading 
 *   [level]="HeadingLevel.H1" 
 *   [size]="Size.XLarge"
 *   [variant]="ColorVariant.Primary">
 *   Hoş Geldiniz
 * </nui-heading>
 * 
 * @example
 * // Hizalama ve ağırlık ile
 * <nui-heading 
 *   [align]="HeadingAlign.Center"
 *   [weight]="HeadingWeight.Bold">
 *   Merkez Başlık
 * </nui-heading>
 * 
 * @example
 * // Truncate ile
 * <nui-heading [truncate]="true">
 *   Çok uzun bir başlık metni...
 * </nui-heading>
 * 
 * @see https://v20.angular.dev/guide/signals
 * @see {@link HeadingLevel} - HTML semantik seviyeler
 * @see {@link Size} - Standart boyut değerleri
 * @see {@link ColorVariant} - Renk varyantları
 * @see {@link HeadingAlign} - Hizalama seçenekleri
 * @see {@link HeadingWeight} - Font ağırlıkları
 */
@Component({
  selector: 'nui-heading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heading.component.html',
  styleUrl: './heading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadingComponent {
  /**
   * HTML semantik seviyesi.
   * Sayfa hiyerarşisinde doğru yapıyı sağlar.
   * 
   * @default HeadingLevel.H2
   */
  level = input<HeadingLevel>(HeadingLevel.H2);

  /**
   * Başlık boyutu.
   * Görsel font size'ı belirler (semantik seviyeden bağımsız).
   * 
   * @default Size.Medium
   */
  size = input<Size>(Size.Medium);

  /**
   * Renk varyantı.
   * Başlığın metin rengini belirler.
   * 
   * @default ColorVariant.Neutral
   */
  variant = input<ColorVariant>(ColorVariant.Neutral);

  /**
   * Yatay hizalama.
   * Başlığın text-align değerini belirler.
   * 
   * @default HeadingAlign.Left
   */
  align = input<HeadingAlign>(HeadingAlign.Left);

  /**
   * Font ağırlığı.
   * Başlığın tipografik kalınlığını belirler.
   * 
   * @default HeadingWeight.Bold
   */
  weight = input<HeadingWeight>(HeadingWeight.Bold);

  /**
   * Truncate durumu.
   * true olduğunda taşan metin üç nokta ile kesilir.
   * 
   * @default false
   */
  truncate = input<boolean>(false);

  /**
   * Line clamp değeri.
   * Belirtilen satır sayısından sonra metin kesilir.
   * Değer verilmezse truncate özelliği geçerli olur.
   * 
   * @default undefined
   */
  lineClamp = input<number | undefined>(undefined);

  /**
   * Uppercase durumu.
   * true olduğunda tüm karakterler büyük harf olur.
   * 
   * @default false
   */
  uppercase = input<boolean>(false);

  /**
   * Margin bottom durumu.
   * true olduğunda başlık altına standart bir margin eklenir.
   * 
   * @default false
   */
  marginBottom = input<boolean>(false);

  /**
   * Başlık metni.
   * Heading content text'i.
   * 
   * @default ''
   */
  text = input<string>('');

  /**
   * Heading için CSS class'larını hesaplayan computed signal.
   * BEM metodolojisi ile dynamic class binding yapar.
   * Reactive olarak güncellenir.
   * 
   * @returns BEM formatında CSS class string'i
   */
  protected readonly headingClasses = computed(() => {
    const classes = ['nui-heading'];
    
    classes.push(`nui-heading--${this.size()}`);
    classes.push(`nui-heading--${this.variant()}`);
    classes.push(`nui-heading--${this.align()}`);
    classes.push(`nui-heading--${this.weight()}`);
    
    if (this.truncate()) {
      classes.push('nui-heading--truncate');
    }
    
    if (this.lineClamp() !== undefined) {
      classes.push(`nui-heading--line-clamp-${this.lineClamp()}`);
    }
    
    if (this.uppercase()) {
      classes.push('nui-heading--uppercase');
    }
    
    if (this.marginBottom()) {
      classes.push('nui-heading--margin-bottom');
    }
    
    return classes.join(' ');
  });

  /**
   * ARIA level attributu için heading seviyesini döndüren computed signal.
   * Accessibility için gerekli.
   * Reactive olarak güncellenir.
   * 
   * @returns ARIA level (1-6)
   */
  protected readonly ariaLevel = computed(() => {
    const levelMap: Record<HeadingLevel, number> = {
      [HeadingLevel.H1]: 1,
      [HeadingLevel.H2]: 2,
      [HeadingLevel.H3]: 3,
      [HeadingLevel.H4]: 4,
      [HeadingLevel.H5]: 5,
      [HeadingLevel.H6]: 6
    };
    return levelMap[this.level()];
  });
}
