import type { IconName } from './icon.types';

/**
 * Loads the list of every bundled icon name (~60 kB) on demand — for an icon
 * picker or browser.
 *
 * Rendering an icon never needs this: `<nui-icon>` just applies a CSS class, so
 * the name list is not part of the runtime at all. The `import()` is what keeps it
 * out of the initial bundle; import `icon-names` directly and it lands right back
 * in there.
 *
 * @example
 * const names = await loadNuiIconNames();
 */
export function loadNuiIconNames(): Promise<readonly IconName[]> {
  return import('./icon-names').then((module) => module.ICON_NAMES);
}
