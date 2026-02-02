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
 * Modern radyo butonu bileşeni.
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
 * - ✅ Label ve description desteği
 * - ✅ WCAG 2.1 AA accessibility standartları
 * - ✅ Keyboard navigation desteği
 *
 * @example
 * // Reactive Forms ile
 * <nui-radio [formControl]="genderControl" value="male" label="Erkek"></nui-radio>
 * <nui-radio [formControl]="genderControl" value="female" label="Kadın"></nui-radio>
 *
 * @example
 * // Template-driven Forms ile
 * <nui-radio [(ngModel)]="selectedColor" value="red" label="Kırmızı"></nui-radio>
 * <nui-radio [(ngModel)]="selectedColor" value="blue" label="Mavi"></nui-radio>
 *
 * @example
 * // Label ve description ile
 * <nui-radio
 *   [(ngModel)]="plan"
 *   value="premium"
 *   label="Premium Plan"
 *   description="Tüm özelliklere sınırsız erişim">
 * </nui-radio>
 *
 * @example
 * // Varyant ve boyut ile
 * <nui-radio
 *   [(ngModel)]="status"
 *   value="active"
 *   [variant]="ColorVariant.Success"
 *   [size]="Size.Large"
 *   label="Aktif">
 * </nui-radio>
 *
 * @see https://v20.angular.dev/guide/signals
 * @see {@link ValueAccessorBase}
 * @see {@link Size} - Standart boyut değerleri
 * @see {@link ColorVariant} - Renk varyantları
 */
@Component({
  selector: 'nui-radio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true,
    },
  ],
})
export class RadioComponent extends ValueAccessorBase<any> {
  /**
   * Unique ID for accessibility.
   */
  readonly inputId = `nui-radio-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Radyo butonunun değeri.
   * Model değeri bu değerle eşleştiğinde seçili (checked) olur.
   */
  readonly valueInput = input.required<any>({ alias: 'value' });

  /**
   * Input name attribute.
   * Radyo grubu oluşturmak için kullanılır.
   */
  readonly name = input<string>('');

  /**
   * Renk varyantı.
   * Semantik anlamı olan renk teması sağlar.
   *
   * @default ColorVariant.Primary
   */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /**
   * Boyut.
   * Radyo butonunun büyüklüğünü ve label font boyutunu belirler.
   *
   * @default Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Readonly durumu.
   * true olduğunda radyo butonu tıklanamaz ama görsel olarak aktif görünür.
   *
   * @default false
   */
  readonly readonly = input<boolean>(false);

  /**
   * Label metni.
   * Radyo butonunun yanında gösterilecek ana etiket.
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
   * Disabled input (dumb mode).
   */
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

  /**
   * Radyo butonunun seçili olup olmadığını kontrol eden computed signal.
   * Model değeri (this.value()) ile input değeri (this.valueInput()) karşılaştırılır.
   */
  readonly isChecked = computed(() => {
    return this.value() === this.valueInput();
  });

  /**
   * Ana container için CSS class'larını hesaplayan computed signal.
   * BEM metodolojisi ile dynamic class binding yapar.
   */
  readonly radioContainerClasses = computed(() => {
    const classes = ['nui-radio'];

    classes.push(`nui-radio--${this.size()}`);

    if (this.isDisabled()) {
      classes.push('nui-radio--disabled');
    }

    if (this.readonly()) {
      classes.push('nui-radio--readonly');
    }

    if (this.isChecked()) {
      classes.push('nui-radio--checked');
    }

    return classes.join(' ');
  });

  /**
   * Radyo kontrolü (daire) için CSS class'larını hesaplayan computed signal.
   */
  readonly radioControlClasses = computed(() => {
    const classes = ['nui-radio__control'];

    classes.push(`nui-radio__control--${this.variant()}`);
    classes.push(`nui-radio__control--${this.size()}`);

    if (this.thisIsCheckedAndColorApply()) {
      // Checked state style is handled mostly by CSS via parent checked class or direct state
      // But let's add variant specific classes here if needed.
      // Actually, variant usually applies to checked state color.
    }

    return classes.join(' ');
  });

  /**
   * Helper to determine if color should be applied
   */
  private readonly thisIsCheckedAndColorApply = computed(() => {
    return this.isChecked() && !this.isDisabled();
  });

  /**
   * Label metni için CSS class'larını hesaplayan computed signal.
   */
  readonly labelTextClasses = computed(() => {
    const classes = ['nui-radio__label-text'];

    classes.push(`nui-radio__label-text--${this.size()}`);

    if (this.isDisabled()) {
      classes.push('nui-radio__label-text--disabled');
    }

    return classes.join(' ');
  });

  /**
   * Description metni için CSS class'larını hesaplayan computed signal.
   */
  readonly descriptionClasses = computed(() => {
    const classes = ['nui-radio__description'];

    classes.push(`nui-radio__description--${this.size()}`);

    if (this.isDisabled()) {
      classes.push('nui-radio__description--disabled');
    }

    return classes.join(' ');
  });

  constructor() {
    super();

    // Sync disabled input
    effect(() => {
      this.setDisabledState(this.disabledInput());
    });
  }

  /**
   * Radyo butonu change handler'ı.
   * Seçildiğinde model değerini günceller.
   *
   * @returns void
   */
  handleChange(): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }

    // Radio button sadece seçildiğinde değer gönderir
    this.updateValue(this.valueInput());
  }

  /**
   * Blur handler'ı.
   * Form touched state'ini güncellemek için.
   */
  handleBlur(): void {
    this.markAsTouched();
  }
}
