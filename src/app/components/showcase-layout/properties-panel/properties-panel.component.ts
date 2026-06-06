import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { PropertyStateService } from '../../../core/services/property-state.service';
import { ComponentRegistryService } from '../../../core/services/component-registry.service';

import { TextboxComponent, CheckboxComponent, SelectComponent, Size } from 'nirengi-ui-kit';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, TextboxComponent, CheckboxComponent, SelectComponent],
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

  private readonly route = inject(ActivatedRoute);
  private readonly propertyState = inject(PropertyStateService);
  private readonly registry = inject(ComponentRegistryService);

  private readonly componentId = toSignal(
    this.route.params.pipe(map((params) => params['id'] || 'button')),
    { initialValue: 'button' }
  );

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
