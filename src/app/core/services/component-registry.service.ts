import { Injectable, signal, computed, Type } from '@angular/core';
import { ComponentShowcaseConfig } from '../interfaces/showcase-config.interface';

/**
 * Component loader fonksiyon tipi.
 * Lazy loading için dynamic import fonksiyonu.
 */
type ComponentLoader = () => Promise<Type<any>>;

/**
 * Component Registry Servisi.
 * Tüm UI Kit component'lerini kaydeder ve dinamik olarak yükler.
 * 
 * ## Sorumluluklar
 * - Component'lerin lazy loading ile yüklenmesi
 * - Showcase config'lerinin merkezi yönetimi
 * - Type-safe component referanslarının sağlanması
 * 
 * ## Kullanım
 * ```typescript
 * // Component-level provide
 * providers: [ComponentRegistryService]
 * 
 * // Component registrar et
 * registry.registerComponent(buttonConfig, () => 
 *   import('nirengi-ui-kit').then(m => m.ButtonComponent)
 * );
 * 
 * // Component yükle
 * const ButtonComponent = await registry.getComponent('button');
 * 
 * // Config oku
 * const config = registry.getConfig('button');
 * ```
 * 
 * @see {@link ComponentShowcaseConfig}
 */
@Injectable()
export class ComponentRegistryService {
  /**
   * Component loader'ların map'i.
   * Key: component ID, Value: loader fonksiyonu
   */
  private readonly loaders = new Map<string, ComponentLoader>();

  /**
   * Yüklenmiş component cache'i.
   * Aynı component'i tekrar yüklememek için cache'lenir.
   */
  private readonly componentCache = new Map<string, Type<any>>();

  /**
   * Component config'lerinin signal'i.
   * Reaktif olarak güncellenir ve menü gibi yerlerde kullanılır.
   */
  private readonly configs = signal<Map<string, ComponentShowcaseConfig>>(
    new Map()
  );

  /**
   * Tüm config'lerin computed list'i.
   * Kategorilere göre gruplama gibi işlemler için kullanılır.
   * 
   * @returns Component config array
   */
  readonly allConfigs = computed(() => 
    Array.from(this.configs().values())
  );

  /**
   * Kategorilere göre gruplandırılmış config'ler.
   * Menü render'ı için kullanılır.
   * 
   * @returns Kategori adı ve o kategorideki config'ler
   */
  readonly configsByCategory = computed(() => {
    const configs = this.allConfigs();
    const categories = new Map<string, ComponentShowcaseConfig[]>();

    configs.forEach(config => {
      const category = config.category || 'Other';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(config);
    });

    return Array.from(categories.entries());
  });

  /**
   * Yeni bir component registrar eder.
   * Config ve loader fonksiyonunu kaydeder.
   * 
   * @param config - Component showcase konfigürasyonu
   * @param loader - Component lazy loader fonksiyonu
   * 
   * @example
   * ```typescript
   * registry.registerComponent(
   *   buttonConfig,
   *   () => import('nirengi-ui-kit').then(m => m.ButtonComponent)
   * );
   * ```
   */
  registerComponent(config: ComponentShowcaseConfig, loader: ComponentLoader): void {
    // Config'i kaydet
    this.configs.update(current => {
      const updated = new Map(current);
      updated.set(config.id, config);
      return updated;
    });

    // Loader'ı kaydet
    this.loaders.set(config.id, loader);
  }

  /**
   * Component'i lazy load eder.
   * İlk yüklemede cache'e alınır, sonraki çağrılarda cache'den döner.
   * 
   * @param id - Component ID
   * @returns Component class referansı
   * @throws Error - Component registrar edilmemişse
   * 
   * @example
   * ```typescript
   * const ButtonComponent = await registry.getComponent('button');
   * // ButtonComponent artık dynamic render için kullanılabilir
   * ```
   */
  async getComponent(id: string): Promise<Type<any>> {
    // Cache'de var mı kontrol et
    if (this.componentCache.has(id)) {
      return this.componentCache.get(id)!;
    }

    // Loader var mı kontrol et
    const loader = this.loaders.get(id);
    if (!loader) {
      throw new Error(`Component "${id}" is not registered in the registry.`);
    }

    // Component'i yükle ve cache'e al
    const component = await loader();
    this.componentCache.set(id, component);

    return component;
  }

  /**
   * Component config'ini getirir.
   * 
   * @param id - Component ID
   * @returns Component config veya undefined
   * 
   * @example
   * ```typescript
   * const config = registry.getConfig('button');
   * console.log(config?.name); // 'Button'
   * ```
   */
  getConfig(id: string): ComponentShowcaseConfig | undefined {
    return this.configs().get(id);
  }

  /**
   * Belirli bir component registrar edilmiş mi kontrol eder.
   * 
   * @param id - Component ID
   * @returns Component registrar edilmişse true
   */
  hasComponent(id: string): boolean {
    return this.configs().has(id);
  }

  /**
   * Tüm registrar edilmiş component ID'lerini döndürür.
   * 
   * @returns Component ID array
   */
  getAllComponentIds(): string[] {
    return Array.from(this.configs().keys());
  }
}
