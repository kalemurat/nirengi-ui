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
 * Modern checkbox component.
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
 * - ✅ Indeterminate state support
 * - ✅ Label and description support
 * - ✅ WCAG 2.1 AA accessibility standards
 * - ✅ Keyboard navigation support
 *
 * @example
 * // With Reactive Forms
 * <nui-checkbox [formControl]="termsControl" label="I Accept"></nui-checkbox>
 *
 * @example
 * // With Template-driven Forms
 * <nui-checkbox [(ngModel)]="isAccepted" label="I Accept"></nui-checkbox>
 *
 * @example
 * // With label and description
 * <nui-checkbox
 *   [formControl]="newsletterControl"
 *   label="Newsletter"
 *   description="I want to receive emails to be notified of new updates">
 * </nui-checkbox>
 *
 * @example
 * // With variant and size
 * <nui-checkbox
 *   [formControl]="termsControl"
 *   [variant]="ColorVariant.Success"
 *   [size]="Size.Large"
 *   label="I have read the Terms of Use">
 * </nui-checkbox>
 *
 * @example
 * // Indeterminate state
 * <nui-checkbox
 *   [formControl]="selectAllControl"
 *   [indeterminate]="isIndeterminate()"
 *   label="Select All">
 * </nui-checkbox>
 *
 * @see https://v20.angular.dev/guide/signals
 * @see {@link ValueAccessorBase}
 * @see {@link Size} - Standard size values
 * @see {@link ColorVariant} - Color variants
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
   * Color variant.
   * Provides a color theme with semantic meaning.
   *
   * @default ColorVariant.Primary
   */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /**
   * Size.
   * Determines the checkbox size and label font size.
   *
   * @default Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Readonly state.
   * When true, the checkbox is not clickable but appears visually active.
   *
   * @default false
   */
  readonly readonly = input<boolean>(false);

  /**
   * Indeterminate state.
   * Used to show partial selection states (e.g., "Select All" checkbox).
   *
   * @default false
   */
  readonly indeterminate = input<boolean>(false);

  /**
   * Label text.
   * The main label to be displayed next to the checkbox.
   */
  readonly label = input<string>('');

  /**
   * Description text.
   * Explanatory text to be displayed under the label.
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
   * Checked input (dumb mode).
   * Used for direct binding.
   */
  readonly checkedInput = input<boolean | null>(null, { alias: 'checked' });

  /**
   * Disabled input (dumb mode).
   */
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

  /**
   * Computed signal to calculate CSS classes for the checkbox.
   * Performs dynamic class binding using BEM methodology.
   * Updated reactively.
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
   * Computed signal to calculate CSS classes for the label.
   * Updated reactively.
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
   * Computed signal to calculate CSS classes for the description.
   * Updated reactively.
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
   * Checkbox toggle handler.
   * Does not work in disabled or readonly states.
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
   * Checkbox blur handler.
   * Used to update the form touched state.
   */
  handleBlur(): void {
    this.markAsTouched();
  }
}
