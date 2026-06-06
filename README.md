# Nirengi UI

Nirengi UI is an Angular-based collection of reusable UI components and example applications designed for building admin panels and complex workflows.

## Highlights

- Modular and extensible architecture
- Components written in TypeScript with strong typing
- Centralized theming and style system
- Production-ready admin UI examples

## Contents

- Projects
- Installation
- Usage
- Contributing
- Sponsorship
- License

## Projects

### nirengi-ui
The main admin application with dashboards, reports and operational flows.

### nirengi-ui-kit
A standalone component library for Nirengi UI offering themeable, reusable Angular components that can be integrated into Nirengi UI or other applications.

Key features:
- Easy setup and integration
- Theme-ready customizable components (Button, Card, Modal, Form controls, etc.)
- Full TypeScript support and type safety
- Simple, developer-friendly API
- Standalone components using modern Angular patterns
- **No Tailwind required in consumer apps** — ships precompiled CSS (see [Styling](#styling))
- Tree-shakable builds
- Documentation and examples

## Installation

To install the UI kit via npm:

```bash
npm install nirengi-ui-kit
```

Or with yarn:

```bash
yarn add nirengi-ui-kit
```

## Quick Start (Angular + TypeScript)

```typescript
import { Component } from '@angular/core';
import { ButtonComponent } from 'nirengi-ui-kit/components/button/button.component';
import { Size } from 'nirengi-ui-kit/common/enums/size.enum';
import { ColorVariant } from 'nirengi-ui-kit/common/enums/color-variant.enum';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="p-4">
      <h2>Nirengi UI Kit Example</h2>
      <button nui-button
              [size]="buttonSize"
              [variant]="buttonVariant"
              (click)="handleClick()">
        Click me
      </button>
    </div>
  `
})
export class ExampleComponent {
  buttonSize = Size.Medium;
  buttonVariant = ColorVariant.Primary;

  handleClick() {
    alert('Clicked!');
  }
}
```

## Styling

> Short version for now — a fuller styling guide will follow.

`nirengi-ui-kit` is **self-contained**: you do **not** need to install or
configure Tailwind CSS in your app to use it. Each component already carries its
own compiled, scoped styles (Angular emulated view encapsulation), so they will
not leak into or clash with your app's CSS.

There is **one** global layer the components depend on — semantic theme tokens
(`--text-primary`, `--bg-primary`, …), Tailwind's base/`--tw-*` initializers, and
the portalled `nui-select` dropdown styles. Ship it with a single one-time import:

```scss
/* your global stylesheet (e.g. src/styles.scss) */
@import 'nirengi-ui-kit/styles';
```

or in `angular.json`:

```jsonc
"styles": [
  "node_modules/nirengi-ui-kit/styles.css",
  "src/styles.scss"
]
```

That's it — components now render with correct colors, borders, and focus rings,
with **no Tailwind in your project**.

### Dark mode

Theme tokens include light and dark values. Toggle dark mode by adding the
`.dark` class to a parent element (typically `<html>` or `<body>`).

### What ships in the package

| Import path                    | Contents                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| `nirengi-ui-kit/styles`        | **Recommended.** Self-contained global CSS: theme tokens + Tailwind base + utilities + select dropdown. Import this once. |
| `nirengi-ui-kit/theme`         | Just the semantic theme tokens (`:root` + `.dark`). Useful if you already provide the rest. |
| `nirengi-ui-kit/tailwind-config` | The library's `tailwind.config.js`. **Only** if your app already uses Tailwind and you'd rather merge the kit's tokens into your own config instead of importing the CSS. |

### Already using Tailwind? (optional)

If your app uses Tailwind, you can skip `styles.css` and instead merge the kit's
theme into your own config so its utilities resolve in your build:

```js
// tailwind.config.js
const uiKit = require('nirengi-ui-kit/tailwind-config');

module.exports = {
  // ...
  theme: { extend: { ...uiKit.theme.extend } },
};
```

In this mode you still import `nirengi-ui-kit/theme` once for the semantic
CSS custom properties (and `nirengi-ui-kit/styles` if you want the select
dropdown styling without re-declaring it).

## Running the Project Locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/kalemurat/nirengi-ui.git
cd nirengi-ui
npm install
```

Start the development server:

```bash
npm start
```

Open http://localhost:4200/ in your browser after the server starts.

Build the main app:

```bash
npm run build
```

Run tests:

```bash
npm test
```

Build the UI kit library:

```bash
ng build nirengi-ui-kit
```

Run library tests:

```bash
ng test nirengi-ui-kit
```

Refer to [projects/nirengi-ui-kit/README.md](projects/nirengi-ui-kit/README.md) for more library-specific documentation.

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push your branch: `git push origin feature/my-feature`
5. Open a Pull Request

Follow project coding standards and add tests where appropriate. For larger changes, open an issue first to discuss the design.

## Sponsorship



Nirengi UI is a high-performance Angular UI kit built for complex workflows. It is developer-friendly and modular. The project is free for individual use; donations and sponsorships help sustain ongoing development and improvements.

- If you or your company rely on Nirengi UI, consider sponsoring the project to support maintenance, new features, and priority fixes.
- Sponsorship and donations can be made via the GitHub Sponsors button on the repository.

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-pink?logo=github)](https://github.com/sponsors/kalemurat)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
