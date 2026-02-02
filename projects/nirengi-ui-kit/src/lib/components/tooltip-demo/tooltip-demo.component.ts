import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { TooltipPosition } from '../tooltip/tooltip.types';
import { ButtonComponent, ButtonType } from '../button/button.component';

/**
 * Demo component used to showcase the Tooltip component in the showcase system.
 * This component uses TooltipDirective and is controlled by external inputs.
 */
@Component({
  selector: 'nirengi-tooltip-demo',
  standalone: true,
  imports: [CommonModule, TooltipDirective, ButtonComponent],
  template: `
    <div
      class="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-20"
    >
      <nui-button
        [nirengiTooltip]="tooltipText()"
        [nirengiTooltipPosition]="tooltipPosition()"
        [type]="ButtonType.Solid"
      >
        Hover Over Me
      </nui-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipDemoComponent {
  /**
   * The text to be displayed inside the tooltip.
   */
  readonly tooltipText = input<string>('Hello World!');

  /**
   * Tooltip position.
   */
  readonly tooltipPosition = input<TooltipPosition>(TooltipPosition.Top);

  // Enum reference for use in the template (if needed)
  readonly ButtonType = ButtonType;
}

