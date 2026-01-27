# Nirengi UI Kit

Modern ve profesyonel bir **Angular UI Kit** kütüphanesi. Angular 18+ ve 20 versiyonları ile uyumlu, Tailwind CSS 3 tabanlı, tamamen standalone component'lerden oluşan bir tasarım sistemi.

## 🎯 Özellikler

- ✅ **Angular 18+ ve 20 Uyumlu**: En güncel Angular versiyonlarıyla çalışır
- ✅ **Standalone Components**: NgModule'siz, modern Angular mimarisi
- ✅ **Tailwind CSS 3**: Ana projenin Tailwind konfigürasyonunu kullanır
- ✅ **Signal-Based State**: Reaktif state yönetimi için Angular Signals
- ✅ **TypeScript Strict Mode**: Tam tip güvenliği
- ✅ **BEM + Tailwind Metodolojisi**: Temiz ve sürdürülebilir CSS
- ✅ **Profesyonel Design System**: Tutarlı design token'lar
- ✅ **Responsive Design**: Mobil-first yaklaşım
- ✅ **Accessibility (A11y)**: WCAG 2.1 AA standartları
- ✅ **Tree-Shakeable**: Optimize edilmiş bundle boyutu

## 📦 Kurulum

UI Kit zaten mevcut Angular workspace'inde bir library olarak bulunuyor. Ana projeden kullanmak için:

```typescript
// Ortak yapılar
import { Size, ColorVariant } from 'nirengi-ui-kit';

// Design token'lar
import { designTokenColors } from 'nirengi-ui-kit/design-tokens';

// Component'ler (gelecekte)
import { ButtonComponent } from 'nirengi-ui-kit/components';
```

## 🎨 Design System

### Renk Varyantları

UI Kit 7 farklı semantik renk varyantı sunar:

- **Primary**: Ana marka rengi (Mavi)
- **Secondary**: İkincil renk (Gri)
- **Success**: Başarı durumu (Yeşil)
- **Warning**: Uyarı durumu (Turuncu)
- **Danger**: Hata/Tehlike (Kırmızı)
- **Info**: Bilgi (Cyan)
- **Neutral**: Nötr ton (Slate)

Her renk 11 farklı ton içerir (50-950).

```typescript
import { ColorVariant } from 'nirengi-ui-kit';

// Kullanım
const variant = ColorVariant.Primary;
```

### Boyutlar

5 standart boyut seviyesi:

- **XS** (Extra Small): `xs` - 24px
- **SM** (Small): `sm` - 32px
- **MD** (Medium): `md` - 40px
- **LG** (Large): `lg` - 48px
- **XL** (Extra Large): `xl` - 56px

```typescript
import { Size } from 'nirengi-ui-kit';

// Kullanım
const size = Size.Medium;
```

### Design Tokens

Design token'lar, tasarım sisteminin temel yapı taşlarıdır:

```typescript
import {
  designTokenColors,      // Renk paleti
  designTokenSpacing,     // Spacing skalası
  designTokenFontSizes,   // Font boyutları
  designTokenShadows,     // Gölge değerleri
  designTokenBreakpoints  // Responsive breakpoint'ler
} from 'nirengi-ui-kit/design-tokens';

// CSS Variables olarak da kullanılabilir
// var(--nui-primary-600)
// var(--nui-spacing-4)
// var(--nui-text-base)
```

## 📁 Proje Yapısı

```
projects/nirengi-ui-kit/
├── src/
│   ├── lib/
│   │   ├── common/                 # Ortak yapılar
│   │   │   ├── enums/             # Enum tanımları
│   │   │   │   ├── size.enum.ts
│   │   │   │   └── color-variant.enum.ts
│   │   │   ├── types/             # TypeScript tipleri
│   │   │   │   ├── size.types.ts
│   │   │   │   └── color.types.ts
│   │   │   ├── constants/         # Sabit değerler
│   │   │   │   ├── size.constants.ts
│   │   │   │   └── color.constants.ts
│   │   │   └── index.ts
│   │   ├── design-tokens/         # Design system
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   ├── typography.ts
│   │   │   ├── shadows.ts
│   │   │   ├── breakpoints.ts
│   │   │   └── index.ts
│   │   ├── components/            # UI Components (gelecekte)
│   │   ├── directives/            # Directives (gelecekte)
│   │   ├── pipes/                 # Pipes (gelecekte)
│   │   └── styles/                # SCSS dosyaları
│   │       ├── _tokens.scss       # CSS variables
│   │       ├── _base.scss         # Base styles
│   │       ├── _utilities.scss    # Utility classes
│   │       └── index.scss         # Ana stil dosyası
│   └── public-api.ts              # Public exports
├── tailwind.config.js             # Tailwind konfigürasyonu
└── tsconfig.lib.json              # TypeScript config
```

## 🚀 Kullanım Örnekleri

### Common Kullanımı

```typescript
import { Size, ColorVariant } from 'nirengi-ui-kit';
import { SIZE_HEIGHT_MAP, COLOR_BG_MAP } from 'nirengi-ui-kit';

class MyComponent {
  // Size enum kullanımı
  buttonSize = Size.Large;
  
  // Color variant kullanımı
  alertVariant = ColorVariant.Warning;
  
  // Constant mapping kullanımı
  getHeight(): string {
    return SIZE_HEIGHT_MAP[this.buttonSize];
  }
  
  getBackgroundClass(): string {
    return COLOR_BG_MAP[this.alertVariant];
  }
}
```

### Design Token Kullanımı

```typescript
import { designTokenColors, designTokenSpacing } from 'nirengi-ui-kit/design-tokens';

// Design token'ları programatik olarak kullan
const primaryColor = designTokenColors.primary[600]; // '#2563eb'
const spacing = designTokenSpacing[4]; // '1rem'
```

### SCSS Stil Kullanımı

```scss
// Ana projenin styles.scss dosyasına ekle
@import 'nirengi-ui-kit/styles/index.scss';

// CSS variables kullanımı
.my-component {
  background-color: var(--nui-primary-600);
  padding: var(--nui-spacing-4);
  border-radius: var(--nui-radius-md);
  box-shadow: var(--nui-shadow-md);
}

// Utility class kullanımı
// <div class="nui-flex nui-flex--center nui-stack--md">
```

## 🛠️ Development

### Library Build

```bash
# UI Kit'i build et
ng build nirengi-ui-kit

# Watch mode
ng build nirengi-ui-kit --watch
```

### Test

```bash
# Unit testleri çalıştır
ng test nirengi-ui-kit
```

## 📋 TypeScript Path Aliases

Proje içinde temiz import path'leri için alias'lar kullanabilirsiniz:

```typescript
// ✅ Alias ile
import { Size } from '@common';
import { designTokenColors } from '@design-tokens';
import { ButtonComponent } from '@components';

// ❌ Uzun path yerine
import { Size } from '../../lib/common/enums/size.enum';
```

Kullanılabilir alias'lar:
- `@common/*` - Ortak yapılar
- `@design-tokens/*` - Design token'lar
- `@components/*` - Component'ler
- `@directives/*` - Directive'ler
- `@pipes/*` - Pipe'lar
- `@styles/*` - Stil dosyaları

## 🎯 Roadmap

- [ ] Button Component
- [ ] Input Component
- [ ] Modal Component
- [ ] Dropdown Component
- [ ] Tooltip Directive
- [ ] Form Components
- [ ] Table Component
- [ ] Navigation Components

## 📝 Lisans

Internal project - Nirengi UI

## 👥 Katkıda Bulunma

Bu kütüphane Nirengi projesi için geliştirilmiştir. Component'ler eklenirken:

1. **Angular 20 Best Practices** kullanın
2. **Standalone component** oluşturun
3. **Signal-based state** yönetimi uygulayın
4. **BEM + Tailwind** metodolojisine uyun
5. **JSDoc dokümantasyonu** ekleyin (Türkçe)
6. **Accessibility** standartlarına uyun
7. **Unit test** yazın
