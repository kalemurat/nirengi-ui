import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, TemplateRef } from '@angular/core';

/**
 * Generic `id` interface for list items.
 * Allows for efficient tracking of items.
 */
export interface ListItem {
  id: string | number;
  [key: string]: any;
}

/**
 * List component that renders a collection of items using a customizable template.
 * Supports content projection via TemplateRef, allowing the item content to be fully customized.
 *
 * ## Features
 * - ✅ OnPush change detection strategy
 * - ✅ Signal-based inputs
 * - ✅ Custom item template support
 * - ✅ BEM style support
 * - ✅ TrackBy optimization using `id`
 *
 * @example
 * <nui-list [items]="users" [itemTemplate]="userTemplate" />
 *
 * <ng-template #userTemplate let-user>
 *   <div class="user-row">
 *     <img [src]="user.avatar" />
 *     <span>{{ user.name }}</span>
 *   </div>
 * </ng-template>
 */
@Component({
  selector: 'nui-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent<T extends ListItem> {
  /**
   * Collection of items to be displayed.
   * Each item MUST have a unique `id` property.
   */
  items = input.required<T[]>();

  /**
   * Template to be used for rendering each item.
   * If not provided, a default template is used.
   * The template content provides access to the item via `let-item`.
   */
  itemTemplate = input<TemplateRef<any>>();

  /**
   * Optional custom CSS class for the list container (ul).
   * Useful for layout adjustments (e.g., 'flex flex-col gap-2').
   */
  listClass = input<string>('');

  /**
   * Computed classes for the list container.
   * Combines the base BEM class with custom classes.
   */
  protected readonly containerClasses = computed(() => {
    return `nui-list ${this.listClass()}`.trim();
  });
}
