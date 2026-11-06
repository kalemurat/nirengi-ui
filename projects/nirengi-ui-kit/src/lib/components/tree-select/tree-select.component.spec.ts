import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TreeSelectComponent } from './tree-select.component';
import { ITreeNode } from '../tree/tree.types';
import { Size } from '../../common/enums/size.enum';
import { SELECT_INTL } from '../select/select-intl.token';

const NODES: ITreeNode[] = [
  {
    id: 'a',
    label: 'Alpha',
    children: [
      {
        id: 'a1',
        label: 'Alpha one',
        children: [{ id: 'a1x', label: 'Alpha one x' }],
      },
      { id: 'a2', label: 'Alpha two', disabled: true },
    ],
  },
  { id: 'b', label: 'Bravo' },
];

@Component({
  imports: [TreeSelectComponent, ReactiveFormsModule],
  template: `
    <nui-tree-select
      [nodes]="nodes"
      [formControl]="control"
      [label]="label()"
      [hint]="hint()"
      [warning]="warning()"
      [success]="success()"
      [size]="size()"
      [clearable]="clearable()"
    />
  `,
})
class HostComponent {
  readonly nodes = NODES;
  readonly control = new FormControl<string | null>(null);
  readonly label = signal<string | undefined>('Parent');
  readonly hint = signal<string | undefined>(undefined);
  readonly warning = signal<string | undefined>(undefined);
  readonly success = signal<string | undefined>(undefined);
  readonly size = signal<Size>(Size.Medium);
  readonly clearable = signal(true);
}

describe('TreeSelectComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const combobox = () => el.querySelector('[role="combobox"]') as HTMLElement;
  const tree = () => document.querySelector('[role="tree"]') as HTMLElement | null;
  const item = (label: string) =>
    Array.from(document.querySelectorAll<HTMLElement>('[role="treeitem"]')).find(
      (node) => node.querySelector('.nui-tree__label')?.textContent?.trim() === label
    ) as HTMLElement;
  /** One key per settle: the combobox relays keys to the tree through an effect. */
  const press = async (keyName: string) => {
    combobox().dispatchEvent(new KeyboardEvent('keydown', { key: keyName, bubbles: true }));
    await settle();
  };
  const open = async () => {
    combobox().click();
    await settle();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    document.body.appendChild(el);
    await settle();
  });

  afterEach(() => {
    fixture.destroy();
    el.remove();
  });

  it('renders a labelled select-only combobox with a tree popup and the placeholder', () => {
    const field = combobox();
    const label = el.querySelector('.nui-tree-select__label') as HTMLElement;

    expect(field.getAttribute('aria-haspopup')).toBe('tree');
    expect(field.getAttribute('aria-expanded')).toBe('false');
    expect(field.getAttribute('aria-labelledby')).toBe(label.id);
    expect(field.hasAttribute('aria-label')).toBe(false);
    expect(field.textContent?.trim()).toBe('Select...');
    expect(el.querySelector('.nui-tree-select__value--placeholder')).not.toBeNull();
    expect(tree()).toBeNull();
  });

  it('uses the placeholder as the accessible name when there is no label', async () => {
    host.label.set(undefined);
    await settle();

    expect(combobox().getAttribute('aria-label')).toBe('Select...');
    expect(combobox().hasAttribute('aria-labelledby')).toBe(false);

    await open();
    expect(tree()?.getAttribute('aria-label')).toBe('Select...');
  });

  it('shows the label of a nested node written by the form', async () => {
    host.control.setValue('a1x');
    await settle();

    expect(combobox().textContent?.trim()).toBe('Alpha one x');
    expect(el.querySelector('.nui-tree-select__value--placeholder')).toBeNull();
  });

  it('shows the placeholder for an id that is not in the tree', async () => {
    host.control.setValue('missing');
    await settle();

    expect(combobox().textContent?.trim()).toBe('Select...');
    expect(el.querySelector('.nui-tree-select__clear')).toBeNull();
  });

  it('opens the tree with the chosen node revealed and active', async () => {
    host.control.setValue('a1x');
    await settle();
    await open();

    const field = combobox();
    expect(field.getAttribute('aria-expanded')).toBe('true');
    expect(field.getAttribute('aria-controls')).toBe(tree()?.id);
    expect(tree()?.getAttribute('aria-labelledby')).toBe(
      (el.querySelector('.nui-tree-select__label') as HTMLElement).id
    );
    expect(tree()?.classList).toContain('nui-tree--combobox');
    expect(item('Alpha').getAttribute('aria-expanded')).toBe('true');
    expect(item('Alpha one').getAttribute('aria-expanded')).toBe('true');
    expect(item('Alpha one x').getAttribute('aria-selected')).toBe('true');
    expect(field.getAttribute('aria-activedescendant')).toBe(item('Alpha one x').id);
  });

  it('chooses a node on row click, closes and marks the control touched', async () => {
    await open();
    item('Bravo').click();
    await settle();

    expect(host.control.value).toBe('b');
    expect(host.control.touched).toBe(true);
    expect(combobox().getAttribute('aria-expanded')).toBe('false');
    expect(combobox().textContent?.trim()).toBe('Bravo');
  });

  it('expands a branch from its chevron without choosing it or closing', async () => {
    await open();
    (item('Alpha').querySelector('.nui-tree__toggle') as HTMLElement).click();
    await settle();

    expect(item('Alpha').getAttribute('aria-expanded')).toBe('true');
    expect(host.control.value).toBeNull();
    expect(combobox().getAttribute('aria-expanded')).toBe('true');

    (item('Alpha').querySelector('.nui-tree__toggle') as HTMLElement).click();
    await settle();
    expect(item('Alpha').getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps the dropdown open when a disabled row is clicked', async () => {
    await open();
    (item('Alpha').querySelector('.nui-tree__toggle') as HTMLElement).click();
    await settle();
    item('Alpha two').click();
    await settle();

    expect(host.control.value).toBeNull();
    expect(combobox().getAttribute('aria-expanded')).toBe('true');
  });

  it('opens, navigates and chooses with the keyboard', async () => {
    await press('ArrowDown');
    expect(combobox().getAttribute('aria-expanded')).toBe('true');
    expect(combobox().getAttribute('aria-activedescendant')).toBe(item('Alpha').id);

    await press('ArrowDown');
    expect(combobox().getAttribute('aria-activedescendant')).toBe(item('Bravo').id);

    await press('Enter');
    expect(host.control.value).toBe('b');
    expect(combobox().getAttribute('aria-expanded')).toBe('false');
  });

  it('closes with Escape without changing the value', async () => {
    await open();
    await press('Escape');

    expect(combobox().getAttribute('aria-expanded')).toBe('false');
    expect(host.control.value).toBeNull();
  });

  it('ignores other keys inside the dropdown', async () => {
    await open();
    await press('ArrowRight');

    expect(combobox().getAttribute('aria-expanded')).toBe('true');
    expect(item('Alpha').getAttribute('aria-expanded')).toBe('true');
  });

  it('clears the value from the clear button and returns focus to the field', async () => {
    host.control.setValue('b');
    await settle();

    const clear = el.querySelector('.nui-tree-select__clear') as HTMLButtonElement;
    expect(clear.getAttribute('aria-label')).toBe('Clear selection');
    expect(combobox().classList).toContain('nui-tree-select__trigger--clearable');
    clear.click();
    await settle();

    expect(host.control.value).toBeNull();
    expect(document.activeElement).toBe(combobox());
    expect(el.querySelector('.nui-tree-select__clear')).toBeNull();
  });

  it('hides the clear button when clearable is off', async () => {
    host.control.setValue('b');
    host.clearable.set(false);
    await settle();

    expect(el.querySelector('.nui-tree-select__clear')).toBeNull();
  });

  it('cannot open or clear while the form control is disabled', async () => {
    host.control.setValue('b');
    host.control.disable();
    await settle();

    expect(combobox().getAttribute('aria-disabled')).toBe('true');
    expect(combobox().classList).toContain('nui-tree-select__trigger--disabled');
    expect(el.querySelector('.nui-tree-select__clear')).toBeNull();

    await open();
    expect(tree()).toBeNull();
  });

  it('closes when it becomes disabled while open', async () => {
    await open();
    host.control.disable();
    await settle();

    expect(combobox().getAttribute('aria-expanded')).toBe('false');
  });

  it('wires hint, warning and success texts to aria-describedby and aria-invalid', async () => {
    host.hint.set('Pick one');
    await settle();
    const describedBy = combobox().getAttribute('aria-describedby');
    expect(el.querySelector(`#${describedBy}`)?.textContent?.trim()).toBe('Pick one');
    expect(combobox().hasAttribute('aria-invalid')).toBe(false);

    host.warning.set('Required');
    await settle();
    expect(el.querySelector('.nui-tree-select__warning')?.textContent?.trim()).toBe('Required');
    expect(combobox().getAttribute('aria-invalid')).toBe('true');
    expect(combobox().classList).toContain('nui-tree-select__trigger--warning');

    host.success.set('Looks good');
    await settle();
    expect(el.querySelector('.nui-tree-select__success')?.textContent?.trim()).toBe('Looks good');
    expect(combobox().hasAttribute('aria-invalid')).toBe(false);
    expect(combobox().classList).toContain('nui-tree-select__trigger--success');
  });

  it('maps the field size onto the tree rows', async () => {
    host.size.set(Size.XLarge);
    await settle();
    expect(combobox().classList).toContain('nui-tree-select__trigger--xl');

    await open();
    expect(tree()?.classList).toContain('nui-tree--lg');
  });

  it('closes from the public close() method', async () => {
    await open();
    const instance = fixture.debugElement.children[0].componentInstance as TreeSelectComponent;
    instance.close();
    await settle();

    expect(combobox().getAttribute('aria-expanded')).toBe('false');
  });
});

describe('TreeSelectComponent with SELECT_INTL', () => {
  it('names the clear button from the shared select texts', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: SELECT_INTL, useValue: { clearSelection: 'Seçimi temizle' } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.setValue('b');
    fixture.detectChanges();
    await fixture.whenStable();

    const clear = (fixture.nativeElement as HTMLElement).querySelector(
      '.nui-tree-select__clear'
    ) as HTMLButtonElement;
    expect(clear.getAttribute('aria-label')).toBe('Seçimi temizle');
  });
});
