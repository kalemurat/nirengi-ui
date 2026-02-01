import {
  Component,
  input,
  forwardRef,
  computed,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { ValueAccessorBase } from '../../common/base/value-accessor.base';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../icon/icon.types';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Modern textarea component.
 * Çok satırlı metin girişi için kullanılan component.
 *
 * ## Özellikler
 * - ✅ Signal tabanlı ControlValueAccessor (NG_VALUE_ACCESSOR)
 * - ✅ OnPush change detection stratejisi
 * - ✅ Computed signals ile class binding
 * - ✅ Label, Hint ve Error mesaj desteği
 * - ✅ Icon desteği
 * - ✅ Boyut varyasyonları (xs, sm, md, lg, xl)
 * - ✅ Disabled ve readonly state'leri
 * - ✅ Auto-resize özelliği
 * - ✅ Karakter sayım desteği (maxlength)
 * - ✅ Tailwind + BEM styling
 *
 * @example
 * <nui-textarea
 *   label="Açıklama"
 *   placeholder="Detayları girin"
 *   [formControl]="descCtrl"
 * />
 *
 * @example
 * <nui-textarea
 *   label="Yorum"
 *   icon="MessageSquare"
 *   [rows]="5"
 *   [maxlength]="500"
 *   error="Yorum çok uzun"
 * />
 *
 * @see {@link ValueAccessorBase} - Base class for form controls
 * @see https://v20.angular.dev/api/forms/ControlValueAccessor
 */
@Component({
  selector: 'nui-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent extends ValueAccessorBase<string> {
  /**
   * Accessibility için benzersiz ID.
   * Her textarea instance'ı için otomatik oluşturulur.
   */
  readonly textareaId = `nui-textarea-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Label metni.
   * Textarea üzerinde gösterilir.
   */
  readonly label = input<string>();

  /**
   * Placeholder metni.
   * Textarea boş olduğunda gösterilir.
   */
  readonly placeholder = input<string>('');

  /**
   * Yardımcı ipucu metni.
   * Textarea altında gösterilir (error yoksa).
   */
  readonly hint = input<string>();

  /**
   * Component renk varyasyonu.
   * @default ColorVariant.Neutral
   */
  readonly variant = input<ColorVariant>(ColorVariant.Neutral);

  /**
   * Icon ismi.
   * Textarea'nın sol üst köşesinde gösterilir.
   */
  readonly icon = input<IconName>();

  /**
   * Readonly durumu.
   * True ise textarea düzenlenemez ancak disabled değildir.
   */
  readonly readonly = input<boolean>(false);

  /**
   * Component boyutu.
   * Text size ve padding'i etkiler.
   * @default Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Textarea satır sayısı.
   * Minimum yüksekliği belirler.
   * @default 3
   */
  readonly rows = input<number>(3);

  /**
   * Maksimum karakter sayısı.
   * Varsa karakter sayacı gösterilir.
   */
  readonly maxlength = input<number>();

  /**
   * Auto-resize özelliği.
   * True ise içeriğe göre otomatik yükseklik ayarı yapılır.
   * @default false
   */
  readonly autoResize = input<boolean>(false);

  /**
   * Textarea value (dumb mode).
   * Form control kullanılmadan da değer atanabilir.
   */
  readonly valueInput = input<string | null>(null, { alias: 'value' });

  /**
   * Disabled state (dumb mode).
   * Form control kullanılmadan da disabled yapılabilir.
   */
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

  constructor() {
    super();

    // Sync value input
    effect(() => {
      const val = this.valueInput();
      if (val !== null) {
        this.writeValue(val);
      }
    });

    // Sync disabled input
    effect(() => {
      this.setDisabledState(this.disabledInput());
    });
  }

  /**
   * Icon boyutunu component size'a göre hesaplayan computed signal.
   * Size değiştiğinde otomatik güncellenir.
   *
   * @returns Icon pixel boyutu
   */
  readonly iconSize = computed(() => {
    switch (this.size()) {
      case Size.XSmall:
        return 14;
      case Size.Small:
        return 16;
      case Size.Medium:
        return 18;
      case Size.Large:
        return 20;
      case Size.XLarge:
        return 24;
      default:
        return 18;
    }
  });

  /**
   * Textarea için CSS class'larını hesaplayan computed signal.
   * Reaktif olarak size değişikliklerini takip eder.
   *
  /**
   * Container element için CSS class'larını hesaplayan computed signal.
   * Variant değişikliklerini takip eder.
   */
  readonly containerClasses = computed(() => `nui-textarea--${this.variant()} nui-textarea--${this.size()}`);

  /**
   * Textarea için CSS class'larını hesaplayan computed signal.
   * Reaktif olarak size değişikliklerini takip eder.
   *
   * @returns Size-based CSS class string'i
   */
  protected readonly textareaClasses = computed(() => {
    return `nui-textarea__input--${this.size()}`;
  });

  /**
   * Karakter sayacı metnini hesaplayan computed signal.
   * Maxlength varsa "mevcut/maksimum" formatında gösterilir.
   *
   * @returns Karakter sayacı metni veya undefined
   */
  protected readonly characterCount = computed(() => {
    const max = this.maxlength();
    if (!max) return undefined;

    const current = this.value()?.length || 0;
    return `${current}/${max}`;
  });

  /**
   * Karakter limitinin aşılıp aşılmadığını kontrol eden computed signal.
   * True ise karakter sayacı kırmızı renkte gösterilir.
   *
   * @returns Limit aşıldıysa true, değilse false
   */
  protected readonly isOverLimit = computed(() => {
    const max = this.maxlength();
    if (!max) return false;

    const current = this.value()?.length || 0;
    return current > max;
  });

  /**
   * Input event handler.
   * Kullanıcı textarea'ya yazdığında tetiklenir.
   * Auto-resize aktifse yüksekliği ayarlar.
   *
   * @param event - Input event
   */
  onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;

    // Update value
    this.updateValue(value);

    // Auto resize if enabled
    if (this.autoResize()) {
      this.adjustHeight(textarea);
    }
  }

  /**
   * Textarea yüksekliğini içeriğe göre ayarlar.
   * Auto-resize özelliği için kullanılır.
   *
   * @param textarea - HTML textarea elementi
   */
  private adjustHeight(textarea: HTMLTextAreaElement): void {
    // Reset height to auto to get scrollHeight
    textarea.style.height = 'auto';
    // Set height to scrollHeight
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
