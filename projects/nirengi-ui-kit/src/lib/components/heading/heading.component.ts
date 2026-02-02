import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Heading level enum.
 * Represents HTML semantic heading levels (h1-h6).
 */
export enum HeadingLevel {
  /** H1 - Page title, highest level */
  H1 = 'h1',
  /** H2 - Main section title */
  H2 = 'h2',
  /** H3 - Subsection title */
  H3 = 'h3',
  /** H4 - Content group title */
  H4 = 'h4',
  /** H5 - Sub-content title */
  H5 = 'h5',
  /** H6 - Lowest level title */
  H6 = 'h6',
}

/**
 * Heading alignment enum.
 * Determines the horizontal alignment of the heading.
 */
export enum HeadingAlign {
  /** Left aligned (default) */
  Left = 'left',
  /** Center aligned */
  Center = 'center',
  /** Right aligned */
  Right = 'right',
}

/**
 * Heading font weight enum.
 * Determines the typographic thickness of the heading.
 */
export enum HeadingWeight {
  /** Normal thickness (400) */
  Normal = 'normal',
  /** Medium thickness (500) */
  Medium = 'medium',
  /** Semi-bold (600) */
  Semibold = 'semibold',
  /** Bold (700) */
  Bold = 'bold',
  /** Extra bold (800) */
  Extrabold = 'extrabold',
}

/**
 * Modern heading component.
 * Uses Angular 20 signal-based API and Tailwind + BEM methodology.
 *
 * ## Features
 * - ✅ Signal-based reactive state management
 * - ✅ OnPush change detection strategy
 * - ✅ Computed signals for class binding
 * - ✅ 6 different HTML semantic levels (h1-h6)
 * - ✅ 5 different sizes (xs, sm, md, lg, xl)
 * - ✅ 7 different color variants (primary, secondary, success, warning, danger, info, neutral)
 * - ✅ 3 different alignments (left, center, right)
 * - ✅ 5 different font weights (normal, medium, semibold, bold, extrabold)
 * - ✅ Truncate and line clamp support
 * - ✅ WCAG 2.1 AA accessibility standards
 * - ✅ SEO optimized semantic HTML
 *
 * ## Design System Integration
 * The component uses central values from the design system:
 * - Font size: Tailwind default typography scale
 * - Colors: Consistent color palette with ColorVariant enum
 * - Spacing: Design token spacing values
 *
 * @example
 * // Basic usage
 * <nui-heading>Main Title</nui-heading>
 *
 * @example
 * // With level and size
 * <nui-heading
 *   [level]="HeadingLevel.H1"
 *   [size]="Size.XLarge"
 *   [variant]="ColorVariant.Primary">
 *   Welcome
 * </nui-heading>
 *
 * @example
 * // With alignment and weight
 * <nui-heading
 *   [align]="HeadingAlign.Center"
 *   [weight]="HeadingWeight.Bold">
 *   Centered Title
 * </nui-heading>
 *
 * @example
 * // With truncate
 * <nui-heading [truncate]="true">
 *   A very long heading text...
 * </nui-heading>
 *
 * @see https://v20.angular.dev/guide/signals
 * @see {@link HeadingLevel} - HTML semantic levels
 * @see {@link Size} - Standard size values
 * @see {@link ColorVariant} - Color variants
 * @see {@link HeadingAlign} - Alignment options
 * @see {@link HeadingWeight} - Font weights
 */
@Component({
  selector: 'nui-heading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heading.component.html',
  styleUrl: './heading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingComponent {
  /**
   * HTML semantic level.
   * Ensures the correct structure in the page hierarchy.
   *
   * @default HeadingLevel.H2
   */
  level = input<HeadingLevel>(HeadingLevel.H2);

  /**
   * Heading size.
   * Determines the visual font size (independent of semantic level).
   * If not specified, it is automatically determined based on the heading level.
   *
   * @default undefined
   */
  size = input<Size | undefined>(undefined);

  /**
   * Color variant.
   * Determines the text color of the heading.
   *
   * @default ColorVariant.Neutral
   */
  variant = input<ColorVariant>(ColorVariant.Neutral);

  /**
   * Horizontal alignment.
   * Determines the text-align value of the heading.
   *
   * @default HeadingAlign.Left
   */
  align = input<HeadingAlign>(HeadingAlign.Left);

  /**
   * Font weight.
   * Determines the typographic thickness of the heading.
   *
   * @default HeadingWeight.Bold
   */
  weight = input<HeadingWeight>(HeadingWeight.Bold);

  /**
   * Truncate state.
   * When true, overflowing text is cut off with an ellipsis.
   *
   * @default false
   */
  truncate = input<boolean>(false);

  /**
   * Line clamp value.
   * Text is cut off after the specified number of lines.
   * If no value is provided, the truncate feature applies.
   *
   * @default undefined
   */
  lineClamp = input<number | undefined>(undefined);

  /**
   * Uppercase state.
   * When true, all characters become uppercase.
   *
   * @default false
   */
  uppercase = input<boolean>(false);

  /**
   * Margin bottom state.
   * When true, a standard margin is added below the heading.
   *
   * @default false
   */
  marginBottom = input<boolean>(false);

  /**
   * Heading text.
   * Content text of the heading.
   *
   * @default ''
   */
  text = input<string>('');

  /**
   * Computed signal to calculate CSS classes for the heading.
   * Performs dynamic class binding using BEM methodology.
   * Updated reactively.
   *
   * @returns CSS class string in BEM format
   */
  protected readonly headingClasses = computed(() => {
    const classes = ['nui-heading'];

    // Automatically size based on level if size is not specified
    const currentSize = this.size() || this.getDefaultSizeByLevel(this.level());
    classes.push(`nui-heading--${currentSize}`);

    classes.push(`nui-heading--${this.variant()}`);
    classes.push(`nui-heading--${this.align()}`);
    classes.push(`nui-heading--${this.weight()}`);

    if (this.truncate()) {
      classes.push('nui-heading--truncate');
    }

    if (this.lineClamp() !== undefined) {
      classes.push(`nui-heading--line-clamp-${this.lineClamp()}`);
    }

    if (this.uppercase()) {
      classes.push('nui-heading--uppercase');
    }

    if (this.marginBottom()) {
      classes.push('nui-heading--margin-bottom');
    }

    return classes.join(' ');
  });

  /**
   * Computed signal to return the heading level for the ARIA level attribute.
   * Required for accessibility.
   * Updated reactively.
   *
   * @returns ARIA level (1-6)
   */
  protected readonly ariaLevel = computed(() => {
    const levelMap: Record<HeadingLevel, number> = {
      [HeadingLevel.H1]: 1,
      [HeadingLevel.H2]: 2,
      [HeadingLevel.H3]: 3,
      [HeadingLevel.H4]: 4,
      [HeadingLevel.H5]: 5,
      [HeadingLevel.H6]: 6,
    };
    return levelMap[this.level()];
  });

  /**
   * Returns the default size based on the heading level.
   *
   * @param level - Current heading level
   * @returns Default size (Size enum)
   */
  private getDefaultSizeByLevel(level: HeadingLevel): Size {
    switch (level) {
      case HeadingLevel.H1:
        return Size.XLarge;
      case HeadingLevel.H2:
        return Size.Large;
      case HeadingLevel.H3:
        return Size.Medium;
      case HeadingLevel.H4:
        return Size.Small;
      case HeadingLevel.H5:
      case HeadingLevel.H6:
        return Size.XSmall;
      default:
        return Size.Medium;
    }
  }
}

