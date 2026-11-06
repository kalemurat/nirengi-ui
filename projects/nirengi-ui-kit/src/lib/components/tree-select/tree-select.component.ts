import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { Combobox, ComboboxPopup } from '@angular/aria/combobox';
import { ValueAccessorBase } from '../../common/base/value-accessor.base';
import { Size } from '../../common/enums/size.enum';
import { IconComponent } from '../icon/icon.component';
import { TreeComponent } from '../tree/tree.component';
import { ITreeNode, TreeSize } from '../tree/tree.types';
import { DEFAULT_SELECT_INTL, ISelectIntl, SELECT_INTL } from '../select/select-intl.token';

const TREE_SIZE_MAP: Record<Size, TreeSize> = {
  [Size.XXSmall]: 'sm',
  [Size.XSmall]: 'sm',
  [Size.Small]: 'sm',
  [Size.Medium]: 'md',
  [Size.Large]: 'lg',
  [Size.XLarge]: 'lg',
};

const ICON_SIZE_MAP: Record<Size, number> = {
  [Size.XXSmall]: 14,
  [Size.XSmall]: 14,
  [Size.Small]: 16,
  [Size.Medium]: 18,
  [Size.Large]: 20,
  [Size.XLarge]: 24,
};

/** Nodes from a root down to the node with `id` (inclusive), or `null` when no node has it. */
function findPath<T>(nodes: ITreeNode<T>[], id: string): ITreeNode<T>[] | null {
  for (const node of nodes) {
    if (node.id === id) {
      return [node];
    }
    if (node.children?.length) {
      const path = findPath(node.children, id);
      if (path) {
        return [node, ...path];
      }
    }
  }
  return null;
}

/**
 * Select-style field whose dropdown is a `nui-tree`, for choosing a single node from
 * hierarchical data (for example a parent category). The bound value is the chosen
 * node's `id` (`null` when empty); any node, branch or leaf, can be chosen.
 *
 * Built on the Angular Aria combobox with a `tree` popup (WAI-ARIA APG combobox pattern,
 * select-only variant): DOM focus stays on the field, the arrow keys move through the
 * tree via `aria-activedescendant`, Right/Left expand and collapse, Enter or Space
 * chooses the active node and closes the dropdown, Escape closes it. A mouse click on a
 * row chooses it; a click on the chevron only expands or collapses the branch.
 * On open, the ancestors of the chosen node are expanded so it is visible and active.
 *
 * The clear button's accessible name comes from {@link SELECT_INTL} (`clearSelection`),
 * shared with `nui-select`.
 *
 * @see https://angular.dev/guide/aria/combobox
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 *
 * @example
 * <nui-tree-select
 *   label="Parent category"
 *   placeholder="Select a category"
 *   [nodes]="categories"
 *   [(ngModel)]="parentId"
 * />
 */
@Component({
  selector: 'nui-tree-select',
  imports: [OverlayModule, Combobox, ComboboxPopup, TreeComponent, IconComponent],
  templateUrl: './tree-select.component.html',
  styleUrl: './tree-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true,
    },
  ],
})
export class TreeSelectComponent<T = unknown> extends ValueAccessorBase<string> {
  private readonly idPrefix = `nui-tree-select-${Math.random().toString(36).substring(2, 11)}`;

  /** Id of the visible label, referenced by the field's and the tree's `aria-labelledby`. */
  readonly labelId = `${this.idPrefix}-label`;

  /** Id of the hint / warning / success text, referenced by the field's `aria-describedby`. */
  readonly messageId = `${this.idPrefix}-message`;

  protected readonly intl: ISelectIntl = {
    ...DEFAULT_SELECT_INTL,
    ...inject(SELECT_INTL, { optional: true }),
  };

  /** Root nodes of the tree shown in the dropdown. */
  readonly nodes = input.required<ITreeNode<T>[]>();

  readonly label = input<string>();

  /** Shown while nothing is chosen; also the field's accessible name when there is no `label`. */
  readonly placeholder = input<string>('Select...');

  readonly hint = input<string>();

  /** Displayed below the field in a success state (green border). */
  readonly success = input<string>();

  /**
   * Displayed below the field in a warning state (yellow border). A non-empty value also
   * sets `aria-invalid="true"` on the field (WCAG technique ARIA21).
   */
  readonly warning = input<string>();

  /** @default Size.Medium */
  readonly size = input<Size>(Size.Medium);

  /** Shows a button that clears the chosen node. @default true */
  readonly clearable = input<boolean>(true);

  /** Kept in sync with the form control's disabled state via `setDisabledState`. */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- same public API as nui-select
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

  /** Whether the dropdown is open. */
  readonly isOpen = signal<boolean>(false);

  /** Expanded branches of the dropdown tree; kept between openings. */
  readonly expandedIds = signal<string[]>([]);

  /** Width of the field, applied to the dropdown so it lines up with the field. */
  protected readonly triggerWidth = signal<number | null>(null);

  private readonly triggerElement = viewChild.required<ElementRef<HTMLElement>>('triggerElement');

  private readonly dropdownElement = viewChild<ElementRef<HTMLElement>>('dropdown');

  /** Path from a root to the chosen node; empty when nothing (or an unknown id) is chosen. */
  private readonly selectedPath = computed(() => {
    const id = this.value();
    return id === null ? [] : (findPath(this.nodes(), id) ?? []);
  });

  /** The chosen node, or `null`. */
  readonly selectedNode = computed(() => this.selectedPath().at(-1) ?? null);

  protected readonly selectedIds = computed(() => {
    const node = this.selectedNode();
    return node ? [node.id] : [];
  });

  protected readonly treeSize = computed(() => TREE_SIZE_MAP[this.size()] ?? 'md');

  protected readonly iconSize = computed(() => ICON_SIZE_MAP[this.size()] ?? 18);

  protected readonly containerClasses = computed(() =>
    ['nui-tree-select', `nui-tree-select--${this.size()}`].join(' ')
  );

  protected readonly triggerClasses = computed(() =>
    [
      'nui-tree-select__trigger',
      `nui-tree-select__trigger--${this.size()}`,
      this.isOpen() ? 'nui-tree-select__trigger--open' : '',
      this.isDisabled() ? 'nui-tree-select__trigger--disabled' : '',
      this.success() ? 'nui-tree-select__trigger--success' : '',
      !this.success() && this.warning() ? 'nui-tree-select__trigger--warning' : '',
      this.showClear() ? 'nui-tree-select__trigger--clearable' : '',
    ]
      .filter(Boolean)
      .join(' ')
  );

  protected readonly showClear = computed(
    () => this.clearable() && !this.isDisabled() && this.selectedNode() !== null
  );

  /** Id of the rendered hint / warning / success text, or `null` when none is shown. */
  protected readonly describedBy = computed(() =>
    this.success() || this.warning() || this.hint() ? this.messageId : null
  );

  /** `true` only while a warning (the validation message) is shown and no success overrides it. */
  protected readonly ariaInvalid = computed(() =>
    !this.success() && this.warning() ? true : null
  );

  constructor() {
    super();

    effect(() => {
      this.setDisabledState(this.disabledInput());
    });

    effect(() => {
      if (this.isDisabled()) {
        this.isOpen.set(false);
      }
    });

    // Angular templates cannot bind capture-phase listeners, so they are added by hand.
    effect((onCleanup) => {
      const dropdown = this.dropdownElement()?.nativeElement;
      if (!dropdown) {
        return;
      }
      const listener = (event: Event) => this.onDropdownEvent(event);
      dropdown.addEventListener('click', listener, true);
      dropdown.addEventListener('keydown', listener, true);
      onCleanup(() => {
        dropdown.removeEventListener('click', listener, true);
        dropdown.removeEventListener('keydown', listener, true);
      });
    });
  }

  /** Mirrors the combobox's open state (click, keys, focus leaving) into `isOpen`. */
  protected onOpenChange(open: boolean): void {
    if (open === this.isOpen()) {
      return;
    }
    if (open) {
      this.triggerWidth.set(this.triggerElement().nativeElement.getBoundingClientRect().width);
      this.revealSelected();
    } else {
      this.markAsTouched();
    }
    this.isOpen.set(open);
  }

  /** Selection made inside the tree. Single selection, so only the first id counts. */
  protected onTreeSelection(ids: string[]): void {
    const id = ids[0];
    if (id !== undefined && id !== this.value()) {
      this.updateValue(id);
    }
  }

  /**
   * Commit (close) on a row click or on Enter / Space, as in the documented Angular Aria select
   * pattern. Listened in the capture phase because the tree stops the propagation of the events
   * it handles; the tree still selects the node in the same dispatch. Chevron clicks only toggle
   * a branch, and a disabled row keeps the dropdown open.
   */
  private onDropdownEvent(event: Event): void {
    let row: Element | null | undefined;
    if (event instanceof KeyboardEvent) {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      // Keys arrive on the tree (relayed by the combobox); the row is its active descendant.
      const activeId = (event.target as HTMLElement).getAttribute('aria-activedescendant');
      row = activeId ? document.getElementById(activeId) : null;
    } else {
      const target = event.target as HTMLElement;
      if (target.closest('.nui-tree__toggle')) {
        return;
      }
      row = target.closest('[role="treeitem"]');
    }
    if (row && row.getAttribute('aria-disabled') !== 'true') {
      this.close();
    }
  }

  clearValue(): void {
    if (this.isDisabled()) {
      return;
    }
    this.updateValue(null);
    this.triggerElement().nativeElement.focus();
  }

  /** Closes the dropdown; DOM focus is already on the field. */
  close(): void {
    this.onOpenChange(false);
  }

  /** Expands the chosen node's ancestors so the tree opens with it visible and active. */
  private revealSelected(): void {
    const ancestors = this.selectedPath()
      .slice(0, -1)
      .map((node) => node.id);
    if (!ancestors.length) {
      return;
    }
    this.expandedIds.update((ids) => [...new Set([...ids, ...ancestors])]);
  }
}
