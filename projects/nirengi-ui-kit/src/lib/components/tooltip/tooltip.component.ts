import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipPosition } from './tooltip.types';

/**
 * Component that displays the tooltip content.
 * Dynamically created and managed by the directive.
 *
 * @example
 * // This component is not used directly, it is managed via the nirengiTooltip directive.
 */
@Component({
  selector: 'nirengi-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()">
      {{ text() }}
    </div>
  `,
  styles: [
    `
      :host {
        /* Component host style */
        display: block;
      }
      .tooltip {
        /* Base tooltip style */
        @apply pointer-events-none scale-95 whitespace-pre-line rounded-md bg-inverse px-4 py-2 text-xs font-semibold text-inverse opacity-0 shadow-xl transition-all duration-200;
      }
      .tooltip.visible {
        /* Visibility control */
        @apply scale-100 opacity-100;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent {
  /**
   * Text to be displayed.
   */
  readonly text = input.required<string>();

  /**
   * Tooltip position.
   */
  readonly position = input<TooltipPosition>(TooltipPosition.Top);

  /**
   * Visibility state.
   * Used for animation.
   */
  readonly visible = input<boolean>(false);

  /**
   * Computed signal for the container style.
   * Produces classes in accordance with BEM methodology.
   */
  readonly containerClasses = computed(() => {
    const baseClass = 'tooltip';
    const positionClass = `tooltip--${this.position()}`;
    const visibleClass = this.visible() ? 'visible' : '';

    return `${baseClass} ${positionClass} ${visibleClass}`;
  });
}
