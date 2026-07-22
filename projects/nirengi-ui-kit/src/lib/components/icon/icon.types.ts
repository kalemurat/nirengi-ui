/**
 * Every RemixIcon name the bundled font provides, in upstream kebab-case
 * (`home-line`, `check-fill`, …) — the same names listed on remixicon.com, minus
 * the `ri-` CSS prefix.
 *
 * Read through `typeof import(...)` so the union is purely a compile-time view of
 * the generated name list; no icon bytes reach the emitted JavaScript.
 */
export type BundledIconName = (typeof import('./icon-names').ICON_NAMES)[number];

/**
 * Autocompletes to every bundled name while staying assignable from a plain
 * `string`: the font resolves names through a CSS class, so a name computed at
 * runtime works exactly like a literal one.
 */
export type IconName = BundledIconName | (string & {});
