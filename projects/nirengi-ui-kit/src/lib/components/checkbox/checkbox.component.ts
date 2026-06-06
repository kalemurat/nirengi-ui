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

  /** @default ColorVariant.Primary */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /** @default Size.Medium */
  readonly size = input<Size>(Size.Medium);

  /**
   * When true, the checkbox is not clickable but appears visually active.
   *
   * @default false
   */
  readonly readonly = input<boolean>(false);

  /**
   * Used to show partial selection states (e.g., "Select All" checkbox).
   *
   * @default false
   */
  readonly indeterminate = input<boolean>(false);

  /**
   * When true, cycles through three states: null → true → false.
   * Useful for filters where "All", "Active", and "Passive" states are needed.
   *
   * @default false
   */
  readonly tristate = input<boolean>(false);

  readonly label = input<string>('');

  readonly description = input<string>('');

  /** @default false */
  readonly required = input<boolean>(false);

  /** Dumb-mode: bypasses ControlValueAccessor; use for direct binding. */
  readonly checked = input<boolean | null>(null);

  /** Dumb-mode: mirrors setDisabledState without a form control. */
  readonly disabled = input<boolean>(false);

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

    if (this.isIndeterminate()) {
      classes.push('nui-checkbox--indeterminate');
    }

    return classes.join(' ');
  });

  /** Returns true when tristate is enabled and value is null. */
  readonly isIndeterminate = computed(() => {
    if (this.tristate() && this.value() === null) {
      return true;
    }
    return this.indeterminate();
  });

  readonly labelClasses = computed(() => {
    const classes = ['nui-checkbox__label'];

    classes.push(`nui-checkbox__label--${this.size()}`);

    if (this.isDisabled()) {
      classes.push('nui-checkbox__label--disabled');
    }

    return classes.join(' ');
  });

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
      const val = this.checked();
      if (val !== null) {
        this.writeValue(val);
      }
    });

    // Sync disabled input
    effect(() => {
      this.setDisabledState(this.disabled());
    });
  }

  /** Does not emit while disabled or readonly; cycles tristate when enabled. */
  handleToggle(): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }

    let newValue: boolean | null;

    if (this.tristate()) {
      const current = this.value();
      if (current === null) {
        newValue = true;
      } else if (current === true) {
        newValue = false;
      } else {
        newValue = null;
      }
    } else {
      newValue = !this.value();
    }

    this.updateValue(newValue);
  }

  handleBlur(): void {
    this.markAsTouched();
  }
}
