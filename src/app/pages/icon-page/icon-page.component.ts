import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, IconNames, IconName, Size as SizeEnum } from 'nirengi-ui-kit';

/**
 * İkon vitrin sayfası.
 * Mevcut tüm ikonları listeler ve arama özelliği sunar.
 */
@Component({
  selector: 'app-icon-page',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './icon-page.html',
  styleUrl: './icon-page.scss',
})
export class IconPageComponent {
  /**
   * Component içinde kullanmak için IconNames referansı (opsiyonel, signal zaten veriyi tutuyor)
   */
  readonly IconNames = IconNames;

  /**
   * Size enum for template usage.
   */
  readonly Size = SizeEnum;

  /**
   * Arama sorgusu.
   */
  searchQuery = signal('');

  /**
   * Tüm ikonların listesi.
   */
  allIcons = signal<IconName[]>(IconNames);

  /**
   * Filtrelenmiş ikon listesi.
   */
  filteredIcons = computed(() => {
    const query = this.searchQuery().toLowerCase();
    // Performans için limit koymuyoruz ama çok fazla ikon varsa virtual scroll gerekebilir.
    // Şimdilik sorunsuz çalışacaktır.
    return this.allIcons().filter((name) => name.toLowerCase().includes(query));
  });

  /**
   * Arama input'u değiştiğinde çalışır.
   */
  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
