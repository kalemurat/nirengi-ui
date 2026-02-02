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
    setHours,
    setMinutes,
    startOfMonth,
    startOfWeek,
    subMonths,
} from 'date-fns';
import { tr } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight, Clock, LucideAngularModule } from 'lucide-angular';
import { ValueAccessorBase } from '../../common/base/value-accessor.base';
import { ColorVariant } from '../../common/enums/color-variant.enum';
import { Size } from '../../common/enums/size.enum';

/**
 * Type definition for Datepicker value.
 * Can be a single Date or a Range object.
 */
export type DateValues = Date | { start: Date | null; end: Date | null };

/**
 * Selection mode.
 */
export type DatepickerSelectionMode = 'single' | 'range';

/**
 * Modern datepicker component.
 * Uses Angular 20 signal-based API and Tailwind + BEM methodology.
 *
 * ## Features
 * - ✅ Signal-based ControlValueAccessor (NG_VALUE_ACCESSOR)
 * - ✅ Two-way data binding support (ngModel, formControl)
 * - ✅ OnPush change detection strategy
 * - ✅ Reactive class binding with computed signals
 * - ✅ Single & Range selection mode
 * - ✅ Time selection (Hour/Minute)
 * - ✅ 7 different color variants (primary, secondary, success, warning, danger, info, neutral)
 * - ✅ 5 different sizes (xs, sm, md, lg, xl)
 * - ✅ Disabled and readonly states
 * - ✅ WCAG 2.1 AA accessibility standards
 * - ✅ Keyboard navigation support
 *
 * @example
 * // With Reactive Forms
 * <n-datepicker [formControl]="dateControl" label="Birth Date"></n-datepicker>
 *
 * @example
 * // With Template-driven Forms
 * <n-datepicker [(ngModel)]="selectedDate" label="Select Date"></n-datepicker>
 *
 * @example
 * // With Range selection
 * <n-datepicker
 *   [formControl]="rangeControl"
 *   [selectionMode]="'range'"
 *   label="Date Range"></n-datepicker>
 *
 * @example
 * // With variant and size
 * <n-datepicker
 *   [formControl]="dateControl"
 *   [variant]="ColorVariant.Success"
 *   [size]="Size.Large"
 *   label="Start Date"></n-datepicker>
 *
 * @see https://v20.angular.dev/guide/signals
 * @see {@link ValueAccessorBase}
 * @see {@link Size} - Standard size values
 * @see {@link ColorVariant} - Color variants
 */
@Component({
  selector: 'n-datepicker',
  standalone: true,
  imports: [CommonModule, OverlayModule, LucideAngularModule, FormsModule],
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
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly readonly = input<boolean>(false);

  /**
   * Color variant.
   * Provides a color theme with semantic meaning.
   *
   * @default ColorVariant.Primary
   */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /**
   * Component size.
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Validation hint text.
   */
  readonly hint = input<string>('');

  /**
   * Error message text.
   */
  readonly error = input<string>('');

  /**
   * Event emitted when date value selection is complete/changed by user.
   */
  readonly dateChange = output<DateValues>();

  /**
   * Date format string.
   * If not provided, defaults based on `withTime`.
   */
  readonly formatStr = input<string>(''); // Dynamic default handled in computed

  /**
   * Selection mode: 'single' or 'range'.
   */
  readonly selectionMode = input<DatepickerSelectionMode>('single');

  /**
   * Enable time selection.
   */
  readonly withTime = input<boolean>(false);

  // --- Internal State ---

  /**
   * Current view date (month/year navigation).
   */
  viewDate = signal<Date>(new Date());

  /**
   * Popup open state.
   */
  isOpen = signal<boolean>(false);

  // Time state (for internal UI binding)
  selectedHour = signal<number>(0);
  selectedMinute = signal<number>(0);

  // Custom Time Picker Visibility
  showHourPicker = signal<boolean>(false);
  showMinutePicker = signal<boolean>(false);

  protected readonly icons = {
    calendar: Calendar,
    clock: Clock,
    prev: ChevronLeft,
    next: ChevronRight,
  };

  /**
   * Resolved format string.
   */
  resolvedFormat = computed(() => {
    if (this.formatStr()) return this.formatStr();
    return this.withTime() ? 'dd.MM.yyyy HH:mm' : 'dd.MM.yyyy';
  });

  formattedValue = computed(() => {
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

  /**
   * Computed classes for the input element.
   * Performs dynamic class binding using BEM methodology.
   * Updated reactively.
   */
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

  currentMonthYear = computed(() => {
    return format(this.viewDate(), 'MMMM yyyy', { locale: tr });
  });

  calendarDays = computed(() => {
    const view = this.viewDate();
    const start = startOfWeek(startOfMonth(view), { locale: tr });
    const end = endOfWeek(endOfMonth(view), { locale: tr });
    return eachDayOfInterval({ start, end });
  });

  weekDays = computed(() => {
    const start = startOfWeek(new Date(), { locale: tr });
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push(format(d, 'EEEEEE', { locale: tr }));
    }
    return days;
  });

  hoursList = Array.from({ length: 24 }, (_, i) => i);
  minutesList = Array.from({ length: 60 }, (_, i) => i);

  constructor() {
    super();

    // Disabled state sync
    effect(() => {
      this.setDisabledState(this.disabledInput());
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

  toggleOpen() {
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

  close() {
    this.isOpen.set(false);
    this.markAsTouched();
  }

  prevMonth() {
    this.viewDate.update((d) => subMonths(d, 1));
  }

  nextMonth() {
    this.viewDate.update((d) => addMonths(d, 1));
  }

  /**
   * Handles date click event.
   */
  selectDate(date: Date) {
    const mode = this.selectionMode();
    const currentVal = this.value();

    // Preserve time if time selection is enabled
    if (this.withTime()) {
      date = setHours(date, this.selectedHour());
      date = setMinutes(date, this.selectedMinute());
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

  toggleHourPicker() {
    this.showHourPicker.update((v) => !v);
    this.showMinutePicker.set(false);
  }

  toggleMinutePicker() {
    this.showMinutePicker.update((v) => !v);
    this.showHourPicker.set(false);
  }

  selectHour(h: number) {
    this.selectedHour.set(h);
    this.updateTime();
    this.showHourPicker.set(false);
  }

  selectMinute(m: number) {
    this.selectedMinute.set(m);
    this.updateTime();
    this.showMinutePicker.set(false);
  }

  private updateTime() {
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

  // --- Helper Predicates ---

  isRange(val: any): val is { start: Date | null; end: Date | null } {
    return val && typeof val === 'object' && 'start' in val;
  }

  isSelected(date: Date): boolean {
    const val = this.value();
    if (this.selectionMode() === 'single') {
      return val instanceof Date && isSameDay(date, val);
    } else if (this.isRange(val)) {
      return (!!val.start && isSameDay(date, val.start)) || (!!val.end && isSameDay(date, val.end));
    }
    return false;
  }

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

  // --- Helpers for Template ---

  /**
   * Helper to safely access range values in template
   */
  readonly rangeValue = computed(() => {
    const v = this.value();
    if (this.isRange(v)) {
      return v;
    }
    return null;
  });

  isSameDay(d1: Date, d2: Date): boolean {
    return isSameDay(d1, d2);
  }

  // --- ControlValueAccessor Overrides ---

  override writeValue(obj: any): void {
    // Basic type checking and safe setting
    if (!obj) {
      super.writeValue(null);
      return;
    }

    if (this.selectionMode() === 'single') {
      if (obj instanceof Date || typeof obj === 'string') {
        // handle string if needed, date-fns parse
        const d = new Date(obj);
        super.writeValue(isValid(d) ? d : null);
        if (isValid(d)) this.viewDate.set(d);
      }
    } else {
      if (typeof obj === 'object' && (obj.start || obj.end)) {
        super.writeValue(obj);
        if (obj.start) this.viewDate.set(obj.start);
      } else {
        super.writeValue(null);
      }
    }
  }
}

