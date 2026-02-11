import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ComponentRegistryService } from '../../../core/services/component-registry.service';

/**
 * Menu Panel Component.
 * Storybook-style sol menü paneli.
 * Component'leri kategorilere göre gruplandırarak gösterir.
 *
 * ## Özellikler
 * - ✅ JSON-driven menü yapısı
 * - ✅ Kategorilere göre gruplama
 * - ✅ Aktif item highlight
 * - ✅ RouterLink entegrasyonu
 *
 * @see {@link ComponentRegistryService}
 */
@Component({
  selector: 'app-menu-panel',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu-panel.component.html',
  styleUrl: './menu-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPanelComponent {
  /**
   * Kategorilere göre gruplandırılmış component'ler.
   * Computed signal olarak registry'den otomatik güncellenir.
   */
  protected readonly menuCategories = inject(ComponentRegistryService).configsByCategory;

  /**
   * Toplam component sayısı.
   * Header'da gösterilmek için.
   */
  protected readonly totalComponents = computed(
    () => inject(ComponentRegistryService).allConfigs().length
  );

  /**
   * Component registry servisini inject eder.
   * Menü yapısı registry'den okunur.
   */
  private readonly registry = inject(ComponentRegistryService);
}
