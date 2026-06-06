# Changelog

All notable changes to **nirengi-ui-kit** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
While the library is pre-1.0 the public API may change between minor versions.

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

[0.1.5]: https://github.com/kalemurat/nirengi-ui/releases/tag/v0.1.5
