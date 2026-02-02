import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipPosition } from './tooltip.types';

/**
 * Tooltip içeriğini gösteren component.
 * Direktif tarafından dinamik olarak oluşturulur ve yönetilir.
 *
 * @example
 * // Bu component direkt olarak kullanılmaz, nirengiTooltip direktifi üzerinden yönetilir.
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
        /* Component host stili */
        display: block;
      }
      .tooltip {
        /* Temel tooltip stili */
        @apply pointer-events-none scale-95 whitespace-nowrap rounded bg-inverse px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200;

        /* Görünürlük kontrolü */
        &--visible {
          @apply scale-100 opacity-100;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent {
  /**
   * Gösterilecek metin.
   */
  readonly text = input.required<string>();

  /**
   * Tooltip pozisyonu.
   */
  readonly position = input<TooltipPosition>(TooltipPosition.Top);

  /**
   * Görünürlük durumu.
   * Animasyon için kullanılır.
   */
  readonly visible = input<boolean>(false);

  /**
   * Container stili için computed signal.
   * BEM metodolojisine uygun class'lar üretir.
   */
  readonly containerClasses = computed(() => {
    const baseClass = 'tooltip';
    const positionClass = `tooltip--${this.position()}`;
    const visibleClass = this.visible() ? 'tooltip--visible' : '';

    return `${baseClass} ${positionClass} ${visibleClass}`;
  });
}
