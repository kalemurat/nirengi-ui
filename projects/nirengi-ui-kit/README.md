# Nirengi UI Kit

A modern, themeable **Angular 20** component library. Standalone, signal-based,
and **zoneless-friendly** — every component is a standalone Angular component with
the `nui` selector prefix. It ships its **own precompiled CSS**, so you do **not**
need Tailwind in your app.

- ✅ Standalone components — no `NgModule`, import only what you use
- ✅ Signal-based API (`input()` / `output()` / `model()`)
- ✅ Self-contained styles — **no Tailwind required** in consumer apps
- ✅ Tree-shakable: direct import paths, no barrel files
- ✅ Strictly typed, design-token driven, light/dark themes
- ✅ Accessibility-minded (WCAG 2.1 AA)

---

## Installation

```bash
npm install nirengi-ui-kit
```

Peer dependencies (Angular 20):

```bash
npm install @angular/core@^20 @angular/common@^20
```

---

## Styling setup (required)

Components depend on **one** global CSS layer (theme tokens, Tailwind base, and the
portalled `nui-select` dropdown styles). Import it **once** — then everything
renders correctly with no Tailwind in your project.

```scss
/* src/styles.scss */
@import 'nirengi-ui-kit/styles';
```

or in `angular.json`:

```jsonc
"styles": [
  "node_modules/nirengi-ui-kit/styles.css",
  "src/styles.scss"
]
```

**Dark mode:** theme tokens include light + dark values. Add the `.dark` class to a
parent (typically `<html>` or `<body>`) to switch.

**Already use Tailwind?** Import `nirengi-ui-kit/theme` (the semantic tokens) and
merge the kit's config so its utilities resolve in your build:

```js
// tailwind.config.js
const uiKit = require('nirengi-ui-kit/tailwind-config');
module.exports = { theme: { extend: { ...uiKit.theme.extend } } };
```

| Import path                      | Contents                                                                 |
| -------------------------------- | ------------------------------------------------------------------------ |
| `nirengi-ui-kit/styles`          | **Recommended.** Full self-contained CSS — import once.                  |
| `nirengi-ui-kit/theme`           | Just the semantic theme tokens (`:root` + `.dark`).                      |
| `nirengi-ui-kit/tailwind-config` | The kit's `tailwind.config.js`, to merge into your own Tailwind setup.   |

---

## Quick start

Import a component directly from its path, add it to your standalone component's
`imports`, and use its `nui-*` selector:

```typescript
import { Component } from '@angular/core';
import { ButtonComponent } from 'nirengi-ui-kit/components/button/button.component';

@Component({
  selector: 'app-root',
  imports: [ButtonComponent],
  template: `<nui-button variant="primary" (clicked)="save()">Save</nui-button>`,
})
export class AppComponent {
  save() {
    /* ... */
  }
}
```

> **Import paths:** there is no barrel `index` — import each component from its
> direct path (e.g. `nirengi-ui-kit/components/button/button.component`) for
> optimal tree-shaking. Enums and tokens have direct paths too
> (`nirengi-ui-kit/common/enums/size.enum`,
> `nirengi-ui-kit/design-tokens/colors`).

**Shared values.** Most components accept a `size` and `variant`:

- `size`: `'2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'` (from `Size` enum)
- `variant`: `'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'` (from `ColorVariant` enum)

```typescript
import { Size } from 'nirengi-ui-kit/common/enums/size.enum';
import { ColorVariant } from 'nirengi-ui-kit/common/enums/color-variant.enum';
```

---

## Components

All selectors use the `nui` prefix. Each entry shows its import path and a minimal
example. String literals (`"primary"`, `"md"`) are accepted in templates in place
of the enum members.

### Typography & content

**Heading** — `nirengi-ui-kit/components/heading/heading.component`

```html
<nui-heading [level]="1" text="Page title" variant="neutral" />
<!-- levels: 1–6 · also: align, weight, size, truncate, uppercase -->
```

**Paragraph** — `nirengi-ui-kit/components/paragraph/paragraph.component`

```html
<nui-paragraph size="md" align="left">Body copy goes here.</nui-paragraph>
```

**Badge** — `nirengi-ui-kit/components/badge/badge.component`

```html
<nui-badge variant="success" type="soft" shape="pill" size="sm">New</nui-badge>
<!-- type: solid | outline | soft · shape: rounded | pill -->
```

**Icon** — `nirengi-ui-kit/components/icon/icon.component`
(icon names come from the bundled Lucide set — see `IconName`)

```html
<nui-icon name="check" [size]="20" color="currentColor" />
```

**List** — `nirengi-ui-kit/components/list/list.component`

```html
<nui-list [items]="users" [itemTemplate]="row" />
<ng-template #row let-user>{{ user.name }}</ng-template>
```

**Breadcrumb** — `nirengi-ui-kit/components/breadcrumb/breadcrumb.component`

```html
<nui-breadcrumb [items]="[{ label: 'Home', url: '/' }, { label: 'Settings' }]" separator="/" />
```

**Accordion** — `nirengi-ui-kit/components/accordion/accordion.component`

```html
<nui-accordion title="Section" content="Panel body" [(expanded)]="isOpen" />
```

**Table** — `nirengi-ui-kit/components/table/table.component`

```html
<nui-table
  [data]="users"
  [columns]="[{ field: 'name', header: 'Name' }, { field: 'email', header: 'Email' }]"
  [pagination]="true"
  (rowClick)="onRow($event)" />
<!-- also: virtualScroll, lazy, sortChange, globalFilter, pageSize -->
```

### Form controls

**Button** — `nirengi-ui-kit/components/button/button.component`

```html
<nui-button kind="solid" variant="primary" size="md" (clicked)="submit()">Save</nui-button>
<!-- kind: solid | outline | ghost | soft · also: disabled, loading, fullWidth, type -->
```

**Textbox** — `nirengi-ui-kit/components/textbox/textbox.component`
(works with `ngModel` / reactive forms)

```html
<nui-textbox label="Email" type="email" placeholder="you@example.com" [(ngModel)]="email" />
<!-- also: icon, hint, clearable, readonly, variant, size -->
```

**Textarea** — `nirengi-ui-kit/components/textarea/textarea.component`

```html
<nui-textarea label="Notes" [rows]="4" [autoResize]="true" [(ngModel)]="notes" />
```

**Checkbox** — `nirengi-ui-kit/components/checkbox/checkbox.component`

```html
<nui-checkbox label="Accept terms" [(ngModel)]="accepted" />
<!-- also: indeterminate, tristate, description, variant, size -->
```

**Radio** — `nirengi-ui-kit/components/radio/radio.component`

```html
<nui-radio name="plan" [value]="'pro'" label="Pro" [(ngModel)]="plan" />
<nui-radio name="plan" [value]="'free'" label="Free" [(ngModel)]="plan" />
```

**Switch** — `nirengi-ui-kit/components/switch/switch.component`

```html
<nui-switch label="Enable notifications" [(ngModel)]="enabled" />
```

**Select** — `nirengi-ui-kit/components/select/select.component`

```html
<nui-select
  label="Country"
  [options]="countries"
  bindLabel="name"
  bindValue="code"
  [searchable]="true"
  [(ngModel)]="country" />
<!-- also: multiple, clearable, itemTemplate -->
```

**Datepicker** — `nirengi-ui-kit/components/datepicker/datepicker.component`

```html
<nui-datepicker label="Date" selectionMode="single" [(ngModel)]="date" (dateChange)="onDate($event)" />
<!-- selectionMode: single | range · also: minDate, maxDate, withTime, clearable -->
```

**File upload** — `nirengi-ui-kit/components/file-upload/file-upload.component`

```html
<nui-file-upload [multiple]="true" accept="image/*" (upload)="onUpload($event)" (fileSelected)="onPick($event)" />
```

### Overlays & feedback

**Tabs** — `nirengi-ui-kit/components/tabs` (`TabsComponent` + `TabComponent`)

```html
<nui-tabs variant="primary" size="md">
  <nui-tab label="Profile">Profile content</nui-tab>
  <nui-tab label="Security">Security content</nui-tab>
</nui-tabs>
```

**Tooltip** — `nirengi-ui-kit/components/tooltip` (directive)

```html
<button nuiTooltip="Helpful hint" nuiTooltipPosition="top">Hover me</button>
```

**Popover** — `nirengi-ui-kit/components/popover` (directive; renders a component)

```html
<button [nuiPopover]="MenuComponent" nuiPopoverPosition="bottom" [nuiPopoverInputs]="{ userId: 1 }"
        (popoverOpened)="onOpen()">
  Open menu
</button>
```

**Toast** — `nirengi-ui-kit/components/toast` (service)

Add the container once near your app root, then inject `ToastService`:

```html
<nui-toast-container />
```

```typescript
import { ToastService } from 'nirengi-ui-kit/components/toast/toast.service';

private readonly toast = inject(ToastService);
this.toast.success({ title: 'Saved', description: 'Your changes were saved.' });
// also: error(), warning(), info()
```

**Modal** — `nirengi-ui-kit/components/modal` (service)

Add the container once near your app root, then inject `ModalService`:

```html
<nui-modal-container />
```

```typescript
import { ModalService } from 'nirengi-ui-kit/components/modal/modal.service';

private readonly modal = inject(ModalService);
const ref = this.modal.open(MyDialogComponent, { size: 'md' });
const result = await ref.afterClosedPromise; // resolves with the close() value
```

---

## Design system

Components are signal-based and OnPush. Sizing and colors come from the central
`Size` and `ColorVariant` enums (source-of-truth values live in the library's
`tailwind.config.js`), so spacing, heights, and palette stay consistent across the
kit. Design tokens are also exported directly:

```typescript
import { designTokenColors } from 'nirengi-ui-kit/design-tokens/colors';
import { designTokenSpacing } from 'nirengi-ui-kit/design-tokens/spacing';
```

For the full size/color reference, theming details, and the contribution guide,
see the [project repository](https://github.com/kalemurat/nirengi-ui).

## License

MIT
