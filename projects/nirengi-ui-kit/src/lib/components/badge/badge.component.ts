import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Badge type enum.
 * Determines the visual style of the badge.
 */
export enum BadgeType {
  /** Filled background */
  Solid = 'solid',
  /** Border only */
  Outline = 'outline',
  /** Soft background */
  Soft = 'soft',
}

/**
 * Badge shape enum.
 */
export enum BadgeShape {
  /** Rounded corner square */
  Rounded = 'rounded',
  /** Pill shape (fully rounded) */
  Pill = 'pill',
}

/**
 * Modern badge (label) component.
 * Used to display status, category, or counter.
 *
 * ## Features
 * - ✅ Signal-based reactive state management
 * - ✅ OnPush change detection strategy
 * - ✅ Computed signals for class binding
 * - ✅ 3 different style types (solid, outline, soft)
 * - ✅ 5 different sizes (xs, sm, md, lg, xl)
 * - ✅ 7 different color variants
 * - ✅ 2 different shapes (rounded, pill)
 * - ✅ Tailwind + BEM methodology
 *
 * @example
 * <nui-badge>New</nui-badge>
 *
 * @example
 * <nui-badge
 *   [variant]="ColorVariant.Success"
 *   [type]="BadgeType.Soft"
 *   [shape]="BadgeShape.Pill">
 *   Completed
 * </nui-badge>
 */
@Component({
  selector: 'nui-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  /**
   * Badge visual type.
   * @default BadgeType.Solid
   */
  readonly type = input<BadgeType>(BadgeType.Solid);

  /**
   * Color variant.
   * @default ColorVariant.Primary
   */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /**
   * Size.
   * @default Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Shape variant.
   * @default BadgeShape.Rounded
   */
  readonly shape = input<BadgeShape>(BadgeShape.Rounded);

  /**
   * Computed signal to calculate CSS classes for the badge.
   * Performs dynamic class binding using BEM methodology.
   * Updated reactively.
   *
   * @returns CSS class string in BEM format
   */
  protected readonly badgeClasses = computed(() => {
    const classes = ['nui-badge'];

    classes.push(`nui-badge--${this.type()}`);
    classes.push(`nui-badge--${this.variant()}`);
    classes.push(`nui-badge--${this.size()}`);
    classes.push(`nui-badge--${this.shape()}`);

    return classes.join(' ');
  });
}

