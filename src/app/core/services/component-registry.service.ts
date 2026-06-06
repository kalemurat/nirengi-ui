import { Injectable, signal, computed, Type } from '@angular/core';
import { IComponentShowcaseConfig } from '../interfaces/showcase-config.interface';

type ComponentLoader = () => Promise<Type<unknown>>;

/**
 * ```typescript
 * // Component-level provide
 * providers: [ComponentRegistryService]
 *
 * // Register component
 * registry.registerComponent(buttonConfig, async () => {
 *   const m = await import('nirengi-ui-kit');
 *   return m.ButtonComponent;
 * });
 *
 * // Register Config only (Lazy load is handled inside getComponent)
 * registry.registerConfig(accordionConfig);
 *
 * // Load component
 * const ButtonComponent = await registry.getComponent('button');
 *
 * // Read config
 * const config = registry.getConfig('button');
 * ```
 *
 * @see {@link IComponentShowcaseConfig}
 */
@Injectable()
export class ComponentRegistryService {
  /** Used for operations such as grouping by category. */
  readonly allConfigs = computed(() => Array.from(this.configs().values()));

  /** Configurations grouped by category; used for menu rendering. */
  readonly configsByCategory = computed(() => {
    const configs = this.allConfigs();
    const categories = new Map<string, IComponentShowcaseConfig[]>();

    configs.forEach((config) => {
      const category = config.category || 'Other';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(config);
    });

    return Array.from(categories.entries());
  });

  private readonly loaders = new Map<string, ComponentLoader>();

  private readonly componentCache = new Map<string, Type<unknown>>();

  private readonly configs = signal<Map<string, IComponentShowcaseConfig>>(new Map());

  registerComponent(config: IComponentShowcaseConfig, loader: ComponentLoader): void {
    // Save Config
    this.configs.update((current) => {
      const updated = new Map(current);
      updated.set(config.id, config);
      return updated;
    });

    // Save Loader
    this.loaders.set(config.id, loader);
  }

  /** If no loader is provided, lazy import must be handled inside `getComponent`. */
  registerConfig(config: IComponentShowcaseConfig): void {
    this.configs.update((current) => {
      const updated = new Map(current);
      updated.set(config.id, config);
      return updated;
    });
  }

  /** @throws Error if the component is not registered and has no fallback loader. */
  async getComponent(id: string): Promise<Type<unknown>> {
    // Check cache
    if (this.componentCache.has(id)) {
      return this.componentCache.get(id)!;
    }

    // Check loader
    const loader = this.loaders.get(id);
    if (!loader) {
      // Fallback for components registered via registerConfig (Lazy loaded here)
      switch (id) {
        case 'list': {
          const { ListComponent } = await import('nirengi-ui-kit');
          this.componentCache.set(id, ListComponent);
          return ListComponent;
        }

        case 'accordion': {
          const { AccordionComponent } = await import('nirengi-ui-kit');
          this.componentCache.set(id, AccordionComponent);
          return AccordionComponent;
        }

        default:
          throw new Error(`Component "${id}" is not registered in the registry or missing loader.`);
      }
    }

    // Load component and cache it
    const component = await loader();
    this.componentCache.set(id, component);

    return component;
  }

  getConfig(id: string): IComponentShowcaseConfig | undefined {
    return this.configs().get(id);
  }

  hasComponent(id: string): boolean {
    return this.configs().has(id);
  }

  getAllComponentIds(): string[] {
    return Array.from(this.configs().keys());
  }
}
