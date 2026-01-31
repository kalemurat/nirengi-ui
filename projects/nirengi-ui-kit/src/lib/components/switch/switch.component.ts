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
 * Formlarda boolean değerleri değiştirmek için kullanılır.
 * Signal tabanlı reaktif state yönetimi kullanır.
 *
 * @example
 * <nui-switch [variant]="ColorVariant.Primary" [size]="Size.Medium">
 *   Bildirimleri Aç
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
   * Template'de enum kullanımı için public property.
   */
  public readonly Size = Size;
  public readonly ColorVariant = ColorVariant;

  /**
   * Switch varyant rengi.
   * Varsayılan: `ColorVariant.Primary`
   */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /**
   * Switch boyutu.
   * Varsayılan: `Size.Medium`
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Switch yanında gösterilecek label metni.
   * Eğer component içeriğinde (ng-content) bir şey varsa o önceliklidir.
   */
  readonly label = input<string>();

  /**
   * Switch input'unun id değeri.
   * Erişilebilirlik için kullanılır.
   */
  readonly id = input<string>(`nui-switch-${Math.random().toString(36).substr(2, 9)}`);

  /**
   * Disabled input (dumb mode).
   */
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

  /**
   * Checked input (dumb mode).
   * Direct binding için kullanılır.
   */
  readonly checkedInput = input<boolean | null>(null, { alias: 'checked' });

  /**
   * Container class'ları.
   * Boyut ve varyanta göre dinamik olarak hesaplanır.
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
   * Toggle işlemi.
   * Disabled değilse değeri tersine çevirir.
   */
  toggle(): void {
    if (this.isDisabled()) return;
    this.updateValue(!this.value());
    this.markAsTouched();
  }

  /**
   * Keyboard (Space/Enter) ile toggle işlemi.
   */
  onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  }
}
