import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/** Visual style variants for the button element. */
export enum ButtonType {
  /** Solid background, high contrast (default) */
  Solid = 'solid',
  /** Border only, transparent background */
  Outline = 'outline',
  /** Text only, no background or border */
  Ghost = 'ghost',
  /** Soft background, no border */
  Soft = 'soft',
}

/**
 * Themeable button component supporting solid, outline, ghost, and soft styles.
 *
 * Sizes are driven by the central `size.constants.ts` maps (SIZE_HEIGHT_MAP,
 * SIZE_PADDING_MAP, SIZE_TEXT_MAP, SIZE_GAP_MAP), keeping button dimensions
 * consistent with Input, Select, and Badge components.
 *
 * @example
 * // Simple usage
 * <nui-button>Save</nui-button>
 *
 * @example
 * // With variant and size
 * <nui-button
 *   [variant]="ColorVariant.Primary"
 *   [size]="Size.Large"
 *   [kind]="ButtonType.Solid">
 *   Submit
 * </nui-button>
 *
 * @example
 * // Disabled and loading state
 * <nui-button
 *   [disabled]="isProcessing()"
 *   [loading]="isLoading()">
 *   Complete Process
 * </nui-button>
 *
 * @example
 * // With click event
 * <nui-button (clicked)="handleSave()">Save</nui-button>
 *
 * @see {@link ButtonType} - Button style types
 * @see {@link Size} - Standard size values
 * @see {@link ColorVariant} - Color variants
 */
@Component({
  selector: 'nui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  /** @default ButtonType.Solid */
  kind = input<ButtonType>(ButtonType.Solid);

  /** @default ColorVariant.Primary */
  variant = input<ColorVariant>(ColorVariant.Primary);

  /** @default Size.Medium */
  size = input<Size>(Size.Medium);

  /** @default false */
  disabled = input<boolean>(false);

  /** @default false */
  loading = input<boolean>(false);

  /** @default false */
  fullWidth = input<boolean>(false);

  /** Not emitted while disabled or loading. */
  clicked = output<void>();

  /** @default 'button' */
  type = input<'button' | 'submit' | 'reset'>('button');

  protected readonly buttonClasses = computed(() => {
    const classes = ['nui-button'];

    classes.push(`nui-button--${this.kind()}`);
    classes.push(`nui-button--${this.variant()}`);
    classes.push(`nui-button--${this.size()}`);

    if (this.disabled()) {
      classes.push('nui-button--disabled');
    }

    if (this.loading()) {
      classes.push('nui-button--loading');
    }

    if (this.fullWidth()) {
      classes.push('nui-button--full-width');
    }

    return classes.join(' ');
  });

  handleClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
