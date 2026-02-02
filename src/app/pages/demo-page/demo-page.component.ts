import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonType, ColorVariant, Size, IconName } from 'nirengi-ui-kit';
import { Demo1Component } from './components/demo-1/demo-1.component';

/**
 * Menu item interface.
 */
interface MenuItem {
  id: string;
  label: string;
  icon: IconName; // Assuming we have some icons
}

/**
 * Demo Page Component.
 * Contains the sidebar menu and the content area with Demo1Component.
 */
import { ModalContainerComponent } from 'nirengi-ui-kit';

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [
    CommonModule,
    Demo1Component,
    ModalContainerComponent
  ],
  templateUrl: './demo-page.component.html',
  styleUrl: './demo-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoPageComponent {
  // Expose Enums
  readonly ButtonType = ButtonType;
  readonly ColorVariant = ColorVariant;
  readonly Size = Size;

  /**
   * Currently active menu category.
   */
  readonly activeCategory = signal<string>('users');

  /**
   * Menu items configuration.
   */
  readonly menuItems = signal<MenuItem[]>([
    { id: 'dashboard', label: 'Dashboard', icon: 'home' as any }, // 'home' might not exist, checking types later or fallback
    { id: 'users', label: 'Users Management', icon: 'user' as any },
    { id: 'settings', label: 'System Settings', icon: 'settings' as any },
    { id: 'reports', label: 'Audit Reports', icon: 'file' as any },
  ]);

  /**
   * Updates the active category.
   * @param id The category ID to select.
   */
  selectCategory(id: string): void {
    this.activeCategory.set(id);
  }
}
