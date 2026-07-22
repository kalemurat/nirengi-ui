import {
  Component,
  inject,
  computed,
  effect,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { PropertyStateService } from '../../../core/services/property-state.service';
import { ComponentRegistryService } from '../../../core/services/component-registry.service';
import { IPropertyOption } from '../../../core/interfaces/showcase-config.interface';

import {
  TextboxComponent,
  CheckboxComponent,
  SelectComponent,
  IconComponent,
  Size,
  loadNuiIconNames,
} from 'nirengi-ui-kit';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [FormsModule, TextboxComponent, CheckboxComponent, SelectComponent, IconComponent],
  templateUrl: './properties-panel.component.html',
  styleUrl: './properties-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesPanelComponent {
  protected readonly Size = Size;

  protected readonly currentConfig = computed(() => {
    const id = this.componentId();
    return this.registry.getConfig(id);
  });

  protected readonly properties = computed(() => this.currentConfig()?.properties || []);

  protected readonly visibleProperties = computed(() =>
    this.properties().filter((prop) => !prop.hideInPanel)
  );

  protected readonly iconOptions = signal<IPropertyOption[]>([]);

  private readonly route = inject(ActivatedRoute);
  private readonly propertyState = inject(PropertyStateService);
  private readonly registry = inject(ComponentRegistryService);

  private readonly componentId = toSignal(
    this.route.params.pipe(map((params) => params['id'] || 'button')),
    { initialValue: 'button' }
  );

  constructor() {
    // Only the icon picker needs all 3229 names, so the list is fetched the first
    // time a config actually asks for it rather than on every showcase page.
    effect(() => {
      const needsIcons = this.visibleProperties().some((prop) => prop.type === 'icon');

      if (!needsIcons || this.iconOptions().length > 0) {
        return;
      }

      loadNuiIconNames().then((names) =>
        this.iconOptions.set(names.map((name) => ({ label: name, value: name })))
      );
    });
  }

  getPropertyValue(name: string): unknown {
    return this.propertyState.getProperty(name);
  }

  updateProperty(name: string, value: string | number | boolean | null): void {
    this.propertyState.setProperty(name, value);
  }

  resetProperties(): void {
    const config = this.currentConfig();
    if (config) {
      this.propertyState.resetToDefaults(config);
    }
  }
}
