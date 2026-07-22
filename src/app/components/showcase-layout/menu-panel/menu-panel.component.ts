import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { ComponentRegistryService } from '../../../core/services/component-registry.service';

@Component({
  selector: 'app-menu-panel',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-panel.component.html',
  styleUrl: './menu-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPanelComponent {
  protected readonly registry = inject(ComponentRegistryService);

  protected readonly menuCategories = this.registry.configsByCategory;

  protected readonly totalComponents = computed(() => this.registry.allConfigs().length);
}
