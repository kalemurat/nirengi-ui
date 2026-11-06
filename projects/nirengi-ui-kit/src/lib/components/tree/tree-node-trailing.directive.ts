import { Directive, inject, TemplateRef } from '@angular/core';
import { ITreeNodeContext } from './tree.types';

/**
 * Marks an `ng-template` as the trailing content of every `nui-tree` row, for
 * example a count badge or a row actions button. The tree renders it at the end
 * of each node without knowing what it contains.
 *
 * A click inside the template bubbles to the tree and selects the row. Call
 * `$event.stopPropagation()` in the handler of an action that must not select it.
 *
 * @example
 * <nui-tree [nodes]="categories" ariaLabel="Categories">
 *   <ng-template nuiTreeNodeTrailing let-node let-level="level">
 *     <nui-badge [text]="node.data.count" />
 *   </ng-template>
 * </nui-tree>
 */
@Directive({
  selector: 'ng-template[nuiTreeNodeTrailing]',
})
export class TreeNodeTrailingDirective<T = unknown> {
  readonly template = inject<TemplateRef<ITreeNodeContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T>(
    _dir: TreeNodeTrailingDirective<T>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- a type predicate must name its parameter
    ctx: unknown
  ): ctx is ITreeNodeContext<T> {
    return true;
  }
}
