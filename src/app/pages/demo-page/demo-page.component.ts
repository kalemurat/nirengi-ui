import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ButtonType, ColorVariant, Size, IconName, IconComponent } from 'nirengi-ui-kit';
import { Demo1Component } from './components/demo-1/demo-1.component';

interface IMenuItem {
  id: string;
  label: string;
  icon: IconName;
}

import { ModalContainerComponent } from 'nirengi-ui-kit';

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [Demo1Component, ModalContainerComponent, IconComponent],
  templateUrl: './demo-page.component.html',
  styleUrl: './demo-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoPageComponent {
  // Expose Enums
  readonly ButtonType = ButtonType;
  readonly ColorVariant = ColorVariant;
  readonly Size = Size;

  readonly activeCategory = signal<string>('users');

  readonly menuItems = signal<IMenuItem[]>([
    { id: 'dashboard', label: 'Dashboard', icon: 'home-line' },
    { id: 'users', label: 'Users Management', icon: 'user-line' },
    { id: 'settings', label: 'System Settings', icon: 'settings-line' },
    { id: 'reports', label: 'Audit Reports', icon: 'file-line' },
  ]);

  selectCategory(id: string): void {
    this.activeCategory.set(id);
  }
}
