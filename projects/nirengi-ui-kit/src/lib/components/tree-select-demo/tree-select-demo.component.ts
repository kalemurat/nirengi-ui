import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TreeSelectComponent } from '../tree-select/tree-select.component';
import { ITreeNode } from '../tree/tree.types';
import { HeadingComponent, HeadingLevel, HeadingWeight } from '../heading/heading.component';
import { ParagraphComponent } from '../paragraph/paragraph.component';
import { Size } from '../../common/enums/size.enum';

/** Category hierarchy the showcase picks a parent category from. */
const CATEGORIES: ITreeNode[] = [
  {
    id: 'electronics',
    label: 'Electronics',
    children: [
      {
        id: 'computers',
        label: 'Computers',
        children: [
          {
            id: 'laptops',
            label: 'Laptops',
            children: [
              { id: 'gaming-laptops', label: 'Gaming laptops' },
              { id: 'ultrabooks', label: 'Ultrabooks' },
            ],
          },
          { id: 'desktops', label: 'Desktops' },
        ],
      },
      {
        id: 'phones',
        label: 'Phones',
        children: [
          { id: 'smartphones', label: 'Smartphones' },
          { id: 'feature-phones', label: 'Feature phones', disabled: true },
        ],
      },
      { id: 'audio', label: 'Audio' },
    ],
  },
  {
    id: 'home',
    label: 'Home & Garden',
    children: [
      { id: 'furniture', label: 'Furniture' },
      { id: 'kitchen', label: 'Kitchen' },
    ],
  },
  { id: 'books', label: 'Books' },
];

/**
 * Showcase wrapper for `nui-tree-select`: picking the parent of a new category from a
 * category hierarchy, bound with `ngModel`.
 */
@Component({
  selector: 'nui-tree-select-demo',
  imports: [FormsModule, TreeSelectComponent, HeadingComponent, ParagraphComponent],
  template: `
    <section class="flex max-w-md flex-col gap-4">
      <nui-heading [level]="HeadingLevel.H3" [weight]="HeadingWeight.Bold" text="New category" />

      <nui-tree-select
        [nodes]="categories"
        [label]="label()"
        [placeholder]="placeholder()"
        [hint]="hint()"
        [size]="size()"
        [clearable]="clearable()"
        [disabled]="disabled()"
        [(ngModel)]="parentId"
        (ngModelChange)="valueChange.emit($event)"
      />

      <nui-paragraph [size]="Size.Small">Chosen parent id: {{ parentId() ?? '—' }}</nui-paragraph>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeSelectDemoComponent {
  readonly label = input<string>('Parent category');

  readonly placeholder = input<string>('Select a category');

  readonly hint = input<string>('Any category can be a parent, including a leaf.');

  readonly size = input<Size>(Size.Medium);

  readonly clearable = input<boolean>(true);

  readonly disabled = input<boolean>(false);

  /** Emits the chosen node id, or `null` after clearing. */
  readonly valueChange = output<string | null>();

  protected readonly categories = CATEGORIES;

  protected readonly parentId = signal<string | null>('laptops');

  protected readonly HeadingLevel = HeadingLevel;
  protected readonly HeadingWeight = HeadingWeight;
  protected readonly Size = Size;
}
