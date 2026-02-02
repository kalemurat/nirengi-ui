import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectComponent, Size } from '../../../../projects/nirengi-ui-kit/src/public-api';

interface User {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

@Component({
  selector: 'app-select-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent],
  templateUrl: './select-page.component.html',
})
export class SelectPageComponent {
  // Enums
  protected readonly Size = Size;

  // Data Sources
  cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'];
  users: User[] = [
    { id: 1, name: 'Ahmet Yılmaz', role: 'Developer', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Ayşe Demir', role: 'Designer', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Mehmet Öz', role: 'Manager', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, name: 'Zeynep Kaya', role: 'Analyst', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 5, name: 'Can Yıldız', role: 'Tester', avatar: 'https://i.pravatar.cc/150?u=5' },
  ];

  // Model Signals
  selectedCity = signal<string | null>(null);
  initialCity = signal<string | null>('İstanbul');
  selectedUser = signal<number | null>(null);
  selectedUsers = signal<number[]>([]);
  selectedUserObj = signal<User | null>(null);
}
