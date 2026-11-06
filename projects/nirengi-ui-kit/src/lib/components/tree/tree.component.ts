import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
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
 * Rendered inside an Angular Aria `ngComboboxPopup` (as `nui-tree-select` does), the
 * tree registers itself as the popup's `ngComboboxWidget`: DOM focus stays on the
 * combobox, which relays the navigation keys to the tree, and the active node is
 * conveyed through `aria-activedescendant` (WAI-ARIA APG combobox pattern with a
 * `tree` popup). In that mode the chevron only expands or collapses its node, so a
 * mouse user can browse into a branch without choosing it.
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
  imports: [NgTemplateOutlet, Tree, TreeItem, TreeItemGroup, ComboboxWidget, IconComponent],
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

  /**
   * Whether the tree is the widget of an Angular Aria combobox popup. Resolved once from the
   * injector: `ngComboboxWidget` requires an enclosing `ngComboboxPopup`, so the template only
   * applies it (with `focusMode="activedescendant"`) when one is present.
   */
  protected readonly inComboboxPopup = inject(ComboboxPopup, { optional: true }) !== null;

  private readonly ariaTree = viewChild(Tree);

  protected readonly treeClasses = computed(() =>
    [
      'nui-tree',
      `nui-tree--${this.size()}`,
      this.disabled() ? 'nui-tree--disabled' : '',
      this.inComboboxPopup ? 'nui-tree--combobox' : '',
    ]
      .filter(Boolean)
      .join(' ')
  );

  private readonly expandedSet = computed(() => new Set(this.expandedIds()));

  constructor() {
    if (this.inComboboxPopup) {
      // Inside a combobox the active node never receives DOM focus (it stays on the combobox),
      // so the browser does not scroll it into view on its own.
      afterRenderEffect(() => {
        this.ariaTree()?.scrollActiveItemIntoView();
      });
    }
  }

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

  /**
   * Chevron click inside a combobox popup: toggles the node only. The click is kept from
   * reaching the tree, which would otherwise also select the node and commit the field.
   */
  protected onToggleClick(event: MouseEvent, node: ITreeNode<T>): void {
    if (!this.inComboboxPopup || !this.hasChildren(node)) {
      return;
    }
    event.stopPropagation();
    if (this.disabled() || node.disabled) {
      return;
    }
    this.onExpandedChange(node.id, !this.isExpanded(node.id));
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
