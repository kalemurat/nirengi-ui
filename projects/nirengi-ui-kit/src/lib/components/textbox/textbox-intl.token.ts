import { InjectionToken } from '@angular/core';

/** Built-in texts of `nui-textbox`: the accessible name of its clear button. */
export interface ITextboxIntl {
  /** Name of the button that clears the value (shown with `clearable`). */
  clearInput: string;
}

export const DEFAULT_TEXTBOX_INTL: ITextboxIntl = {
  clearInput: 'Clear input',
};

/**
 * Overrides the textbox's built-in texts; any key left out falls back to
 * {@link DEFAULT_TEXTBOX_INTL}. Provide it app-wide, or in a component's `providers` to
 * scope it to that subtree.
 *
 * @example
 * providers: [{ provide: TEXTBOX_INTL, useValue: { clearInput: 'Girdiyi temizle' } }]
 */
export const TEXTBOX_INTL = new InjectionToken<Partial<ITextboxIntl>>('TEXTBOX_INTL');
