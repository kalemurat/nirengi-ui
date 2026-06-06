import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, IconNames, IconName, Size as SizeEnum } from 'nirengi-ui-kit';

@Component({
  selector: 'app-icon-page',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './icon-page.html',
  styleUrl: './icon-page.scss',
})
export class IconPageComponent {
  readonly IconNames = IconNames;

  readonly Size = SizeEnum;

  searchQuery = signal('');

  allIcons = signal<IconName[]>(IconNames);

  filteredIcons = computed(() => {
    const query = this.searchQuery().toLowerCase();
    // Performans için limit koymuyoruz ama çok fazla ikon varsa virtual scroll gerekebilir.
    // Şimdilik sorunsuz çalışacaktır.
    return this.allIcons().filter((name) => name.toLowerCase().includes(query));
  });

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
