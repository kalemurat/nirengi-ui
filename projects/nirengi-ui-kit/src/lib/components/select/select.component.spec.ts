import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, ViewEncapsulation } from '@angular/core';
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
    const def = (SelectComponent as unknown as { ɵcmp: { encapsulation: ViewEncapsulation } }).ɵcmp;
    expect(def.encapsulation).not.toBe(ViewEncapsulation.None);
    expect(def.encapsulation).toBe(ViewEncapsulation.Emulated);
  });

  it('should scope rendered host styling via emulated encapsulation attributes', () => {
    createComponent();
    const host = fixture.nativeElement as HTMLElement;
    const attrs = host.getAttributeNames();
    expect(attrs.some((a) => a.startsWith('_nghost-'))).toBeTrue();
  });

  // ─── Creation ─────────────────────────────────────────────────────────────

  describe('Creation', () => {
    it('should create with required options input', () => {
      createComponent();
      expect(component).toBeTruthy();
    });

    it('should initialise isOpen to false', () => {
      createComponent();
      expect(component.isOpen()).toBeFalse();
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
      expect(component.isDisabled()).toBeFalse();
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
      expect(component.multiple()).toBeFalse();
    });

    it('should default searchable to false', () => {
      createComponent();
      expect(component.searchable()).toBeFalse();
    });

    it('should default clearable to true', () => {
      createComponent();
      expect(component.clearable()).toBeTrue();
    });

    it('should default appendToBody to true', () => {
      createComponent();
      expect(component.appendToBody()).toBeTrue();
    });

    it('should default disabled to false', () => {
      createComponent();
      expect(component.disabledInput()).toBeFalse();
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
        expect(component.multiple()).toBeTrue();
      });
    });

    describe('searchable', () => {
      it('should enable search mode', () => {
        createComponent((f) => f.componentRef.setInput('searchable', true));
        expect(component.searchable()).toBeTrue();
      });
    });

    describe('clearable', () => {
      it('should disable clear button when false', () => {
        createComponent((f) => f.componentRef.setInput('clearable', false));
        expect(component.clearable()).toBeFalse();
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

      ([
        [Size.XSmall, 'xs'],
        [Size.Small, 'sm'],
        [Size.Medium, 'md'],
        [Size.Large, 'lg'],
        [Size.XLarge, 'xl'],
      ] as [Size, string][]).forEach(([size, cls]) => {
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
        expect(component.isDisabled()).toBeTrue();
      });

      it('should not be disabled by default', () => {
        createComponent();
        expect(component.isDisabled()).toBeFalse();
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
        expect(component.appendToBody()).toBeTrue();
      });

      it('should accept false', () => {
        createComponent((f) => f.componentRef.setInput('appendToBody', false));
        expect(component.appendToBody()).toBeFalse();
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
        const opts = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
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
        expect(component.hasValue()).toBeFalse();
      });

      it('should return true for a primitive value', () => {
        createComponent();
        component.writeValue('Alpha');
        expect(component.hasValue()).toBeTrue();
      });

      it('should return false for empty array in multiple mode', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.writeValue([]);
        expect(component.hasValue()).toBeFalse();
      });

      it('should return true for non-empty array in multiple mode', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.writeValue(['Alpha']);
        expect(component.hasValue()).toBeTrue();
      });

      it('should return false when value is undefined', () => {
        createComponent();
        component.value.set(undefined as any);
        expect(component.hasValue()).toBeFalse();
      });
    });

    describe('itemTemplate', () => {
      it('should be null when no template is provided', () => {
        createComponent();
        expect(component.itemTemplate()).toBeNull();
      });
    });
  });

  // ─── Methods ──────────────────────────────────────────────────────────────

  describe('Methods', () => {
    describe('toggleDropdown', () => {
      it('should open dropdown when closed', () => {
        createComponent();
        expect(component.isOpen()).toBeFalse();
        component.toggleDropdown();
        expect(component.isOpen()).toBeTrue();
      });

      it('should close dropdown when open', () => {
        createComponent();
        component.toggleDropdown();
        expect(component.isOpen()).toBeTrue();
        component.toggleDropdown();
        expect(component.isOpen()).toBeFalse();
      });

      it('should do nothing when disabled', () => {
        createComponent((f) => f.componentRef.setInput('disabled', true));
        fixture.detectChanges();
        component.toggleDropdown();
        expect(component.isOpen()).toBeFalse();
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
        const touchedSpy = jasmine.createSpy('onTouched');
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
        expect(component.isOpen()).toBeTrue();
      });
    });

    describe('close', () => {
      it('should set isOpen to false', () => {
        createComponent();
        component.isOpen.set(true);
        component.close();
        expect(component.isOpen()).toBeFalse();
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
        const spy = jasmine.createSpy('onTouched');
        component.registerOnTouched(spy);
        component.isOpen.set(true);
        component.close();
        expect(spy).toHaveBeenCalled();
      });

      it('should do nothing when already closed', () => {
        createComponent();
        const spy = jasmine.createSpy('onTouched');
        component.registerOnTouched(spy);
        component.close(); // already closed
        expect(spy).not.toHaveBeenCalled();
        expect(component.isOpen()).toBeFalse();
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
        expect(component.isOpen()).toBeFalse();
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
        const spy = jasmine.createSpy('onChange');
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
        expect(component.isOpen()).toBeTrue();
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
        spyOn(fakeEvent, 'stopPropagation');
        component.removeItem('Alpha', fakeEvent);
        expect(component.value()).toEqual(['Beta']);
        expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      });

      it('should stop propagation', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.writeValue(['Alpha']);
        const fakeEvent = new MouseEvent('click');
        spyOn(fakeEvent, 'stopPropagation');
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
        spyOn(fakeEvent, 'stopPropagation');
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
        spyOn(fakeEvent, 'stopPropagation');
        component.removeItem({ id: 2, name: 'Bob' }, fakeEvent);
        expect(component.value()).toEqual([1, 3]);
      });
    });

    describe('clearValue', () => {
      it('should set value to null in single mode', () => {
        createComponent();
        component.writeValue('Alpha');
        const fakeEvent = new MouseEvent('click');
        spyOn(fakeEvent, 'stopPropagation');
        component.clearValue(fakeEvent);
        expect(component.value()).toBeNull();
      });

      it('should set value to empty array in multiple mode', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.writeValue(['Alpha', 'Beta']);
        const fakeEvent = new MouseEvent('click');
        spyOn(fakeEvent, 'stopPropagation');
        component.clearValue(fakeEvent);
        expect(component.value()).toEqual([]);
      });

      it('should stop propagation', () => {
        createComponent();
        component.writeValue('Alpha');
        const fakeEvent = new MouseEvent('click');
        spyOn(fakeEvent, 'stopPropagation');
        component.clearValue(fakeEvent);
        expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      });

      it('should do nothing when disabled', () => {
        createComponent((f) => f.componentRef.setInput('disabled', true));
        fixture.detectChanges();
        component.writeValue('Alpha');
        const fakeEvent = new MouseEvent('click');
        spyOn(fakeEvent, 'stopPropagation');
        component.clearValue(fakeEvent);
        // updateValue respects isDisabled, but stopPropagation still called
        expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      });

      it('should fire onChange with null after clearing single', () => {
        createComponent();
        const spy = jasmine.createSpy('onChange');
        component.registerOnChange(spy);
        component.writeValue('Alpha');
        const fakeEvent = new MouseEvent('click');
        spyOn(fakeEvent, 'stopPropagation');
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
        expect(component.isSelected('Alpha')).toBeFalse();
      });

      it('should return true when value matches in single mode', () => {
        createComponent();
        component.writeValue('Alpha');
        expect(component.isSelected('Alpha')).toBeTrue();
      });

      it('should return false when value does not match in single mode', () => {
        createComponent();
        component.writeValue('Alpha');
        expect(component.isSelected('Beta')).toBeFalse();
      });

      it('should return true when option in array (multiple mode)', () => {
        createComponent((f) => {
          f.componentRef.setInput('multiple', true);
          f.componentRef.setInput('options', OBJECT_OPTIONS);
          f.componentRef.setInput('bindValue', 'id');
        });
        component.writeValue([1, 3]);
        expect(component.isSelected({ id: 1, name: 'Alice' })).toBeTrue();
        expect(component.isSelected({ id: 2, name: 'Bob' })).toBeFalse();
      });

      it('should return false in multiple mode when value is not array', () => {
        createComponent((f) => f.componentRef.setInput('multiple', true));
        component.value.set('Alpha' as any);
        expect(component.isSelected('Alpha')).toBeFalse();
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
        const spy = jasmine.createSpy('onChange');
        component.registerOnChange(spy);
        component.selectOption('Alpha');
        expect(spy).toHaveBeenCalledWith('Alpha');
      });
    });

    describe('registerOnTouched', () => {
      it('should register the onTouched callback', () => {
        createComponent();
        const spy = jasmine.createSpy('onTouched');
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
        expect(component.isDisabled()).toBeTrue();
      });

      it('should set isDisabled back to false', () => {
        createComponent();
        component.setDisabledState(true);
        component.setDisabledState(false);
        expect(component.isDisabled()).toBeFalse();
      });
    });

    describe('updateValue', () => {
      it('should update value and fire onChange', () => {
        createComponent();
        const spy = jasmine.createSpy('onChange');
        component.registerOnChange(spy);
        component.updateValue('Gamma');
        expect(component.value()).toBe('Gamma');
        expect(spy).toHaveBeenCalledWith('Gamma');
      });

      it('should not update when disabled', () => {
        createComponent();
        component.setDisabledState(true);
        const spy = jasmine.createSpy('onChange');
        component.registerOnChange(spy);
        component.updateValue('Alpha');
        expect(component.value()).toBeNull();
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('markAsTouched', () => {
      it('should call onTouched when not disabled', () => {
        createComponent();
        const spy = jasmine.createSpy('onTouched');
        component.registerOnTouched(spy);
        component.markAsTouched();
        expect(spy).toHaveBeenCalled();
      });

      it('should not call onTouched when disabled', () => {
        createComponent();
        component.setDisabledState(true);
        const spy = jasmine.createSpy('onTouched');
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
        expect(component.isOpen()).toBeFalse();
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
        expect(component.isOpen()).toBeTrue();
      });
    });

    describe('Trigger keyboard events', () => {
      it('should open/close on Enter key on trigger', () => {
        createComponent();
        const trigger = fixture.nativeElement.querySelector('.nui-select__trigger') as HTMLElement;
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        fixture.detectChanges();
        expect(component.isOpen()).toBeTrue();

        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        fixture.detectChanges();
        expect(component.isOpen()).toBeFalse();
      });

      it('should open/close on Space key on trigger', () => {
        createComponent();
        const trigger = fixture.nativeElement.querySelector('.nui-select__trigger') as HTMLElement;
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
        fixture.detectChanges();
        expect(component.isOpen()).toBeTrue();
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
      expect(component.isOpen()).toBeFalse();
    });

    it('should sync disabledInput with isDisabled via effect', () => {
      createComponent();
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.isDisabled()).toBeTrue();
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
        expect(component.isOpen()).toBeTrue();
      });
    });
  });

  // ─── Edge Cases ───────────────────────────────────────────────────────────

  describe('Edge Cases', () => {
    it('should handle empty options array gracefully', () => {
      createComponent((f) => f.componentRef.setInput('options', []));
      expect(component.filteredOptions()).toEqual([]);
      expect(component.selectedItems()).toEqual([]);
      expect(component.hasValue()).toBeFalse();
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
      expect(component.hasValue()).toBeTrue();
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
