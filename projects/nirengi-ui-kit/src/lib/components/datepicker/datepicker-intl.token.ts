import { InjectionToken } from '@angular/core';

/** Accessible names announced by `nui-datepicker`; month, weekday and day names come from the date-fns locale. */
export interface IDatepickerIntl {
  /** Name of the button that opens the calendar. */
  toggleCalendar: string;
  /** Name of the button that clears the selected date. */
  clearDate: string;
  /** Name of the button that shows the previous month. */
  previousMonth: string;
  /** Name of the button that shows the next month. */
  nextMonth: string;
  /** Name of the calendar popup dialog. */
  calendarLabel: string;
}

export const DEFAULT_DATEPICKER_INTL: IDatepickerIntl = {
  toggleCalendar: 'Toggle calendar',
  clearDate: 'Clear date',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  calendarLabel: 'Choose date',
};

/**
 * Overrides the datepicker's accessible names app-wide; any key left out falls back to
 * {@link DEFAULT_DATEPICKER_INTL}.
 *
 * @example
 * providers: [
 *   { provide: DATEPICKER_INTL, useValue: { toggleCalendar: 'Takvimi aç', clearDate: 'Tarihi temizle' } },
 * ]
 */
export const DATEPICKER_INTL = new InjectionToken<Partial<IDatepickerIntl>>('DATEPICKER_INTL');
