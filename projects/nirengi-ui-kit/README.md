# Nirengi UI Kit

A modern, professional Angular UI Kit library providing reusable, themeable components for building complex applications.

## Features

- Angular 18+ and 20 compatible
- Standalone components (no NgModule required)
- Tailwind CSS 3 integration
- Tree-shakable builds with explicit imports
- TypeScript strict mode and full typing
- BEM + Tailwind style methodology
- Design token driven system
- Accessibility-minded (WCAG 2.1 AA guidance)
- Responsive and mobile-first

## Installation

Install via npm:

```bash
npm install nirengi-ui-kit
```

## Usage

This library avoids barrel files (index.ts). Import components, enums and tokens via their direct paths to ensure guaranteed tree-shaking and minimal bundle sizes.

### Example: Enums

```typescript
import { Size } from 'nirengi-ui-kit/common/enums/size.enum';
import { ColorVariant } from 'nirengi-ui-kit/common/enums/color-variant.enum';

const buttonSize = Size.Medium;
const buttonVariant = ColorVariant.Primary;
```

### Example: Types

```typescript
import { SizeType, SizeValue } from 'nirengi-ui-kit/common/types/size.types';
import { ColorVariantType } from 'nirengi-ui-kit/common/types/color.types';

const size: SizeType = 'md';
const variant: ColorVariantType = 'primary';
```

### Design Tokens

```typescript
import { designTokenColors } from 'nirengi-ui-kit/design-tokens/colors';
import { designTokenSpacing } from 'nirengi-ui-kit/design-tokens/spacing';

const primary600 = designTokenColors.primary['600'];
const spacing4 = designTokenSpacing['4']; // '1rem'
```

### Components (examples)

```typescript
import { ButtonComponent } from 'nirengi-ui-kit/components/button/button.component';
import { InputComponent } from 'nirengi-ui-kit/components/input/input.component';
import { ModalComponent } from 'nirengi-ui-kit/components/modal/modal.component';
```

## Development

Use path aliases during development for convenience. Consumers should always import from the package paths.

```typescript
// Inside the library (dev)
import { Size } from '@common/enums/size.enum';

// Consumer usage
import { Size } from 'nirengi-ui-kit/common/enums/size.enum';
```

### Build

```bash
ng build nirengi-ui-kit
ng build nirengi-ui-kit --configuration production
```

### Test

```bash
ng test nirengi-ui-kit
ng test nirengi-ui-kit --code-coverage
```

## Documentation & Architecture

Principles:

1. Standalone components — no NgModule required.
2. Signals API for reactive state.
3. Zoneless-first design (no runtime dependency on Zone.js).
4. BEM class names combined with Tailwind utility usage via `@apply`.
5. Explicit exports and direct imports to guarantee tree-shaking.

### Design System — Centralized Size Management

All component sizes (height, padding, text-size, gap, icon-size, border-radius) are centrally managed in `projects/nirengi-ui-kit/tailwind.config.js`.

Do not hard-code pixel values in component styles; use Tailwind custom classes defined in the config.

Example tailwind extension:

```javascript
// projects/nirengi-ui-kit/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      height: {
        'component-xs': '24px',
        'component-sm': '32px',
        'component-md': '36px',
        'component-lg': '40px',
        'component-xl': '48px',
      },
      spacing: {
        3.5: '0.875rem',
      },
      colors: {
        /* ... */
      },
      fontFamily: {
        /* ... */
      },
    },
  },
};
```

SCSS usage (preferred):

```scss
.nui-button {
  &--xs { @apply h-component-xs gap-1 px-2 text-xs; }
  &--sm { @apply h-component-sm gap-1.5 px-3 text-sm; }
  &--md { @apply h-component-md gap-1.5 px-3.5 text-sm; }
}
```

Avoid hard-coded values in components (height: 32px etc.).

#### Size mapping reference

| Size   | Height class    | Pixel | Padding | Text     | Gap    |
| ------ | --------------- | ----- | ------- | -------- | ------ |
| XSmall | h-component-xs  | 24px  | px-2    | text-xs  | gap-1  |
| Small  | h-component-sm  | 32px  | px-3    | text-sm  | gap-1.5|
| Medium | h-component-md  | 36px  | px-3.5  | text-sm  | gap-1.5|
| Large  | h-component-lg  | 40px  | px-5    | text-base| gap-2  |
| XLarge | h-component-xl  | 48px  | px-6    | text-lg  | gap-2.5|

Note: `common/constants/size.constants.ts` is kept for reference only. Source-of-truth values live in `tailwind.config.js`.

## Style Methodology

Use English BEM class names with Tailwind utilities applied via SCSS `@apply`.

Example HTML/SCSS:

```html
<button class="button button--primary button--medium">
  <span class="button__icon">📌</span>
  <span class="button__text">Save</span>
</button>
```

```scss
.button {
  @apply inline-flex items-center gap-2 rounded-md font-medium transition-colors;

  &--primary { @apply bg-blue-600 text-white hover:bg-blue-700; }
  &--medium { @apply px-4 py-2 text-base; }
  &__icon { @apply h-5 w-5; }
  &__text { @apply truncate; }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing`
5. Open a Pull Request

Please follow the project's coding standards and add tests for new features. Open an issue for large design changes before implementation.

## License

MIT

## Links

- https://angular.dev
- https://tailwindcss.com
- https://www.typescriptlang.org

---

Made with ❤️ by Nirengi Team
