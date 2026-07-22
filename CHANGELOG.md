# Changelog

All notable changes to **nirengi-ui-kit** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
While the library is pre-1.0 the public API may change between minor versions.

## [Unreleased]

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

[0.1.6]: https://github.com/kalemurat/nirengi-ui/releases/tag/v0.1.6
[0.1.5]: https://github.com/kalemurat/nirengi-ui/releases/tag/v0.1.5
