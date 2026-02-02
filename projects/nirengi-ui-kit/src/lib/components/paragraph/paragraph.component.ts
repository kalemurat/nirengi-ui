import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Paragraph alignment enum.
 * Determines the horizontal alignment of the paragraph.
 */
export enum ParagraphAlign {
  /** Left aligned (default) */
  Left = 'left',
  /** Center aligned */
  Center = 'center',
  /** Right aligned */
  Right = 'right',
  /** Justified */
  Justify = 'justify',
}

/**
 * Paragraph font weight enum.
 * Determines the typographic thickness of the paragraph.
 */
export enum ParagraphWeight {
  /** Thin thickness (300) */
  Light = 'light',
  /** Normal thickness (400) */
  Normal = 'normal',
  /** Medium thickness (500) */
  Medium = 'medium',
  /** Semi-bold (600) */
  Semibold = 'semibold',
  /** Bold (700) */
  Bold = 'bold',
}

/**
 * Modern paragraph component.
 * Uses Angular 20 signal-based API and Tailwind + BEM methodology.
 *
 * ## Features
 * - ✅ Signal-based reactive state management
 * - ✅ OnPush change detection strategy
 * - ✅ Computed signals for class binding
 * - ✅ 5 different sizes (xs, sm, md, lg, xl)
 * - ✅ 7 different color variants (primary, secondary, success, warning, danger, info, neutral)
 * - ✅ 4 different alignments (left, center, right, justify)
 * - ✅ 5 different font weights (light, normal, medium, semibold, bold)
 * - ✅ Truncate and line clamp support
 * - ✅ Leading (line height) control
 * - ✅ Margin bottom support
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
 * <nui-paragraph>This is a paragraph text.</nui-paragraph>
 *
 * @example
 * // With size and color
 * <nui-paragraph
 *   [size]="Size.Large"
 *   [variant]="ColorVariant.Primary">
 *   Blue paragraph in large size
 * </nui-paragraph>
 *
 * @example
 * // With alignment and weight
 * <nui-paragraph
 *   [align]="ParagraphAlign.Center"
 *   [weight]="ParagraphWeight.Medium">
 *   Center aligned, medium thickness
 * </nui-paragraph>
 *
 * @example
 * // With line clamp
 * <nui-paragraph [lineClamp]="3">
 *   A very long paragraph text. This text will be cut off after 3 lines
 *   and an ellipsis will be added to the end...
 * </nui-paragraph>
 *
 * @see https://v20.angular.dev/guide/signals
 * @see {@link Size} - Standard size values
 * @see {@link ColorVariant} - Color variants
 * @see {@link ParagraphAlign} - Alignment options
 * @see {@link ParagraphWeight} - Font weights
 */
@Component({
  selector: 'nui-paragraph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paragraph.component.html',
  styleUrl: './paragraph.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParagraphComponent {
  /**
   * Paragraph size.
   * Determines the visual font size.
   *
   * @default Size.Medium
   */
  size = input<Size>(Size.Medium);

  /**
   * Color variant.
   * Determines the text color of the paragraph.
   *
   * @default ColorVariant.Neutral
   */
  variant = input<ColorVariant>(ColorVariant.Neutral);

  /**
   * Horizontal alignment.
   * Determines the text-align value of the paragraph.
   *
   * @default ParagraphAlign.Left
   */
  align = input<ParagraphAlign>(ParagraphAlign.Left);

  /**
   * Font weight.
   * Determines the typographic thickness of the paragraph.
   *
   * @default ParagraphWeight.Normal
   */
  weight = input<ParagraphWeight>(ParagraphWeight.Normal);

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
   * Leading (line height) value.
   * Determines the spacing between lines.
   *
   * @default 'normal'
   */
  leading = input<'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'>('normal');

  /**
   * Margin bottom state.
   * When true, a standard margin is added below the paragraph.
   *
   * @default false
   */
  marginBottom = input<boolean>(false);

  /**
   * Italic state.
   * When true, text becomes italic.
   *
   * @default false
   */
  italic = input<boolean>(false);

  /**
   * Computed signal to calculate CSS classes for the paragraph.
   * Performs dynamic class binding using BEM methodology.
   * Updated reactively.
   *
   * @returns CSS class string in BEM format
   */
  protected readonly paragraphClasses = computed(() => {
    const classes = ['nui-paragraph'];

    classes.push(`nui-paragraph--${this.size()}`);
    classes.push(`nui-paragraph--${this.variant()}`);
    classes.push(`nui-paragraph--${this.align()}`);
    classes.push(`nui-paragraph--${this.weight()}`);
    classes.push(`nui-paragraph--${this.leading()}`);

    if (this.truncate()) {
      classes.push('nui-paragraph--truncate');
    }

    if (this.lineClamp() !== undefined) {
      classes.push(`nui-paragraph--line-clamp-${this.lineClamp()}`);
    }

    if (this.marginBottom()) {
      classes.push('nui-paragraph--margin-bottom');
    }

    if (this.italic()) {
      classes.push('nui-paragraph--italic');
    }

    return classes.join(' ');
  });
}

