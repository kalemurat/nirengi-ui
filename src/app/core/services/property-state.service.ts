import { Injectable, signal, computed } from '@angular/core';
import { ComponentShowcaseConfig } from '../interfaces/showcase-config.interface';

/**
 * Property State Servisi.
 * Aktif component'in property değerlerini signal tabanlı yönetir.
 * 
 * ## Sorumluluklar
 * - Property değerlerinin reaktif state olarak tutulması
 * - Default değerlere sıfırlama
 * - Property değişikliklerinin izlenmesi
 * 
 * ## Kullanım
 * ```typescript
 * // Component-level provide
 * providers: [PropertyStateService]
 * 
 * // Servisi inject et
 * private propertyState = inject(PropertyStateService);
 * 
 * // Değer oku
 * const variant = this.propertyState.getProperty('variant');
 * 
 * // Değer güncelle
 * this.propertyState.setProperty('variant', 'primary');
 * ```
 * 
 * @see {@link ComponentShowcaseConfig}
 */
@Injectable()
export class PropertyStateService {
  /**
   * Property değerleri signal'i.
   * Key-value map olarak property adı ve değerini tutar.
   */
  private readonly propertyValues = signal<Record<string, any>>({});

  /**
   * Tüm property'lerin computed signal'i.
   * Dışarıya sadece okunabilir olarak expose edilir.
   * 
   * @returns Property değerleri map
   */
  readonly allProperties = computed(() => this.propertyValues());

  /**
   * Belirli bir property değerini okur.
   * 
   * @param name - Property adı
   * @returns Property değeri, yoksa undefined
   * 
   * @example
   * ```typescript
   * const variant = this.propertyState.getProperty('variant');
   * // 'primary'
   * ```
   */
  getProperty(name: string): any {
    return this.propertyValues()[name];
  }

  /**
   * Belirli bir property değerini günceller.
   * Signal reaktif olarak güncellendiği için bağlı tüm computed'lar otomatik tetiklenir.
   * 
   * @param name - Property adı
   * @param value - Yeni değer
   * 
   * @example
   * ```typescript
   * this.propertyState.setProperty('variant', 'secondary');
   * // Component otomatik re-render olur
   * ```
   */
  setProperty(name: string, value: any): void {
    this.propertyValues.update(current => ({
      ...current,
      [name]: value
    }));
  }

  /**
   * Tüm property'leri verilen config'deki default değerlere sıfırlar.
   * Component değiştiğinde veya reset butonu tıklandığında kullanılır.
   * 
   * @param config - Component showcase konfigürasyonu
   * 
   * @example
   * ```typescript
   * this.propertyState.resetToDefaults(buttonConfig);
   * // Tüm property'ler default değerlerine döner
   * ```
   */
  resetToDefaults(config: ComponentShowcaseConfig): void {
    const defaults: Record<string, any> = {};
    
    config.properties.forEach(prop => {
      defaults[prop.name] = prop.defaultValue;
    });
    
    this.propertyValues.set(defaults);
  }

  /**
   * Tüm property state'ini temizler.
   * Component destroy olduğunda veya showcase'den çıkıldığında kullanılır.
   */
  clear(): void {
    this.propertyValues.set({});
  }
}
