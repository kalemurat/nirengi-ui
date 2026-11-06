import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { TreeComponent } from '../tree/tree.component';
import { TreeNodeTrailingDirective } from '../tree/tree-node-trailing.directive';
import { ITreeNode, TreeSize } from '../tree/tree.types';
import { BadgeComponent, BadgeType } from '../badge/badge.component';
import { IconComponent } from '../icon/icon.component';
import { HeadingComponent, HeadingLevel, HeadingWeight } from '../heading/heading.component';
import { ParagraphComponent } from '../paragraph/paragraph.component';
import { ColorVariant } from '../../common/enums/color-variant.enum';
import { Size } from '../../common/enums/size.enum';

interface ICategoryData {
  count: number;
}

/** Five-level product category sample used by the showcase. */
const CATEGORIES: ITreeNode<ICategoryData>[] = [
  {
    id: 'electronics',
    label: 'Electronics',
    data: { count: 128 },
    children: [
      {
        id: 'computers',
        label: 'Computers',
        data: { count: 64 },
        children: [
          {
            id: 'laptops',
            label: 'Laptops',
            data: { count: 40 },
            children: [
              {
                id: 'gaming-laptops',
                label: 'Gaming laptops',
                data: { count: 12 },
                children: [
                  { id: 'gaming-laptops-15', label: '15-inch', data: { count: 7 } },
                  { id: 'gaming-laptops-17', label: '17-inch', data: { count: 5 } },
                ],
              },
              { id: 'ultrabooks', label: 'Ultrabooks', data: { count: 28 } },
            ],
          },
          { id: 'desktops', label: 'Desktops', data: { count: 24 } },
        ],
      },
      {
        id: 'phones',
        label: 'Phones',
        data: { count: 52 },
        children: [
          { id: 'smartphones', label: 'Smartphones', data: { count: 45 } },
          { id: 'feature-phones', label: 'Feature phones', data: { count: 7 }, disabled: true },
        ],
      },
      { id: 'audio', label: 'Audio', data: { count: 12 } },
    ],
  },
  {
    id: 'home',
    label: 'Home & Garden',
    data: { count: 73 },
    children: [
      { id: 'furniture', label: 'Furniture', data: { count: 41 } },
      { id: 'kitchen', label: 'Kitchen', data: { count: 32 } },
    ],
  },
  { id: 'books', label: 'Books', data: { count: 210 } },
];

/**
 * Showcase wrapper for `nui-tree`: a five-level category tree with a count badge
 * and a row action projected through `nuiTreeNodeTrailing`.
 */
@Component({
  selector: 'nui-tree-demo',
  imports: [
    TreeComponent,
    TreeNodeTrailingDirective,
    BadgeComponent,
    IconComponent,
    HeadingComponent,
    ParagraphComponent,
  ],
  template: `
    <div class="flex flex-col gap-8">
      <section>
        <nui-heading
          [level]="HeadingLevel.H3"
          [weight]="HeadingWeight.Bold"
          [marginBottom]="true"
          text="Product categories"
        />
        <nui-paragraph [size]="Size.Small" [marginBottom]="true">
          Use the arrow keys to move, Right/Left to expand or collapse, Enter or Space to select,
          and type a letter to jump to a matching category.
        </nui-paragraph>

        <div class="max-w-md rounded-lg border border-default bg-primary p-2">
          <nui-tree
            [nodes]="categories"
            ariaLabel="Product categories"
            [size]="size()"
            [multi]="multi()"
            [disabled]="disabled()"
            [(expandedIds)]="expandedIds"
            [(selectedIds)]="selectedIds"
            (expandedIdsChange)="expandedIdsChange.emit($event)"
            (selectedIdsChange)="selectedIdsChange.emit($event)"
          >
            <ng-template nuiTreeNodeTrailing let-node>
              <nui-badge
                [type]="BadgeType.Soft"
                [variant]="ColorVariant.Secondary"
                [size]="Size.Small"
              >
                {{ countOf(node) }}
              </nui-badge>
              <button
                type="button"
                class="inline-flex h-6 w-6 items-center justify-center rounded text-secondary hover:bg-tertiary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                [attr.aria-label]="'Actions for ' + node.label"
                (click)="$event.stopPropagation(); nodeAction.emit(node.id)"
              >
                <nui-icon name="more-2-fill" size="xs" />
              </button>
            </ng-template>
          </nui-tree>
        </div>

        <nui-paragraph [size]="Size.Small">
          Expanded: {{ expandedIds().join(', ') || '—' }}<br />
          Selected: {{ selectedIds().join(', ') || '—' }}
        </nui-paragraph>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeDemoComponent {
  readonly size = input<TreeSize>('md');

  readonly multi = input<boolean>(false);

  readonly disabled = input<boolean>(false);

  readonly expandedIdsChange = output<string[]>();

  readonly selectedIdsChange = output<string[]>();

  /** Emits the id of the row whose action button was pressed. */
  readonly nodeAction = output<string>();

  protected readonly categories = CATEGORIES;

  protected readonly expandedIds = signal<string[]>(['electronics', 'computers']);

  protected readonly selectedIds = signal<string[]>([]);

  protected readonly HeadingLevel = HeadingLevel;
  protected readonly HeadingWeight = HeadingWeight;
  protected readonly Size = Size;
  protected readonly BadgeType = BadgeType;
  protected readonly ColorVariant = ColorVariant;

  protected countOf(node: ITreeNode): number | undefined {
    return (node.data as ICategoryData | undefined)?.count;
  }
}
