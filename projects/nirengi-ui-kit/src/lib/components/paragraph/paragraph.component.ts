import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Paragraph hizalama enum'ı.
 * Paragrafın yatay hizalamasını belirler.
 */
export enum ParagraphAlign {
  /** Sola hizalı (varsayılan) */
  Left = 'left',
  /** Ortaya hizalı */
  Center = 'center',
  /** Sağa hizalı */
  Right = 'right',
  /** İki yana yaslı */
  Justify = 'justify'
}

/**
 * Paragraph font ağırlığı enum'ı.
 * Paragrafın tipografik kalınlığını belirler.
 */
export enum ParagraphWeight {
  /** İnce kalınlık (300) */
  Light = 'light',
  /** Normal kalınlık (400) */
  Normal = 'normal',
  /** Orta kalınlık (500) */
  Medium = 'medium',
  /** Yarı kalın (600) */
  Semibold = 'semibold',
  /** Kalın (700) */
  Bold = 'bold'
}

/**
 * Modern paragraph component'i.
 * Angular 20 signal-based API ve Tailwind + BEM metodolojisi kullanır.
 * 
 * ## Özellikler
 * - ✅ Signal tabanlı reaktif state yönetimi
 * - ✅ OnPush change detection stratejisi
 * - ✅ Computed signals ile class binding
 * - ✅ 5 farklı boyut (xs, sm, md, lg, xl)
 * - ✅ 7 farklı renk varyantı (primary, secondary, success, warning, danger, info, neutral)
 * - ✅ 4 farklı hizalama (left, center, right, justify)
 * - ✅ 5 farklı font ağırlığı (light, normal, medium, semibold, bold)
 * - ✅ Truncate ve line clamp desteği
 * - ✅ Leading (satır yüksekliği) kontrolü
 * - ✅ Margin bottom desteği
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
 * <nui-paragraph>Bu bir paragraf metnidir.</nui-paragraph>
 * 
 * @example
 * // Boyut ve renk ile
 * <nui-paragraph 
 *   [size]="Size.Large"
 *   [variant]="ColorVariant.Primary">
 *   Büyük boyutta mavi paragraf
 * </nui-paragraph>
 * 
 * @example
 * // Hizalama ve ağırlık ile
 * <nui-paragraph 
 *   [align]="ParagraphAlign.Center"
 *   [weight]="ParagraphWeight.Medium">
 *   Merkez hizalı, orta kalınlık
 * </nui-paragraph>
 * 
 * @example
 * // Line clamp ile
 * <nui-paragraph [lineClamp]="3">
 *   Çok uzun bir paragraf metni. Bu metin 3 satırdan sonra kesilecek
 *   ve sonuna üç nokta eklenecektir...
 * </nui-paragraph>
 * 
 * @see https://v20.angular.dev/guide/signals
 * @see {@link Size} - Standart boyut değerleri
 * @see {@link ColorVariant} - Renk varyantları
 * @see {@link ParagraphAlign} - Hizalama seçenekleri
 * @see {@link ParagraphWeight} - Font ağırlıkları
 */
@Component({
  selector: 'nui-paragraph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paragraph.component.html',
  styleUrl: './paragraph.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParagraphComponent {
  /**
   * Paragraf boyutu.
   * Görsel font size'ı belirler.
   * 
   * @default Size.Medium
   */
  size = input<Size>(Size.Medium);

  /**
   * Renk varyantı.
   * Paragrafın metin rengini belirler.
   * 
   * @default ColorVariant.Neutral
   */
  variant = input<ColorVariant>(ColorVariant.Neutral);

  /**
   * Yatay hizalama.
   * Paragrafın text-align değerini belirler.
   * 
   * @default ParagraphAlign.Left
   */
  align = input<ParagraphAlign>(ParagraphAlign.Left);

  /**
   * Font ağırlığı.
   * Paragrafın tipografik kalınlığını belirler.
   * 
   * @default ParagraphWeight.Normal
   */
  weight = input<ParagraphWeight>(ParagraphWeight.Normal);

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
   * Leading (satır yüksekliği) değeri.
   * Satırlar arası boşluğu belirler.
   * 
   * @default 'normal'
   */
  leading = input<'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'>('normal');

  /**
   * Margin bottom durumu.
   * true olduğunda paragraf altına standart bir margin eklenir.
   * 
   * @default false
   */
  marginBottom = input<boolean>(false);

  /**
   * Italic durumu.
   * true olduğunda metin eğik (italic) olur.
   * 
   * @default false
   */
  italic = input<boolean>(false);

  /**
   * Paragraph için CSS class'larını hesaplayan computed signal.
   * BEM metodolojisi ile dynamic class binding yapar.
   * Reactive olarak güncellenir.
   * 
   * @returns BEM formatında CSS class string'i
   */
  protected readonly paragraphClasses = computed(() => {
    const classes = ['nui-paragraph'];
    
    classes.push(`nui-paragraph--${this.size()}`);
    classes.push(`nui-paragraph--${this.variant()}`);
    classes.push(`nui-paragraph--${this.align()}`);
    classes.push(`nui-paragraph--${this.weight()}`);
    classes.push(`nui-paragraph--${this.leading()}`);
    
    if (this.truncate()) {
      classes.push('nui-paragraph--truncate');
    }
    
    if (this.lineClamp() !== undefined) {
      classes.push(`nui-paragraph--line-clamp-${this.lineClamp()}`);
    }
    
    if (this.marginBottom()) {
      classes.push('nui-paragraph--margin-bottom');
    }
    
    if (this.italic()) {
      classes.push('nui-paragraph--italic');
    }
    
    return classes.join(' ');
  });
}
