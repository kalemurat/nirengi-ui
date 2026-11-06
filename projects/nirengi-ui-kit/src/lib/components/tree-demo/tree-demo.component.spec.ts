import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TreeDemoComponent } from './tree-demo.component';

describe('TreeDemoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeDemoComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  const create = async () => {
    const fixture = TestBed.createComponent(TreeDemoComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  };

  it('renders the sample tree three levels deep with counts', async () => {
    const fixture = await create();
    const el = fixture.nativeElement as HTMLElement;

    const levels = Array.from(el.querySelectorAll('[role="treeitem"]')).map((node) =>
      Number(node.getAttribute('aria-level'))
    );
    expect(Math.max(...levels)).toBeGreaterThanOrEqual(3);
    expect(el.querySelector('nui-badge')?.textContent?.trim()).toBe('128');
  });

  it('emits nodeAction without selecting the row', async () => {
    const fixture = await create();
    const actions: string[] = [];
    const selections: string[][] = [];
    fixture.componentInstance.nodeAction.subscribe((id) => actions.push(id));
    fixture.componentInstance.selectedIdsChange.subscribe((ids) => selections.push(ids));

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button[aria-label="Actions for Books"]'
    ) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    expect(actions).toEqual(['books']);
    expect(selections).toEqual([]);
  });

  it('forwards expansion changes from the tree', async () => {
    const fixture = await create();
    const changes: string[][] = [];
    fixture.componentInstance.expandedIdsChange.subscribe((ids) => changes.push(ids));

    const electronics = (fixture.nativeElement as HTMLElement).querySelector(
      '[role="treeitem"]'
    ) as HTMLElement;
    electronics.focus();
    electronics.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(changes.at(-1)).toEqual(['computers']);
  });

  it('forwards selection changes from the tree', async () => {
    const fixture = await create();
    const selections: string[][] = [];
    fixture.componentInstance.selectedIdsChange.subscribe((ids) => selections.push(ids));

    const electronics = (fixture.nativeElement as HTMLElement).querySelector(
      '[role="treeitem"]'
    ) as HTMLElement;
    electronics.focus();
    electronics.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(selections.at(-1)).toEqual(['electronics']);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Selected: electronics');
  });
});
