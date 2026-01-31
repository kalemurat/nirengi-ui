import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { TooltipPosition } from '../tooltip/tooltip.types';
import { ButtonComponent, ButtonType } from '../button/button.component';

/**
 * Tooltip bileşenini showcase sisteminde göstermek için kullanılan demo bileşeni.
 * Bu bileşen, TooltipDirective'i kullanır ve dışarıdan gelen inputlarla kontrol edilir.
 */
@Component({
  selector: 'nirengi-tooltip-demo',
  standalone: true,
  imports: [CommonModule, TooltipDirective, ButtonComponent],
  template: `
    <div class="flex items-center justify-center p-20 bg-slate-50 rounded-lg border border-slate-200">
      <nui-button
        [nirengiTooltip]="tooltipText()"
        [nirengiTooltipPosition]="tooltipPosition()"
        [type]="ButtonType.Solid"
      >
        Üzerime Gel
      </nui-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipDemoComponent {
  /**
   * Tooltip içinde gösterilecek metin.
   */
  readonly tooltipText = input<string>('Merhaba Dünya!');

  /**
   * Tooltip pozisyonu.
   */
  readonly tooltipPosition = input<TooltipPosition>(TooltipPosition.Top);

  // Template içinde kullanmak için enum referansı (Gerekirse)
  readonly ButtonType = ButtonType;
}
