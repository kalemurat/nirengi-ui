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

export type TextboxType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';

/**
 * Signal-based textbox component with ControlValueAccessor support.
 *
 * @example
 * <nui-textbox label="Username" placeholder="Enter user" [formControl]="userCtrl" />
 *
 * @example
 * <nui-textbox
 *   label="Password"
 *   type="password"
 *   icon="Lock"
 *   variant="danger"
 *   hint="Invalid password"
 * />
 */

@Component({
  selector: 'nui-textbox',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './textbox.component.html',
  styleUrl: './textbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextboxComponent),
      multi: true,
    },
  ],
})
export class TextboxComponent extends ValueAccessorBase<string> {
  /**
   * Unique ID for accessibility.
   */
  readonly inputId = `nui-textbox-${Math.random().toString(36).substr(2, 9)}`;

  readonly label = input<string>();

  readonly placeholder = input<string>('');

  /** @default 'text' */
  readonly type = input<TextboxType>('text');

  readonly hint = input<string>();

  /** @default ColorVariant.Neutral */
  readonly variant = input<ColorVariant>(ColorVariant.Neutral);

  readonly icon = input<IconName>();

  readonly readonly = input<boolean>(false);

  /** @default Size.Medium */
  readonly size = input<Size>(Size.Medium);

  /** Dumb-mode value; synced to the base class via effect. */
  readonly valueInput = input<string | null>(null, { alias: 'value' });

  /**
   * Shows a clear button when the value is not empty.
   * @default false
   */
  readonly clearable = input<boolean>(false);

  /** Dumb-mode disabled; synced to the base class via effect. */
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

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

  protected readonly containerClasses = computed(() => {
    return `nui-textbox--${this.variant()} nui-textbox--${this.size()}`;
  });

  protected readonly inputClasses = computed(() => {
    return `nui-textbox__input--${this.size()}`;
  });

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

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.updateValue(value);
  }

  /** No-op when disabled or readonly. */
  clearValue(): void {
    if (this.isDisabled() || this.readonly()) return;
    this.updateValue('');
  }
}
