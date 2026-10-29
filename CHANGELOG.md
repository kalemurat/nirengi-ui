# Changelog

All notable changes to **nirengi-ui-kit** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Since `1.0.0` the public API is stable: breaking changes only ship in a new major
version. Before `1.0.0` the API could change between minor versions.

## [1.1.0] - 2026-10-29

### Added

- `nui-select` can hand searching to the consumer, for options loaded from a server:
  the `searchChange` output emits the trimmed term, `[filterLocally]="false"` makes the
  list show `options` exactly as given, and `[loading]` shows a loading message in the
  empty-state slot and marks the list `aria-busy`. Replacing `options` while the list is
  open keeps it open with the typed text, resets the active option, and the selected
  label stays visible even when the new options no longer contain it.
- `nui-select` has a new `loading` text in `SELECT_INTL` (default "Loading...").
  `ISelectIntl` gained a matching required `loading` member, so code that builds a full
  `ISelectIntl` object needs to add it; `SELECT_INTL` overrides stay partial and are
  unaffected.
- `nui-tabs` active tab is controllable: `[activeIndex]` opens a given tab,
  `[(activeIndex)]` follows the user's clicks and `(activeIndexChange)` emits the
  clicked tab's index. A disabled or out-of-range index never activates that tab.
- `nui-textbox` clear button label is overridable app-wide or per subtree through the
  new `TEXTBOX_INTL` token (`DEFAULT_TEXTBOX_INTL` and `ITextboxIntl` are exported). The
  default stays "Clear input".

### Changed

- `nui-datepicker` defaults to the neutral variant, like `nui-textbox` and
  `nui-textarea`, so an untouched field is no longer blue. Use `variant="primary"` to
  keep the previous look.
- `nui-tabs` shows the first enabled tab when the first tab is disabled and no index is
  bound; previously the disabled first tab was shown.

### Fixed

- `nui-select` options panel is as wide as its trigger again when rendered as a popover,
  instead of shrinking to its widest option.
- `nui-datepicker` calendar closes when focus leaves the input with Tab, and an outside
  click both closes it and reaches its target. The calendar no longer renders a
  backdrop that swallowed the next click on the page.
- `nui-tabs` `selectTab()` no longer treats a negative index as counting from the end.

## [1.0.1] - 2026-10-29

### Added

- `nui-datepicker` accepts a `required` input that sets `aria-required` on the text
  input. The native `required` attribute is deliberately not used, so the browser's
  own validation bubble never appears on a field whose typed text the component
  parses itself.

### Fixed

- `nui-datepicker` input now reports its invalid state with `aria-invalid` and
  references the visible hint or error text through `aria-describedby`, so screen
  readers announce them.
- `nui-select` options can be picked inside a modal `<dialog>`. The panel is now
  rendered as an inline popover in the top layer instead of an overlay behind the
  dialog.

### Changed

- Library code is aligned with Angular 22: redundant `standalone: true` flags and
  `CommonModule` imports are removed and host listeners are declared in the `host`
  metadata. There is no change to the public API, and the peer range stays
  `^21.0.0 || ^22.0.0`.

## [1.0.0] - 2026-10-29

First stable release. The public API is now covered by Semantic Versioning, so
breaking changes will only ship in a new major version.

### Added

- `DATEPICKER_INTL` and `SELECT_INTL` injection tokens make the built-in texts of
  `nui-datepicker` and `nui-select` (button names, search placeholder, empty-result
  message, calendar labels) overridable app-wide or per subtree. Both default to
  English.
- `nui-datepicker` accepts `valueFormat="iso-date"` to report local `yyyy-MM-dd`
  strings to the form control without a UTC shift. ISO strings are read back as
  local dates, also inside ranges.
- `nui-datepicker` input is editable: dates typed in the display format are parsed
  on Enter or blur, empty text clears the value and unparseable text is reverted.
- Full keyboard support for `nui-datepicker` (ArrowDown opens the calendar;
  arrows, Home/End and PageUp/PageDown, with Shift for years, move the active day;
  Escape closes and returns focus to the input) and `nui-select` (arrows,
  Home/End, Enter, Escape, Tab, with a visible active-option ring).

### Changed

- **BREAKING — Angular 20 is no longer supported.** The peer range is now
  `^21.0.0 || ^22.0.0`. The datepicker's inline popover needs `@angular/cdk` 21+,
  and the CDK major must match the Angular major.
- **BREAKING — new peer dependencies.** `@angular/cdk`, `@angular/forms` and
  `@angular/router` are now declared peer dependencies, as the kit already imported
  them. npm 7+ and pnpm install them automatically. `date-fns` is a regular
  dependency and is installed with the kit.
- `nui-datepicker` renders its calendar as an inline CDK popover, with grid
  semantics (`role="grid"`, full-date labels, `aria-selected`,
  `aria-current="date"`, a labelled dialog and a live month title).
- `nui-select` follows the WAI-ARIA select-only combobox pattern: the trigger has
  `role="combobox"` with `aria-expanded`, `aria-controls` and
  `aria-activedescendant`, and the popup is a `listbox`. In searchable mode the
  search input becomes the combobox.

### Fixed

- `nui-datepicker` stays visible and clickable inside a modal `<dialog>`.
- `nui-select` has a programmatic name: the dangling `<label for>` is replaced by
  `aria-labelledby`. Its hint, warning and success text is linked with
  `aria-describedby`, and `aria-invalid="true"` is set while a warning is shown.
- Focus returns to the `nui-select` trigger when the listbox closes, instead of
  falling to `<body>`.

## [0.2.1] - 2026-07-23

**No library changes.** The package contents are identical to `0.2.0` — nothing
under `projects/nirengi-ui-kit/src` was touched. If you are on `0.2.0` there is
nothing to gain by upgrading.

This version exists to exercise the release pipeline end to end after publishing
switched from an `NPM_TOKEN` environment variable to an `npm login` session. Only
repository tooling changed: the tracked `.npmrc` was removed because, being
project-level, it overrode a valid `~/.npmrc` login with an empty credential and
broke `npm publish`.

## [0.2.0] - 2026-07-23

### Added

- **Angular 21 and 22 support.** The peer range widens from `^20.3.0` to
  `^20.3.0 || ^21.0.0 || ^22.0.0`, so the kit installs cleanly on Angular 21 and 22
  workspaces. Angular 20 remains supported.

### Changed

- **BREAKING — icons are now RemixIcon instead of Lucide.** `<nui-icon>` renders the
  bundled [RemixIcon](https://remixicon.com) set (3229 glyphs) and every icon name
  changed: names are now upstream kebab-case without the `ri-` prefix
  (`House` → `home-line`, `Check` → `check-line`, `X` → `close-line`,
  `ChevronDown` → `arrow-down-s-line`). `IconName` keeps its shape, so the compiler
  flags every outdated name.
- **BREAKING — `strokeWidth` and `absoluteStrokeWidth` inputs were removed** from
  `<nui-icon>`. RemixIcon is a filled/outlined set with no stroke-width concept;
  pick the `-line` or `-fill` variant of a glyph instead.
- **BREAKING — the icon stylesheet is now a required setup step.** Icons render
  from the vendored RemixIcon web font, so `<nui-icon>` needs its CSS. Consumers of
  `nirengi-ui-kit/styles` get it automatically and need to do nothing. If you build
  your own stylesheet on `nirengi-ui-kit/theme`, add `@import 'nirengi-ui-kit/icons';`
  — without it nothing renders, including the icons inside `nui-select`,
  `nui-datepicker` and `nui-toast`.
- **Icons no longer cost anything in the JavaScript bundle.** The full set used to
  be a single eager constant that could not be tree-shaken, adding ~1.27 MB raw
  (163 kB transfer) to every consumer's initial bundle. An icon is now a CSS class,
  which also means a name computed at runtime works exactly like a literal one. The
  showcase's initial transfer went from 411.8 kB back down to 179.3 kB — below the
  248.6 kB it measured before the RemixIcon switch.
- `nui-icon` renders an `<i>` carrying the glyph rather than an inline `<svg>`;
  `color` now drives CSS `color` and `size` drives `font-size`. `currentColor`
  inheritance, the rendered box size, and `aria-hidden` are unchanged.

### Removed

- **BREAKING — `ALL_ICONS` and `IconNames` exports.** The font carries the glyphs,
  so there is no path-data map to expose and no reason to ship a 3229-entry array to
  every consumer. For an icon picker, `loadNuiIconNames()` resolves the same list in
  its own lazy chunk: `const names = await loadNuiIconNames();`.
- **`lucide-angular` runtime dependency.** It declared `@angular/core: 13.x - 21.x`
  and was bundled into the package via `allowedNonPeerDependencies`, which forced
  consumers on Angular 22 to install with `--legacy-peer-deps`. The kit now has no
  runtime icon dependency at all: the framework-agnostic `remixicon` CSS and font are
  vendored at development time (`npm run generate:icons`) and committed.
  Angular 20 support (`^20.3.0 || ^21.0.0 || ^22.0.0`) is unaffected.

## [0.1.6] - 2026-06-07

### Added

- **Zero-config styling** — the library now ships self-contained CSS, so consumers
  can use the components without installing or configuring Tailwind themselves.
- **npm publish configuration** — `nirengi-ui-kit` is set up for public publishing
  to the npm registry.

### Changed

- Rewrote the consumer-facing README as an npm landing page with per-component
  usage examples.

### Fixed

- Resolved TypeScript 5.9 build errors in `tsconfig.lib.json` by adding `rootDir`
  and dropping the deprecated `baseUrl`.
- Made the repo-wide ESLint baseline pass cleanly.

## [0.1.5] - 2026-06-06

First public release of **nirengi-ui-kit** — an Angular 20, signal-based, zoneless
component library (selector prefix `nui`), built with `ng-packagr`.

### Added

- **Component set** — `accordion`, `badge`, `breadcrumb`, `button`, `checkbox`,
  `datepicker`, `file-upload`, `heading`, `icon`, `list`, `modal`, `paragraph`,
  `popover`, `radio`, `select`, `switch`, `table`, `tabs`, `textarea`, `textbox`,
  `toast`, and `tooltip`.
- **Signal-based, zoneless architecture** — standalone components with `OnPush`
  change detection and signal APIs (`input()` / `output()` / `model()` /
  `computed()` / `effect()`).
- **Form controls** built on the signal-based `ValueAccessorBase`, with clearable
  inputs for `textbox` and `datepicker` and tri-state support for `checkbox`.
- **Central design tokens** — a size (`xs`–`xl`) and color-variant system driven by
  `tailwind.config.js` and `common/enums`, with no hard-coded pixel values.
- **Table** with filtering, pagination, virtual scrolling, multi-select filtering,
  loading state, localizable text, and `rowClick` / `sortChange` / `filterChange`
  output events.
- **Select** dropdown powered by CDK Overlay, with color `variant` theming and a
  clear action.
- **Datepicker** with a calendar popup, time selection, and month navigation.
- **Popover** with a close button and configurable outside-click behavior.
- **Dark mode** support across components and design tokens.
- **Accessibility** — WCAG 2.1 AA support (keyboard navigation, ARIA, focus
  management).
- **Showcase application** — a config-driven demo app exhibiting every component.

### Changed

- Standardized the component sizing system (`xs`–`xl`) across all components and
  migrated class bindings to `computed()` signals with `OnPush`.
- Renamed the `ButtonComponent` `type` input to `kind` (with a native `type`
  attribute binding) and the icon selector to `nui-icon`.
- Replaced the textbox/select error-state inputs with a flexible color-variant
  system.
- Removed barrel files in favor of explicit exports / direct import paths for
  reliable tree-shaking.
- Differentiated the `H5` and `H6` default heading sizes via a new `2xs` size.

### Fixed

- Prevented the popover from immediately closing on open in production builds and
  fixed a popover directive memory leak.

[1.1.0]: https://github.com/kalemurat/nirengi-ui/releases/tag/v1.1.0
[1.0.1]: https://github.com/kalemurat/nirengi-ui/releases/tag/v1.0.1
[1.0.0]: https://github.com/kalemurat/nirengi-ui/releases/tag/v1.0.0
[0.2.1]: https://github.com/kalemurat/nirengi-ui/releases/tag/v0.2.1
[0.2.0]: https://github.com/kalemurat/nirengi-ui/releases/tag/v0.2.0
[0.1.6]: https://github.com/kalemurat/nirengi-ui/releases/tag/v0.1.6
[0.1.5]: https://github.com/kalemurat/nirengi-ui/releases/tag/v0.1.5
