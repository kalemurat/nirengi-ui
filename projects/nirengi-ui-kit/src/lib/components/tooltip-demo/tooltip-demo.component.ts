import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { TooltipPosition } from '../tooltip/tooltip.types';
import { ButtonComponent, ButtonType } from '../button/button.component';

/** Demo component that showcases TooltipDirective inside the nirengi-ui-kit showcase system. */
@Component({
  selector: 'nui-tooltip-demo',
  standalone: true,
  imports: [CommonModule, TooltipDirective, ButtonComponent],
  template: `
    <div
      class="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-20"
    >
      <nui-button
        [nuiTooltip]="tooltipText()"
        [nuiTooltipPosition]="tooltipPosition()"
        [kind]="ButtonType.Solid"
      >
        Hover Over Me
      </nui-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipDemoComponent {
  readonly tooltipText = input<string>('Hello World!');

  readonly tooltipPosition = input<TooltipPosition>(TooltipPosition.Top);

  // Enum reference for use in the template (if needed)
  readonly ButtonType = ButtonType;
}
