import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipPosition } from './tooltip.types';

/**
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
  readonly text = input.required<string>();

  readonly position = input<TooltipPosition>(TooltipPosition.Top);

  readonly visible = input<boolean>(false);

  readonly containerClasses = computed(() => {
    const baseClass = 'tooltip';
    const positionClass = `tooltip--${this.position()}`;
    const visibleClass = this.visible() ? 'visible' : '';

    return `${baseClass} ${positionClass} ${visibleClass}`;
  });
}
