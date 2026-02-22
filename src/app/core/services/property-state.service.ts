import { Injectable, signal, computed } from '@angular/core';
import { IComponentShowcaseConfig } from '../interfaces/showcase-config.interface';

/**
 * Property State Service.
 * Manages the property values of the active component based on signals.
 *
 * ## Responsibilities
 * - Holding property values as reactive state
 * - Resetting to default values
 * - Monitoring property changes
 *
 * ## Usage
 * ```typescript
 * // Component-level provide
 * providers: [PropertyStateService]
 *
 * // Inject service
 * private propertyState = inject(PropertyStateService);
 *
 * // Read value
 * const variant = this.propertyState.getProperty('variant');
 *
 * // Update value
 * this.propertyState.setProperty('variant', 'primary');
 * ```
 *
 * @see {@link IComponentShowcaseConfig}
 */
@Injectable()
export class PropertyStateService {
  /**
   * Computed signal of all properties.
   * Exposed as read-only externally.
   *
   * @returns Property values map
   */
  readonly allProperties = computed(() => this.propertyValues());

  /**
   * Signal for property values.
   * Holds property name and value as a key-value map.
   */
  private readonly propertyValues = signal<Record<string, unknown>>({});

  /**
   * Reads a specific property value.
   *
   * @param name - Property name
   * @returns Property value, undefined if not exists
   *
   * @example
   * ```typescript
   * const variant = this.propertyState.getProperty('variant');
   * // 'primary'
   * ```
   */
  getProperty(name: string): unknown {
    return this.propertyValues()[name];
  }

  /**
   * Updates a specific property value.
   * Since signal is reactively updated, all connected computeds are automatically triggered.
   *
   * @param name - Property name
   * @param value - New value
   *
   * @example
   * ```typescript
   * this.propertyState.setProperty('variant', 'secondary');
   * // Component automatically re-renders
   * ```
   */
  setProperty(name: string, value: unknown): void {
    this.propertyValues.update((current) => ({
      ...current,
      [name]: value,
    }));
  }

  /**
   * Resets all properties to default values in the given config.
   * Used when component changes or reset button is clicked.
   *
   * @param config - Component showcase configuration
   *
   * @example
   * ```typescript
   * this.propertyState.resetToDefaults(buttonConfig);
   * // All properties return to their default values
   * ```
   */
  resetToDefaults(config: IComponentShowcaseConfig): void {
    const defaults: Record<string, unknown> = {};

    config.properties.forEach((prop) => {
      defaults[prop.name] = prop.defaultValue;
    });

    this.propertyValues.set(defaults);
  }

  /**
   * Clears all property state.
   * Used when component is destroyed or showcase is exited.
   */
  clear(): void {
    this.propertyValues.set({});
  }
}
