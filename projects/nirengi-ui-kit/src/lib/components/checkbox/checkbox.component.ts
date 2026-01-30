import {
  Component,
  input,
  forwardRef,
  effect,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '../../common/base/value-accessor.base';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Modern checkbox component'i.
 * Angular 20 signal-based API ve Tailwind + BEM metodolojisi kullanır.
 *
 * ## Özellikler
 * - ✅ Signal tabanlı ControlValueAccessor (NG_VALUE_ACCESSOR)
 * - ✅ Two-way data binding desteği (ngModel, formControl)
 * - ✅ OnPush change detection stratejisi
 * - ✅ Computed signals ile reaktif class binding
 * - ✅ 5 farklı boyut (xs, sm, md, lg, xl)
 * - ✅ 7 farklı renk varyantı (primary, secondary, success, warning, danger, info, neutral)
 * - ✅ Disabled ve readonly durumları
 * - ✅ Indeterminate (belirsiz) durum desteği
 * - ✅ Label ve description desteği
 * - ✅ WCAG 2.1 AA accessibility standartları
 * - ✅ Keyboard navigation desteği
 *
 * @example
 * // Reactive Forms ile
 * <nui-checkbox [formControl]="termsControl" label="Kabul Ediyorum"></nui-checkbox>
 *
 * @example
 * // Template-driven Forms ile
 * <nui-checkbox [(ngModel)]="isAccepted" label="Kabul Ediyorum"></nui-checkbox>
 *
 * @example
 * // Label ve description ile
 * <nui-checkbox
 *   [formControl]="newsletterControl"
 *   label="Haber Bülteni"
 *   description="Yeni güncellemelerden haberdar olmak için e-posta almak istiyorum">
 * </nui-checkbox>
 *
 * @example
 * // Varyant ve boyut ile
 * <nui-checkbox
 *   [formControl]="termsControl"
 *   [variant]="ColorVariant.Success"
 *   [size]="Size.Large"
 *   label="Kullanım Şartlarını Okudum">
 * </nui-checkbox>
 *
 * @example
 * // Indeterminate durumu
 * <nui-checkbox
 *   [formControl]="selectAllControl"
 *   [indeterminate]="isIndeterminate()"
 *   label="Tümünü Seç">
 * </nui-checkbox>
 *
 * @see https://v20.angular.dev/guide/signals
 * @see {@link ValueAccessorBase}
 * @see {@link Size} - Standart boyut değerleri
 * @see {@link ColorVariant} - Renk varyantları
 */
@Component({
  selector: 'nui-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent extends ValueAccessorBase<boolean> {
  /**
   * Unique ID for accessibility.
   */
  readonly inputId = `nui-checkbox-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Renk varyantı.
   * Semantik anlamı olan renk teması sağlar.
   *
   * @default ColorVariant.Primary
   */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /**
   * Boyut.
   * Checkbox'ın büyüklüğünü ve label font boyutunu belirler.
   *
   * @default Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Readonly durumu.
   * true olduğunda checkbox tıklanamaz ama görsel olarak aktif görünür.
   *
   * @default false
   */
  readonly readonly = input<boolean>(false);

  /**
   * Indeterminate (belirsiz) durumu.
   * Kısmi seçim durumlarını göstermek için kullanılır (örn: "Select All" checkbox).
   *
   * @default false
   */
  readonly indeterminate = input<boolean>(false);

  /**
   * Label metni.
   * Checkbox'ın yanında gösterilecek ana etiket.
   */
  readonly label = input<string>('');

  /**
   * Description metni.
   * Label'ın altında gösterilecek açıklayıcı metin.
   */
  readonly description = input<string>('');

  /**
   * Required (zorunlu) durumu.
   * Form validasyonu için kullanılır.
   *
   * @default false
   */
  readonly required = input<boolean>(false);

  /**
   * Checked input (dumb mode).
   * Direct binding için kullanılır.
   */
  readonly checkedInput = input<boolean | null>(null, { alias: 'checked' });

  /**
   * Disabled input (dumb mode).
   */
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

  /**
   * Checkbox için CSS class'larını hesaplayan computed signal.
   * BEM metodolojisi ile dynamic class binding yapar.
   * Reactive olarak güncellenir.
   */
  readonly checkboxClasses = computed(() => {
    const classes = ['nui-checkbox'];

    classes.push(`nui-checkbox--${this.variant()}`);
    classes.push(`nui-checkbox--${this.size()}`);

    if (this.isDisabled()) {
      classes.push('nui-checkbox--disabled');
    }

    if (this.readonly()) {
      classes.push('nui-checkbox--readonly');
    }

    if (this.value()) {
      classes.push('nui-checkbox--checked');
    }

    if (this.indeterminate()) {
      classes.push('nui-checkbox--indeterminate');
    }

    return classes.join(' ');
  });

  /**
   * Label için CSS class'larını hesaplayan computed signal.
   * Reactive olarak güncellenir.
   */
  readonly labelClasses = computed(() => {
    const classes = ['nui-checkbox__label'];

    classes.push(`nui-checkbox__label--${this.size()}`);

    if (this.isDisabled()) {
      classes.push('nui-checkbox__label--disabled');
    }

    return classes.join(' ');
  });

  /**
   * Description için CSS class'larını hesaplayan computed signal.
   * Reactive olarak güncellenir.
   */
  readonly descriptionClasses = computed(() => {
    const classes = ['nui-checkbox__description'];

    classes.push(`nui-checkbox__description--${this.size()}`);

    if (this.isDisabled()) {
      classes.push('nui-checkbox__description--disabled');
    }

    return classes.join(' ');
  });

  constructor() {
    super();

    // Sync checked input
    effect(() => {
      const val = this.checkedInput();
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
   * Checkbox toggle handler'ı.
   * Disabled veya readonly durumunda çalışmaz.
   *
   * @returns void
   */
  handleToggle(): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }

    const newValue = !this.value();
    this.updateValue(newValue);
  }

  /**
   * Checkbox blur handler'ı.
   * Form touched state'ini güncellemek için.
   */
  handleBlur(): void {
    this.markAsTouched();
  }
}
