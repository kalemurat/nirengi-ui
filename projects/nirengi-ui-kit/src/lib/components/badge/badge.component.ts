import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/** Determines the visual style of the badge. */
export enum BadgeType {
  /** Filled background */
  Solid = 'solid',
  /** Border only */
  Outline = 'outline',
  /** Soft background */
  Soft = 'soft',
}

export enum BadgeShape {
  /** Rounded corner square */
  Rounded = 'rounded',
  /** Pill shape (fully rounded) */
  Pill = 'pill',
}

/**
 * Badge component for displaying status, category, or counter labels.
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
  /** @default BadgeType.Solid */
  readonly type = input<BadgeType>(BadgeType.Solid);

  /** @default ColorVariant.Primary */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /** @default Size.Medium */
  readonly size = input<Size>(Size.Medium);

  /** @default BadgeShape.Rounded */
  readonly shape = input<BadgeShape>(BadgeShape.Rounded);

  protected readonly badgeClasses = computed(() => {
    const classes = ['nui-badge'];

    classes.push(`nui-badge--${this.type()}`);
    classes.push(`nui-badge--${this.variant()}`);
    classes.push(`nui-badge--${this.size()}`);
    classes.push(`nui-badge--${this.shape()}`);

    return classes.join(' ');
  });
}
