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
  public readonly Size = Size;
  public readonly ColorVariant = ColorVariant;

  /** @default ColorVariant.Primary */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /** @default Size.Medium */
  readonly size = input<Size>(Size.Medium);

  /** If ng-content is provided, it takes priority over this label. */
  readonly label = input<string>();

  /** @default auto-generated random id */
  readonly id = input<string>(`nui-switch-${Math.random().toString(36).substr(2, 9)}`);

  /** Dumb/controlled-mode disabled binding. */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- intentional public API alias
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

  /** Dumb/controlled-mode checked binding. */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- intentional public API alias
  readonly checkedInput = input<boolean | null>(null, { alias: 'checked' });

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

  /** No-op when disabled. */
  toggle(): void {
    if (this.isDisabled()) return;
    this.updateValue(!this.value());
    this.markAsTouched();
  }

  /** Handles Space and Enter keys; prevents default scroll on Space. */
  onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  }
}
