import { Directive, inject, TemplateRef } from '@angular/core';

/**
 * Directive for the tab label.
 * Used to use a custom template (icon, image, etc.) in the tab header.
 *
 * @example
 * <nui-tab>
 *   <ng-template nuiTabLabel>
 *     <nui-icon name="user" />
 *     <span>Profile</span>
 *   </ng-template>
 *   Content...
 * </nui-tab>
 */
@Directive({
  selector: '[nuiTabLabel]',
  standalone: true,
})
export class TabLabelDirective {
  /**
   * Template reference.
   */
  readonly template = inject(TemplateRef);
}

