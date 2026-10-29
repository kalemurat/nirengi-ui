import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { DatepickerComponent, DateValues } from './datepicker.component';
import { DATEPICKER_INTL, DEFAULT_DATEPICKER_INTL } from './datepicker-intl.token';

describe('datepicker.component.ts', () => {
  let fixture: ComponentFixture<DatepickerComponent>;
  let component: DatepickerComponent;

  async function createComponent(inputs: Record<string, unknown> = {}): Promise<void> {
    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    fixture.detectChanges();
    await fixture.whenStable();
  }

  async function render(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function inputEl(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  function toggleButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.datepicker__icon-wrapper');
  }

  function dayButtons(): HTMLButtonElement[] {
    return Array.from(document.querySelectorAll<HTMLButtonElement>('.datepicker__day'));
  }

  function dayButton(label: string): HTMLButtonElement {
    return dayButtons().find((b) => b.getAttribute('aria-label') === label)!;
  }

  function typeAndCommit(text: string, how: 'enter' | 'blur' = 'blur'): void {
    const input = inputEl();
    input.value = text;
    if (how === 'enter') {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    } else {
      input.dispatchEvent(new Event('blur'));
    }
  }

  function gridKey(key: string, shiftKey = false): void {
    document
      .querySelector('.datepicker__day[tabindex="0"]')!
      .dispatchEvent(
        new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true })
      );
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  describe('Typed entry', () => {
    it('should accept a typed dd.MM.yyyy date on blur and report it', async () => {
      await createComponent();
      const onChange = vi.fn();
      const emitted: DateValues[] = [];
      component.registerOnChange(onChange);
      component.dateChange.subscribe((d) => emitted.push(d));

      typeAndCommit('29.10.2026');

      const value = component.value() as Date;
      expect(value.getFullYear()).toBe(2026);
      expect(value.getMonth()).toBe(9);
      expect(value.getDate()).toBe(29);
      expect(onChange).toHaveBeenCalledWith(value);
      expect(emitted).toEqual([value]);
    });

    it('should normalise lenient input to the display format', async () => {
      await createComponent();
      typeAndCommit('1.2.2026', 'enter');
      await render();
      expect(inputEl().value).toBe('01.02.2026');
    });

    it('should revert unparseable text and keep the previous value', async () => {
      await createComponent();
      component.writeValue(new Date(2026, 0, 15));
      await render();

      typeAndCommit('31.02.2026');
      expect((component.value() as Date).getDate()).toBe(15);
      expect(inputEl().value).toBe('15.01.2026');

      typeAndCommit('01.01.26');
      expect((component.value() as Date).getDate()).toBe(15);
    });

    it('should clear the value when the text is emptied', async () => {
      await createComponent();
      component.writeValue(new Date(2026, 0, 15));
      await render();
      typeAndCommit('');
      expect(component.value()).toBeNull();
    });

    it('should not touch the value when the text is unchanged', async () => {
      await createComponent();
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      typeAndCommit('');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should parse the time part when withTime is enabled', async () => {
      await createComponent({ withTime: true });
      typeAndCommit('29.10.2026 14:30');
      const value = component.value() as Date;
      expect(value.getHours()).toBe(14);
      expect(value.getMinutes()).toBe(30);
    });

    it('should parse a typed range and order its ends', async () => {
      await createComponent({ selectionMode: 'range' });
      typeAndCommit('10.10.2026 - 01.10.2026');
      const range = component.value() as { start: Date; end: Date };
      expect(range.start.getDate()).toBe(1);
      expect(range.end.getDate()).toBe(10);
      expect(inputEl().value).toBe('01.10.2026 - 10.10.2026');
    });

    it('should accept a typed range start only and reject malformed ranges', async () => {
      await createComponent({ selectionMode: 'range' });
      typeAndCommit('05.10.2026');
      expect(component.value()).toEqual({ start: new Date(2026, 9, 5), end: null });

      for (const text of [
        'x - 01.10.2026',
        '01.10.2026 - x',
        '01.10.2026 - 02.10.2026 - 03.10.2026',
      ]) {
        typeAndCommit(text);
        expect(component.value()).toEqual({ start: new Date(2026, 9, 5), end: null });
      }
    });

    it('should ignore typing while readonly', async () => {
      await createComponent({ readonly: true });
      component.commitTypedValue();
      expect(inputEl().readOnly).toBe(true);
      expect(component.value()).toBeNull();
    });
  });

  describe('Keyboard and focus', () => {
    it('should open from the calendar button and focus the selected day', async () => {
      await createComponent();
      component.writeValue(new Date(2026, 9, 29));
      toggleButton().click();
      await render();

      expect(component.isOpen()).toBe(true);
      expect(toggleButton().getAttribute('aria-expanded')).toBe('true');
      expect(document.activeElement?.getAttribute('aria-label')).toBe('29 Ekim 2026 Perşembe');
    });

    it('should keep focus on the input when opened by clicking it', async () => {
      await createComponent();
      inputEl().focus();
      inputEl().click();
      await render();
      expect(component.isOpen()).toBe(true);
      expect(document.activeElement).toBe(inputEl());
    });

    it('should open on ArrowDown from the input, then focus the grid on a second ArrowDown', async () => {
      await createComponent();
      const arrow = () =>
        inputEl().dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true })
        );
      inputEl().click();
      await render();
      arrow();
      await render();
      expect(document.activeElement?.classList).toContain('datepicker__day');

      component.close();
      await render();
      arrow();
      await render();
      expect(component.isOpen()).toBe(true);
    });

    it('should move the active day with arrows, Home/End and PageUp/PageDown', async () => {
      await createComponent();
      component.writeValue(new Date(2026, 9, 14)); // Wednesday
      component.open(true);
      await render();

      const steps: [string, boolean, Date][] = [
        ['ArrowRight', false, new Date(2026, 9, 15)],
        ['ArrowLeft', false, new Date(2026, 9, 14)],
        ['ArrowDown', false, new Date(2026, 9, 21)],
        ['ArrowUp', false, new Date(2026, 9, 14)],
        ['Home', false, new Date(2026, 9, 12)],
        ['End', false, new Date(2026, 9, 18)],
        ['PageDown', false, new Date(2026, 10, 18)],
        ['PageUp', false, new Date(2026, 9, 18)],
        ['PageDown', true, new Date(2027, 9, 18)],
        ['PageUp', true, new Date(2026, 9, 18)],
      ];
      for (const [key, shift, expected] of steps) {
        gridKey(key, shift);
        await render();
        expect(component.activeDate()).toEqual(expected);
      }
      expect(document.activeElement?.getAttribute('aria-label')).toBe('18 Ekim 2026 Pazar');
    });

    it('should switch the visible month when the active day leaves it', async () => {
      await createComponent();
      component.writeValue(new Date(2026, 9, 31));
      component.open(true);
      await render();
      gridKey('ArrowRight');
      await render();
      expect(component.currentMonthYear()).toBe('Kasım 2026');
      expect(document.activeElement?.getAttribute('aria-label')).toBe('1 Kasım 2026 Pazar');
    });

    it('should ignore unrelated keys in the grid', async () => {
      await createComponent();
      component.open();
      await render();
      const before = component.activeDate();
      gridKey('a');
      expect(component.activeDate()).toBe(before);
    });

    it('should select with a day click, close and return focus to the input', async () => {
      await createComponent();
      const onTouched = vi.fn();
      component.registerOnTouched(onTouched);
      component.writeValue(new Date(2026, 9, 1));
      component.open(true);
      await render();

      dayButton('15 Ekim 2026 Perşembe').click();
      await render();

      expect((component.value() as Date).getDate()).toBe(15);
      expect(component.isOpen()).toBe(false);
      expect(onTouched).toHaveBeenCalled();
      expect(document.activeElement).toBe(inputEl());
    });

    it('should close on Escape via the overlay and return focus to the input', async () => {
      await createComponent();
      component.open(true);
      await render();
      document.body.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true })
      );
      await render();
      expect(component.isOpen()).toBe(false);
      expect(document.activeElement).toBe(inputEl());
    });

    it('should close when Enter commits while open', async () => {
      await createComponent();
      inputEl().click();
      await render();
      typeAndCommit('02.03.2026', 'enter');
      await render();
      expect(component.isOpen()).toBe(false);
      expect((component.value() as Date).getMonth()).toBe(2);
    });

    it('should move the active day along with month navigation buttons', async () => {
      await createComponent();
      component.writeValue(new Date(2026, 9, 14));
      component.open();
      await render();
      component.nextMonth();
      expect(component.activeDate()).toEqual(new Date(2026, 10, 14));
      component.prevMonth();
      component.prevMonth();
      expect(component.activeDate()).toEqual(new Date(2026, 8, 14));
    });

    it('should toggle closed when already open', async () => {
      await createComponent();
      component.toggleOpen();
      component.toggleOpen();
      expect(component.isOpen()).toBe(false);
    });

    it('should not open while disabled', async () => {
      await createComponent({ disabled: true });
      component.open();
      expect(component.isOpen()).toBe(false);
      expect(inputEl().disabled).toBe(true);
    });

    it('should anchor a range calendar on its start date', async () => {
      await createComponent({ selectionMode: 'range' });
      component.writeValue({ start: new Date(2026, 4, 3), end: new Date(2026, 4, 9) });
      component.open();
      expect(component.activeDate()).toEqual(new Date(2026, 4, 3));
    });
  });

  describe('Accessibility semantics', () => {
    it('should expose a labelled grid with full-date gridcells and roving tabindex', async () => {
      await createComponent();
      component.writeValue(new Date(2026, 9, 29));
      component.open();
      await render();

      const grid = document.querySelector('[role="grid"]')!;
      const title = document.getElementById(grid.getAttribute('aria-labelledby')!)!;
      expect(title.textContent?.trim()).toBe('Ekim 2026');
      expect(document.querySelectorAll('[role="row"]').length).toBe(
        component.calendarWeeks().length + 1
      );
      expect(document.querySelectorAll('[role="columnheader"]')[0].getAttribute('aria-label')).toBe(
        'Pazartesi'
      );

      const selected = dayButton('29 Ekim 2026 Perşembe');
      expect(selected.getAttribute('role')).toBe('gridcell');
      expect(selected.getAttribute('aria-selected')).toBe('true');
      expect(selected.tabIndex).toBe(0);
      expect(dayButtons().filter((b) => b.tabIndex === 0).length).toBe(1);
      expect(dayButton('28 Ekim 2026 Çarşamba').getAttribute('aria-selected')).toBe('false');
    });

    it('should mark today with aria-current="date"', async () => {
      await createComponent();
      component.open();
      await render();
      const current = dayButtons().filter((b) => b.getAttribute('aria-current') === 'date');
      expect(current.length).toBe(1);
      expect(current[0].getAttribute('aria-label')).toBe(component.dayLabel(new Date()));
    });

    it('should use the default English accessible names', async () => {
      await createComponent({ clearable: true });
      component.writeValue(new Date(2026, 9, 29));
      component.open();
      await render();
      expect(toggleButton().getAttribute('aria-label')).toBe(
        DEFAULT_DATEPICKER_INTL.toggleCalendar
      );
      expect(
        fixture.nativeElement.querySelector('.datepicker__clear').getAttribute('aria-label')
      ).toBe('Clear date');
      expect(document.querySelector('[role="dialog"]')!.getAttribute('aria-label')).toBe(
        'Choose date'
      );
    });

    it('should take accessible names from DATEPICKER_INTL, falling back per key', async () => {
      TestBed.overrideProvider(DATEPICKER_INTL, {
        useValue: {
          toggleCalendar: 'Takvimi aç',
          previousMonth: 'Önceki ay',
          nextMonth: 'Sonraki ay',
        },
      });
      await createComponent();
      component.open();
      await render();

      expect(toggleButton().getAttribute('aria-label')).toBe('Takvimi aç');
      const navLabels = Array.from(document.querySelectorAll('.datepicker__nav-btn')).map((b) =>
        b.getAttribute('aria-label')
      );
      expect(navLabels).toEqual(['Önceki ay', 'Sonraki ay']);
      expect(document.querySelector('[role="dialog"]')!.getAttribute('aria-label')).toBe(
        'Choose date'
      );
    });
  });

  describe('Value format', () => {
    it('should report local yyyy-MM-dd strings with valueFormat="iso-date"', async () => {
      await createComponent({ valueFormat: 'iso-date' });
      const onChange = vi.fn();
      const emitted: DateValues[] = [];
      component.registerOnChange(onChange);
      component.dateChange.subscribe((d) => emitted.push(d));

      component.selectDate(new Date(2026, 9, 29));

      expect(onChange).toHaveBeenCalledWith('2026-10-29');
      expect(emitted[0]).toBeInstanceOf(Date);
    });

    it('should include the local time with withTime', async () => {
      await createComponent({ valueFormat: 'iso-date', withTime: true });
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      typeAndCommit('29.10.2026 00:30');
      expect(onChange).toHaveBeenCalledWith('2026-10-29T00:30');
    });

    it('should report ranges as ISO string pairs and null when cleared', async () => {
      await createComponent({ valueFormat: 'iso-date', selectionMode: 'range' });
      const onChange = vi.fn();
      component.registerOnChange(onChange);

      component.selectDate(new Date(2026, 9, 1));
      expect(onChange).toHaveBeenLastCalledWith({ start: '2026-10-01', end: null });
      component.selectDate(new Date(2026, 9, 5));
      expect(onChange).toHaveBeenLastCalledWith({ start: '2026-10-01', end: '2026-10-05' });

      component.clearValue(new Event('click'));
      expect(onChange).toHaveBeenLastCalledWith(null);
    });

    it('should keep reporting Date objects by default', async () => {
      await createComponent();
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      component.selectDate(new Date(2026, 9, 29));
      expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date);
    });

    it('should read ISO strings back as local dates, also inside ranges', async () => {
      await createComponent();
      component.writeValue('2026-10-29');
      expect(component.value()).toEqual(new Date(2026, 9, 29));
      await render();
      expect(inputEl().value).toBe('29.10.2026');

      component.writeValue('not a date');
      expect(component.value()).toBeNull();

      fixture.componentRef.setInput('selectionMode', 'range');
      component.writeValue({ start: '2026-10-01', end: '2026-10-05' });
      expect(component.value()).toEqual({ start: new Date(2026, 9, 1), end: new Date(2026, 9, 5) });

      component.writeValue({ start: 'bad', end: null });
      expect(component.value()).toBeNull();
    });
  });

  describe('Selection and time', () => {
    it('should map sizes to icon sizes and honour a custom format', async () => {
      await createComponent({ formatStr: 'yyyy/MM/dd', error: 'Required' });
      const sizes: [string, number][] = [
        ['xs', 14],
        ['sm', 16],
        ['md', 18],
        ['lg', 20],
        ['xl', 24],
        ['unknown', 18],
      ];
      for (const [size, px] of sizes) {
        fixture.componentRef.setInput('size', size);
        expect(component.iconSize()).toBe(px);
      }
      component.writeValue(new Date(2026, 9, 29));
      expect(component.formattedValue()).toBe('2026/10/29');
      expect(component.inputClasses()).toContain('datepicker__input--error');
    });

    it('should build a range, swapping reversed ends, and highlight the days between', async () => {
      await createComponent({ selectionMode: 'range' });
      component.open();
      component.selectDate(new Date(2026, 9, 10));
      expect(component.formattedValue()).toBe('10.10.2026');
      component.selectDate(new Date(2026, 9, 5));
      await render();

      expect(component.value()).toEqual({
        start: new Date(2026, 9, 5),
        end: new Date(2026, 9, 10),
      });
      expect(component.isOpen()).toBe(false);
      expect(component.isInRange(new Date(2026, 9, 7))).toBe(true);
      expect(component.isSelected(new Date(2026, 9, 10))).toBe(true);
      expect(component.isSelected(new Date(2026, 9, 7))).toBe(false);

      component.selectDate(new Date(2026, 9, 20));
      expect(component.value()).toEqual({ start: new Date(2026, 9, 20), end: null });
    });

    it('should report no selection or range for an empty value', async () => {
      await createComponent({ selectionMode: 'range' });
      expect(component.isSelected(new Date())).toBe(false);
      expect(component.rangeValue()).toBeNull();
      expect(component.formattedValue()).toBe('');
    });

    it('should apply picked hours and minutes to a single value and keep the calendar open', async () => {
      await createComponent({ withTime: true });
      component.writeValue(new Date(2026, 9, 29, 8, 15));
      component.open();
      await render();
      expect(component.selectedHour()).toBe(8);
      expect(component.selectedMinute()).toBe(15);

      component.toggleHourPicker();
      expect(component.showHourPicker()).toBe(true);
      component.selectHour(17);
      component.toggleMinutePicker();
      expect(component.showMinutePicker()).toBe(true);
      expect(component.showHourPicker()).toBe(false);
      component.selectMinute(45);

      component.selectDate(new Date(2026, 9, 30));
      const value = component.value() as Date;
      expect([value.getDate(), value.getHours(), value.getMinutes()]).toEqual([30, 17, 45]);
      expect(component.isOpen()).toBe(true);
    });

    it('should apply picked time to the range start, then to the range end', async () => {
      await createComponent({ selectionMode: 'range', withTime: true });
      component.open();
      component.selectHour(1);
      expect(component.value()).toBeNull();

      component.selectDate(new Date(2026, 9, 1));
      component.selectHour(9);
      expect((component.value() as { start: Date }).start.getHours()).toBe(9);

      component.selectDate(new Date(2026, 9, 3));
      component.selectMinute(30);
      const range = component.value() as { start: Date; end: Date };
      expect(range.end.getMinutes()).toBe(30);
      expect(component.isOpen()).toBe(true);
    });

    it('should not clear while readonly', async () => {
      await createComponent({ readonly: true });
      component.writeValue(new Date(2026, 9, 29));
      component.clearValue(new Event('click'));
      expect(component.value()).not.toBeNull();
    });
  });

  describe('Reactive forms', () => {
    @Component({
      imports: [DatepickerComponent, ReactiveFormsModule],
      template: `<nui-datepicker [formControl]="control" valueFormat="iso-date" />`,
    })
    class HostComponent {
      readonly control = new FormControl<string | null>('2026-10-29');
    }

    it('should round-trip an ISO date string through a FormControl without shifting the day', async () => {
      const host = TestBed.createComponent(HostComponent);
      host.detectChanges();
      await host.whenStable();
      const input: HTMLInputElement = host.nativeElement.querySelector('input');
      expect(input.value).toBe('29.10.2026');

      input.value = '30.10.2026';
      input.dispatchEvent(new Event('blur'));
      expect(host.componentInstance.control.value).toBe('2026-10-30');
      expect(host.componentInstance.control.touched).toBe(true);
      host.destroy();
    });
  });

  describe('Overlay placement', () => {
    it('should render the calendar as an inline popover so it works inside a modal dialog', async () => {
      await createComponent();
      const overlay = fixture.debugElement
        .queryAllNodes(By.directive(CdkConnectedOverlay))[0]
        .injector.get(CdkConnectedOverlay);
      expect(overlay.usePopover).toBe('inline');
    });
  });
});
