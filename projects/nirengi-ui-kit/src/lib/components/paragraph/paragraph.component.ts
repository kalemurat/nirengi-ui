import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/** Horizontal text alignment options for the paragraph. */
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

/** Font weight options for the paragraph. */
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
 * Semantic paragraph element with size, color, alignment, weight, truncation, and leading controls.
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
  /** @default Size.Medium */
  size = input<Size>(Size.Medium);

  /** @default ColorVariant.Neutral */
  variant = input<ColorVariant>(ColorVariant.Neutral);

  /** @default ParagraphAlign.Left */
  align = input<ParagraphAlign>(ParagraphAlign.Left);

  /** @default ParagraphWeight.Normal */
  weight = input<ParagraphWeight>(ParagraphWeight.Normal);

  /** @default false */
  truncate = input<boolean>(false);

  /**
   * Clamps text to this many lines. When omitted, the `truncate` input applies instead.
   *
   * @default undefined
   */
  lineClamp = input<number | undefined>(undefined);

  /** @default 'normal' */
  leading = input<'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'>('normal');

  /** @default false */
  marginBottom = input<boolean>(false);

  /** @default false */
  italic = input<boolean>(false);

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
