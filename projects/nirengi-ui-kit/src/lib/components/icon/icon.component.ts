import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { ALL_ICONS, IconName } from './icon.types';

/**
 * İkon bileşeni.
 * Lucide ikonlarını kullanarak SVG ikonlar render eder.
 * 
 * ## Özellikler
 * - ✅ Signal-based reactive state
 * - ✅ OnPush change detection stratejisi
 * - ✅ Lucide icon library integration
 * - ✅ Type-safe icon names
 * 
 * @see https://lucide.dev/icons/
 * 
 * @example
 * <nirengi-icon name="House" size="24" color="red" />
 */
@Component({
  selector: 'nirengi-icon',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  providers: [
    { provide: LUCIDE_ICONS, useValue: new LucideIconProvider(ALL_ICONS) }
  ],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  /**
   * Gösterilecek ikonun adı.
   * IconName tipi sayesinde otomatik tamamlama destekler.
   */
  name = input.required<IconName>();

  /**
   * İkon boyutu (piksel).
   * Varsayılan: 24
   */
  size = input<number | string>(24);

  /**
   * İkon rengi.
   * Varsayılan: 'currentColor' (ebeveynden miras alır)
   */
  color = input<string>('currentColor');

  /**
   * Çizgi kalınlığı.
   * Varsayılan: 2
   */
  strokeWidth = input<number>(2);

  /**
   * Mutlak çizgi kalınlığı kullanılsın mı?
   * Varsayılan: false
   */
  absoluteStrokeWidth = input<boolean>(false);
  
  /**
   * SVG elementine eklenecek class.
   */
  class = input<string>('');
}
