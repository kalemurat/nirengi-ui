import { Component, input, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { ALL_ICONS, IconName } from './icon.types';

/**
 * @see https://lucide.dev/icons/
 *
 * @example
 * <nui-icon name="House" size="24" color="red" />
 * <nui-icon name="Moon" [size]="Size.Large" />
 */
@Component({
  selector: 'nui-icon',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  providers: [{ provide: LUCIDE_ICONS, useValue: new LucideIconProvider(ALL_ICONS) }],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  private readonly SIZE_MAP: Record<string, number> = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  };

  /** Supports autocomplete via the `IconName` type union. */
  name = input.required<IconName>();

  /**
   * Accepts a pixel number, a numeric string, or a size token (`xs` 16 / `sm` 20 / `md` 24 / `lg` 28 / `xl` 32).
   * @default 24
   */
  size = input<number | string>(24);

  /** @default 'currentColor' — inherits from parent element */
  color = input<string>('currentColor');

  /** @default 2 */
  strokeWidth = input<number>(2);

  /** @default false */
  absoluteStrokeWidth = input<boolean>(false);

  class = input<string>('');

  protected readonly numericSize = computed(() => {
    const size = this.size();
    if (typeof size === 'number') {
      return size;
    }
    // Check enum mapping first
    if (this.SIZE_MAP[size] !== undefined) {
      return this.SIZE_MAP[size];
    }
    // Try to parse numeric string
    const parsed = parseInt(size, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
    return 24;
  });
}
