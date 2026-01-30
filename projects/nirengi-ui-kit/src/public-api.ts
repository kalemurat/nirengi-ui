/**
 * Nirengi UI Kit - Public API
 * 
 * Modern ve profesyonel bir Angular UI Kit kütüphanesi.
 * Angular 18+ ve 20 versiyonları ile uyumludur.
 * Tailwind CSS 3 kullanan, tamamen standalone component'lerden oluşur.
 * 
 * @packageDocumentation
 * 
 * ## Tree-Shaking Optimized
 * Bu kütüphane explicit exports kullanır. Her dosya direkt path ile import edilir.
 * Böylece modern bundler'lar (esbuild) kullanılmayan kodu otomatik olarak atar.
 * 
 * ## Kullanım Örnekleri
 * 
 * ### Enums (Ortak Değerler)
 * ```typescript
 * // Boyut enum'ı
 * import { Size } from 'nirengi-ui-kit/common/enums/size.enum';
 * 
 * // Renk varyant enum'ı
 * import { ColorVariant } from 'nirengi-ui-kit/common/enums/color-variant.enum';
 * ```
 * 
 * ### Types (Tip Tanımları)
 * ```typescript
 * // Boyut tipleri
 * import { SizeType, SizeValue } from 'nirengi-ui-kit/common/types/size.types';
 * 
 * // Renk tipleri
 * import { ColorVariantType, ColorValue } from 'nirengi-ui-kit/common/types/color.types';
 * ```
 * 
 * ### Constants (Sabitler)
 * ```typescript
 * // Boyut mapping sabitleri
 * import { 
 *   SIZE_HEIGHT_MAP, 
 *   SIZE_PADDING_MAP,
 *   SIZE_TEXT_MAP,
 *   SIZE_ICON_MAP,
 *   SIZE_RADIUS_MAP
 * } from 'nirengi-ui-kit/common/constants/size.constants';
 * 
 * // Renk mapping sabitleri
 * import { 
 *   COLOR_BG_MAP, 
 *   COLOR_TEXT_MAP,
 *   COLOR_BORDER_MAP,
 *   COLOR_VARIANT_MAP,
 *   COLOR_DEFAULT_SHADE_MAP,
 *   COLOR_HOVER_SHADE_MAP
 * } from 'nirengi-ui-kit/common/constants/color.constants';
 * ```
 * 
 * ### Design Tokens
 * ```typescript
 * // Renk token'ları
 * import { designTokenColors } from 'nirengi-ui-kit/design-tokens/colors';
 * 
 * // Spacing token'ları
 * import { designTokenSpacing } from 'nirengi-ui-kit/design-tokens/spacing';
 * 
 * // Typography token'ları
 * import { 
 *   designTokenFontFamily,
 *   designTokenFontSizes, 
 *   designTokenFontWeights 
 * } from 'nirengi-ui-kit/design-tokens/typography';
 * 
 * // Shadow token'ları
 * import { designTokenShadows } from 'nirengi-ui-kit/design-tokens/shadows';
 * 
 * // Breakpoint token'ları
 * import { designTokenBreakpoints } from 'nirengi-ui-kit/design-tokens/breakpoints';
 * ```
 * 
 * ### Components (Gelecekte eklenecek)
 * ```typescript
 * // Button component
 * import { ButtonComponent } from 'nirengi-ui-kit/components/button/button.component';
 * 
 * // Input component
 * import { InputComponent } from 'nirengi-ui-kit/components/input/input.component';
 * ```
 * 
 * ## Path Alias Kullanımı (Kütüphane içinde)
 * Kütüphane geliştirirken TypeScript path alias'ları kullanabilirsiniz:
 * ```typescript
 * import { Size } from '@common/enums/size.enum';
 * import { designTokenColors } from '@design-tokens/colors';
 * import { ButtonComponent } from '@components/button/button.component';
 * ```
 * 
 * ## Özellikler
 * - ✅ Angular 18+ ve 20 uyumlu
 * - ✅ Standalone component'ler
 * - ✅ Tailwind CSS 3 entegrasyonu
 * - ✅ Explicit exports (optimized tree-shaking)
 * - ✅ Profesyonel design system
 * - ✅ TypeScript strict mode
 * - ✅ Kapsamlı tip tanımları
 * - ✅ BEM + Tailwind metodolojisi
 * - ✅ Responsive tasarım desteği
 * - ✅ Accessibility standartları
 */

// ============================================================================
// COMMON - ENUMS
// ============================================================================

/**
 * UI Kit standart boyut değerleri.
 * @see {@link Size}
 */
export { Size } from './lib/common/enums/size.enum';

/**
 * UI Kit standart renk varyantları.
 * @see {@link ColorVariant}
 */
export { ColorVariant } from './lib/common/enums/color-variant.enum';

// ============================================================================
// COMMON - TYPES
// ============================================================================

/**
 * Boyut tipi ve değer tipleri.
 * @see {@link SizeType}
 * @see {@link SizeValue}
 */
export type { SizeType, SizeValue } from './lib/common/types/size.types';

/**
 * Renk varyant tipi ve değer tipleri.
 * @see {@link ColorVariantType}
 * @see {@link ColorValue}
 */
export type { ColorVariantType, ColorValue } from './lib/common/types/color.types';

// ============================================================================
// COMMON - CONSTANTS
// ============================================================================

/**
 * Boyut bazlı CSS mapping sabitleri.
 * Height, padding, text size, icon size, gap, border radius değerlerinin Size enum'ına göre map'lenmesi.
 */
export {
  SIZE_HEIGHT_MAP,
  SIZE_PADDING_MAP,
  SIZE_TEXT_MAP,
  SIZE_ICON_MAP,
  SIZE_GAP_MAP,
  SIZE_RADIUS_MAP
} from './lib/common/constants/size.constants';

/**
 * Renk varyant bazlı CSS mapping sabitleri.
 * Background, text, border renk değerlerinin ColorVariant enum'ına göre map'lenmesi.
 */
export {
  COLOR_BG_MAP,
  COLOR_TEXT_MAP,
  COLOR_BORDER_MAP,
  COLOR_VARIANT_MAP,
  COLOR_DEFAULT_SHADE_MAP,
  COLOR_HOVER_SHADE_MAP
} from './lib/common/constants/color.constants';

// ============================================================================
// DESIGN TOKENS
// ============================================================================

/**
 * Design system renk palette'i.
 * Primary, secondary, semantic color tanımları.
 */
export { designTokenColors } from './lib/design-tokens/colors';

/**
 * Design system spacing scale.
 * Margin, padding, gap gibi boşluk değerleri.
 */
export { designTokenSpacing } from './lib/design-tokens/spacing';

/**
 * Design system typography scale.
 * Font family, font size, font weight değerleri.
 */
export {
  designTokenFontFamily,
  designTokenFontSizes,
  designTokenFontWeights
} from './lib/design-tokens/typography';

/**
 * Design system shadow palette.
 * Box shadow değerleri (xs, sm, md, lg, xl, 2xl).
 */
export { designTokenShadows } from './lib/design-tokens/shadows';

/**
 * Design system responsive breakpoints.
 * Mobile, tablet, desktop ve geniş ekran breakpoint'leri.
 */
export { designTokenBreakpoints } from './lib/design-tokens/breakpoints';

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Button component ve button type enum'ı.
 * @see {@link ButtonComponent}
 * @see {@link ButtonType}
 */
export { ButtonComponent, ButtonType } from './lib/components/button/button.component';

/**
 * Heading component ve heading enum'ları.
 * @see {@link HeadingComponent}
 * @see {@link HeadingLevel}
 * @see {@link HeadingAlign}
 * @see {@link HeadingWeight}
 */
export { 
  HeadingComponent, 
  HeadingLevel, 
  HeadingAlign, 
  HeadingWeight 
} from './lib/components/heading/heading.component';

/**
 * Icon component ve type'ları.
 * @see {@link IconComponent}
 * @see {@link IconName}
 */
export { IconComponent } from './lib/components/icon/icon.component';
export type { IconName } from './lib/components/icon/icon.types';
export { ALL_ICONS, IconNames } from './lib/components/icon/icon.types';

/**
 * Badge component ve enum'ları.
 * @see {@link BadgeComponent}
 * @see {@link BadgeType}
 * @see {@link BadgeShape}
 */
export { BadgeComponent, BadgeType, BadgeShape } from './lib/components/badge/badge.component';

/**
 * Textbox component ve type'ları.
 * @see {@link TextboxComponent}
 * @see {@link TextboxType}
 */
export { TextboxComponent } from './lib/components/textbox/textbox.component';
export type { TextboxType } from './lib/components/textbox/textbox.component';

/**
 * Textarea component.
 * @see {@link TextareaComponent}
 */
export { TextareaComponent } from './lib/components/textarea/textarea.component';

/**
 * Checkbox component.
 * @see {@link CheckboxComponent}
 */
export { CheckboxComponent } from './lib/components/checkbox/checkbox.component';

/**
 * Paragraph component ve enum'ları.
 * @see {@link ParagraphComponent}
 * @see {@link ParagraphAlign}
 * @see {@link ParagraphWeight}
 */
export { 
  ParagraphComponent, 
  ParagraphAlign, 
  ParagraphWeight 
} from './lib/components/paragraph/paragraph.component';

// export { InputComponent } from './lib/components/input/input.component';
// export { ModalComponent } from './lib/components/modal/modal.component';

// ============================================================================
// DIRECTIVES (Gelecekte eklenecek)
// ============================================================================

// export { TooltipDirective } from './lib/directives/tooltip/tooltip.directive';
// export { ClickOutsideDirective } from './lib/directives/click-outside/click-outside.directive';

// ============================================================================
// PIPES (Gelecekte eklenecek)
// ============================================================================

// export { SafeHtmlPipe } from './lib/pipes/safe-html/safe-html.pipe';
// export { TruncatePipe } from './lib/pipes/truncate/truncate.pipe';

/**
 * Select component.
 * @see {@link SelectComponent}
 */
export { SelectComponent } from './lib/components/select/select.component';

/**
 * Radio component.
 * @see {@link RadioComponent}
 */
export { RadioComponent } from './lib/components/radio/radio.component';

/**
 * Breadcrumb component.
 * @see {@link BreadcrumbComponent}
 */
export { BreadcrumbComponent } from './lib/components/breadcrumb/breadcrumb.component';
export type { BreadcrumbItem } from './lib/components/breadcrumb/breadcrumb.component';


/**
 * List component and interface.
 * @see {@link ListComponent}
 * @see {@link ListItem}
 */
export { ListComponent } from './lib/components/list/list.component';
export type { ListItem } from './lib/components/list/list.component';

/**
 * Table component and types.
 * @see {@link TableComponent}
 * @see {@link FilterMatchMode}
 * @see {@link FilterMetadata}
 */
export { TableComponent } from './lib/components/table/table.component';
export type { FilterMatchMode, FilterMetadata } from './lib/components/table/table.component';


/**
 * Accordion component and types.
 * @see {@link AccordionComponent}
 * @see {@link AccordionStatus}
 */
export { AccordionComponent } from './lib/components/accordion/accordion.component';
export type { AccordionStatus } from './lib/components/accordion/accordion.component';

/**
 * Datepicker component.
 * @see {@link DatepickerComponent}
 */
export { DatepickerComponent } from './lib/components/datepicker/datepicker.component';

export * from './lib/components/toast';
export * from './lib/components/toast-demo';
