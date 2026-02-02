# Nirengi UI Kit

Modern ve profesyonel bir Angular UI Kit kütüphanesi.

## 🎯 Özellikler

- ✅ **Angular 18+ ve 20 uyumlu** - En güncel Angular versiyonlarını destekler
- ✅ **Standalone Components** - NgModule'siz modern mimari
- ✅ **Tailwind CSS 3** - Utility-first CSS framework entegrasyonu
- ✅ **Tree-Shaking Optimized** - Explicit exports ile optimize edilmiş bundle size
- ✅ **TypeScript Strict Mode** - Tam tip güvenliği
- ✅ **BEM + Tailwind** - Tutarlı ve ölçeklenebilir stil metodolojisi
- ✅ **Design System** - Kapsamlı design token sistemi
- ✅ **Accessibility** - WCAG 2.1 AA standartlarına uygun
- ✅ **Responsive** - Mobil öncelikli responsive tasarım

## 📦 Kurulum

```bash
npm install nirengi-ui-kit
```

## 🚀 Kullanım

### Tree-Shaking Optimizasyonu

Bu kütüphane, **barrel file (index.ts) pattern'i kullanmaz**. Her dosya direkt path ile import edilir. Bu yaklaşım:

- ✅ Garantili tree-shaking sağlar
- ✅ Bundle size'ı minimize eder
- ✅ Explicit dependencies oluşturur
- ✅ Build performansını artırır

### Import Örnekleri

#### Enums (Ortak Değerler)

```typescript
// Size enum - Component boyutlandırma için
import { Size } from 'nirengi-ui-kit/common/enums/size.enum';

// ColorVariant enum - Renk temaları için
import { ColorVariant } from 'nirengi-ui-kit/common/enums/color-variant.enum';

// Kullanım
const buttonSize = Size.Medium;
const buttonVariant = ColorVariant.Primary;
```

#### Types (Tip Tanımları)

```typescript
// Boyut tipleri
import { SizeType, SizeValue } from 'nirengi-ui-kit/common/types/size.types';

// Renk tipleri
import { ColorVariantType, ColorValue } from 'nirengi-ui-kit/common/types/color.types';

// Kullanım
const size: SizeType = 'md';
const variant: ColorVariantType = 'primary';
```

#### Constants (Mapping Sabitleri)

```typescript
// Boyut mapping sabitleri
import {
  SIZE_HEIGHT_MAP,
  SIZE_PADDING_MAP,
  SIZE_TEXT_MAP,
  SIZE_ICON_MAP,
  SIZE_RADIUS_MAP,
} from 'nirengi-ui-kit/common/constants/size.constants';

// Renk mapping sabitleri
import {
  COLOR_BG_MAP,
  COLOR_TEXT_MAP,
  COLOR_BORDER_MAP,
  COLOR_VARIANT_MAP,
} from 'nirengi-ui-kit/common/constants/color.constants';

// Kullanım
const height = SIZE_HEIGHT_MAP[Size.Large]; // '48px'
const bgColor = COLOR_BG_MAP[ColorVariant.Primary]; // 'bg-blue-600'
```

#### Design Tokens

```typescript
// Renk palette
import { designTokenColors } from 'nirengi-ui-kit/design-tokens/colors';

// Spacing scale
import { designTokenSpacing } from 'nirengi-ui-kit/design-tokens/spacing';

// Typography
import {
  designTokenFontFamily,
  designTokenFontSizes,
  designTokenFontWeights,
} from 'nirengi-ui-kit/design-tokens/typography';

// Shadows
import { designTokenShadows } from 'nirengi-ui-kit/design-tokens/shadows';

// Breakpoints
import { designTokenBreakpoints } from 'nirengi-ui-kit/design-tokens/breakpoints';

// Kullanım
const primaryColor = designTokenColors.primary['600'];
const spacing4 = designTokenSpacing['4']; // '1rem'
const shadowMd = designTokenShadows.md;
```

#### Components (Gelecekte eklenecek)

```typescript
// Button component
import { ButtonComponent } from 'nirengi-ui-kit/components/button/button.component';

// Input component
import { InputComponent } from 'nirengi-ui-kit/components/input/input.component';

// Modal component
import { ModalComponent } from 'nirengi-ui-kit/components/modal/modal.component';
```

## 🛠️ Kütüphane Geliştirme

### Path Alias Kullanımı

Kütüphane içinde geliştirme yaparken TypeScript path alias'ları kullanılabilir:

```typescript
// ✅ Kütüphane içinde (development)
import { Size } from '@common/enums/size.enum';
import { designTokenColors } from '@design-tokens/colors';
import { ButtonComponent } from '@components/button/button.component';

// ✅ Kütüphane dışında (consumers)
import { Size } from 'nirengi-ui-kit/common/enums/size.enum';
import { designTokenColors } from 'nirengi-ui-kit/design-tokens/colors';
import { ButtonComponent } from 'nirengi-ui-kit/components/button/button.component';
```

### Build

```bash
# Library build
ng build nirengi-ui-kit

# Production build with optimization
ng build nirengi-ui-kit --configuration production
```

### Test

```bash
# Unit tests
ng test nirengi-ui-kit

# Coverage
ng test nirengi-ui-kit --code-coverage
```

## 📚 Dokümantasyon

### Mimari Prensipleri

1. **Standalone Components**: Tüm component'ler standalone, NgModule kullanılmaz
2. **Signals API**: Reaktif state yönetimi için Angular Signals
3. **Zoneless**: Zone.js'siz çalışacak şekilde tasarlanmış
4. **BEM + Tailwind**: HTML'de İngilizce BEM class'ları, SCSS'de @apply ile Tailwind
5. **Explicit Exports**: Tree-shaking için her dosya direkt export edilir

### Design System - Merkezi Yönetim

#### ⚠️ ÖNEMLİ: Boyut Yönetimi

Tüm componentlerin boyutları (height, padding, text-size, gap, icon-size, border-radius) **merkezi olarak** `projects/nirengi-ui-kit/tailwind.config.js` dosyasından yönetilir.

**✅ DOĞRU YAKLAŞIM: Tailwind Config**

Tüm boyutlar Tailwind'in `theme.extend` konfigürasyonunda tanımlanmıştır:

```javascript
// projects/nirengi-ui-kit/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // Component yükseklikleri
      height: {
        'component-xs': '24px', // h-component-xs
        'component-sm': '32px', // h-component-sm
        'component-md': '36px', // h-component-md
        'component-lg': '40px', // h-component-lg
        'component-xl': '48px', // h-component-xl
      },

      // Özel spacing değerleri
      spacing: {
        3.5: '0.875rem', // px-3.5 için
      },

      // Renkler, font'lar vs.
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

**Component SCSS Kullanımı:**

```scss
// ✅ DOĞRU: Tailwind custom class'larını kullan
.nui-button {
  &--xs {
    @apply h-component-xs gap-1 px-2 text-xs;
  }

  &--sm {
    @apply h-component-sm gap-1.5 px-3 text-sm;
  }

  &--md {
    @apply h-component-md gap-1.5 px-3.5 text-sm;
  }
}
```

```scss
// ❌ YANLIŞ: Hard-coded değerler kullanma
.nui-input {
  &--small {
    height: 32px; // Direkt pixel değeri
    padding: 12px;
  }
}
```

#### Mevcut Size Mapping'leri

| Size   | Height Class   | Pixel | Padding | Text      | Gap     |
| ------ | -------------- | ----- | ------- | --------- | ------- |
| XSmall | h-component-xs | 24px  | px-2    | text-xs   | gap-1   |
| Small  | h-component-sm | 32px  | px-3    | text-sm   | gap-1.5 |
| Medium | h-component-md | 36px  | px-3.5  | text-sm   | gap-1.5 |
| Large  | h-component-lg | 40px  | px-5    | text-base | gap-2   |
| XLarge | h-component-xl | 48px  | px-6    | text-lg   | gap-2.5 |

#### size.constants.ts Dosyası

`common/constants/size.constants.ts` dosyası artık **sadece REFERANS** amaçlı tutulmaktadır. Gerçek değerler `tailwind.config.js`'de. Bu dosya, hangi Tailwind class'ını kullanmanız gerektiğini hatırlatmak için mevcuttur.

**💡 Neden Tailwind Config?**

- ✅ Tailwind'in doğal ekosistemi içinde
- ✅ Build time'da CSS'e compile edilir
- ✅ Consumer projede configuration override gerekmez
- ✅ Standard Tailwind best practices
  ✅ Design token mantığıyla uyumlu
- ✅ Tüm componentler (Button, Input, Select, Badge, Chip) tutarlı
- ✅ Tek bir yerden tüm UI Kit'in boyutlarını değiştirebiliriz

**🔒 Library Distribution:**

Library build edildiğinde (`ng build nirengi-ui-kit`), Tailwind config'deki tüm custom değerler CSS'e compile edilerek `dist/` klasörüne gider. Consumer projesinde Tailwind config'e herhangi bir ekleme yapmaya gerek yoktur.

### Stil Metodolojisi

```html
<!-- HTML: BEM class isimleri -->
<button class="button button--primary button--medium">
  <span class="button__icon">📌</span>
  <span class="button__text">Kaydet</span>
</button>
```

```scss
// SCSS: Nested BEM + Tailwind @apply
.button {
  @apply inline-flex items-center gap-2 rounded-md font-medium transition-colors;

  &--primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }

  &--medium {
    @apply px-4 py-2 text-base;
  }

  &__icon {
    @apply h-5 w-5;
  }

  &__text {
    @apply truncate;
  }
}
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit atın (`git commit -m 'feat: add amazing feature'`)
4. Push yapın (`git push origin feature/amazing`)
5. Pull Request açın

## 📝 Lisans

MIT

## 🔗 Bağlantılar

- [Angular Docs](https://angular.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

---

**Made with ❤️ by Nirengi Team**
