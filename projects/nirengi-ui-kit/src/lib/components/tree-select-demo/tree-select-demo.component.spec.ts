import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TreeSelectDemoComponent } from './tree-select-demo.component';

describe('TreeSelectDemoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeSelectDemoComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  const create = async () => {
    const fixture = TestBed.createComponent(TreeSelectDemoComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  };

  it('starts with a nested category chosen as the parent', async () => {
    const fixture = await create();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('[role="combobox"]')?.textContent?.trim()).toBe('Laptops');
    expect(el.querySelector('.nui-tree-select__label')?.textContent?.trim()).toBe(
      'Parent category'
    );
    expect(el.textContent).toContain('Chosen parent id: laptops');
    fixture.destroy();
  });

  it('emits valueChange when the chosen parent changes', async () => {
    const fixture = await create();
    const changes: (string | null)[] = [];
    fixture.componentInstance.valueChange.subscribe((id) => changes.push(id));

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('.nui-tree-select__clear')
      ?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(changes).toEqual([null]);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Chosen parent id: —');
    fixture.destroy();
  });
});
