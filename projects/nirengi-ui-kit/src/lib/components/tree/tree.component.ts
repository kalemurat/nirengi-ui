import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  model,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { IconComponent } from '../icon/icon.component';
import { TreeNodeTrailingDirective } from './tree-node-trailing.directive';
import { ITreeNode, ITreeNodeContext, TreeSize } from './tree.types';

/**
 * Hierarchical tree view built on the Angular Aria `ngTree` primitives, which
 * implement the WAI-ARIA APG Tree View pattern: `tree` / `treeitem` / `group`
 * roles, `aria-expanded`, `aria-level`, `aria-setsize`, `aria-posinset`,
 * `aria-selected`, roving `tabindex`, and the keyboard model (Up/Down, Right to
 * expand or enter, Left to collapse or go to the parent, Home/End, Enter/Space
 * to select, `*` to expand siblings, type-ahead).
 *
 * Both the expanded and the selected state are controllable through two-way
 * bindable models keyed by node `id`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 * @see https://angular.dev/guide/aria/tree
 *
 * @example
 * <nui-tree
 *   [nodes]="categories"
 *   ariaLabel="Product categories"
 *   [(expandedIds)]="expanded"
 *   [(selectedIds)]="selected">
 *   <ng-template nuiTreeNodeTrailing let-node>
 *     <span>{{ node.data.count }}</span>
 *   </ng-template>
 * </nui-tree>
 */
@Component({
  selector: 'nui-tree',
  imports: [NgTemplateOutlet, Tree, TreeItem, TreeItemGroup, IconComponent],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent<T = unknown> {
  /** Root nodes; children nest through `ITreeNode.children`. */
  readonly nodes = input.required<ITreeNode<T>[]>();

  /** Ids of the expanded nodes. Two-way bindable (`expandedIdsChange`). */
  readonly expandedIds = model<string[]>([]);

  /** Ids of the selected nodes. Two-way bindable (`selectedIdsChange`). */
  readonly selectedIds = model<string[]>([]);

  /**
   * Allows selecting more than one node.
   * @default false
   */
  readonly multi = input<boolean>(false);

  /**
   * Disables the whole tree.
   * @default false
   */
  readonly disabled = input<boolean>(false);

  /**
   * Row size.
   * @default 'md'
   */
  readonly size = input<TreeSize>('md');

  /** Accessible name of the tree. Provide this or `ariaLabelledby`. */
  readonly ariaLabel = input<string>('');

  /** Id of the element that labels the tree. */
  readonly ariaLabelledby = input<string>('');

  protected readonly trailing = contentChild(TreeNodeTrailingDirective);

  protected readonly treeClasses = computed(() =>
    ['nui-tree', `nui-tree--${this.size()}`, this.disabled() ? 'nui-tree--disabled' : '']
      .filter(Boolean)
      .join(' ')
  );

  private readonly expandedSet = computed(() => new Set(this.expandedIds()));

  protected hasChildren(node: ITreeNode<T>): boolean {
    return !!node.children?.length;
  }

  protected isExpanded(id: string): boolean {
    return this.expandedSet().has(id);
  }

  /** Mirrors an expansion made by the user (click or keyboard) into `expandedIds`. */
  protected onExpandedChange(id: string, expanded: boolean): void {
    if (expanded === this.isExpanded(id)) {
      return;
    }
    this.expandedIds.update((ids) =>
      expanded ? [...ids, id] : ids.filter((existing) => existing !== id)
    );
  }

  protected contextFor(node: ITreeNode<T>, item: TreeItem<string>): ITreeNodeContext<T> {
    return {
      $implicit: node,
      node,
      level: item.level(),
      expanded: this.hasChildren(node) && this.isExpanded(node.id),
      selected: !!item.selected(),
    };
  }
}
