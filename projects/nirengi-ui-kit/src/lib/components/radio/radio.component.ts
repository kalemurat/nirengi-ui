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
 * Radio button component with signal-based ControlValueAccessor.
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
 * @see {@link ValueAccessorBase}
 * @see {@link Size}
 * @see {@link ColorVariant}
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
  /** Unique ID for accessibility. */
  readonly inputId = `nui-radio-${Math.random().toString(36).substr(2, 9)}`;

  /** When the model value matches this value, the radio becomes checked. */
  readonly valueInput = input.required<any>({ alias: 'value' });

  /** Groups multiple radio buttons together. */
  readonly name = input<string>('');

  /** @default ColorVariant.Primary */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /** @default Size.Medium */
  readonly size = input<Size>(Size.Medium);

  /** When true, not clickable but appears visually active. @default false */
  readonly readonly = input<boolean>(false);

  readonly label = input<string>('');

  readonly description = input<string>('');

  /** @default false */
  readonly required = input<boolean>(false);

  /** Disabled input (dumb mode). */
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

  readonly isChecked = computed(() => {
    return this.value() === this.valueInput();
  });

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

  private readonly thisIsCheckedAndColorApply = computed(() => {
    return this.isChecked() && !this.isDisabled();
  });

  readonly labelTextClasses = computed(() => {
    const classes = ['nui-radio__label-text'];

    classes.push(`nui-radio__label-text--${this.size()}`);

    if (this.isDisabled()) {
      classes.push('nui-radio__label-text--disabled');
    }

    return classes.join(' ');
  });

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

  handleChange(): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }

    // Radio button only sends value when selected
    this.updateValue(this.valueInput());
  }

  handleBlur(): void {
    this.markAsTouched();
  }
}
