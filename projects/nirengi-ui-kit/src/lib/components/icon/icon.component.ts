import { Component, input, ChangeDetectionStrategy, computed } from '@angular/core';

import { ALL_ICONS, IconName } from './icon.types';

/**
 * Renders one of the bundled RemixIcon glyphs as an inline `<svg>`.
 *
 * Icons ship as raw path data generated from the upstream `remixicon` assets, so
 * the kit carries no runtime icon dependency and stays installable on every
 * supported Angular major. The path is bound through `[attr.d]`, never
 * `innerHTML`, so no sanitizer bypass is involved.
 *
 * @see https://remixicon.com — browse names (drop the `ri-` prefix)
 *
 * @example
 * <nui-icon name="home-line" size="24" color="red" />
 * <nui-icon name="moon-line" [size]="Size.Large" />
 */
@Component({
  selector: 'nui-icon',
  standalone: true,
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

  /** RemixIcon name in upstream kebab-case (`home-line`); autocompletes via `IconName`. */
  name = input.required<IconName>();

  /**
   * Accepts a pixel number, a numeric string, or a size token (`xs` 16 / `sm` 20 / `md` 24 / `lg` 28 / `xl` 32).
   * @default 24
   */
  size = input<number | string>(24);

  /** @default 'currentColor' — inherits from parent element */
  color = input<string>('currentColor');

  class = input<string>('');

  /** `undefined` for an unknown name, which renders an empty `<svg>` rather than throwing. */
  protected readonly pathData = computed<string | undefined>(() => ALL_ICONS[this.name()]);

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
