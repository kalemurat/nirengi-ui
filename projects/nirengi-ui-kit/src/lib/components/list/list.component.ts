import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, TemplateRef } from '@angular/core';

/** Requires a unique `id` on every list item for efficient tracking. */
export interface ListItem {
  id: string | number;
  [key: string]: any;
}

/**
 * Renders a collection of items via a caller-supplied `TemplateRef`.
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
  /** Each item MUST have a unique `id` property. */
  items = input.required<T[]>();

  /**
   * If omitted, a default template is used.
   * Access the item in the template via `let-item`.
   */
  itemTemplate = input<TemplateRef<any>>();

  /** Extra CSS class(es) on the `<ul>` container (e.g. `'flex flex-col gap-2'`). */
  listClass = input<string>('');

  protected readonly containerClasses = computed(() => {
    return `nui-list ${this.listClass()}`.trim();
  });
}
