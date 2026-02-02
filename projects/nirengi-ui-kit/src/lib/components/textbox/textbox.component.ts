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
 * Textbox input types definitions.
 */
export type TextboxType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';

/**
 * Modern textbox (input) component.
 * Allows user input for various data types.
 *
 * ## Features
 * - ✅ Signal based ControlValueAccessor (NG_VALUE_ACCESSOR)
 * - ✅ OnPush change detection stratejisi
 * - ✅ Computed signals ile class binding
 * - ✅ Various types (text, password, etc.)
 * - ✅ Label, Hint, and Error message support
 * - ✅ Icon support
 * - ✅ Size variations
 * - ✅ Disabled state
 * - ✅ Tailwind + BEM styling
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

  /**
   * Label text.
   */
  readonly label = input<string>();

  /**
   * Placeholder text.
   */
  readonly placeholder = input<string>('');

  /**
   * Input type.
   * @default 'text'
   */
  readonly type = input<TextboxType>('text');

  /**
   * Helper hint text.
   */
  readonly hint = input<string>();

  /**
   * Component color variant.
   * @default ColorVariant.Neutral
   */
  readonly variant = input<ColorVariant>(ColorVariant.Neutral);

  /**
   * Icon name to display.
   */
  readonly icon = input<IconName>();

  /**
   * Readonly state.
   */
  readonly readonly = input<boolean>(false);

  /**
   * Component size.
   * @default Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Input value (dumb mode).
   */
  readonly valueInput = input<string | null>(null, { alias: 'value' });

  /**
   * Disabled state (dumb mode).
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
   * Computed icon size based on component size.
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
   * Container CSS classes (variant).
   */
  protected readonly containerClasses = computed(() => {
    return `nui-textbox--${this.variant()} nui-textbox--${this.size()}`;
  });

  /**
   * Input CSS classes (size).
   */
  protected readonly inputClasses = computed(() => {
    return `nui-textbox__input--${this.size()}`;
  });

  /**
   * Handle input event.
   */
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.updateValue(value);
  }
}
