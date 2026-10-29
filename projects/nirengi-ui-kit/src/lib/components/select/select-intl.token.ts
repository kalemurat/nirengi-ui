import { InjectionToken } from '@angular/core';

/** Built-in texts of `nui-select`: accessible names plus the search placeholder, empty-result and loading messages. */
export interface ISelectIntl {
  /** Name of the button that clears the selection. */
  clearSelection: string;
  /** Name of the chip button that removes one selected item in multiple mode. */
  removeItem: string;
  /** Placeholder of the in-dropdown search input. */
  searchPlaceholder: string;
  /** Name of the search input when the select has no `label`. */
  searchLabel: string;
  /** Message shown when no option matches the search term. */
  noResults: string;
  /** Message shown in place of the empty-result message while `loading` is on. */
  loading: string;
}

export const DEFAULT_SELECT_INTL: ISelectIntl = {
  clearSelection: 'Clear selection',
  removeItem: 'Remove item',
  searchPlaceholder: 'Search...',
  searchLabel: 'Search options',
  noResults: 'No results found.',
  loading: 'Loading...',
};

/**
 * Overrides the select's built-in texts; any key left out falls back to
 * {@link DEFAULT_SELECT_INTL}. Provide it app-wide, or in a component's `providers` to
 * scope it to that subtree.
 *
 * @example
 * providers: [
 *   { provide: SELECT_INTL, useValue: { searchPlaceholder: 'Ara...', noResults: 'Sonuç bulunamadı.' } },
 * ]
 */
export const SELECT_INTL = new InjectionToken<Partial<ISelectIntl>>('SELECT_INTL');
