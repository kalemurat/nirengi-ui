import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { ALL_ICONS, IconName } from './icon.types';

/**
 * Icon component.
 * Renders SVG icons using Lucide icons.
 *
 * ## Features
 * - ✅ Signal-based reactive state
 * - ✅ OnPush change detection strategy
 * - ✅ Lucide icon library integration
 * - ✅ Type-safe icon names
 *
 * @see https://lucide.dev/icons/
 *
 * @example
 * <nui-icon name="House" size="24" color="red" />
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
  /**
   * Name of the icon to display.
   * Supports autocomplete thanks to the IconName type.
   */
  name = input.required<IconName>();

  /**
   * Icon size (pixels).
   * Default: 24
   */
  size = input<number | string>(24);

  /**
   * Icon color.
   * Default: 'currentColor' (inherited from parent)
   */
  color = input<string>('currentColor');

  /**
   * Stroke width.
   * Default: 2
   */
  strokeWidth = input<number>(2);

  /**
   * Should absolute stroke width be used?
   * Default: false
   */
  absoluteStrokeWidth = input<boolean>(false);

  /**
   * Class to be added to the SVG element.
   */
  class = input<string>('');
}
