import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';

import { IconComponent, IconName, loadNuiIconNames, Size as SizeEnum } from 'nirengi-ui-kit';

@Component({
  selector: 'app-icon-page',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './icon-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './icon-page.scss',
})
export class IconPageComponent {
  readonly Size = SizeEnum;

  searchQuery = signal('');

  // Rendering an icon never needs the name list — only this browser does, so it
  // pulls the list from its own lazy chunk instead of the initial bundle.
  allIcons = signal<readonly IconName[]>([]);

  filteredIcons = computed(() => {
    const query = this.searchQuery().toLowerCase();
    // Performans için limit koymuyoruz ama çok fazla ikon varsa virtual scroll gerekebilir.
    // Şimdilik sorunsuz çalışacaktır.
    return this.allIcons().filter((name) => name.toLowerCase().includes(query));
  });

  constructor() {
    loadNuiIconNames().then((names) => this.allIcons.set(names));
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
