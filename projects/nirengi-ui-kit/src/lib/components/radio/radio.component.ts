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
 * Modern radio button component.
 * Uses Angular 20 signal-based API and Tailwind + BEM methodology.
 *
 * ## Features
 * - ✅ Signal-based ControlValueAccessor (NG_VALUE_ACCESSOR)
 * - ✅ Two-way data binding support (ngModel, formControl)
 * - ✅ OnPush change detection strategy
 * - ✅ Reactive class binding with computed signals
 * - ✅ 5 different sizes (xs, sm, md, lg, xl)
 * - ✅ 7 different color variants (primary, secondary, success, warning, danger, info, neutral)
 * - ✅ Disabled and readonly states
 * - ✅ Label and description support
 * - ✅ WCAG 2.1 AA accessibility standards
 * - ✅ Keyboard navigation support
 *
 * @example
 * // With Reactive Forms
 * <nui-radio [formControl]="genderControl" value="male" label="Male"></nui-radio>
 * <nui-radio [formControl]="genderControl" value="female" label="Female"></nui-radio>
 *
 * @example
 * // With Template-driven Forms
 * <nui-radio [(ngModel)]="selectedColor" value="red" label="Red"></nui-radio>
 * <nui-radio [(ngModel)]="selectedColor" value="blue" label="Blue"></nui-radio>
 *
 * @example
 * // With label and description
 * <nui-radio
 *   [(ngModel)]="plan"
 *   value="premium"
 *   label="Premium Plan"
 *   description="Unlimited access to all features">
 * </nui-radio>
 *
 * @example
 * // With variant and size
 * <nui-radio
 *   [(ngModel)]="status"
 *   value="active"
 *   [variant]="ColorVariant.Success"
 *   [size]="Size.Large"
 *   label="Active">
 * </nui-radio>
 *
 * @see https://v20.angular.dev/guide/signals
 * @see {@link ValueAccessorBase}
 * @see {@link Size} - Standard size values
 * @see {@link ColorVariant} - Color variants
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
   * Value of the radio button.
   * When the model value matches this value, it becomes checked.
   */
  readonly valueInput = input.required<any>({ alias: 'value' });

  /**
   * Input name attribute.
   * Used to create a radio group.
   */
  readonly name = input<string>('');

  /**
   * Color variant.
   * Provides a color theme with semantic meaning.
   *
   * @default ColorVariant.Primary
   */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /**
   * Size.
   * Determines the size of the radio button and label font size.
   *
   * @default Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Readonly state.
   * When true, the radio button is not clickable but appears visually active.
   *
   * @default false
   */
  readonly readonly = input<boolean>(false);

  /**
   * Label text.
   * Main label to be displayed next to the radio button.
   */
  readonly label = input<string>('');

  /**
   * Description text.
   * Explanatory text to be displayed below the label.
   */
  readonly description = input<string>('');

  /**
   * Required state.
   * Used for form validation.
   *
   * @default false
   */
  readonly required = input<boolean>(false);

  /**
   * Disabled input (dumb mode).
   */
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

  /**
   * Computed signal that checks if the radio button is selected.
   * Compares model value (this.value()) with input value (this.valueInput()).
   */
  readonly isChecked = computed(() => {
    return this.value() === this.valueInput();
  });

  /**
   * Computed signal to calculate CSS classes for the main container.
   * Performs dynamic class binding using BEM methodology.
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
   * Computed signal to calculate CSS classes for the radio control (circle).
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
   * Computed signal to calculate CSS classes for the label text.
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
   * Computed signal to calculate CSS classes for the description text.
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
   * Radio button change handler.
   * Updates model value when selected.
   *
   * @returns void
   */
  handleChange(): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }

    // Radio button only sends value when selected
    this.updateValue(this.valueInput());
  }

  /**
   * Blur handler.
   * To update form touched state.
   */
  handleBlur(): void {
    this.markAsTouched();
  }
}
