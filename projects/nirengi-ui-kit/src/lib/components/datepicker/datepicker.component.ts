import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  addDays,
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  isValid,
  isWithinInterval,
  parse,
  parseISO,
  setHours,
  setMinutes,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  subYears,
} from 'date-fns';
import { tr } from 'date-fns/locale';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../icon/icon.types';
import { ValueAccessorBase } from '../../common/base/value-accessor.base';
import { ColorVariant } from '../../common/enums/color-variant.enum';
import { Size } from '../../common/enums/size.enum';
import { DATEPICKER_INTL, IDatepickerIntl, DEFAULT_DATEPICKER_INTL } from './datepicker-intl.token';

export type DateValues = Date | { start: Date | null; end: Date | null };

export type DatepickerSelectionMode = 'single' | 'range';

/** `'date'` reports `Date` objects to the form control; `'iso-date'` reports local ISO strings. */
export type DatepickerValueFormat = 'date' | 'iso-date';

/** Value reported to the bound form control, shaped by `valueFormat`. */
export type DatepickerModelValue =
  | DateValues
  | string
  | { start: string | null; end: string | null };

/** Separator between start and end in the displayed (and typed) range text. */
const RANGE_SEPARATOR = ' - ';

/**
 * @example
 * // With Reactive Forms
 * <nui-datepicker [formControl]="dateControl" label="Birth Date"></nui-datepicker>
 *
 * @example
 * // With Template-driven Forms
 * <nui-datepicker [(ngModel)]="selectedDate" label="Select Date"></nui-datepicker>
 *
 * @example
 * // With Range selection
 * <nui-datepicker
 *   [formControl]="rangeControl"
 *   [selectionMode]="'range'"
 *   label="Date Range"></nui-datepicker>
 *
 * @example
 * // With variant and size
 * <nui-datepicker
 *   [formControl]="dateControl"
 *   [variant]="ColorVariant.Success"
 *   [size]="Size.Large"
 *   label="Start Date"></nui-datepicker>
 *
 * @example
 * // Store the value as a 'yyyy-MM-dd' string
 * <nui-datepicker [formControl]="dueDateControl" valueFormat="iso-date"></nui-datepicker>
 *
 * Dates can be typed into the input in the display format (`dd.MM.yyyy` by default) and committed
 * with Enter or on blur. ArrowDown opens the calendar; inside it the arrow keys, Home/End and
 * PageUp/PageDown (Shift for years) move between days, Enter selects and Escape closes, returning
 * focus to the input (WAI-ARIA APG date picker pattern). Accessible names are overridable via
 * {@link DATEPICKER_INTL}.
 *
 * @see {@link ValueAccessorBase}
 * @see {@link Size}
 * @see {@link ColorVariant}
 */
@Component({
  selector: 'nui-datepicker',
  standalone: true,
  imports: [CommonModule, OverlayModule, FormsModule, IconComponent],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent extends ValueAccessorBase<DateValues> {
  // --- Inputs ---

  readonly label = input<string>('');
  readonly placeholder = input<string>('Select date');
  readonly id = input<string>(`datepicker-${Math.random().toString(36).substr(2, 9)}`);
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);

  /**
   * Marks the field as mandatory for assistive technology via `aria-required`. The native
   * `required` attribute is deliberately not used, so the browser's own constraint-validation
   * bubble never appears on a field whose typed text the component parses itself.
   * @default false
   */
  readonly required = input<boolean>(false);

  /** Shows a clear button when a value is selected. @default false */
  readonly clearable = input<boolean>(false);

  /** @default ColorVariant.Primary */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  readonly size = input<Size>(Size.Medium);

  readonly iconSize = computed(() => {
    switch (this.size()) {
      case Size.XSmall:
        return 14;
      case Size.Small:
        return 16;
      case Size.Medium:
        return 18;
      case Size.Large:
        return 20;
      case Size.XLarge:
        return 24;
      default:
        return 18;
    }
  });

  readonly hint = input<string>('');

  readonly error = input<string>('');

  /** If not provided, defaults based on `withTime`. */
  readonly formatStr = input<string>(''); // Dynamic default handled in computed

  readonly selectionMode = input<DatepickerSelectionMode>('single');

  readonly withTime = input<boolean>(false);

  /**
   * Shape of the value reported to the bound form control. `'iso-date'` reports local
   * `yyyy-MM-dd` strings (`yyyy-MM-dd'T'HH:mm` with `withTime`) formatted without a UTC
   * conversion, so the calendar day never shifts. `dateChange` always emits `Date`s.
   * @default 'date'
   */
  readonly valueFormat = input<DatepickerValueFormat>('date');

  // --- Outputs ---

  /** Emitted when date selection is complete or changed by user. */
  readonly dateChange = output<DateValues>();

  // --- Public Computed ---

  readonly resolvedFormat = computed(() => {
    if (this.formatStr()) return this.formatStr();
    return this.withTime() ? 'dd.MM.yyyy HH:mm' : 'dd.MM.yyyy';
  });

  readonly formattedValue = computed(() => {
    const val = this.value();
    if (!val) return '';

    const fmt = this.resolvedFormat();

    if (this.isRange(val)) {
      const start = val.start ? format(val.start, fmt, { locale: tr }) : '';
      const end = val.end ? format(val.end, fmt, { locale: tr }) : '';
      return start && end ? `${start}${RANGE_SEPARATOR}${end}` : start;
    } else if (isValid(val)) {
      return format(val as Date, fmt, { locale: tr });
    }
    return '';
  });

  readonly inputClasses = computed(() => {
    const classes = ['datepicker__input'];

    // Variant
    classes.push(`datepicker__input--${this.variant()}`);

    // Error state overrides variant
    if (this.error()) {
      classes.push('datepicker__input--error');
    }

    if (this.isOpen()) {
      classes.push('datepicker__input--focused');
    }

    return classes.join(' ');
  });

  readonly currentMonthYear = computed(() => {
    return format(this.viewDate(), 'MMMM yyyy', { locale: tr });
  });

  readonly calendarDays = computed(() => {
    const view = this.viewDate();
    const start = startOfWeek(startOfMonth(view), { locale: tr });
    const end = endOfWeek(endOfMonth(view), { locale: tr });
    return eachDayOfInterval({ start, end });
  });

  /** `calendarDays` split into rows of seven for the grid's `row` elements. */
  readonly calendarWeeks = computed(() => {
    const days = this.calendarDays();
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  });

  readonly weekDays = computed(() => this.formatWeekDays('EEEEEE'));

  /** Full weekday names used as the accessible names of the abbreviated column headers. */
  readonly weekDayLabels = computed(() => this.formatWeekDays('EEEE'));

  readonly titleId = computed(() => `${this.id()}-calendar-title`);

  /** Id of the hint text, referenced by the input's `aria-describedby`. */
  readonly hintId = computed(() => `${this.id()}-hint`);

  /** Id of the error text, referenced by the input's `aria-describedby`. */
  readonly errorId = computed(() => `${this.id()}-error`);

  /**
   * Id of the text currently shown under the field (the error wins over the hint, mirroring the
   * template), or null when none is rendered so the attribute never references a missing element.
   */
  readonly describedBy = computed(() =>
    this.error() ? this.errorId() : this.hint() ? this.hintId() : null
  );

  /** Safely typed range value for template access. */
  readonly rangeValue = computed(() => {
    const v = this.value();
    if (this.isRange(v)) {
      return v;
    }
    return null;
  });

  // --- Internal State ---

  /** Current view date for month/year navigation. */
  readonly viewDate = signal<Date>(new Date());

  readonly isOpen = signal<boolean>(false);

  /** The day that holds the grid's single tab stop (roving tabindex) and keyboard focus. */
  readonly activeDate = signal<Date>(new Date());

  // Time state (for internal UI binding)
  readonly selectedHour = signal<number>(0);
  readonly selectedMinute = signal<number>(0);

  // Custom Time Picker Visibility
  readonly showHourPicker = signal<boolean>(false);
  readonly showMinutePicker = signal<boolean>(false);

  readonly hoursList = Array.from({ length: 24 }, (_, i) => i);
  readonly minutesList = Array.from({ length: 60 }, (_, i) => i);

  protected readonly icons: {
    calendar: IconName;
    clock: IconName;
    prev: IconName;
    next: IconName;
    clear: IconName;
  } = {
    calendar: 'calendar-line',
    clock: 'time-line',
    prev: 'arrow-left-s-line',
    next: 'arrow-right-s-line',
    clear: 'close-line',
  };

  protected readonly intl: IDatepickerIntl = {
    ...DEFAULT_DATEPICKER_INTL,
    ...inject(DATEPICKER_INTL, { optional: true }),
  };

  private readonly injector = inject(Injector);

  private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

  private readonly calendarElement = viewChild<ElementRef<HTMLElement>>('calendar');

  constructor() {
    super();

    // Disabled state sync
    effect(() => {
      this.setDisabledState(this.disabled());
    });

    // Reset time when opening
    effect(() => {
      if (this.isOpen()) {
        const val = this.value();
        if (this.selectionMode() === 'single' && val instanceof Date) {
          this.selectedHour.set(val.getHours());
          this.selectedMinute.set(val.getMinutes());
        } else {
          // For range or empty, default to current time or 00:00
          const now = new Date();
          this.selectedHour.set(now.getHours());
          this.selectedMinute.set(now.getMinutes());
        }
      }
    });
  }

  // --- Actions ---

  /**
   * Opens or closes the calendar. `moveFocus` puts keyboard focus on the active day (calendar
   * button, ArrowDown); a click on the input leaves focus there so the user can keep typing.
   */
  toggleOpen(moveFocus = false): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open(moveFocus);
    }
  }

  /** Syncs the view and active day to the current value (or today) and shows the calendar. */
  open(moveFocus = false): void {
    if (this.isDisabled() || this.readonly()) return;
    const val = this.value();
    let anchor = new Date();
    if (this.selectionMode() === 'single' && val instanceof Date) {
      anchor = val;
    } else if (this.isRange(val) && val.start) {
      anchor = val.start;
    }
    this.viewDate.set(anchor);
    this.activeDate.set(startOfDay(anchor));
    this.isOpen.set(true);
    if (moveFocus) {
      this.focusActiveDay();
    }
  }

  /** Closes the popup, marks the control as touched and returns focus to the input. */
  close(): void {
    this.isOpen.set(false);
    this.showHourPicker.set(false);
    this.showMinutePicker.set(false);
    this.markAsTouched();
    this.inputElement().nativeElement.focus();
  }

  /** Keeps `isOpen` in sync when the CDK overlay detaches itself (e.g. on Escape). */
  onOverlayDetach(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  prevMonth(): void {
    this.viewDate.update((d) => subMonths(d, 1));
    this.activeDate.update((d) => subMonths(d, 1));
  }

  nextMonth(): void {
    this.viewDate.update((d) => addMonths(d, 1));
    this.activeDate.update((d) => addMonths(d, 1));
  }

  /** ArrowDown opens the calendar and focuses the active day; Enter commits the typed text. */
  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.isOpen()) {
        this.focusActiveDay();
      } else {
        this.open(true);
      }
    } else if (event.key === 'Enter') {
      // Not prevented: committing first lets an enclosing form submit the parsed value.
      this.commitTypedValue();
      if (this.isOpen()) {
        this.close();
      }
    }
  }

  onInputBlur(): void {
    this.commitTypedValue();
    this.markAsTouched();
  }

  /**
   * Grid keyboard navigation per the WAI-ARIA APG date picker dialog. Enter/Space are left to
   * the day buttons' native click; Escape is handled by the CDK overlay.
   */
  onDayKeydown(event: KeyboardEvent): void {
    const active = this.activeDate();
    let next: Date;
    switch (event.key) {
      case 'ArrowLeft':
        next = addDays(active, -1);
        break;
      case 'ArrowRight':
        next = addDays(active, 1);
        break;
      case 'ArrowUp':
        next = addDays(active, -7);
        break;
      case 'ArrowDown':
        next = addDays(active, 7);
        break;
      case 'Home':
        next = startOfWeek(active, { locale: tr });
        break;
      case 'End':
        next = startOfDay(endOfWeek(active, { locale: tr }));
        break;
      case 'PageUp':
        next = event.shiftKey ? subYears(active, 1) : subMonths(active, 1);
        break;
      case 'PageDown':
        next = event.shiftKey ? addYears(active, 1) : addMonths(active, 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    this.activeDate.set(next);
    if (!isSameMonth(next, this.viewDate())) {
      this.viewDate.set(next);
    }
    this.focusActiveDay();
  }

  /**
   * Parses the input text in `resolvedFormat` (a range as `start - end`) and applies it. Empty
   * text clears the value; unparseable text is reverted to the current value.
   */
  commitTypedValue(): void {
    if (this.isDisabled() || this.readonly()) return;
    const inputEl = this.inputElement().nativeElement;
    const text = inputEl.value.trim();
    if (text === this.formattedValue()) return;

    if (!text) {
      this.updateValue(null);
      this.dateChange.emit(null!);
    } else {
      const parsed = this.parseTypedValue(text);
      if (parsed) {
        this.updateValue(parsed);
        this.dateChange.emit(parsed);
      }
    }
    // Normalises e.g. "1.1.2026" to "01.01.2026", or restores the text after a failed parse.
    inputEl.value = this.formattedValue();
  }

  /** Applies time if `withTime` is enabled; swaps start/end when end is before start in range mode. */
  selectDate(date: Date): void {
    const mode = this.selectionMode();
    const currentVal = this.value();

    // Preserve time if time selection is enabled
    if (this.withTime()) {
      date = setHours(date, this.selectedHour());
      date = setMinutes(date, this.selectedMinute());
    } else {
      date = setHours(date, 0);
      date = setMinutes(date, 0);
      date.setSeconds(0);
      date.setMilliseconds(0);
    }

    if (mode === 'single') {
      this.updateValue(date);
      this.dateChange.emit(date);
      if (!this.withTime()) {
        // Close immediately if only date
        this.close();
      }
    } else {
      // Range Mode logic
      if (!currentVal || !this.isRange(currentVal) || (currentVal.start && currentVal.end)) {
        // Start new range
        const newVal = { start: date, end: null };
        this.updateValue(newVal);
        this.dateChange.emit(newVal);
      } else {
        // Complete range
        let start = currentVal.start!;
        let end = date;

        // Swap if end is before start
        if (isBefore(end, start)) {
          [start, end] = [end, start];
        }

        const newVal = { start, end };
        this.updateValue(newVal);
        this.dateChange.emit(newVal);

        if (!this.withTime()) {
          this.close();
        }
      }
    }
  }

  clearValue(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled() || this.readonly()) return;
    this.updateValue(null);
    this.dateChange.emit(null!);
  }

  toggleHourPicker(): void {
    this.showHourPicker.update((v) => !v);
    this.showMinutePicker.set(false);
  }

  toggleMinutePicker(): void {
    this.showMinutePicker.update((v) => !v);
    this.showHourPicker.set(false);
  }

  selectHour(h: number): void {
    this.selectedHour.set(h);
    this.updateTime();
    this.showHourPicker.set(false);
  }

  selectMinute(m: number): void {
    this.selectedMinute.set(m);
    this.updateTime();
    this.showMinutePicker.set(false);
  }

  /** Accepts `Date`s or ISO date strings (also inside a range); invalid input clears the value. */
  override writeValue(obj: DatepickerModelValue | null): void {
    if (this.selectionMode() === 'single') {
      const date = obj instanceof Date || typeof obj === 'string' ? this.toDate(obj) : null;
      super.writeValue(date);
      if (date) this.viewDate.set(date);
      return;
    }

    const range = this.isRange(obj)
      ? { start: this.toDate(obj.start), end: this.toDate(obj.end) }
      : null;
    if (range && (range.start || range.end)) {
      super.writeValue(range);
      if (range.start) this.viewDate.set(range.start);
    } else {
      super.writeValue(null);
    }
  }

  /**
   * Converts outgoing values to the shape selected by `valueFormat` before the form sees them.
   * The forms API callback accepts any value; the cast only widens it to {@link DatepickerModelValue}.
   */
  override registerOnChange(fn: (value: DateValues | null) => void): void {
    const report = fn as (value: DatepickerModelValue | null) => void;
    super.registerOnChange((value) => report(this.toModelValue(value)));
  }

  // --- Helper Predicates ---

  /** Type guard for range values. */
  isRange(val: unknown): val is { start: Date | null; end: Date | null } {
    return !!val && typeof val === 'object' && 'start' in val;
  }

  /** Works for both single and range selection modes (matches start or end in range). */
  isSelected(date: Date): boolean {
    const val = this.value();
    if (this.selectionMode() === 'single') {
      return val instanceof Date && isSameDay(date, val);
    } else if (this.isRange(val)) {
      return (!!val.start && isSameDay(date, val.start)) || (!!val.end && isSameDay(date, val.end));
    }
    return false;
  }

  /** Only returns true when both range start and end are set. */
  isInRange(date: Date): boolean {
    const val = this.value();
    if (this.selectionMode() === 'range' && this.isRange(val) && val.start && val.end) {
      return isWithinInterval(date, { start: val.start, end: val.end });
    }
    return false;
  }

  isCurrentMonth(date: Date): boolean {
    return isSameMonth(date, this.viewDate());
  }

  isDateToday(date: Date): boolean {
    return isToday(date);
  }

  isSameDay(d1: Date, d2: Date): boolean {
    return isSameDay(d1, d2);
  }

  /** Full date announced for a day button, e.g. "29 Ekim 2026 Perşembe". */
  dayLabel(date: Date): string {
    return format(date, 'd MMMM yyyy EEEE', { locale: tr });
  }

  // --- Private Methods ---

  private formatWeekDays(pattern: string): string[] {
    const start = startOfWeek(new Date(), { locale: tr });
    return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), pattern, { locale: tr }));
  }

  /** Focuses the roving-tabindex day once the calendar has rendered the active date. */
  private focusActiveDay(): void {
    afterNextRender(
      () => {
        this.calendarElement()
          ?.nativeElement.querySelector<HTMLElement>('.datepicker__day[tabindex="0"]')
          ?.focus();
      },
      { injector: this.injector }
    );
  }

  private parseTypedValue(text: string): DateValues | null {
    if (this.selectionMode() === 'single') {
      return this.parseDate(text);
    }

    // Split on the exact display separator so formats containing '-' (e.g. yyyy-MM-dd) still parse.
    const parts = text.split(RANGE_SEPARATOR).map((part) => part.trim());
    if (parts.length > 2) return null;
    const start = this.parseDate(parts[0]);
    if (!start) return null;
    if (parts.length === 1) return { start, end: null };
    const end = this.parseDate(parts[1]);
    if (!end) return null;
    return isBefore(end, start) ? { start: end, end: start } : { start, end };
  }

  /** Strict enough to reject two-digit years, which date-fns would read as the first century. */
  private parseDate(text: string): Date | null {
    const parsed = parse(text, this.resolvedFormat(), new Date(), { locale: tr });
    return isValid(parsed) && parsed.getFullYear() >= 1000 ? parsed : null;
  }

  private toDate(value: Date | string | null): Date | null {
    if (!value) return null;
    const date = typeof value === 'string' ? parseISO(value) : value;
    return isValid(date) ? date : null;
  }

  private toModelValue(value: DateValues | null): DatepickerModelValue | null {
    if (!value || this.valueFormat() === 'date') return value;
    if (this.isRange(value)) {
      return { start: this.toIsoString(value.start), end: this.toIsoString(value.end) };
    }
    return this.toIsoString(value);
  }

  /** Local-time ISO formatting; `toISOString()` would convert to UTC and can shift the day. */
  private toIsoString(date: Date | null): string | null {
    if (!date) return null;
    return format(date, this.withTime() ? "yyyy-MM-dd'T'HH:mm" : 'yyyy-MM-dd');
  }

  /** In range mode applies time to end if complete, otherwise to start. */
  private updateTime(): void {
    const h = this.selectedHour();
    const m = this.selectedMinute();
    const mode = this.selectionMode();
    const val = this.value();

    if (mode === 'single' && val instanceof Date) {
      let newVal = setHours(val, h);
      newVal = setMinutes(newVal, m);
      this.updateValue(newVal);
      this.dateChange.emit(newVal);
    }
    // For range, usually time applies to 'end' or we need dual time pickers.
    // For simplicity in this iteration, we might apply time to the *last selected* date
    // or simplistic 'start' time.
    // Better UX for range+time is complex. Let's apply to END if range is complete, or START if only start.
    else if (this.isRange(val)) {
      if (val.end) {
        let newEnd = setHours(val.end, h);
        newEnd = setMinutes(newEnd, m);
        const newVal = { ...val, end: newEnd };
        this.updateValue(newVal);
        this.dateChange.emit(newVal);
      } else if (val.start) {
        let newStart = setHours(val.start, h);
        newStart = setMinutes(newStart, m);
        const newVal = { ...val, start: newStart };
        this.updateValue(newVal);
        this.dateChange.emit(newVal);
      }
    }
  }
}
