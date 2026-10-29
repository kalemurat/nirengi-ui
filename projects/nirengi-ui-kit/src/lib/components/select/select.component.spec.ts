import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, ViewEncapsulation } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SelectComponent } from './select.component';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

const SIMPLE_OPTIONS = ['Alpha', 'Beta', 'Gamma'];

const OBJECT_OPTIONS = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];

describe('select.component.ts', () => {
  let fixture: ComponentFixture<SelectComponent>;
  let component: SelectComponent;

  function createComponent(extraSetup?: (f: ComponentFixture<SelectComponent>) => void): void {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    // required input must be provided before first detectChanges
    fixture.componentRef.setInput('options', SIMPLE_OPTIONS);
    if (extraSetup) extraSetup(fixture);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  // ─── Encapsulation Guard Tests (PRESERVE) ─────────────────────────────────

  it('should use emulated (not None) view encapsulation so component styles do not leak', () => {
    createComponent();
    const def = (
      SelectComponent as unknown as {
        ɵcmp: {
          encapsulation: ViewEncapsulation;
        };
      }
    ).ɵcmp;
    expect(def.encapsulation).not.toBe(ViewEncapsulation.None);
    expect(def.encapsulation).toBe(ViewEncapsulation.Emulated);
  });

  it('should scope rendered host styling via emulated encapsulation attributes', () => {
    createComponent();
    const host = fixture.nativeElement as HTMLElement;
    const attrs = host.getAttributeNames();
    expect(attrs.some((a) => a.startsWith('_nghost-'))).toBe(true);
  });

  // ─── Creation ─────────────────────────────────────────────────────────────

  describe('Creation', () => {
    it('should create with required options input', () => {
      createComponent();
      expect(component).toBeTruthy();
    });

    it('should initialise isOpen to false', () => {
      createComponent();
      expect(component.isOpen()).toBe(false);
    });

    it('should initialise searchTerm to empty string', () => {
      createComponent();
      expect(component.searchTerm()).toBe('');
    });

    it('should initialise value to null', () => {
      createComponent();
      expect(component.value()).toBeNull();
    });

    it('should initialise isDisabled to false', () => {
      createComponent();
      expect(component.isDisabled()).toBe(false);
    });

    it('should generate a unique inputId', () => {
      createComponent();
      expect(component.inputId).toMatch(/^nui-select-[a-z0-9]+$/);
    });

    it('should have default placeholder "Select..."', () => {
      createComponent();
      expect(component.placeholder()).toBe('Select...');
    });

    it('should have default size of Medium', () => {
      createComponent();
      expect(component.size()).toBe(Size.Medium);
    });

    it('should have default variant of Secondary', () => {
      createComponent();
      expect(component.variant()).toBe(ColorVariant.Secondary);
    });

    it('should default multiple to false', () => {
      createComponent();
      expect(component.multiple()).toBe(false);
    });

    it('should default searchable to false', () => {
      createComponent();
      expect(component.searchable()).toBe(false);
    });

    it('should default clearable to true', () => {
      createComponent();
      expect(component.clearable()).toBe(true);
    });

    it('should default appendToBody to true', () => {
      createComponent();
      expect(component.appendToBody()).toBe(true);
    });

    it('should default disabled to false', () => {
      createComponent();
      expect(component.disabledInput()).toBe(false);
    });
  });

  // ─── Inputs ───────────────────────────────────────────────────────────────

  describe('Inputs', () => {
    describe('options (required)', () => {
      it('should accept simple string options', () => {
        createComponent();
        expect(component.options()).toEqual(SIMPLE_OPTIONS);
      });

      it('should accept object options', () => {
        createComponent((f) => f.componentRef.setInput('options', OBJECT_OPTIONS));
        expect(component.options()).toEqual(OBJECT_OPTIONS);
      });

      it('should accept an empty array', () => {
        createComponent((f) => f.componentRef.setInput('options', []));
        expect(component.options()).toEqual([]);
      });
    });

    describe('bindLabel', () => {
      it('should be undefined by default', () => {
        createComponent();
        expect(component.bindLabel()).toBeUndefined();
      });

      it('should accept a property name string', () => {
        createComponent((f) => {
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindLabel', 'name');
        });
        expect(component.bindLabel()).toBe('name');
      });
    });

    describe('bindValue', () => {
      it('should be undefined by default', () => {
        createComponent();
        expect(component.bindValue()).toBeUndefined();
      });

      it('should accept a property name string', () => {
        createComponent((f) => {
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindValue', 'id');
        });
        expect(component.bindValue()).toBe('id');
      });
    });

    describe('multiple', () => {
      it('should switch to multiple selection mode', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        expect(component.multiple()).toBe(true);
      });
    });

    describe('searchable', () => {
      it('should enable search mode', () => {
        createComponent((f) => f.componentRef.setInput('searchable', true));
        expect(component.searchable()).toBe(true);
      });
    });

    describe('clearable', () => {
      it('should disable clear button when false', () => {
        createComponent((f) => f.componentRef.setInput('clearable', false));
        expect(component.clearable()).toBe(false);
      });
    });

    describe('placeholder', () => {
      it('should use custom placeholder', () => {
        createComponent((f) => f.componentRef.setInput('placeholder', 'Pick one'));
        expect(component.placeholder()).toBe('Pick one');
      });
    });

    describe('label', () => {
      it('should be undefined by default', () => {
        createComponent();
        expect(component.label()).toBeUndefined();
      });

      it('should render a label element when provided', () => {
        createComponent((f) => f.componentRef.setInput('label', 'Country'));
        fixture.detectChanges();
        const label = fixture.nativeElement.querySelector('.nui-select__label');
        expect(label).toBeTruthy();
        expect(label.textContent.trim()).toBe('Country');
      });

      it('should not render a label element when not provided', () => {
        createComponent();
        const label = fixture.nativeElement.querySelector('.nui-select__label');
        expect(label).toBeNull();
      });
    });

    describe('hint', () => {
      it('should render hint text below the component', () => {
        createComponent((f) => f.componentRef.setInput('hint', 'Choose an option'));
        fixture.detectChanges();
        const hint = fixture.nativeElement.querySelector('.nui-select__hint');
        expect(hint).toBeTruthy();
        expect(hint.textContent.trim()).toBe('Choose an option');
      });

      it('should not render hint when not provided', () => {
        createComponent();
        const hint = fixture.nativeElement.querySelector('.nui-select__hint');
        expect(hint).toBeNull();
      });
    });

    describe('success', () => {
      it('should render success message', () => {
        createComponent((f) => f.componentRef.setInput('success', 'Looks good!'));
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector('.nui-select__success');
        expect(el).toBeTruthy();
        expect(el.textContent.trim()).toBe('Looks good!');
      });

      it('should apply success class to trigger', () => {
        createComponent((f) => f.componentRef.setInput('success', 'OK'));
        fixture.detectChanges();
        const trigger = fixture.nativeElement.querySelector('.nui-select__trigger');
        expect(trigger.classList).toContain('nui-select__trigger--success');
      });

      it('should hide hint when success is set', () => {
        createComponent((f) => {
          f.componentRef.setInput('hint', 'Some hint');
          f.componentRef.setInput('success', 'OK');
        });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.nui-select__hint')).toBeNull();
        expect(fixture.nativeElement.querySelector('.nui-select__success')).toBeTruthy();
      });
    });

    describe('warning', () => {
      it('should render warning message', () => {
        createComponent((f) => f.componentRef.setInput('warning', 'Watch out!'));
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector('.nui-select__warning');
        expect(el).toBeTruthy();
        expect(el.textContent.trim()).toBe('Watch out!');
      });

      it('should apply warning class to trigger', () => {
        createComponent((f) => f.componentRef.setInput('warning', 'Careful'));
        fixture.detectChanges();
        const trigger = fixture.nativeElement.querySelector('.nui-select__trigger');
        expect(trigger.classList).toContain('nui-select__trigger--warning');
      });

      it('should prefer success over warning when both are set', () => {
        createComponent((f) => {
          f.componentRef.setInput('success', 'OK');
          f.componentRef.setInput('warning', 'Careful');
        });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.nui-select__success')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.nui-select__warning')).toBeNull();
      });
    });

    describe('size', () => {
      it('should default to medium', () => {
        createComponent();
        expect(component.size()).toBe(Size.Medium);
      });

      (
        [
          [Size.XSmall, 'xs'],
          [Size.Small, 'sm'],
          [Size.Medium, 'md'],
          [Size.Large, 'lg'],
          [Size.XLarge, 'xl'],
        ] as [Size, string][]
      ).forEach(([size, cls]) => {
        it(`should apply size class '${cls}' for Size.${size}`, () => {
          createComponent((f) => f.componentRef.setInput('size', size));
          fixture.detectChanges();
          const container = fixture.nativeElement.querySelector('.nui-select');
          expect(container.className).toContain(`nui-select--${cls}`);
        });
      });
    });

    describe('variant', () => {
      it('should default to secondary', () => {
        createComponent();
        expect(component.variant()).toBe(ColorVariant.Secondary);
      });

      it('should apply variant class to container', () => {
        createComponent((f) => f.componentRef.setInput('variant', ColorVariant.Primary));
        fixture.detectChanges();
        const container = fixture.nativeElement.querySelector('.nui-select');
        expect(container.className).toContain('nui-select--primary');
      });
    });

    describe('disabled input', () => {
      it('should disable via disabledInput (alias: disabled)', () => {
        createComponent((f) => f.componentRef.setInput('disabled', true));
        fixture.detectChanges();
        expect(component.isDisabled()).toBe(true);
      });

      it('should not be disabled by default', () => {
        createComponent();
        expect(component.isDisabled()).toBe(false);
      });

      it('should apply disabled class to trigger when disabled', () => {
        createComponent((f) => f.componentRef.setInput('disabled', true));
        fixture.detectChanges();
        const trigger = fixture.nativeElement.querySelector('.nui-select__trigger');
        expect(trigger.classList).toContain('nui-select__trigger--disabled');
      });
    });

    describe('appendToBody', () => {
      it('should default to true', () => {
        createComponent();
        expect(component.appendToBody()).toBe(true);
      });

      it('should accept false', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        expect(component.appendToBody()).toBe(false);
      });
    });
  });

  // ─── Computed Signals ─────────────────────────────────────────────────────

  describe('Computed Signals', () => {
    describe('containerClasses', () => {
      it('should include variant and size classes', () => {
        createComponent();
        const cls = component.containerClasses();
        expect(cls).toContain('nui-select--secondary');
        expect(cls).toContain('nui-select--md');
      });

      it('should update when variant changes', () => {
        createComponent();
        fixture.componentRef.setInput('variant', ColorVariant.Primary);
        fixture.detectChanges();
        expect(component.containerClasses()).toContain('nui-select--primary');
      });

      it('should update when size changes', () => {
        createComponent();
        fixture.componentRef.setInput('size', Size.Large);
        fixture.detectChanges();
        expect(component.containerClasses()).toContain('nui-select--lg');
      });
    });

    describe('triggerClasses', () => {
      it('should include size class', () => {
        createComponent();
        expect(component.triggerClasses()).toContain('nui-select__trigger--md');
      });

      it('should update when size changes', () => {
        createComponent();
        fixture.componentRef.setInput('size', Size.Small);
        fixture.detectChanges();
        expect(component.triggerClasses()).toContain('nui-select__trigger--sm');
      });
    });

    describe('overlayPanelClasses', () => {
      it('should return array with nui-select, nui-select-overlay, size, and variant', () => {
        createComponent();
        const classes = component.overlayPanelClasses();
        expect(classes).toContain('nui-select');
        expect(classes).toContain('nui-select-overlay');
        expect(classes).toContain('nui-select--md');
        expect(classes).toContain('nui-select--secondary');
      });

      it('should update when size or variant change', () => {
        createComponent();
        fixture.componentRef.setInput('size', Size.XLarge);
        fixture.componentRef.setInput('variant', ColorVariant.Primary);
        fixture.detectChanges();
        const classes = component.overlayPanelClasses();
        expect(classes).toContain('nui-select--xl');
        expect(classes).toContain('nui-select--primary');
      });
    });

    describe('iconSize', () => {
      it('should return 14 for XSmall', () => {
        createComponent((f) => f.componentRef.setInput('size', Size.XSmall));
        expect(component.iconSize()).toBe(14);
      });

      it('should return 16 for Small', () => {
        createComponent((f) => f.componentRef.setInput('size', Size.Small));
        expect(component.iconSize()).toBe(16);
      });

      it('should return 18 for Medium (default)', () => {
        createComponent();
        expect(component.iconSize()).toBe(18);
      });

      it('should return 20 for Large', () => {
        createComponent((f) => f.componentRef.setInput('size', Size.Large));
        expect(component.iconSize()).toBe(20);
      });

      it('should return 24 for XLarge', () => {
        createComponent((f) => f.componentRef.setInput('size', Size.XLarge));
        expect(component.iconSize()).toBe(24);
      });
    });

    describe('filteredOptions', () => {
      it('should return all options when searchTerm is empty', () => {
        createComponent();
        expect(component.filteredOptions()).toEqual(SIMPLE_OPTIONS);
      });

      it('should filter by search term (case-insensitive)', () => {
        createComponent();
        component.searchTerm.set('alp');
        expect(component.filteredOptions()).toEqual(['Alpha']);
      });

      it('should return empty array when no match', () => {
        createComponent();
        component.searchTerm.set('zzz');
        expect(component.filteredOptions()).toEqual([]);
      });

      it('should filter object options using bindLabel', () => {
        createComponent((f) => {
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindLabel', 'name');
        });
        component.searchTerm.set('ali');
        expect(component.filteredOptions()).toEqual([{ id: 1, name: 'Alice' }]);
      });

      it('should be case-insensitive', () => {
        createComponent();
        component.searchTerm.set('BETA');
        expect(component.filteredOptions()).toEqual(['Beta']);
      });
    });

    describe('selectedItems', () => {
      it('should return empty array when value is null', () => {
        createComponent();
        expect(component.selectedItems()).toEqual([]);
      });

      it('should return empty array when value is undefined', () => {
        createComponent();
        component.value.set(undefined as any);
        expect(component.selectedItems()).toEqual([]);
      });

      it('should return matching option for single primitive value', () => {
        createComponent();
        component.writeValue('Alpha');
        expect(component.selectedItems()).toEqual(['Alpha']);
      });

      it('should return matching object option using bindValue', () => {
        createComponent((f) => {
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindValue', 'id');
        });
        component.writeValue(2);
        expect(component.selectedItems()).toEqual([{ id: 2, name: 'Bob' }]);
      });

      it('should return empty array for unknown bindValue', () => {
        createComponent((f) => {
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindValue', 'id');
        });
        component.writeValue(999);
        expect(component.selectedItems()).toEqual([]);
      });

      it('should return multiple items for multi-select', () => {
        createComponent((f) => {
          f.componentRef.setInput('multiple', true);
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindValue', 'id');
        });
        component.writeValue([1, 3]);
        expect(component.selectedItems()).toEqual([
          { id: 1, name: 'Alice' },
          { id: 3, name: 'Charlie' },
        ]);
      });

      it('should return empty array in multiple mode when value is not an array', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.writeValue('Alpha' as any);
        expect(component.selectedItems()).toEqual([]);
      });

      it('should return empty array in multiple mode when value is empty array', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.writeValue([]);
        expect(component.selectedItems()).toEqual([]);
      });

      it('should find object option by object reference (no bindValue)', () => {
        const opts = [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ];
        createComponent((f) => {
          f.componentRef.setInput('options', opts);
        });
        component.writeValue(opts[0]);
        expect(component.selectedItems()).toEqual([opts[0]]);
      });
    });

    describe('hasValue', () => {
      it('should return false when value is null', () => {
        createComponent();
        expect(component.hasValue()).toBe(false);
      });

      it('should return true for a primitive value', () => {
        createComponent();
        component.writeValue('Alpha');
        expect(component.hasValue()).toBe(true);
      });

      it('should return false for empty array in multiple mode', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.writeValue([]);
        expect(component.hasValue()).toBe(false);
      });

      it('should return true for non-empty array in multiple mode', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.writeValue(['Alpha']);
        expect(component.hasValue()).toBe(true);
      });

      it('should return false when value is undefined', () => {
        createComponent();
        component.value.set(undefined as any);
        expect(component.hasValue()).toBe(false);
      });
    });

    describe('itemTemplate', () => {
      it('should be null when no template is provided', () => {
        createComponent();
        expect(component.itemTemplate()).toBeNull();
      });

      it('should resolve a projected #itemTemplate content child', () => {
        @Component({
          imports: [SelectComponent],
          template: `
            <nui-select [options]="options">
              <ng-template #itemTemplate let-item>{{ item }}</ng-template>
            </nui-select>
          `,
        })
        class HostComponent {
          readonly options = SIMPLE_OPTIONS;
        }

        TestBed.configureTestingModule({ imports: [HostComponent] });
        const hostFixture = TestBed.createComponent(HostComponent);
        hostFixture.detectChanges();

        const select = hostFixture.debugElement.query(By.directive(SelectComponent))
          .componentInstance as SelectComponent;

        expect(select.contentItemTemplate()).toBeTruthy();
        expect(select.itemTemplate()).toBe(select.contentItemTemplate()!);
      });
    });
  });

  // ─── Methods ──────────────────────────────────────────────────────────────

  describe('Methods', () => {
    describe('toggleDropdown', () => {
      it('should open dropdown when closed', () => {
        createComponent();
        expect(component.isOpen()).toBe(false);
        component.toggleDropdown();
        expect(component.isOpen()).toBe(true);
      });

      it('should close dropdown when open', () => {
        createComponent();
        component.toggleDropdown();
        expect(component.isOpen()).toBe(true);
        component.toggleDropdown();
        expect(component.isOpen()).toBe(false);
      });

      it('should do nothing when disabled', () => {
        createComponent((f) => f.componentRef.setInput('disabled', true));
        fixture.detectChanges();
        component.toggleDropdown();
        expect(component.isOpen()).toBe(false);
      });

      it('should clear searchTerm when closing', () => {
        createComponent();
        component.toggleDropdown(); // open
        component.searchTerm.set('test');
        component.toggleDropdown(); // close
        expect(component.searchTerm()).toBe('');
      });

      it('should call onTouched when closing', () => {
        createComponent();
        const touchedSpy = vi.fn().mockName('onTouched');
        component.registerOnTouched(touchedSpy);
        component.toggleDropdown(); // open
        component.toggleDropdown(); // close
        expect(touchedSpy).toHaveBeenCalled();
      });
    });

    describe('open (via toggleDropdown)', () => {
      it('should set isOpen to true', () => {
        createComponent();
        component.toggleDropdown();
        expect(component.isOpen()).toBe(true);
      });
    });

    describe('close', () => {
      it('should set isOpen to false', () => {
        createComponent();
        component.isOpen.set(true);
        component.close();
        expect(component.isOpen()).toBe(false);
      });

      it('should clear searchTerm when closing', () => {
        createComponent();
        component.isOpen.set(true);
        component.searchTerm.set('term');
        component.close();
        expect(component.searchTerm()).toBe('');
      });

      it('should call onTouched when closing', () => {
        createComponent();
        const spy = vi.fn().mockName('onTouched');
        component.registerOnTouched(spy);
        component.isOpen.set(true);
        component.close();
        expect(spy).toHaveBeenCalled();
      });

      it('should do nothing when already closed', () => {
        createComponent();
        const spy = vi.fn().mockName('onTouched');
        component.registerOnTouched(spy);
        component.close(); // already closed
        expect(spy).not.toHaveBeenCalled();
        expect(component.isOpen()).toBe(false);
      });
    });

    describe('selectOption — single mode', () => {
      it('should set value to the option', () => {
        createComponent();
        component.selectOption('Alpha');
        expect(component.value()).toBe('Alpha');
      });

      it('should close the dropdown after selecting', () => {
        createComponent();
        component.isOpen.set(true);
        component.selectOption('Alpha');
        expect(component.isOpen()).toBe(false);
      });

      it('should use bindValue to extract the actual value', () => {
        createComponent((f) => {
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindValue', 'id');
        });
        component.selectOption({ id: 2, name: 'Bob' });
        expect(component.value()).toBe(2);
      });

      it('should fire onChange when a value is selected', () => {
        createComponent();
        const spy = vi.fn().mockName('onChange');
        component.registerOnChange(spy);
        component.selectOption('Beta');
        expect(spy).toHaveBeenCalledWith('Beta');
      });

      it('should replace previous single selection', () => {
        createComponent();
        component.selectOption('Alpha');
        component.selectOption('Beta');
        expect(component.value()).toBe('Beta');
      });
    });

    describe('selectOption — multiple mode', () => {
      beforeEach(() => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
      });

      it('should add a value to the array', () => {
        component.writeValue([]);
        component.selectOption('Alpha');
        expect(component.value()).toEqual(['Alpha']);
      });

      it('should add additional values', () => {
        component.writeValue(['Alpha']);
        component.selectOption('Beta');
        expect(component.value()).toEqual(['Alpha', 'Beta']);
      });

      it('should remove an already-selected value', () => {
        component.writeValue(['Alpha', 'Beta']);
        component.selectOption('Alpha');
        expect(component.value()).toEqual(['Beta']);
      });

      it('should not close the dropdown in multiple mode', () => {
        component.isOpen.set(true);
        component.writeValue([]);
        component.selectOption('Alpha');
        expect(component.isOpen()).toBe(true);
      });

      it('should handle null current value by starting fresh', () => {
        component.writeValue(null);
        component.selectOption('Gamma');
        expect(component.value()).toEqual(['Gamma']);
      });

      it('should use bindValue in multiple mode', () => {
        createComponent((f) => {
          f.componentRef.setInput('multiple', true);
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindValue', 'id');
        });
        component.writeValue([]);
        component.selectOption({ id: 1, name: 'Alice' });
        component.selectOption({ id: 3, name: 'Charlie' });
        expect(component.value()).toEqual([1, 3]);
      });
    });

    describe('removeItem', () => {
      it('should remove an item from multiple selection', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.writeValue(['Alpha', 'Beta']);
        const fakeEvent = new MouseEvent('click');
        vi.spyOn(fakeEvent, 'stopPropagation').mockReturnValue(undefined);
        component.removeItem('Alpha', fakeEvent);
        expect(component.value()).toEqual(['Beta']);
        expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      });

      it('should stop propagation', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.writeValue(['Alpha']);
        const fakeEvent = new MouseEvent('click');
        vi.spyOn(fakeEvent, 'stopPropagation').mockReturnValue(undefined);
        component.removeItem('Alpha', fakeEvent);
        expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      });

      it('should do nothing when disabled', () => {
        createComponent((f) => {
          f.componentRef.setInput('multiple', true);
          f.componentRef.setInput('disabled', true);
        });
        fixture.detectChanges();
        component.writeValue(['Alpha', 'Beta']);
        const fakeEvent = new MouseEvent('click');
        vi.spyOn(fakeEvent, 'stopPropagation').mockReturnValue(undefined);
        component.removeItem('Alpha', fakeEvent);
        // Value remains unchanged since disabled
        expect(component.value()).toEqual(['Alpha', 'Beta']);
      });

      it('should remove object item using bindValue', () => {
        createComponent((f) => {
          f.componentRef.setInput('multiple', true);
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindValue', 'id');
        });
        component.writeValue([1, 2, 3]);
        const fakeEvent = new MouseEvent('click');
        vi.spyOn(fakeEvent, 'stopPropagation').mockReturnValue(undefined);
        component.removeItem({ id: 2, name: 'Bob' }, fakeEvent);
        expect(component.value()).toEqual([1, 3]);
      });
    });

    describe('clearValue', () => {
      it('should set value to null in single mode', () => {
        createComponent();
        component.writeValue('Alpha');
        const fakeEvent = new MouseEvent('click');
        vi.spyOn(fakeEvent, 'stopPropagation').mockReturnValue(undefined);
        component.clearValue(fakeEvent);
        expect(component.value()).toBeNull();
      });

      it('should set value to empty array in multiple mode', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.writeValue(['Alpha', 'Beta']);
        const fakeEvent = new MouseEvent('click');
        vi.spyOn(fakeEvent, 'stopPropagation').mockReturnValue(undefined);
        component.clearValue(fakeEvent);
        expect(component.value()).toEqual([]);
      });

      it('should stop propagation', () => {
        createComponent();
        component.writeValue('Alpha');
        const fakeEvent = new MouseEvent('click');
        vi.spyOn(fakeEvent, 'stopPropagation').mockReturnValue(undefined);
        component.clearValue(fakeEvent);
        expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      });

      it('should do nothing when disabled', () => {
        createComponent((f) => f.componentRef.setInput('disabled', true));
        fixture.detectChanges();
        component.writeValue('Alpha');
        const fakeEvent = new MouseEvent('click');
        vi.spyOn(fakeEvent, 'stopPropagation').mockReturnValue(undefined);
        component.clearValue(fakeEvent);
        // updateValue respects isDisabled, but stopPropagation still called
        expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      });

      it('should fire onChange with null after clearing single', () => {
        createComponent();
        const spy = vi.fn().mockName('onChange');
        component.registerOnChange(spy);
        component.writeValue('Alpha');
        const fakeEvent = new MouseEvent('click');
        vi.spyOn(fakeEvent, 'stopPropagation').mockReturnValue(undefined);
        component.clearValue(fakeEvent);
        expect(spy).toHaveBeenCalledWith(null);
      });
    });

    describe('onSearch', () => {
      it('should update searchTerm from input event', () => {
        createComponent();
        const input = document.createElement('input');
        input.value = 'gamma';
        const event = new Event('input');
        Object.defineProperty(event, 'target', { value: input });
        component.onSearch(event);
        expect(component.searchTerm()).toBe('gamma');
      });

      it('should update filteredOptions reactively', () => {
        createComponent();
        const input = document.createElement('input');
        input.value = 'bet';
        const event = new Event('input');
        Object.defineProperty(event, 'target', { value: input });
        component.onSearch(event);
        expect(component.filteredOptions()).toEqual(['Beta']);
      });
    });

    describe('getLabel', () => {
      it('should return empty string for null/undefined', () => {
        createComponent();
        expect(component.getLabel(null)).toBe('');
        expect(component.getLabel(undefined)).toBe('');
      });

      it('should return string representation for primitives', () => {
        createComponent();
        expect(component.getLabel('Alpha')).toBe('Alpha');
        expect(component.getLabel(42)).toBe('42');
      });

      it('should return object property when bindLabel is set', () => {
        createComponent((f) => {
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindLabel', 'name');
        });
        expect(component.getLabel({ id: 1, name: 'Alice' })).toBe('Alice');
      });

      it('should return empty string when bindLabel property missing', () => {
        createComponent((f) => {
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindLabel', 'nonexistent');
        });
        expect(component.getLabel({ id: 1, name: 'Alice' })).toBe('');
      });

      it('should return String(option) when no bindLabel for object', () => {
        createComponent();
        const obj = { toString: () => 'custom-string' };
        expect(component.getLabel(obj)).toBe('custom-string');
      });
    });

    describe('getValue', () => {
      it('should return option itself when no bindValue', () => {
        createComponent();
        expect(component.getValue('Alpha')).toBe('Alpha');
      });

      it('should return property value when bindValue is set', () => {
        createComponent((f) => {
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindValue', 'id');
        });
        expect(component.getValue({ id: 2, name: 'Bob' })).toBe(2);
      });

      it('should return primitive when bindValue set but option is primitive', () => {
        createComponent((f) => {
          f.componentRef.setInput('bindValue', 'id');
        });
        // Not an object → fallback
        expect(component.getValue('plain')).toBe('plain');
      });
    });

    describe('isSelected', () => {
      it('should return false when no value is set', () => {
        createComponent();
        expect(component.isSelected('Alpha')).toBe(false);
      });

      it('should return true when value matches in single mode', () => {
        createComponent();
        component.writeValue('Alpha');
        expect(component.isSelected('Alpha')).toBe(true);
      });

      it('should return false when value does not match in single mode', () => {
        createComponent();
        component.writeValue('Alpha');
        expect(component.isSelected('Beta')).toBe(false);
      });

      it('should return true when option in array (multiple mode)', () => {
        createComponent((f) => {
          f.componentRef.setInput('multiple', true);
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindValue', 'id');
        });
        component.writeValue([1, 3]);
        expect(component.isSelected({ id: 1, name: 'Alice' })).toBe(true);
        expect(component.isSelected({ id: 2, name: 'Bob' })).toBe(false);
      });

      it('should return false in multiple mode when value is not array', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.value.set('Alpha' as any);
        expect(component.isSelected('Alpha')).toBe(false);
      });
    });

    describe('trackByFn', () => {
      it('should return option value when bindValue is set', () => {
        createComponent((f) => {
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindValue', 'id');
        });
        expect(component.trackByFn(0, { id: 1, name: 'Alice' })).toBe(1);
      });

      it('should return index when getValue returns falsy', () => {
        createComponent();
        // null option → getValue returns null → trackByFn should use index
        expect(component.trackByFn(5, null)).toBe(5);
      });

      it('should return string option itself for primitive options', () => {
        createComponent();
        expect(component.trackByFn(0, 'Alpha')).toBe('Alpha');
      });
    });
  });

  // ─── ControlValueAccessor ─────────────────────────────────────────────────

  describe('ControlValueAccessor', () => {
    describe('writeValue', () => {
      it('should set the value signal', () => {
        createComponent();
        component.writeValue('Beta');
        expect(component.value()).toBe('Beta');
      });

      it('should accept null', () => {
        createComponent();
        component.writeValue('Alpha');
        component.writeValue(null);
        expect(component.value()).toBeNull();
      });

      it('should accept arrays (multiple mode)', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.writeValue(['Alpha', 'Beta']);
        expect(component.value()).toEqual(['Alpha', 'Beta']);
      });
    });

    describe('registerOnChange', () => {
      it('should register the onChange callback', () => {
        createComponent();
        const spy = vi.fn().mockName('onChange');
        component.registerOnChange(spy);
        component.selectOption('Alpha');
        expect(spy).toHaveBeenCalledWith('Alpha');
      });
    });

    describe('registerOnTouched', () => {
      it('should register the onTouched callback', () => {
        createComponent();
        const spy = vi.fn().mockName('onTouched');
        component.registerOnTouched(spy);
        component.isOpen.set(true);
        component.close();
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('setDisabledState', () => {
      it('should set isDisabled to true', () => {
        createComponent();
        component.setDisabledState(true);
        expect(component.isDisabled()).toBe(true);
      });

      it('should set isDisabled back to false', () => {
        createComponent();
        component.setDisabledState(true);
        component.setDisabledState(false);
        expect(component.isDisabled()).toBe(false);
      });
    });

    describe('updateValue', () => {
      it('should update value and fire onChange', () => {
        createComponent();
        const spy = vi.fn().mockName('onChange');
        component.registerOnChange(spy);
        component.updateValue('Gamma');
        expect(component.value()).toBe('Gamma');
        expect(spy).toHaveBeenCalledWith('Gamma');
      });

      it('should not update when disabled', () => {
        createComponent();
        component.setDisabledState(true);
        const spy = vi.fn().mockName('onChange');
        component.registerOnChange(spy);
        component.updateValue('Alpha');
        expect(component.value()).toBeNull();
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('markAsTouched', () => {
      it('should call onTouched when not disabled', () => {
        createComponent();
        const spy = vi.fn().mockName('onTouched');
        component.registerOnTouched(spy);
        component.markAsTouched();
        expect(spy).toHaveBeenCalled();
      });

      it('should not call onTouched when disabled', () => {
        createComponent();
        component.setDisabledState(true);
        const spy = vi.fn().mockName('onTouched');
        component.registerOnTouched(spy);
        component.markAsTouched();
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  // ─── Keyboard / Host Listeners ────────────────────────────────────────────

  describe('Keyboard and Host Listeners', () => {
    describe('onClickOutside (document:click)', () => {
      it('should close dropdown when clicking outside the component', () => {
        createComponent();
        component.isOpen.set(true);
        // Click on a node outside the component
        const outsideNode = document.createElement('div');
        document.body.appendChild(outsideNode);
        component.onClickOutside(new MouseEvent('click', { bubbles: true }));
        expect(component.isOpen()).toBe(false);
        document.body.removeChild(outsideNode);
      });

      it('should not close dropdown when clicking inside the component', () => {
        createComponent();
        component.isOpen.set(true);
        const host: HTMLElement = fixture.nativeElement;
        const innerNode = host.querySelector('.nui-select__trigger') as HTMLElement;
        // Simulate a click with target being an inner node
        const fakeEvent = { target: innerNode } as unknown as Event;
        component.onClickOutside(fakeEvent);
        expect(component.isOpen()).toBe(true);
      });
    });

    describe('Trigger keyboard events', () => {
      it('should open/close on Enter key on trigger', () => {
        createComponent();
        const trigger = fixture.nativeElement.querySelector('.nui-select__trigger') as HTMLElement;
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        fixture.detectChanges();
        expect(component.isOpen()).toBe(true);

        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        fixture.detectChanges();
        expect(component.isOpen()).toBe(false);
      });

      it('should open/close on Space key on trigger', () => {
        createComponent();
        const trigger = fixture.nativeElement.querySelector('.nui-select__trigger') as HTMLElement;
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
        fixture.detectChanges();
        expect(component.isOpen()).toBe(true);
      });
    });
  });

  // ─── Effect: disabled closes dropdown ─────────────────────────────────────

  describe('Effects', () => {
    it('should close dropdown when disabled becomes true', () => {
      createComponent();
      component.isOpen.set(true);
      // The effect reacts synchronously in zoneless mode when the signal changes
      component.setDisabledState(true);
      fixture.detectChanges();
      expect(component.isOpen()).toBe(false);
    });

    it('should sync disabledInput with isDisabled via effect', () => {
      createComponent();
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.isDisabled()).toBe(true);
    });
  });

  // ─── DOM / Template ───────────────────────────────────────────────────────

  describe('Template / DOM', () => {
    describe('Placeholder', () => {
      it('should show placeholder when no value is set', () => {
        createComponent((f) => f.componentRef.setInput('placeholder', 'Choose'));
        const valueEl = fixture.nativeElement.querySelector('.nui-select__value');
        expect(valueEl.textContent.trim()).toBe('Choose');
      });

      it('should show selected label when value is set (single)', () => {
        createComponent();
        component.writeValue('Beta');
        fixture.detectChanges();
        const valueEl = fixture.nativeElement.querySelector('.nui-select__value');
        expect(valueEl.textContent.trim()).toBe('Beta');
      });

      it('should apply placeholder class when no value', () => {
        createComponent();
        const valueEl = fixture.nativeElement.querySelector('.nui-select__value');
        expect(valueEl.classList).toContain('nui-select__value--placeholder');
      });

      it('should not apply placeholder class when value is set', () => {
        createComponent();
        component.writeValue('Alpha');
        fixture.detectChanges();
        const valueEl = fixture.nativeElement.querySelector('.nui-select__value');
        expect(valueEl.classList).not.toContain('nui-select__value--placeholder');
      });
    });

    describe('Clear button', () => {
      it('should show clear button when has value, clearable, and not disabled', () => {
        createComponent();
        component.writeValue('Alpha');
        fixture.detectChanges();
        const clearBtn = fixture.nativeElement.querySelector('.nui-select__clear');
        expect(clearBtn).toBeTruthy();
      });

      it('should not show clear button when no value', () => {
        createComponent();
        const clearBtn = fixture.nativeElement.querySelector('.nui-select__clear');
        expect(clearBtn).toBeNull();
      });

      it('should not show clear button when clearable is false', () => {
        createComponent((f) => f.componentRef.setInput('clearable', false));
        component.writeValue('Alpha');
        fixture.detectChanges();
        const clearBtn = fixture.nativeElement.querySelector('.nui-select__clear');
        expect(clearBtn).toBeNull();
      });

      it('should not show clear button when disabled', () => {
        createComponent((f) => f.componentRef.setInput('disabled', true));
        fixture.detectChanges();
        component.writeValue('Alpha');
        fixture.detectChanges();
        const clearBtn = fixture.nativeElement.querySelector('.nui-select__clear');
        expect(clearBtn).toBeNull();
      });
    });

    describe('Chips (multiple mode)', () => {
      it('should show chips in multiple mode when items are selected', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.writeValue(['Alpha', 'Beta']);
        fixture.detectChanges();
        const chips = fixture.nativeElement.querySelectorAll('.nui-select__chip');
        expect(chips.length).toBe(2);
      });

      it('should show chip labels', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.writeValue(['Alpha']);
        fixture.detectChanges();
        const chip = fixture.nativeElement.querySelector('.nui-select__chip');
        expect(chip.textContent).toContain('Alpha');
      });
    });

    describe('Dropdown open state class', () => {
      it('should apply open class to trigger when open', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        component.isOpen.set(true);
        fixture.detectChanges();
        const trigger = fixture.nativeElement.querySelector('.nui-select__trigger');
        expect(trigger.classList).toContain('nui-select__trigger--open');
      });

      it('should not apply open class when closed', () => {
        createComponent();
        const trigger = fixture.nativeElement.querySelector('.nui-select__trigger');
        expect(trigger.classList).not.toContain('nui-select__trigger--open');
      });
    });

    describe('Inline dropdown (appendToBody=false)', () => {
      it('should show dropdown inline when open and appendToBody is false', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        component.isOpen.set(true);
        fixture.detectChanges();
        const dropdown = fixture.nativeElement.querySelector('.nui-select__dropdown');
        expect(dropdown).toBeTruthy();
      });

      it('should not show dropdown when closed', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        const dropdown = fixture.nativeElement.querySelector('.nui-select__dropdown');
        expect(dropdown).toBeNull();
      });

      it('should not show dropdown when disabled even if open', () => {
        createComponent((f) => {
          f.componentRef.setInput('appendToBody', false);
          f.componentRef.setInput('disabled', true);
        });
        fixture.detectChanges();
        component.isOpen.set(true);
        fixture.detectChanges();
        const dropdown = fixture.nativeElement.querySelector('.nui-select__dropdown');
        expect(dropdown).toBeNull();
      });

      it('should show no-results message when filteredOptions is empty', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        component.searchTerm.set('zzz');
        component.isOpen.set(true);
        fixture.detectChanges();
        const empty = fixture.nativeElement.querySelector('.nui-select__empty');
        expect(empty).toBeTruthy();
        expect(empty.textContent.trim()).toBe('No results found.');
      });

      it('should render options list in inline mode', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        component.isOpen.set(true);
        fixture.detectChanges();
        const options = fixture.nativeElement.querySelectorAll('.nui-select__option');
        expect(options.length).toBe(SIMPLE_OPTIONS.length);
      });

      it('should apply selected class to selected option', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        component.writeValue('Beta');
        component.isOpen.set(true);
        fixture.detectChanges();
        const options = fixture.nativeElement.querySelectorAll('.nui-select__option');
        const selectedOption = Array.from(options).find((el: any) =>
          el.classList.contains('nui-select__option--selected')
        );
        expect(selectedOption).toBeTruthy();
      });

      it('should show search input when searchable is true', () => {
        createComponent((f) => {
          f.componentRef.setInput('appendToBody', false);
          f.componentRef.setInput('searchable', true);
        });
        component.isOpen.set(true);
        fixture.detectChanges();
        const searchInput = fixture.nativeElement.querySelector('.nui-select__search-input');
        expect(searchInput).toBeTruthy();
      });

      it('should not show search input when searchable is false', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        component.isOpen.set(true);
        fixture.detectChanges();
        const searchInput = fixture.nativeElement.querySelector('.nui-select__search-input');
        expect(searchInput).toBeNull();
      });

      it('should select option on click in inline mode', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        component.isOpen.set(true);
        fixture.detectChanges();
        const options = fixture.nativeElement.querySelectorAll('.nui-select__option');
        (options[1] as HTMLElement).click();
        fixture.detectChanges();
        expect(component.value()).toBe('Beta');
      });
    });

    describe('Trigger click', () => {
      it('should toggle dropdown on trigger click', () => {
        createComponent();
        const trigger = fixture.nativeElement.querySelector('.nui-select__trigger') as HTMLElement;
        trigger.click();
        fixture.detectChanges();
        expect(component.isOpen()).toBe(true);
      });
    });
  });

  // ─── Accessibility (WAI-ARIA APG select-only combobox) ────────────────────

  describe('Accessibility', () => {
    /** Opens the dropdown inline so the popup is queryable from the component's own DOM. */
    function createOpenInline(extraSetup?: (f: ComponentFixture<SelectComponent>) => void): void {
      createComponent((f) => {
        f.componentRef.setInput('appendToBody', false);
        if (extraSetup) extraSetup(f);
      });
      component.toggleDropdown();
      fixture.detectChanges();
    }

    function trigger(): HTMLElement {
      return fixture.nativeElement.querySelector('.nui-select__trigger') as HTMLElement;
    }

    /**
     * Resolves an IDREF the way an assistive technology would.
     * Walks the fixture's own elements rather than using a `#id` selector, so the
     * assertion does not depend on `CSS.escape` being present in the test environment.
     */
    function findById(id: string): HTMLElement | null {
      const host = fixture.nativeElement as HTMLElement;
      return (
        Array.from(host.querySelectorAll<HTMLElement>('[id]')).find((el) => el.id === id) ?? null
      );
    }

    describe('Generated ids', () => {
      it('should derive labelId, listboxId and searchInputId from inputId', () => {
        createComponent();
        expect(component.labelId).toBe(`${component.inputId}-label`);
        expect(component.listboxId).toBe(`${component.inputId}-listbox`);
        expect(component.searchInputId).toBe(`${component.inputId}-search`);
      });

      it('should generate unique ids per instance', () => {
        createComponent();
        const first = component.inputId;
        const second = TestBed.createComponent(SelectComponent);
        second.componentRef.setInput('options', SIMPLE_OPTIONS);
        second.detectChanges();
        expect(second.componentInstance.inputId).not.toBe(first);
      });

      it('should build option ids from the inputId and index', () => {
        createComponent();
        expect(component.getOptionId(2)).toBe(`${component.inputId}-option-2`);
      });
    });

    describe('Label association', () => {
      it('should not render a label[for] pointing at a non-labelable element', () => {
        createComponent((f) => f.componentRef.setInput('label', 'Country'));
        fixture.detectChanges();
        const labelWithFor = fixture.nativeElement.querySelector('label[for]');
        expect(labelWithFor).toBeNull();
      });

      it('should render the visible label with the generated labelId', () => {
        createComponent((f) => f.componentRef.setInput('label', 'Country'));
        fixture.detectChanges();
        const label = fixture.nativeElement.querySelector('.nui-select__label');
        expect(label.id).toBe(component.labelId);
      });

      it('should point aria-labelledby at the visible label when a label is provided', () => {
        createComponent((f) => f.componentRef.setInput('label', 'Country'));
        fixture.detectChanges();
        expect(trigger().getAttribute('aria-labelledby')).toBe(component.labelId);
      });

      it('should resolve aria-labelledby to an element that exists in the DOM', () => {
        createComponent((f) => f.componentRef.setInput('label', 'Country'));
        fixture.detectChanges();
        const id = trigger().getAttribute('aria-labelledby')!;
        const referenced = findById(id);
        expect(referenced).toBeTruthy();
        expect(referenced!.textContent!.trim()).toBe('Country');
      });

      it('should fall back to aria-label with the placeholder when no label is provided', () => {
        createComponent((f) => f.componentRef.setInput('placeholder', 'Pick a country'));
        fixture.detectChanges();
        expect(trigger().getAttribute('aria-labelledby')).toBeNull();
        expect(trigger().getAttribute('aria-label')).toBe('Pick a country');
      });

      it('should not set aria-label when a visible label is present', () => {
        createComponent((f) => f.componentRef.setInput('label', 'Country'));
        fixture.detectChanges();
        expect(trigger().getAttribute('aria-label')).toBeNull();
      });
    });

    describe('Trigger combobox semantics', () => {
      it('should expose role="combobox" on the trigger', () => {
        createComponent();
        expect(trigger().getAttribute('role')).toBe('combobox');
      });

      it('should carry the inputId on the trigger', () => {
        createComponent();
        expect(trigger().id).toBe(component.inputId);
      });

      it('should expose aria-haspopup="listbox"', () => {
        createComponent();
        expect(trigger().getAttribute('aria-haspopup')).toBe('listbox');
      });

      it('should report aria-expanded="false" when closed', () => {
        createComponent();
        expect(trigger().getAttribute('aria-expanded')).toBe('false');
      });

      it('should report aria-expanded="true" when open', () => {
        createOpenInline();
        expect(trigger().getAttribute('aria-expanded')).toBe('true');
      });

      it('should reference the popup via aria-controls', () => {
        createComponent();
        expect(trigger().getAttribute('aria-controls')).toBe(component.listboxId);
      });

      it('should expose aria-disabled and remove it from the tab order when disabled', () => {
        createComponent((f) => f.componentRef.setInput('disabled', true));
        fixture.detectChanges();
        expect(trigger().getAttribute('aria-disabled')).toBe('true');
        expect(trigger().getAttribute('tabindex')).toBe('-1');
      });

      it('should be focusable when enabled', () => {
        createComponent();
        expect(trigger().getAttribute('tabindex')).toBe('0');
      });
    });

    describe('Listbox popup semantics', () => {
      it('should expose role="listbox" on the options container', () => {
        createOpenInline();
        const listbox = fixture.nativeElement.querySelector('.nui-select__options');
        expect(listbox.getAttribute('role')).toBe('listbox');
      });

      it('should give the listbox the id referenced by aria-controls', () => {
        createOpenInline();
        const listbox = fixture.nativeElement.querySelector('.nui-select__options');
        expect(listbox.id).toBe(trigger().getAttribute('aria-controls'));
      });

      it('should set aria-multiselectable in multiple mode', () => {
        createOpenInline((f) => f.componentRef.setInput('multiple', true));
        const listbox = fixture.nativeElement.querySelector('.nui-select__options');
        expect(listbox.getAttribute('aria-multiselectable')).toBe('true');
      });

      it('should not set aria-multiselectable in single mode', () => {
        createOpenInline();
        const listbox = fixture.nativeElement.querySelector('.nui-select__options');
        expect(listbox.getAttribute('aria-multiselectable')).toBeNull();
      });

      it('should give each option a unique id matching getOptionId', () => {
        createOpenInline();
        const options = fixture.nativeElement.querySelectorAll('.nui-select__option');
        options.forEach((opt: HTMLElement, i: number) => {
          expect(opt.id).toBe(component.getOptionId(i));
        });
      });

      it('should not make options focusable (focus stays on the combobox)', () => {
        createOpenInline();
        const options = fixture.nativeElement.querySelectorAll('.nui-select__option');
        options.forEach((opt: HTMLElement) => {
          expect(opt.getAttribute('tabindex')).toBeNull();
        });
      });

      it('should mark the selected option with aria-selected="true"', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        component.writeValue('Beta');
        component.toggleDropdown();
        fixture.detectChanges();
        const options = fixture.nativeElement.querySelectorAll('.nui-select__option');
        expect(options[1].getAttribute('aria-selected')).toBe('true');
        expect(options[0].getAttribute('aria-selected')).toBe('false');
      });
    });

    describe('Search input identity', () => {
      it('should give the search input an id and a name', () => {
        createOpenInline((f) => f.componentRef.setInput('searchable', true));
        const input = fixture.nativeElement.querySelector('.nui-select__search-input');
        expect(input.id).toBe(component.searchInputId);
        expect(input.getAttribute('name')).toBe(component.searchInputId);
      });

      it('should give the search input an accessible name', () => {
        createOpenInline((f) => f.componentRef.setInput('searchable', true));
        const input = fixture.nativeElement.querySelector('.nui-select__search-input');
        expect(input.getAttribute('aria-label')).toBe('Search options');
      });

      it('should disable browser autocomplete on the search input', () => {
        createOpenInline((f) => f.componentRef.setInput('searchable', true));
        const input = fixture.nativeElement.querySelector('.nui-select__search-input');
        expect(input.getAttribute('autocomplete')).toBe('off');
      });
    });

    describe('aria-activedescendant', () => {
      it('should be null while the dropdown is closed', () => {
        createComponent();
        expect(component.activeDescendantId()).toBeNull();
        expect(trigger().getAttribute('aria-activedescendant')).toBeNull();
      });

      it('should point at the first option when opened with no selection', () => {
        createOpenInline();
        expect(component.activeIndex()).toBe(0);
        expect(trigger().getAttribute('aria-activedescendant')).toBe(component.getOptionId(0));
      });

      it('should point at the selected option when opened with a selection', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        component.writeValue('Gamma');
        component.toggleDropdown();
        fixture.detectChanges();
        expect(component.activeIndex()).toBe(2);
        expect(trigger().getAttribute('aria-activedescendant')).toBe(component.getOptionId(2));
      });

      it('should reference an element that actually exists in the DOM', () => {
        createOpenInline();
        const id = trigger().getAttribute('aria-activedescendant')!;
        expect(findById(id)).toBeTruthy();
      });

      it('should reset when the dropdown closes', () => {
        createOpenInline();
        component.close();
        fixture.detectChanges();
        expect(component.activeIndex()).toBe(-1);
        expect(component.activeDescendantId()).toBeNull();
      });

      it('should be null when the filtered list is empty', () => {
        createOpenInline();
        component.searchTerm.set('zzz');
        component.activeIndex.set(-1);
        fixture.detectChanges();
        expect(component.activeDescendantId()).toBeNull();
      });

      it('should apply the active class to the active option', () => {
        createOpenInline();
        const options = fixture.nativeElement.querySelectorAll('.nui-select__option');
        expect(options[0].classList).toContain('nui-select__option--active');
        expect(options[1].classList).not.toContain('nui-select__option--active');
      });
    });

    describe('Keyboard navigation (APG combobox)', () => {
      function press(key: string): KeyboardEvent {
        const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
        trigger().dispatchEvent(event);
        fixture.detectChanges();
        return event;
      }

      it('should open the dropdown on ArrowDown when closed', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        press('ArrowDown');
        expect(component.isOpen()).toBe(true);
      });

      it('should open the dropdown on ArrowUp when closed', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        press('ArrowUp');
        expect(component.isOpen()).toBe(true);
      });

      it('should move the active option down with ArrowDown', () => {
        createOpenInline();
        expect(component.activeIndex()).toBe(0);
        press('ArrowDown');
        expect(component.activeIndex()).toBe(1);
      });

      it('should move the active option up with ArrowUp', () => {
        createOpenInline();
        press('ArrowDown');
        press('ArrowUp');
        expect(component.activeIndex()).toBe(0);
      });

      it('should wrap from the last option to the first with ArrowDown', () => {
        createOpenInline();
        component.activeIndex.set(SIMPLE_OPTIONS.length - 1);
        press('ArrowDown');
        expect(component.activeIndex()).toBe(0);
      });

      it('should wrap from the first option to the last with ArrowUp', () => {
        createOpenInline();
        component.activeIndex.set(0);
        press('ArrowUp');
        expect(component.activeIndex()).toBe(SIMPLE_OPTIONS.length - 1);
      });

      it('should jump to the first option with Home', () => {
        createOpenInline();
        component.activeIndex.set(2);
        press('Home');
        expect(component.activeIndex()).toBe(0);
      });

      it('should jump to the last option with End', () => {
        createOpenInline();
        press('End');
        expect(component.activeIndex()).toBe(SIMPLE_OPTIONS.length - 1);
      });

      it('should select the active option with Enter and close', () => {
        createOpenInline();
        press('ArrowDown'); // → Beta
        press('Enter');
        expect(component.value()).toBe('Beta');
        expect(component.isOpen()).toBe(false);
      });

      it('should select the active option with Space and close', () => {
        createOpenInline();
        press(' ');
        expect(component.value()).toBe('Alpha');
        expect(component.isOpen()).toBe(false);
      });

      it('should open on Enter when closed', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        press('Enter');
        expect(component.isOpen()).toBe(true);
      });

      it('should open on Space when closed', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        press(' ');
        expect(component.isOpen()).toBe(true);
      });

      it('should close on Escape without changing the value', () => {
        createOpenInline();
        press('Escape');
        expect(component.isOpen()).toBe(false);
        expect(component.value()).toBeNull();
      });

      it('should close on Tab and let focus move naturally', () => {
        createOpenInline();
        const event = press('Tab');
        expect(component.isOpen()).toBe(false);
        expect(event.defaultPrevented).toBe(false);
      });

      it('should preventDefault on ArrowDown so the page does not scroll', () => {
        createOpenInline();
        const event = press('ArrowDown');
        expect(event.defaultPrevented).toBe(true);
      });

      it('should do nothing when disabled', () => {
        createComponent((f) => {
          f.componentRef.setInput('appendToBody', false);
          f.componentRef.setInput('disabled', true);
        });
        fixture.detectChanges();
        press('ArrowDown');
        expect(component.isOpen()).toBe(false);
      });

      it('should not select anything with Enter when the filtered list is empty', () => {
        createOpenInline();
        component.searchTerm.set('zzz');
        component.activeIndex.set(-1);
        fixture.detectChanges();
        press('Enter');
        expect(component.value()).toBeNull();
      });

      it('should keep the dropdown open after Enter in multiple mode', () => {
        createOpenInline((f) => f.componentRef.setInput('multiple', true));
        press('Enter');
        expect(component.value()).toEqual(['Alpha']);
        expect(component.isOpen()).toBe(true);
      });
    });

    /*
     * The combobox role and aria-activedescendant MUST live on whichever element holds DOM
     * focus, because aria-activedescendant is only honoured on the focused element. Opening a
     * searchable select auto-focuses the search input, so the roles swap between modes.
     */
    describe('Combobox follows DOM focus', () => {
      function searchInput(): HTMLInputElement {
        return fixture.nativeElement.querySelector('.nui-select__search-input');
      }

      describe('searchable = false (APG select-only)', () => {
        it('should keep role="combobox" on the trigger when open', () => {
          createOpenInline();
          expect(trigger().getAttribute('role')).toBe('combobox');
        });

        it('should keep aria-activedescendant on the trigger', () => {
          createOpenInline();
          expect(trigger().getAttribute('aria-activedescendant')).toBe(component.getOptionId(0));
        });

        it('should report the trigger as the combobox element', () => {
          createOpenInline();
          expect(component.searchIsCombobox()).toBe(false);
        });

        it('should render no search input to compete for focus', () => {
          createOpenInline();
          expect(searchInput()).toBeNull();
        });
      });

      describe('searchable = true (APG editable / autocomplete-list)', () => {
        it('should move role="combobox" onto the search input while open', () => {
          createOpenInline((f) => f.componentRef.setInput('searchable', true));
          expect(searchInput().getAttribute('role')).toBe('combobox');
        });

        it('should put aria-activedescendant on the search input, not the trigger', () => {
          createOpenInline((f) => f.componentRef.setInput('searchable', true));
          expect(searchInput().getAttribute('aria-activedescendant')).toBe(
            component.getOptionId(0)
          );
          expect(trigger().getAttribute('aria-activedescendant')).toBeNull();
        });

        it('should demote the trigger so there is exactly one combobox', () => {
          createOpenInline((f) => f.componentRef.setInput('searchable', true));
          expect(trigger().getAttribute('role')).not.toBe('combobox');
          const comboboxes = fixture.nativeElement.querySelectorAll('[role="combobox"]');
          expect(comboboxes.length).toBe(1);
          expect(comboboxes[0]).toBe(searchInput());
        });

        it('should expose aria-expanded and aria-controls on the search input', () => {
          createOpenInline((f) => f.componentRef.setInput('searchable', true));
          expect(searchInput().getAttribute('aria-expanded')).toBe('true');
          expect(searchInput().getAttribute('aria-controls')).toBe(component.listboxId);
        });

        it('should expose aria-autocomplete="list" on the search input', () => {
          createOpenInline((f) => f.componentRef.setInput('searchable', true));
          expect(searchInput().getAttribute('aria-autocomplete')).toBe('list');
        });

        it('should name the search combobox from the visible label', () => {
          createOpenInline((f) => {
            f.componentRef.setInput('searchable', true);
            f.componentRef.setInput('label', 'Country');
          });
          expect(searchInput().getAttribute('aria-labelledby')).toBe(component.labelId);
          expect(findById(component.labelId)!.textContent!.trim()).toBe('Country');
        });

        it('should fall back to aria-label when there is no visible label', () => {
          createOpenInline((f) => f.componentRef.setInput('searchable', true));
          expect(searchInput().getAttribute('aria-labelledby')).toBeNull();
          expect(searchInput().getAttribute('aria-label')).toBe('Search options');
        });

        it('should keep aria-activedescendant on the search input as it moves', () => {
          createOpenInline((f) => f.componentRef.setInput('searchable', true));
          searchInput().dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
          );
          fixture.detectChanges();
          expect(component.activeIndex()).toBe(1);
          expect(searchInput().getAttribute('aria-activedescendant')).toBe(
            component.getOptionId(1)
          );
          expect(trigger().getAttribute('aria-activedescendant')).toBeNull();
        });

        it('should return the combobox role to the trigger once closed', () => {
          createOpenInline((f) => f.componentRef.setInput('searchable', true));
          component.close();
          fixture.detectChanges();
          expect(component.searchIsCombobox()).toBe(false);
          expect(trigger().getAttribute('role')).toBe('combobox');
        });
      });

      /*
       * The assertion that actually binds focus to the ARIA: it is not enough that the role
       * and aria-activedescendant exist somewhere — they must be on the element that holds
       * DOM focus, because assistive tech only reads aria-activedescendant from there.
       * These attach the fixture to the document so focus() genuinely takes effect.
       */
      describe('INVARIANT: document.activeElement carries role and aria-activedescendant', () => {
        /** Attaches the fixture to the document so focus actually lands on elements. */
        function createAttachedOpen(searchable: boolean): void {
          fixture = TestBed.createComponent(SelectComponent);
          component = fixture.componentInstance;
          fixture.componentRef.setInput('options', SIMPLE_OPTIONS);
          fixture.componentRef.setInput('appendToBody', false);
          fixture.componentRef.setInput('searchable', searchable);
          document.body.appendChild(fixture.nativeElement);
          fixture.detectChanges();
          trigger().focus();
          component.toggleDropdown();
          fixture.detectChanges();
        }

        function detachFixture(): void {
          fixture.nativeElement.remove();
        }

        it('should hold in non-searchable mode: focused element is the combobox', () => {
          createAttachedOpen(false);
          const focused = document.activeElement as HTMLElement;
          expect(focused).toBe(trigger());
          expect(focused.getAttribute('role')).toBe('combobox');
          expect(focused.getAttribute('aria-activedescendant')).toBe(component.getOptionId(0));
          detachFixture();
        });

        it('should hold in searchable mode: focused search input is the combobox', async () => {
          createAttachedOpen(true);
          // The component auto-focuses the search input inside a setTimeout.
          await new Promise((resolve) => setTimeout(resolve));
          fixture.detectChanges();

          const focused = document.activeElement as HTMLElement;
          const searchEl = fixture.nativeElement.querySelector('.nui-select__search-input');

          // Guard: the premise of this test is that focus really moved to the search input.
          expect(focused).toBe(searchEl);
          expect(focused.getAttribute('role')).toBe('combobox');
          expect(focused.getAttribute('aria-activedescendant')).toBe(component.getOptionId(0));
          // ...and the unfocused trigger must NOT claim the role or the attribute.
          expect(trigger().getAttribute('aria-activedescendant')).toBeNull();
          expect(trigger().getAttribute('role')).not.toBe('combobox');
          detachFixture();
        });

        it('should keep the invariant while arrowing in searchable mode', async () => {
          createAttachedOpen(true);
          await new Promise((resolve) => setTimeout(resolve));
          fixture.detectChanges();

          (document.activeElement as HTMLElement).dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
          );
          fixture.detectChanges();

          const focused = document.activeElement as HTMLElement;
          expect(focused.getAttribute('role')).toBe('combobox');
          expect(focused.getAttribute('aria-activedescendant')).toBe(component.getOptionId(1));
          detachFixture();
        });

        it('should never leave aria-activedescendant on an unfocused element', async () => {
          for (const searchable of [false, true]) {
            createAttachedOpen(searchable);
            await new Promise((resolve) => setTimeout(resolve));
            fixture.detectChanges();

            const offenders = [
              ...fixture.nativeElement.querySelectorAll('[aria-activedescendant]'),
            ].filter((el: Element) => el !== document.activeElement);
            expect(offenders).toEqual([]);
            detachFixture();
          }
        });
      });
    });

    describe('Search keyboard delegation', () => {
      function pressOnSearch(key: string): void {
        const input = fixture.nativeElement.querySelector(
          '.nui-select__search-input'
        ) as HTMLElement;
        input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
        fixture.detectChanges();
      }

      it('should move the active option with ArrowDown from the search input', () => {
        createOpenInline((f) => f.componentRef.setInput('searchable', true));
        expect(component.activeIndex()).toBe(0);
        pressOnSearch('ArrowDown');
        expect(component.activeIndex()).toBe(1);
      });

      it('should select the active option with Enter from the search input', () => {
        createOpenInline((f) => f.componentRef.setInput('searchable', true));
        pressOnSearch('Enter');
        expect(component.value()).toBe('Alpha');
      });

      it('should close on Escape from the search input', () => {
        createOpenInline((f) => f.componentRef.setInput('searchable', true));
        pressOnSearch('Escape');
        expect(component.isOpen()).toBe(false);
      });

      it('should not treat Space as a selection so it can be typed', () => {
        createOpenInline((f) => f.componentRef.setInput('searchable', true));
        pressOnSearch(' ');
        expect(component.value()).toBeNull();
        expect(component.isOpen()).toBe(true);
      });

      it('should leave Home/End to the input so they move the caret, not the option list', () => {
        createOpenInline((f) => f.componentRef.setInput('searchable', true));
        component.activeIndex.set(1);
        pressOnSearch('End');
        expect(component.activeIndex()).toBe(1);
        pressOnSearch('Home');
        expect(component.activeIndex()).toBe(1);
      });

      it('should re-anchor the active option to the first result when searching', () => {
        createOpenInline((f) => f.componentRef.setInput('searchable', true));
        component.activeIndex.set(2);
        const input = document.createElement('input');
        input.value = 'bet';
        const event = new Event('input');
        Object.defineProperty(event, 'target', { value: input });
        component.onSearch(event);
        expect(component.activeIndex()).toBe(0);
        expect(component.activeDescendantId()).toBe(component.getOptionId(0));
      });

      it('should clear the active option when a search yields no results', () => {
        createOpenInline((f) => f.componentRef.setInput('searchable', true));
        const input = document.createElement('input');
        input.value = 'zzz';
        const event = new Event('input');
        Object.defineProperty(event, 'target', { value: input });
        component.onSearch(event);
        expect(component.activeIndex()).toBe(-1);
        expect(component.activeDescendantId()).toBeNull();
      });
    });

    /*
     * APG select-only combobox: Enter / Escape / option click "Closes the listbox. Sets visual
     * focus on the combobox." In searchable mode the focused search input is removed on close,
     * so without restoring focus it would fall to <body>.
     */
    describe('Focus return on close', () => {
      /** Attaches the fixture so focus() takes effect, opens it and waits for the auto-focus. */
      async function createAttachedOpen(
        extraSetup?: (f: ComponentFixture<SelectComponent>) => void
      ): Promise<void> {
        fixture = TestBed.createComponent(SelectComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('options', SIMPLE_OPTIONS);
        fixture.componentRef.setInput('appendToBody', false);
        fixture.componentRef.setInput('searchable', true);
        if (extraSetup) extraSetup(fixture);
        document.body.appendChild(fixture.nativeElement);
        fixture.detectChanges();
        trigger().focus();
        component.toggleDropdown();
        fixture.detectChanges();
        await new Promise((resolve) => setTimeout(resolve));
        fixture.detectChanges();
      }

      function pressOnFocused(key: string): void {
        (document.activeElement as HTMLElement).dispatchEvent(
          new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
        );
        fixture.detectChanges();
      }

      function searchEl(): HTMLElement | null {
        return fixture.nativeElement.querySelector('.nui-select__search-input');
      }

      afterEach(() => fixture.nativeElement.remove());

      it('should return focus to the trigger after selecting with Enter from the search input', async () => {
        await createAttachedOpen();
        expect(document.activeElement).toBe(searchEl());
        pressOnFocused('Enter');
        expect(component.value()).toBe('Alpha');
        expect(searchEl()).toBeNull();
        expect(document.activeElement).toBe(trigger());
      });

      it('should return focus to the trigger after Escape from the search input', async () => {
        await createAttachedOpen();
        pressOnFocused('Escape');
        expect(component.isOpen()).toBe(false);
        expect(document.activeElement).toBe(trigger());
      });

      it('should return focus to the trigger before Tab moves on from the search input', async () => {
        await createAttachedOpen();
        pressOnFocused('Tab');
        expect(component.isOpen()).toBe(false);
        expect(document.activeElement).toBe(trigger());
      });

      it('should return focus to the trigger after a mouse click selects an option', async () => {
        await createAttachedOpen();
        const option = fixture.nativeElement.querySelector('.nui-select__option') as HTMLElement;
        option.click();
        fixture.detectChanges();
        expect(document.activeElement).toBe(trigger());
      });

      it('should not move focus when closed by an outside click', async () => {
        await createAttachedOpen();
        const outside = document.createElement('button');
        document.body.appendChild(outside);
        outside.focus();
        const event = new MouseEvent('click');
        Object.defineProperty(event, 'target', { value: outside });
        component.onClickOutside(event);
        fixture.detectChanges();
        expect(component.isOpen()).toBe(false);
        expect(document.activeElement).toBe(outside);
        outside.remove();
      });

      it('should prevent option mousedown so the combobox keeps DOM focus', async () => {
        await createAttachedOpen((f) => f.componentRef.setInput('multiple', true));
        const option = fixture.nativeElement.querySelector('.nui-select__option') as HTMLElement;
        const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
        option.dispatchEvent(mousedown);
        expect(mousedown.defaultPrevented).toBe(true);
      });
    });
  });

  // ─── Edge Cases ───────────────────────────────────────────────────────────

  describe('Edge Cases', () => {
    it('should handle empty options array gracefully', () => {
      createComponent((f) => f.componentRef.setInput('options', []));
      expect(component.filteredOptions()).toEqual([]);
      expect(component.selectedItems()).toEqual([]);
      expect(component.hasValue()).toBe(false);
    });

    it('should not throw when options change after initialization', () => {
      createComponent();
      expect(() => {
        fixture.componentRef.setInput('options', OBJECT_OPTIONS);
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should not throw when calling close repeatedly', () => {
      createComponent();
      expect(() => {
        component.close();
        component.close();
        component.close();
      }).not.toThrow();
    });

    it('should return true from hasValue when value is set to empty string (not null/undefined)', () => {
      // hasValue only checks for null/undefined; empty string is still considered a value
      createComponent();
      component.writeValue('');
      expect(component.hasValue()).toBe(true);
    });

    it('should handle getLabel on number option without bindLabel', () => {
      createComponent((f) => f.componentRef.setInput('options', [1, 2, 3]));
      expect(component.getLabel(1)).toBe('1');
    });

    it('should compute triggerWidth as null initially', () => {
      createComponent();
      expect(component.triggerWidth()).toBeNull();
    });
  });
});
