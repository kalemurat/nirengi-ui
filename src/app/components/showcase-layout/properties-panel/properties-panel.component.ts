import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { PropertyStateService } from '../../../core/services/property-state.service';
import { ComponentRegistryService } from '../../../core/services/component-registry.service';
import { PropertyConfig } from '../../../core/interfaces/showcase-config.interface';

/**
 * Properties Panel Component.
 * Component property'lerini JSON-driven olarak gösterir ve düzenleme imkanı verir.
 * 
 * ## Özellikler
 * - ✅ JSON-driven property editor
 * - ✅ Enum, boolean, string, number tipleri
 * - ✅ Content projection açıklamaları
 * - ✅ Anlık property değişimi
 * 
 * @see {@link PropertyStateService}
 * @see {@link PropertyConfig}
 */
@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './properties-panel.component.html',
  styleUrl: './properties-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertiesPanelComponent {
  /**
   * Servisleri inject eder.
   */
  private readonly route = inject(ActivatedRoute);
  private readonly propertyState = inject(PropertyStateService);
  private readonly registry = inject(ComponentRegistryService);

  /**
   * Aktif component ID.
   * Route parametresinden reactive olarak alınır.
   */
  private readonly componentId = toSignal(
    this.route.params.pipe(
      map(params => params['id'] || 'button')
    ),
    { initialValue: 'button' }
  );

  /**
   * Aktif component config.
   * componentId değiştiğinde otomatik olarak güncellenir.
   */
  protected readonly currentConfig = computed(() => {
    const id = this.componentId();
    return this.registry.getConfig(id);
  });

  /**
   * Property'ler listesi.
   * Config'den okunur.
   */
  protected readonly properties = computed(() => 
    this.currentConfig()?.properties || []
  );

  /**
   * Görünür property'ler listesi.
   * hideInPanel = true olan property'ler filtrelenir.
   */
  protected readonly visibleProperties = computed(() => 
    this.properties().filter(prop => !prop.hideInPanel)
  );

  /**
   * Property değerini okur.
   * 
   * @param name - Property adı
   * @returns Property değeri
   */
  getPropertyValue(name: string): any {
    return this.propertyState.getProperty(name);
  }

  /**
   * Property değerini günceller.
   * Signal reaktif olarak güncellenir.
   * 
   * @param name - Property adı
   * @param value - Yeni değer
   */
  updateProperty(name: string, value: any): void {
    this.propertyState.setProperty(name, value);
  }

  /**
   * Tüm property'leri default değerlere sıfırlar.
   */
  resetProperties(): void {
    const config = this.currentConfig();
    if (config) {
      this.propertyState.resetToDefaults(config);
    }
  }
}
