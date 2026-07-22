import { Component, input, ChangeDetectionStrategy, computed } from '@angular/core';

import { IconName } from './icon.types';

/**
 * Renders one of the bundled RemixIcon glyphs.
 *
 * The kit vendors RemixIcon's web font rather than wrapping a third-party Angular
 * icon library, so it carries no runtime icon dependency and stays installable on
 * every supported Angular major. An icon is a CSS class on an empty element —
 * nothing about the set reaches your JavaScript bundle, and any name resolves,
 * literal or computed.
 *
 * ⚠️ The stylesheet is a required one-time setup step; without it no icon renders:
 * ```scss
 * @use 'nirengi-ui-kit/icons';
 * ```
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

  /**
   * Carries the BEM hook as well, because a bound `[class]` and a static `class`
   * attribute on the same element are two sources for one value. An unknown name
   * yields a class no rule matches, which renders no glyph rather than throwing.
   */
  protected readonly iconClass = computed(() => `nui-icon ri-${this.name()}`);

  /** Drives `font-size`: the glyph fills its em box, so this is the icon's box in px. */
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
