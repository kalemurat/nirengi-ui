import { Injectable, signal, computed } from '@angular/core';
import { IComponentShowcaseConfig } from '../interfaces/showcase-config.interface';

/** @see {@link IComponentShowcaseConfig} */
@Injectable()
export class PropertyStateService {
  readonly allProperties = computed(() => this.propertyValues());

  private readonly propertyValues = signal<Record<string, unknown>>({});

  getProperty(name: string): unknown {
    return this.propertyValues()[name];
  }

  /** Updating the signal automatically triggers all dependent computeds. */
  setProperty(name: string, value: unknown): void {
    this.propertyValues.update((current) => ({
      ...current,
      [name]: value,
    }));
  }

  /** Used when component changes or reset button is clicked. */
  resetToDefaults(config: IComponentShowcaseConfig): void {
    const defaults: Record<string, unknown> = {};

    config.properties.forEach((prop) => {
      defaults[prop.name] = prop.defaultValue;
    });

    this.propertyValues.set(defaults);
  }

  clear(): void {
    this.propertyValues.set({});
  }
}
