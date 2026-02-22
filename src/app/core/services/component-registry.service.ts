import { Injectable, signal, computed, Type } from '@angular/core';
import { IComponentShowcaseConfig } from '../interfaces/showcase-config.interface';

/**
 * Component loader function type.
 * Dynamic import function for lazy loading.
 */
type ComponentLoader = () => Promise<Type<unknown>>;

/**
 * Component Registry Service.
 * Registers and dynamically loads all UI Kit components.
 *
 * ## Responsibilities
 * - Lazy loading of components
 * - Central management of showcase configurations
 * - Providing type-safe component references
 *
 * ## Usage
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
  /**
   * Computed list of all configurations.
   * Used for operations such as grouping by category.
   *
   * @returns Component config array
   */
  readonly allConfigs = computed(() => Array.from(this.configs().values()));

  /**
   * Configurations grouped by category.
   * Used for menu rendering.
   *
   * @returns Category name and configs in that category
   */
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

  /**
   * Map of component loaders.
   * Key: component ID, Value: loader function
   */
  private readonly loaders = new Map<string, ComponentLoader>();

  /**
   * Cached loaded components.
   * Cached to avoid reloading the same component.
   */
  private readonly componentCache = new Map<string, Type<unknown>>();

  /**
   * Signal for component configurations.
   * Reactively updated and used in places like the menu.
   */
  private readonly configs = signal<Map<string, IComponentShowcaseConfig>>(new Map());

  /**
   * Registers a new component.
   * Saves the configuration and loader function.
   *
   * @param config - Component showcase configuration
   * @param loader - Component lazy loader function
   */
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

  /**
   * Registers only the component configuration.
   * If no loader is provided, it must be handled via lazy import or logic within getComponent.
   *
   * @param config - Component showcase configuration
   */
  registerConfig(config: IComponentShowcaseConfig): void {
    this.configs.update((current) => {
      const updated = new Map(current);
      updated.set(config.id, config);
      return updated;
    });
  }

  /**
   * Lazy loads the component.
   * Cached on first load, returns from cache on subsequent calls.
   *
   * @param id - Component ID
   * @returns Component class reference
   * @throws Error - If component is not registered
   */
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

  /**
   * Retrieves the component configuration.
   */
  getConfig(id: string): IComponentShowcaseConfig | undefined {
    return this.configs().get(id);
  }

  /**
   * Checks if a specific component is registered.
   */
  hasComponent(id: string): boolean {
    return this.configs().has(id);
  }

  /**
   * Returns all registered component IDs.
   */
  getAllComponentIds(): string[] {
    return Array.from(this.configs().keys());
  }
}
