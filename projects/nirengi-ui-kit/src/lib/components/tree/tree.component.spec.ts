import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TreeComponent } from './tree.component';
import { TreeNodeTrailingDirective } from './tree-node-trailing.directive';
import { ITreeNode, TreeSize } from './tree.types';

const NODES: ITreeNode<{ count: number }>[] = [
  {
    id: 'a',
    label: 'Alpha',
    data: { count: 3 },
    children: [
      {
        id: 'a1',
        label: 'Alpha one',
        data: { count: 2 },
        children: [{ id: 'a1x', label: 'Alpha one x', data: { count: 1 } }],
      },
      { id: 'a2', label: 'Alpha two', disabled: true },
    ],
  },
  { id: 'b', label: 'Bravo', data: { count: 5 } },
  { id: 'c', label: 'Charlie' },
];

@Component({
  imports: [TreeComponent, TreeNodeTrailingDirective],
  template: `
    <nui-tree
      [nodes]="nodes"
      ariaLabel="Sample tree"
      [size]="size()"
      [multi]="multi()"
      [disabled]="disabled()"
      [(expandedIds)]="expanded"
      [(selectedIds)]="selected"
      (expandedIdsChange)="expandedChanges.push($event)"
      (selectedIdsChange)="selectedChanges.push($event)"
    >
      @if (withTrailing()) {
        <ng-template
          nuiTreeNodeTrailing
          let-node
          let-level="level"
          let-expanded="expanded"
          let-selected="selected"
        >
          <span class="trailing" [attr.data-id]="node.id">
            {{ level }}|{{ expanded }}|{{ selected }}
          </span>
        </ng-template>
      }
    </nui-tree>
  `,
})
class HostComponent {
  readonly nodes = NODES;
  readonly size = signal<TreeSize>('md');
  readonly multi = signal(false);
  readonly disabled = signal(false);
  readonly withTrailing = signal(true);
  readonly expanded = signal<string[]>([]);
  readonly selected = signal<string[]>([]);
  readonly expandedChanges: string[][] = [];
  readonly selectedChanges: string[][] = [];
}

describe('TreeComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  const tree = () => el.querySelector('[role="tree"]') as HTMLElement;
  const item = (label: string) =>
    Array.from(el.querySelectorAll<HTMLElement>('[role="treeitem"]')).find(
      (node) => node.querySelector('.nui-tree__label')?.textContent?.trim() === label
    ) as HTMLElement;
  const key = (target: HTMLElement, keyName: string) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key: keyName, bubbles: true }));
  };
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    await settle();
  });

  it('renders a labelled tree with root treeitems and APG states', () => {
    expect(tree().getAttribute('aria-label')).toBe('Sample tree');
    expect(tree().classList).toContain('nui-tree--md');

    const alpha = item('Alpha');
    expect(alpha.getAttribute('aria-level')).toBe('1');
    expect(alpha.getAttribute('aria-setsize')).toBe('3');
    expect(alpha.getAttribute('aria-posinset')).toBe('1');
    expect(alpha.getAttribute('aria-expanded')).toBe('false');
    expect(item('Charlie').getAttribute('aria-posinset')).toBe('3');
    // Leaves are not expandable, so they carry no aria-expanded.
    expect(item('Bravo').hasAttribute('aria-expanded')).toBe(false);
  });

  it('uses a roving tabindex with exactly one tabbable item', () => {
    const tabbable = el.querySelectorAll('[role="treeitem"][tabindex="0"]');
    expect(tabbable.length).toBe(1);
  });

  it('renders the child group of an item expanded through expandedIds', async () => {
    host.expanded.set(['a', 'a1']);
    await settle();

    expect(item('Alpha').getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('[role="group"]')).not.toBeNull();
    expect(item('Alpha one').getAttribute('aria-level')).toBe('2');
    expect(item('Alpha one x').getAttribute('aria-level')).toBe('3');
    expect(item('Alpha two').getAttribute('aria-disabled')).toBe('true');
  });

  it('collapses an item when its id leaves expandedIds', async () => {
    host.expanded.set(['a']);
    await settle();
    host.expanded.set([]);
    await settle();

    expect(item('Alpha').getAttribute('aria-expanded')).toBe('false');
  });

  it('expands with ArrowRight and collapses with ArrowLeft, emitting expandedIdsChange', async () => {
    const alpha = item('Alpha');
    alpha.focus();
    key(alpha, 'ArrowRight');
    await settle();

    expect(host.expanded()).toEqual(['a']);
    expect(host.expandedChanges.at(-1)).toEqual(['a']);
    expect(alpha.getAttribute('aria-expanded')).toBe('true');

    key(alpha, 'ArrowLeft');
    await settle();

    expect(host.expanded()).toEqual([]);
    expect(alpha.getAttribute('aria-expanded')).toBe('false');
  });

  it('moves focus with ArrowDown and End', async () => {
    const alpha = item('Alpha');
    alpha.focus();
    key(alpha, 'ArrowDown');
    await settle();
    expect(item('Bravo').getAttribute('tabindex')).toBe('0');

    key(item('Bravo'), 'End');
    await settle();
    expect(item('Charlie').getAttribute('tabindex')).toBe('0');
    expect(document.activeElement).toBe(item('Charlie'));
  });

  it('selects the focused item with Enter and emits selectedIdsChange', async () => {
    const alpha = item('Alpha');
    alpha.focus();
    key(alpha, 'ArrowDown');
    await settle();
    const bravo = item('Bravo');
    key(bravo, 'Enter');
    await settle();

    expect(host.selected()).toEqual(['b']);
    expect(host.selectedChanges.at(-1)).toEqual(['b']);
    expect(bravo.getAttribute('aria-selected')).toBe('true');
  });

  it('reflects selectedIds set by the consumer', async () => {
    host.selected.set(['c']);
    await settle();

    expect(item('Charlie').getAttribute('aria-selected')).toBe('true');
    expect(item('Bravo').getAttribute('aria-selected')).toBe('false');
  });

  it('projects the trailing template with the node context', async () => {
    host.expanded.set(['a']);
    host.selected.set(['b']);
    await settle();

    const text = (id: string) =>
      el.querySelector(`.trailing[data-id="${id}"]`)?.textContent?.replace(/\s/g, '');
    expect(text('a')).toBe('1|true|false');
    expect(text('a1')).toBe('2|false|false');
    expect(text('b')).toBe('1|false|true');
  });

  it('renders no trailing slot without a template', async () => {
    host.withTrailing.set(false);
    await settle();

    expect(el.querySelector('.nui-tree__trailing')).toBeNull();
  });

  it('applies size, multi and disabled to the tree', async () => {
    host.size.set('lg');
    host.multi.set(true);
    host.disabled.set(true);
    await settle();

    expect(tree().classList).toContain('nui-tree--lg');
    expect(tree().classList).toContain('nui-tree--disabled');
    expect(tree().getAttribute('aria-multiselectable')).toBe('true');
    expect(tree().getAttribute('aria-disabled')).toBe('true');
  });

  it('keeps the chevron click selecting and expanding the row outside a combobox', async () => {
    (item('Alpha').querySelector('.nui-tree__toggle') as HTMLElement).click();
    await settle();

    expect(host.selected()).toEqual(['a']);
    expect(host.expanded()).toEqual(['a']);
    expect(tree().classList).not.toContain('nui-tree--combobox');
    expect(tree().hasAttribute('aria-activedescendant')).toBe(false);
  });

  it('ignores a chevron click on a disabled tree inside a combobox popup', async () => {
    const component = fixture.debugElement.children[0].componentInstance as unknown as {
      inComboboxPopup: boolean;
      onToggleClick(event: MouseEvent, node: ITreeNode): void;
    };
    host.disabled.set(true);
    await settle();
    // Simulates the combobox mode for this call only (re-rendering would need a real popup);
    // the mode is covered end-to-end by TreeSelectComponent.
    component.inComboboxPopup = true;

    const event = new MouseEvent('click');
    const stop = vi.spyOn(event, 'stopPropagation');
    component.onToggleClick(event, NODES[0]);
    component.onToggleClick(event, NODES[1]);

    component.inComboboxPopup = false;

    expect(stop).toHaveBeenCalledTimes(1);
    expect(host.expanded()).toEqual([]);
  });
});

describe('TreeComponent (unit)', () => {
  it('ignores an expansion change that matches the current state', async () => {
    await TestBed.configureTestingModule({
      imports: [TreeComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    const fixture = TestBed.createComponent(TreeComponent);
    fixture.componentRef.setInput('nodes', NODES);
    fixture.componentRef.setInput('ariaLabelledby', 'external-label');
    fixture.componentRef.setInput('expandedIds', ['a']);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance as unknown as {
      onExpandedChange(id: string, expanded: boolean): void;
      expandedIds(): string[];
    };
    component.onExpandedChange('a', true);
    component.onExpandedChange('b', false);
    expect(component.expandedIds()).toEqual(['a']);

    const treeEl = (fixture.nativeElement as HTMLElement).querySelector('[role="tree"]');
    expect(treeEl?.getAttribute('aria-labelledby')).toBe('external-label');
    expect(treeEl?.hasAttribute('aria-label')).toBe(false);
  });
});
