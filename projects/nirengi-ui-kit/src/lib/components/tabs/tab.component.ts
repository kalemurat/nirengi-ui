import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { TabLabelDirective } from './tab-label.directive';

/**
 * Tab item component.
 * Used inside the `nui-tabs` component.
 * It takes content with `ng-content` and presents it to the parent as a path-template.
 *
 * @example
 * <nui-tab label="Profile">
 *   <app-profile-settings />
 * </nui-tab>
 *
 * @example
 * <!-- With Custom Template -->
 * <nui-tab>
 *   <ng-template nuiTabLabel>
 *      <nui-icon name="user" /> Profile
 *   </ng-template>
 *   Content...
 * </nui-tab>
 */
@Component({
  selector: 'nui-tab',
  standalone: true,
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  /**
   * Tab label.
   * Text to be displayed in the header part.
   * If the `nuiTabLabel` directive is used, this value is ignored.
   */
  readonly label = input<string>();

  /**
   * Disabled state.
   * If true, the tab cannot be selected.
   *
   * @default false
   */
  readonly disabled = input<boolean>(false);

  /**
   * Custom label template.
   * Captures content with the `nuiTabLabel` directive.
   */
  readonly labelTemplate = contentChild(TabLabelDirective);

  /**
   * Template reference holding the tab content.
   * Used by the parent component (Tabs) to render the content.
   */
  readonly contentTemplate = viewChild.required(TemplateRef);
}
