import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonType, ColorVariant, Size, IconName } from 'nirengi-ui-kit';
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
  imports: [CommonModule, Demo1Component, ModalContainerComponent],
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
    { id: 'dashboard', label: 'Dashboard', icon: 'home' as IconName },
    { id: 'users', label: 'Users Management', icon: 'user' as IconName },
    { id: 'settings', label: 'System Settings', icon: 'settings' as IconName },
    { id: 'reports', label: 'Audit Reports', icon: 'file' as IconName },
  ]);

  selectCategory(id: string): void {
    this.activeCategory.set(id);
  }
}
