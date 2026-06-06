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
  /** If the `nuiTabLabel` directive is used, this value is ignored. */
  readonly label = input<string>();

  /** @default false */
  readonly disabled = input<boolean>(false);

  /** Captures content projected with the `nuiTabLabel` directive. */
  readonly labelTemplate = contentChild(TabLabelDirective);

  /** Used by the parent `nui-tabs` component to render the active tab's content. */
  readonly contentTemplate = viewChild.required(TemplateRef);
}
