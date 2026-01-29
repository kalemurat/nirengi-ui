import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

/**
 * UI Component menü öğesi interface'i.
 * Her UI componentinin menüdeki temsili için kullanılır.
 */
interface MenuItem {
  /** Component'in görünen adı */
  label: string;
  /** Component'in unique ID'si */
  id: string;
  /** Component'in rota yolu */
  route: string;
  /** Component açıklaması */
  description: string;
  /** Component kategorisi (opsiyonel) */
  category?: string;
}

/**
 * Ana uygulama component'i.
 * UI Kit component'lerini showcase eden menü sistemi.
 * 
 * ## Özellikler
 * - ✅ Signal tabanlı state yönetimi
 * - ✅ Routing ile sayfa geçişleri
 * - ✅ Responsive sidebar menü
 * - ✅ Kategorize edilmiş component listesi
 * 
 * @see https://v20.angular.dev/guide/routing
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /**
   * Uygulama başlığı signal'i.
   */
  protected readonly title = signal('Nirengi UI Kit');

  /**
   * Menü öğeleri listesi.
   */
  protected readonly menuItems = signal<MenuItem[]>([
    {
      id: 'heading',
      route: '/heading',
      label: 'Heading',
      description: 'Typography heading component (h1-h6)',
      category: 'Typography'
    },
    {
      id: 'paragraph',
      route: '/paragraph',
      label: 'Paragraph',
      description: 'Text paragraph component with multiple styles',
      category: 'Typography'
    },
    {
      id: 'button',
      route: '/button',
      label: 'Button',
      description: 'Interactive button with multiple variants',
      category: 'Controls'
    },
    {
      id: 'icon',
      route: '/icon',
      label: 'Icon',
      description: 'Lucide icons wrapper with type safety',
      category: 'Media'
    },
    {
      id: 'badge',
      route: '/badge',
      label: 'Badge',
      description: 'Status indicators and labels',
      category: 'Data Display'
    },
    {
      id: 'textbox',
      route: '/textbox',
      label: 'Text Box',
      description: 'Input fields for user text',
      category: 'Forms'
    },
    {
      id: 'textarea',
      route: '/textarea',
      label: 'Textarea',
      description: 'Multi-line text input area',
      category: 'Forms'
    },
    {
      id: 'select',
      route: '/select',
      label: 'Select',
      description: 'Dropdown selection component',
      category: 'Forms'
    },
    {
      id: 'checkbox',
      route: '/checkbox',
      label: 'Checkbox',
      description: 'Binary choice selection control',
      category: 'Forms'
    }
  ]);

  /**
   * Sidebar açık/kapalı durumu.
   */
  protected readonly isSidebarOpen = signal<boolean>(true);

  /**
   * Kategorilere göre gruplandırılmış menü öğeleri.
   * Computed signal ile otomatik olarak güncellenir.
   */
  protected readonly menuItemsByCategory = computed(() => {
    const items = this.menuItems();
    const categories = new Map<string, MenuItem[]>();
    
    items.forEach(item => {
      const category = item.category || 'Other';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(item);
    });
    
    return Array.from(categories.entries());
  });

  /**
   * Sidebar'ı açar/kapatır.
   */
  toggleSidebar(): void {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }
}
