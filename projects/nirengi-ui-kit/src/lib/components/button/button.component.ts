import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Button type enum.
 * Determines the visual style and behavior of the button.
 */
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
 * Modern button component.
 * Uses Angular 20 signal-based API and Tailwind + BEM methodology.
 *
 * ## Features
 * - ✅ Signal-based reactive state management
 * - ✅ OnPush change detection strategy
 * - ✅ Computed signals for class binding
 * - ✅ 4 different button types (solid, outline, ghost, soft)
 * - ✅ 5 different sizes (xs, sm, md, lg, xl)
 * - ✅ 7 different color variants (primary, secondary, success, warning, danger, info, neutral)
 * - ✅ Disabled and loading states
 * - ✅ Full width option
 * - ✅ Icon support (prefix and suffix)
 * - ✅ WCAG 2.1 AA accessibility standards
 * - ✅ Keyboard navigation support
 *
 * ## Design System Integration
 * The component uses central size values from the `size.constants.ts` file:
 * - SIZE_HEIGHT_MAP: Button heights
 * - SIZE_PADDING_MAP: Horizontal padding values
 * - SIZE_TEXT_MAP: Font size values
 * - SIZE_GAP_MAP: Gap between icon and text
 *
 * This ensures size consistency with other components like Input, Select, and Badge.
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
 * @see https://v20.angular.dev/guide/signals
 * @see {@link ButtonType} - Button style types
 * @see {@link Size} - Standard size values
 * @see {@link ColorVariant} - Color variants
 * @see {@link SIZE_HEIGHT_MAP} - Central size height mapping
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
  /**
   * Button kind (visual style).
   * Determines the visual style and behavior.
   *
   * @default ButtonType.Solid
   */
  kind = input<ButtonType>(ButtonType.Solid);

  /**
   * Color variant.
   * Provides a color theme with semantic meaning.
   *
   * @default ColorVariant.Primary
   */
  variant = input<ColorVariant>(ColorVariant.Primary);

  /**
   * Size.
   * Determines the button's height, padding, and font size.
   *
   * @default Size.Medium
   */
  size = input<Size>(Size.Medium);

  /**
   * Disabled state.
   * When true, the button is not clickable and appears visually disabled.
   *
   * @default false
   */
  disabled = input<boolean>(false);

  /**
   * Loading state.
   * When true, the button shows a loading spinner and becomes unclickable.
   *
   * @default false
   */
  loading = input<boolean>(false);

  /**
   * Full width state.
   * When true, the button covers the full width of its parent container.
   *
   * @default false
   */
  fullWidth = input<boolean>(false);

  /**
   * Click event.
   * Emitted when the button is clicked.
   * Not emitted during loading or disabled states.
   *
   * @event clicked
   */
  clicked = output<void>();

  /**
   * Native button type.
   * Determines the browser behavior of the button (submit form, reset form, etc.).
   *
   * @default 'button'
   */
  type = input<'button' | 'submit' | 'reset'>('button');

  /**
   * Computed signal to calculate CSS classes for the button.
   * Performs dynamic class binding using BEM methodology.
   * Updated reactively.
   *
   * @returns CSS class string in BEM format
   */
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

  /**
   * Click handler method.
   * Does not emit event during loading or disabled states.
   *
   * @returns void
   */
  handleClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
