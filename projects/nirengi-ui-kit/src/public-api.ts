/**
 * Nirengi UI Kit - Public API
 *
 * Modern and professional Angular UI Kit library.
 * Compatible with Angular 18+ and 20 versions.
 * Consists of fully standalone components using Tailwind CSS 3.
 *
 * @packageDocumentation
 *
 * ## Tree-Shaking Optimized
 * This library uses explicit exports. Each file is imported with a direct path.
 * Thus, modern bundlers (esbuild) automatically discard unused code.
 *
 * ## Usage Examples
 *
 * ### Enums (Common Values)
 * ```typescript
 * // Size enum
 * import { Size } from 'nirengi-ui-kit/common/enums/size.enum';
 *
 * // Color variant enum
 * import { ColorVariant } from 'nirengi-ui-kit/common/enums/color-variant.enum';
 * ```
 *
 * ### Types (Type Definitions)
 * ```typescript
 * // Size types
 * import { SizeType, SizeValue } from 'nirengi-ui-kit/common/types/size.types';
 *
 * // Color types
 * import { ColorVariantType, ColorValue } from 'nirengi-ui-kit/common/types/color.types';
 * ```
 *
 * ### Constants (Constants)
 * ```typescript
 * // Size mapping constants
 * import {
 *   SIZE_HEIGHT_MAP,
 *   SIZE_PADDING_MAP,
 *   SIZE_TEXT_MAP,
 *   SIZE_ICON_MAP,
 *   SIZE_RADIUS_MAP
 * } from 'nirengi-ui-kit/common/constants/size.constants';
 *
 * // Color mapping constants
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
 * // Color tokens
 * import { designTokenColors } from 'nirengi-ui-kit/design-tokens/colors';
 *
 * // Spacing tokens
 * import { designTokenSpacing } from 'nirengi-ui-kit/design-tokens/spacing';
 *
 * // Typography tokens
 * import {
 *   designTokenFontFamily,
 *   designTokenFontSizes,
 *   designTokenFontWeights
 * } from 'nirengi-ui-kit/design-tokens/typography';
 *
 * // Shadow tokens
 * import { designTokenShadows } from 'nirengi-ui-kit/design-tokens/shadows';
 *
 * // Breakpoint tokens
 * import { designTokenBreakpoints } from 'nirengi-ui-kit/design-tokens/breakpoints';
 * ```
 *
 * ### Components (To be added in the future)
 * ```typescript
 * // Button component
 * import { ButtonComponent } from 'nirengi-ui-kit/components/button/button.component';
 *
 * // Input component
 * import { InputComponent } from 'nirengi-ui-kit/components/input/input.component';
 * ```
 *
 * ## Path Alias Usage (Inside Library)
 * You can use TypeScript path aliases while developing the library:
 * ```typescript
 * import { Size } from '@common/enums/size.enum';
 * import { designTokenColors } from '@design-tokens/colors';
 * import { ButtonComponent } from '@components/button/button.component';
 * ```
 *
 * ## Features
 * - ✅ Angular 18+ and 20 compatible
 * - ✅ Standalone components
 * - ✅ Tailwind CSS 3 integration
 * - ✅ Explicit exports (optimized tree-shaking)
 * - ✅ Professional design system
 * - ✅ TypeScript strict mode
 * - ✅ Comprehensive type definitions
 * - ✅ BEM + Tailwind methodology
 * - ✅ Responsive design support
 * - ✅ Accessibility standards
 */

// ============================================================================
// COMMON - ENUMS
// ============================================================================

/**
 * UI Kit standard size values.
 * @see {@link Size}
 */
export { Size } from './lib/common/enums/size.enum';

/**
 * UI Kit standard color variants.
 * @see {@link ColorVariant}
 */
export { ColorVariant } from './lib/common/enums/color-variant.enum';

// ============================================================================
// COMMON - TYPES
// ============================================================================

/**
 * Size type and value types.
 * @see {@link SizeType}
 * @see {@link SizeValue}
 */
export type { SizeType, SizeValue } from './lib/common/types/size.types';

/**
 * Color variant type and value types.
 * @see {@link ColorVariantType}
 * @see {@link ColorValue}
 */
export type { ColorVariantType, ColorValue } from './lib/common/types/color.types';

// ============================================================================
// COMMON - CONSTANTS
// ============================================================================

/**
 * Size-based CSS mapping constants.
 * Mapping of height, padding, text size, icon size, gap, and border radius values according to the Size enum.
 */
export {
  SIZE_HEIGHT_MAP,
  SIZE_PADDING_MAP,
  SIZE_TEXT_MAP,
  SIZE_ICON_MAP,
  SIZE_GAP_MAP,
  SIZE_RADIUS_MAP,
} from './lib/common/constants/size.constants';

/**
 * Color variant-based CSS mapping constants.
 * Mapping of background, text, and border color values according to the ColorVariant enum.
 */
export {
  COLOR_BG_MAP,
  COLOR_TEXT_MAP,
  COLOR_BORDER_MAP,
  COLOR_VARIANT_MAP,
  COLOR_DEFAULT_SHADE_MAP,
  COLOR_HOVER_SHADE_MAP,
} from './lib/common/constants/color.constants';

// ============================================================================
// DESIGN TOKENS
// ============================================================================

/**
 * Design system color palette.
 * Primary, secondary, and semantic color definitions.
 */
export { designTokenColors } from './lib/design-tokens/colors';

/**
 * Design system spacing scale.
 * Spacing values such as margin, padding, and gap.
 */
export { designTokenSpacing } from './lib/design-tokens/spacing';

/**
 * Design system typography scale.
 * Font family, font size, and font weight values.
 */
export {
  designTokenFontFamily,
  designTokenFontSizes,
  designTokenFontWeights,
} from './lib/design-tokens/typography';

/**
 * Design system shadow palette.
 * Box shadow values (xs, sm, md, lg, xl, 2xl).
 */
export { designTokenShadows } from './lib/design-tokens/shadows';

/**
 * Design system responsive breakpoints.
 * Mobile, tablet, desktop, and wide screen breakpoints.
 */
export { designTokenBreakpoints } from './lib/design-tokens/breakpoints';

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Button component and button type enum.
 * @see {@link ButtonComponent}
 * @see {@link ButtonType}
 */
export { ButtonComponent, ButtonType } from './lib/components/button/button.component';

/**
 * Heading component and heading enums.
 * @see {@link HeadingComponent}
 * @see {@link HeadingLevel}
 * @see {@link HeadingAlign}
 * @see {@link HeadingWeight}
 */
export {
  HeadingComponent,
  HeadingLevel,
  HeadingAlign,
  HeadingWeight,
} from './lib/components/heading/heading.component';

/**
 * Icon component and types.
 * @see {@link IconComponent}
 * @see {@link IconName}
 */
export { IconComponent } from './lib/components/icon/icon.component';
export type { IconName } from './lib/components/icon/icon.types';
export { ALL_ICONS, IconNames } from './lib/components/icon/icon.types';

/**
 * Badge component and enums.
 * @see {@link BadgeComponent}
 * @see {@link BadgeType}
 * @see {@link BadgeShape}
 */
export { BadgeComponent, BadgeType, BadgeShape } from './lib/components/badge/badge.component';

/**
 * Textbox component and types.
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
 * Paragraph component and enums.
 * @see {@link ParagraphComponent}
 * @see {@link ParagraphAlign}
 * @see {@link ParagraphWeight}
 */
export {
  ParagraphComponent,
  ParagraphAlign,
  ParagraphWeight,
} from './lib/components/paragraph/paragraph.component';

// export { InputComponent } from './lib/components/input/input.component';
// export { ModalComponent } from './lib/components/modal/modal.component';

// ============================================================================
// DIRECTIVES (To be added in the future)
// ============================================================================

/**
 * Tooltip directive and component.
 * @see {@link TooltipDirective}
 * @see {@link TooltipComponent}
 * @see {@link TooltipPosition}
 */
export * from './lib/components/tooltip';
export * from './lib/components/tooltip-demo';

// export { ClickOutsideDirective } from './lib/directives/click-outside/click-outside.directive';

// ============================================================================
// PIPES (To be added in the future)
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
 * @see {@link IFilterMetadata}
 * @see {@link ITableColumn}
 * @see {@link FilterMatchMode}
 */
export { TableComponent } from './lib/components/table/table.component';
export type {
  IFilterMetadata,
  ITableColumn,
  FilterMatchMode,
} from './lib/components/table/table.component';

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
export * from './lib/components/modal';
export * from './lib/components/modal-demo';
export * from './lib/components/tabs';
export * from './lib/components/tabs-demo';

/**
 * Switch component.
 * @see {@link SwitchComponent}
 */
export { SwitchComponent } from './lib/components/switch/switch.component';

/**
 * Popover directive and component.
 * @see {@link PopoverDirective}
 * @see {@link PopoverComponent}
 * @see {@link PopoverPosition}
 */
export * from './lib/components/popover';
export * from './lib/components/popover-demo';

/**
 * File Upload component.
 * @see {@link FileUploadComponent}
 */
export * from './lib/components/file-upload';
