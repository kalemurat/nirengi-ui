import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectComponent, Size } from '../../../../projects/nirengi-ui-kit/src/public-api';

/**
 * User interface for select options.
 */
interface IUser {
  /** User ID */
  id: number;
  /** User full name */
  name: string;
  /** User role title */
  role: string;
  /** Avatar URL */
  avatar: string;
}

/**
 * Select component showcase page.
 * Demonstrates various usage patterns of the Select component including:
 * - Basic string array selection
 * - Object binding
 * - Multiple selection
 * - Custom templates
 * - Various states (disabled, error, etc.)
 *
 * @see {@link SelectComponent}
 */
@Component({
  selector: 'app-select-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent],
  templateUrl: './select-page.component.html',
  styleUrl: './select-page.component.scss',
})
export class SelectPageComponent {
  /**
   * Data source for simple string array example.
   */
  cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'];

  /**
   * Data source for object selection examples.
   */
  users: IUser[] = [
    { id: 1, name: 'Ahmet Yılmaz', role: 'Developer', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Ayşe Demir', role: 'Designer', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Mehmet Öz', role: 'Manager', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, name: 'Zeynep Kaya', role: 'Analyst', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 5, name: 'Can Yıldız', role: 'Tester', avatar: 'https://i.pravatar.cc/150?u=5' },
  ];

  // Model Signals

  /**
   * Selected city model (string).
   */
  selectedCity = signal<string | null>(null);

  /**
   * Initial city model with default value.
   */
  initialCity = signal<string | null>('İstanbul');

  /**
   * Selected user ID model.
   */
  selectedUser = signal<number | null>(null);

  /**
   * Selected users list for multiple selection.
   */
  selectedUsers = signal<number[]>([]);

  /**
   * Selected full user object model.
   */
  selectedUserObj = signal<IUser | null>(null);

  // Enums

  /**
   * Size enum for template usage.
   */
  protected readonly Size = Size;
}
