import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  addMonths,
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
  parseISO,
  setHours,
  setMinutes,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { tr } from 'date-fns/locale';
import { LucideAngularModule } from 'lucide-angular';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../icon/icon.types';
import { ValueAccessorBase } from '../../common/base/value-accessor.base';
import { ColorVariant } from '../../common/enums/color-variant.enum';
import { Size } from '../../common/enums/size.enum';

export type DateValues = Date | { start: Date | null; end: Date | null };

export type DatepickerSelectionMode = 'single' | 'range';

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
 * @see {@link ValueAccessorBase}
 * @see {@link Size}
 * @see {@link ColorVariant}
 */
@Component({
  selector: 'nui-datepicker',
  standalone: true,
  imports: [CommonModule, OverlayModule, LucideAngularModule, FormsModule, IconComponent],
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
      return start && end ? `${start} - ${end}` : start;
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

  readonly weekDays = computed(() => {
    const start = startOfWeek(new Date(), { locale: tr });
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push(format(d, 'EEEEEE', { locale: tr }));
    }
    return days;
  });

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
    calendar: 'Calendar',
    clock: 'Clock',
    prev: 'ChevronLeft',
    next: 'ChevronRight',
    clear: 'X',
  };

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

  /** Syncs the view date to the current value when opening. */
  toggleOpen(): void {
    if (this.isDisabled() || this.readonly()) return;
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      // Sync view date to current value if exists
      const val = this.value();
      if (this.selectionMode() === 'single' && val instanceof Date) {
        this.viewDate.set(val);
      } else if (this.isRange(val) && val.start) {
        this.viewDate.set(val.start);
      } else {
        this.viewDate.set(new Date());
      }
    }
  }

  /** Closes the popup and marks the control as touched. */
  close(): void {
    this.isOpen.set(false);
    this.markAsTouched();
  }

  prevMonth(): void {
    this.viewDate.update((d) => subMonths(d, 1));
  }

  nextMonth(): void {
    this.viewDate.update((d) => addMonths(d, 1));
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

  /** Also accepts ISO date strings; validates before setting. */
  override writeValue(obj: DateValues | null): void {
    // Basic type checking and safe setting
    if (!obj) {
      super.writeValue(null);
      return;
    }

    if (this.selectionMode() === 'single') {
      if (obj instanceof Date) {
        super.writeValue(isValid(obj) ? obj : null);
        if (isValid(obj)) this.viewDate.set(obj);
      } else if (typeof obj === 'string') {
        const parsed = parseISO(obj);
        super.writeValue(isValid(parsed) ? parsed : null);
        if (isValid(parsed)) this.viewDate.set(parsed);
      }
    } else {
      const range = obj as { start: Date | null; end: Date | null };
      if (typeof range === 'object' && (range.start || range.end)) {
        super.writeValue(range);
        if (range.start) this.viewDate.set(range.start);
      } else {
        super.writeValue(null);
      }
    }
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

  // --- Private Methods ---

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
