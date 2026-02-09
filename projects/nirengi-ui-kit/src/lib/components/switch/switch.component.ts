import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ColorVariant } from '../../common/enums/color-variant.enum';
import { Size } from '../../common/enums/size.enum';
import { ValueAccessorBase } from '../../common/base/value-accessor.base';

/**
 * Switch (Toggle) Component.
 * Used for toggling boolean values in forms.
 * Uses signal-based reactive state management.
 *
 * @example
 * <nui-switch [variant]="ColorVariant.Primary" [size]="Size.Medium">
 *   Enable Notifications
 * </nui-switch>
 */
@Component({
  selector: 'nui-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent extends ValueAccessorBase<boolean> {
  /**
   * Public property for using enums in the template.
   */
  public readonly Size = Size;
  public readonly ColorVariant = ColorVariant;

  /**
   * Switch variant color.
   * Default: `ColorVariant.Primary`
   */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /**
   * Switch size.
   * Default: `Size.Medium`
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Label text to be displayed next to the switch.
   * If there is content in the component (ng-content), it takes priority.
   */
  readonly label = input<string>();

  /**
   * ID value for the switch input.
   * Used for accessibility.
   */
  readonly id = input<string>(`nui-switch-${Math.random().toString(36).substr(2, 9)}`);

  /**
   * Disabled input (dumb mode).
   */
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

  /**
   * Checked input (dumb mode).
   * Used for direct binding.
   */
  readonly checkedInput = input<boolean | null>(null, { alias: 'checked' });

  /**
   * Container classes.
   * Dynamically calculated based on size and variant.
   */
  readonly containerClasses = computed(() => {
    return {
      'nui-switch': true,
      [`nui-switch--${this.size()}`]: true,
      [`nui-switch--${this.variant()}`]: true,
      'nui-switch--disabled': this.isDisabled(),
      'nui-switch--checked': this.value() === true,
    };
  });

  constructor() {
    super();

    // Sync disabled input
    effect(() => {
      this.setDisabledState(this.disabledInput());
    });

    // Sync checked input
    effect(() => {
      const val = this.checkedInput();
      if (val !== null) {
        this.writeValue(val);
      }
    });
  }

  /**
   * Toggle action.
   * Inverts the value if not disabled.
   */
  toggle(): void {
    if (this.isDisabled()) return;
    this.updateValue(!this.value());
    this.markAsTouched();
  }

  /**
   * Toggle action via keyboard (Space/Enter).
   */
  onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  }
}
