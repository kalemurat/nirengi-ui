import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Badge tipi enum'ı.
 * Badge'in görsel stilini belirler.
 */
export enum BadgeType {
  /** Dolu arka plan */
  Solid = 'solid',
  /** Sadece kenarlık */
  Outline = 'outline',
  /** Hafif arka plan */
  Soft = 'soft',
}

/**
 * Badge şekil enum'ı.
 */
export enum BadgeShape {
  /** Yuvarlak köşeli kare */
  Rounded = 'rounded',
  /** Hap şeklinde (tam yuvarlak) */
  Pill = 'pill',
}

/**
 * Modern badge (etiket) component'i.
 * Durum, kategori veya sayaç göstermek için kullanılır.
 *
 * ## Özellikler
 * - ✅ Signal tabanlı reaktif state yönetimi
 * - ✅ OnPush change detection stratejisi
 * - ✅ Computed signals ile class binding
 * - ✅ 3 farklı stil tipi (solid, outline, soft)
 * - ✅ 5 farklı boyut (xs, sm, md, lg, xl)
 * - ✅ 7 farklı renk varyantı
 * - ✅ 2 farklı şekil (rounded, pill)
 * - ✅ Tailwind + BEM metodolojisi
 *
 * @example
 * <nui-badge>Yeni</nui-badge>
 *
 * @example
 * <nui-badge
 *   [variant]="ColorVariant.Success"
 *   [type]="BadgeType.Soft"
 *   [shape]="BadgeShape.Pill">
 *   Tamamlandı
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
   * Badge görsel tipi.
   * @default BadgeType.Solid
   */
  readonly type = input<BadgeType>(BadgeType.Solid);

  /**
   * Renk varyantı.
   * @default ColorVariant.Primary
   */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /**
   * Boyut.
   * @default Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Şekil varyantı.
   * @default BadgeShape.Rounded
   */
  readonly shape = input<BadgeShape>(BadgeShape.Rounded);

  /**
   * Badge için CSS class'larını hesaplayan computed signal.
   * BEM metodolojisi ile dynamic class binding yapar.
   * Reactive olarak güncellenir.
   *
   * @returns BEM formatında CSS class string'i
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
