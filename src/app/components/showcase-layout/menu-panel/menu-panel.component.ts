import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ComponentRegistryService } from '../../../core/services/component-registry.service';

/**
 * Menu Panel Component.
 * Storybook-style left menu panel.
 * Displays components grouped by categories.
 *
 * ## Features
 * - ✅ JSON-driven menu structure
 * - ✅ Grouped by categories
 * - ✅ Active item highlighting
 * - ✅ RouterLink integration
 *
 * @see {@link ComponentRegistryService}
 */
@Component({
  selector: 'app-menu-panel',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu-panel.component.html',
  styleUrl: './menu-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPanelComponent {
  /**
   * Component registry service.
   * Provides access to all registered UI components and their configurations.
   */
  protected readonly registry = inject(ComponentRegistryService);

  /**
   * Component configurations grouped by categories.
   * Automatically updated from registry as a computed signal.
   */
  protected readonly menuCategories = this.registry.configsByCategory;

  /**
   * Total count of registered components.
   * Displayed in the header section.
   */
  protected readonly totalComponents = computed(() => this.registry.allConfigs().length);
}
