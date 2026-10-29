import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TabsComponent } from './tabs.component';
import { TabComponent } from './tab.component';
import { TabLabelDirective } from './tab-label.directive';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

@Component({
  imports: [TabsComponent, TabComponent],
  template: `
    <nui-tabs [(activeIndex)]="index" (activeIndexChange)="changes.push($event)">
      <nui-tab label="General">General content</nui-tab>
      <nui-tab label="Advanced" [disabled]="advancedDisabled()">Advanced content</nui-tab>
      <nui-tab label="Billing">Billing content</nui-tab>
    </nui-tabs>
  `,
})
class BoundHostComponent {
  readonly index = signal(0);
  readonly advancedDisabled = signal(false);
  readonly changes: number[] = [];
}

@Component({
  imports: [TabsComponent, TabComponent],
  template: `
    <nui-tabs>
      <nui-tab label="First" [disabled]="true">First content</nui-tab>
      <nui-tab label="Second">Second content</nui-tab>
    </nui-tabs>
  `,
})
class UnboundHostComponent {}

@Component({
  imports: [TabsComponent, TabComponent],
  template: `
    <nui-tabs [activeIndex]="2">
      <nui-tab label="A">A content</nui-tab>
      <nui-tab label="B">B content</nui-tab>
      <nui-tab label="C">C content</nui-tab>
    </nui-tabs>
  `,
})
class InitialIndexHostComponent {}

@Component({
  imports: [TabsComponent, TabComponent],
  template: `
    <nui-tabs>
      <nui-tab label="A" [disabled]="true">A content</nui-tab>
      <nui-tab label="B" [disabled]="true">B content</nui-tab>
    </nui-tabs>
  `,
})
class AllDisabledHostComponent {}

@Component({
  imports: [TabsComponent, TabComponent, TabLabelDirective],
  template: `
    <nui-tabs [fullWidth]="true" [variant]="ColorVariant.Success" [size]="Size.Large">
      <nui-tab>
        <ng-template nuiTabLabel><span class="custom-label">Profile</span></ng-template>
        Profile content
      </nui-tab>
      <nui-tab label="Plain">Plain content</nui-tab>
    </nui-tabs>
  `,
})
class CustomLabelHostComponent {
  protected readonly ColorVariant = ColorVariant;
  protected readonly Size = Size;
}

describe('tabs.component.ts', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  function headers<T>(fixture: ComponentFixture<T>): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));
  }

  function selected<T>(fixture: ComponentFixture<T>): (string | null)[] {
    return headers(fixture).map((h) => h.getAttribute('aria-selected'));
  }

  function panelText<T>(fixture: ComponentFixture<T>): string | undefined {
    return fixture.nativeElement.querySelector('[role="tabpanel"]')?.textContent?.trim();
  }

  async function create<T>(type: new () => T): Promise<ComponentFixture<T>> {
    const fixture = TestBed.createComponent(type);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  describe('without a binding', () => {
    it('should open the first tab', async () => {
      const fixture = await create(BoundHostComponent);
      expect(selected(fixture)).toEqual(['true', 'false', 'false']);
      expect(panelText(fixture)).toBe('General content');
    });

    it('should open the first enabled tab when the first one is disabled', async () => {
      const fixture = await create(UnboundHostComponent);
      expect(selected(fixture)).toEqual(['false', 'true']);
      expect(panelText(fixture)).toBe('Second content');
    });

    it('should show no panel when every tab is disabled', async () => {
      const fixture = await create(AllDisabledHostComponent);
      expect(selected(fixture)).toEqual(['false', 'false']);
      expect(fixture.nativeElement.querySelector('[role="tabpanel"]')).toBeNull();
    });
  });

  describe('[activeIndex] input', () => {
    it('should open the tab it names on first render', async () => {
      const fixture = await create(InitialIndexHostComponent);
      expect(selected(fixture)).toEqual(['false', 'false', 'true']);
      expect(panelText(fixture)).toBe('C content');
    });
  });

  describe('two-way binding', () => {
    it('should emit the clicked index and keep the bound value in sync', async () => {
      const fixture = await create(BoundHostComponent);

      headers(fixture)[2].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.changes).toEqual([2]);
      expect(fixture.componentInstance.index()).toBe(2);
      expect(selected(fixture)).toEqual(['false', 'false', 'true']);
      expect(panelText(fixture)).toBe('Billing content');
    });

    it('should not emit when the active tab is clicked again', async () => {
      const fixture = await create(BoundHostComponent);
      headers(fixture)[0].click();
      fixture.detectChanges();
      expect(fixture.componentInstance.changes).toEqual([]);
    });

    it('should switch tabs when the consumer changes the bound index from code', async () => {
      const fixture = await create(BoundHostComponent);

      fixture.componentInstance.index.set(2);
      fixture.detectChanges();

      expect(panelText(fixture)).toBe('Billing content');
      expect(fixture.componentInstance.changes).toEqual([]);
    });
  });

  describe('disabled and out-of-range indexes', () => {
    it('should ignore a click on a disabled tab', async () => {
      const fixture = await create(BoundHostComponent);
      fixture.componentInstance.advancedDisabled.set(true);
      fixture.detectChanges();

      headers(fixture)[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.changes).toEqual([]);
      expect(fixture.componentInstance.index()).toBe(0);
      expect(panelText(fixture)).toBe('General content');
    });

    it('should refuse a disabled tab through selectTab', async () => {
      const fixture = await create(BoundHostComponent);
      fixture.componentInstance.advancedDisabled.set(true);
      fixture.detectChanges();
      const tabs = fixture.debugElement.children[0].componentInstance as TabsComponent;

      tabs.selectTab(1);
      tabs.selectTab(99);
      tabs.selectTab(-1);
      fixture.detectChanges();

      expect(fixture.componentInstance.index()).toBe(0);
    });

    it('should not activate a disabled tab named by the bound index', async () => {
      const fixture = await create(BoundHostComponent);
      fixture.componentInstance.advancedDisabled.set(true);
      fixture.componentInstance.index.set(1);
      fixture.detectChanges();

      expect(selected(fixture)).toEqual(['true', 'false', 'false']);
      expect(panelText(fixture)).toBe('General content');
      expect(fixture.componentInstance.index()).toBe(1);
    });

    it('should fall back to the first enabled tab for an out-of-range index', async () => {
      const fixture = await create(BoundHostComponent);

      fixture.componentInstance.index.set(7);
      fixture.detectChanges();
      expect(selected(fixture)).toEqual(['true', 'false', 'false']);

      fixture.componentInstance.index.set(-1);
      fixture.detectChanges();
      expect(selected(fixture)).toEqual(['true', 'false', 'false']);
    });

    it('should emit again when a click picks the tab the fallback was already showing', async () => {
      const fixture = await create(BoundHostComponent);
      fixture.componentInstance.index.set(7);
      fixture.detectChanges();

      headers(fixture)[0].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.changes).toEqual([0]);
      expect(fixture.componentInstance.index()).toBe(0);
    });
  });

  describe('appearance', () => {
    it('should render a nuiTabLabel template as the tab header instead of the label text', async () => {
      const fixture = await create(CustomLabelHostComponent);
      const [custom, plain] = headers(fixture);
      expect(custom.querySelector('.custom-label')?.textContent).toBe('Profile');
      expect(plain.textContent?.trim()).toBe('Plain');
      expect(panelText(fixture)).toBe('Profile content');
    });

    it('should apply the size, variant and full-width classes', async () => {
      const fixture = await create(CustomLabelHostComponent);
      const root = fixture.nativeElement.querySelector('.nui-tabs') as HTMLElement;
      expect(root.classList).toContain('nui-tabs--lg');
      expect(root.classList).toContain('nui-tabs--success');
      expect(root.classList).toContain('nui-tabs--full-width');
    });

    it('should default to the primary variant and medium size without full width', async () => {
      const fixture = await create(BoundHostComponent);
      const root = fixture.nativeElement.querySelector('.nui-tabs') as HTMLElement;
      expect(root.classList).toContain('nui-tabs--md');
      expect(root.classList).toContain('nui-tabs--primary');
      expect(root.classList).not.toContain('nui-tabs--full-width');
    });
  });
});
