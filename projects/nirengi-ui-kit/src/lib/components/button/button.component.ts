import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Button tipi enum'ı.
 * Butonun görsel stilini ve davranışını belirler.
 */
export enum ButtonType {
  /** Dolu arka plan, yüksek kontrast (varsayılan) */
  Solid = 'solid',
  /** Sadece kenarlık, arka plan şeffaf */
  Outline = 'outline',
  /** Sadece metin, arka plan ve kenarlık yok */
  Ghost = 'ghost',
  /** Hafif arka plan, kenarlık yok */
  Soft = 'soft'
}

/**
 * Modern button component'i.
 * Angular 20 signal-based API ve Tailwind + BEM metodolojisi kullanır.
 * 
 * ## Özellikler
 * - ✅ Signal tabanlı reaktif state yönetimi
 * - ✅ OnPush change detection stratejisi
 * - ✅ Computed signals ile class binding
 * - ✅ 4 farklı button tipi (solid, outline, ghost, soft)
 * - ✅ 5 farklı boyut (xs, sm, md, lg, xl)
 * - ✅ 7 farklı renk varyantı (primary, secondary, success, warning, danger, info, neutral)
 * - ✅ Disabled ve loading durumları
 * - ✅ Full width seçeneği
 * - ✅ Icon desteği (prefix ve suffix)
 * - ✅ WCAG 2.1 AA accessibility standartları
 * - ✅ Keyboard navigation desteği
 * 
 * ## Design System Entegrasyonu
 * Component, `size.constants.ts` dosyasındaki merkezi boyut değerlerini kullanır:
 * - SIZE_HEIGHT_MAP: Button yükseklikleri
 * - SIZE_PADDING_MAP: Horizontal padding değerleri
 * - SIZE_TEXT_MAP: Font size değerleri
 * - SIZE_GAP_MAP: Icon-text arası boşluk
 * 
 * Bu sayede Input, Select, Badge gibi diğer componentlerle boyut tutarlılığı garantilidir.
 * 
 * @example
 * // Basit kullanım
 * <nui-button>Kaydet</nui-button>
 * 
 * @example
 * // Varyant ve boyut ile
 * <nui-button 
 *   [variant]="ColorVariant.Primary" 
 *   [size]="Size.Large"
 *   [type]="ButtonType.Solid">
 *   Gönder
 * </nui-button>
 * 
 * @example
 * // Disabled ve loading durumu
 * <nui-button 
 *   [disabled]="isProcessing()" 
 *   [loading]="isLoading()">
 *   İşlemi Tamamla
 * </nui-button>
 * 
 * @example
 * // Click event ile
 * <nui-button (clicked)="handleSave()">Kaydet</nui-button>
 * 
 * @see https://v20.angular.dev/guide/signals
 * @see {@link ButtonType} - Button stil tipleri
 * @see {@link Size} - Standart boyut değerleri
 * @see {@link ColorVariant} - Renk varyantları
 * @see {@link SIZE_HEIGHT_MAP} - Merkezi boyut yükseklik mapping
 */
@Component({
  selector: 'nui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  /**
   * Button tipi.
   * Görsel stil ve davranışı belirler.
   * 
   * @default ButtonType.Solid
   */
  type = input<ButtonType>(ButtonType.Solid);

  /**
   * Renk varyantı.
   * Semantik anlamı olan renk teması sağlar.
   * 
   * @default ColorVariant.Primary
   */
  variant = input<ColorVariant>(ColorVariant.Primary);

  /**
   * Boyut.
   * Butonun yükseklik, padding ve font boyutunu belirler.
   * 
   * @default Size.Medium
   */
  size = input<Size>(Size.Medium);

  /**
   * Disabled durumu.
   * true olduğunda buton tıklanamaz ve görsel olarak devre dışı görünür.
   * 
   * @default false
   */
  disabled = input<boolean>(false);

  /**
   * Loading durumu.
   * true olduğunda buton loading spinner gösterir ve tıklanamaz hale gelir.
   * 
   * @default false
   */
  loading = input<boolean>(false);

  /**
   * Full width durumu.
   * true olduğunda buton parent container'ın tüm genişliğini kaplar.
   * 
   * @default false
   */
  fullWidth = input<boolean>(false);

  /**
   * Click event'i.
   * Butona tıklandığında emit edilir.
   * Loading veya disabled durumunda emit edilmez.
   * 
   * @event clicked
   */
  clicked = output<void>();

  /**
   * Button için CSS class'larını hesaplayan computed signal.
   * BEM metodolojisi ile dynamic class binding yapar.
   * Reactive olarak güncellenir.
   * 
   * @returns BEM formatında CSS class string'i
   */
  protected readonly buttonClasses = computed(() => {
    const classes = ['nui-button'];
    
    classes.push(`nui-button--${this.type()}`);
    classes.push(`nui-button--${this.variant()}`);
    classes.push(`nui-button--${this.size()}`);
    
    if (this.disabled()) {
      classes.push('nui-button--disabled');
    }
    
    if (this.loading()) {
      classes.push('nui-button--loading');
    }
    
    if (this.fullWidth()) {
      classes.push('nui-button--full-width');
    }
    
    return classes.join(' ');
  });

  /**
   * Click handler metodu.
   * Loading veya disabled durumunda event emit etmez.
   * 
   * @returns void
   */
  handleClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
