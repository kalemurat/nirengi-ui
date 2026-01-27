import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent, ButtonType, Size, ColorVariant } from 'nirengi-ui-kit';

/**
 * UI Component menü öğesi interface'i.
 * Her UI componentinin menüdeki temsili için kullanılır.
 */
interface MenuItem {
  /** Component'in görünen adı */
  label: string;
  /** Component'in unique ID'si */
  id: string;
  /** Component açıklaması */
  description: string;
}

/**
 * Ana uygulamacomponent'i.
 * UI Kit component'lerini showcase eden menü sistemi.
 * 
 * ## Özellikler
 * - ✅ Signal tabanlı state yönetimi
 * - ✅ Dinamik component rendering
 * - ✅ Responsive sidebar menü
 * - ✅ Modern UI/UX
 * 
 * @see https://v20.angular.dev/guide/signals
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ButtonComponent],
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
   * Her yeni component eklendiğinde bu listeye eklenir.
   */
  protected readonly menuItems = signal<MenuItem[]>([
    {
      id: 'button',
      label: 'Button',
      description: 'Modern button component with multiple variants'
    }
  ]);

  /**
   * Seçili component ID'si.
   * Hangi component'in showcase edileceğini belirler.
   */
  protected readonly selectedComponentId = signal<string>('button');

  /**
   * Sidebar açık/kapalı durumu.
   * Mobile responsive için kullanılır.
   */
  protected readonly isSidebarOpen = signal<boolean>(true);

  /**
   * Menü öğesine tıklandığında seçili component'i değiştirir.
   * 
   * @param itemId - Seçilen component ID'si
   */
  selectComponent(itemId: string): void {
    this.selectedComponentId.set(itemId);
  }

  /**
   * Sidebar'ı açar/kapatır.
   */
  toggleSidebar(): void {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  // ============================================================================
  // BUTTON COMPONENT SHOWCASE DATA
  // ============================================================================

  /**
   * Button varyasyonları için sabit değerler.
   */
  protected readonly ButtonType = ButtonType;
  protected readonly Size = Size;
  protected readonly ColorVariant = ColorVariant;

  /**
   * Button tipleri listesi.
   */
  protected readonly buttonTypes = signal<ButtonType[]>([
    ButtonType.Solid,
    ButtonType.Outline,
    ButtonType.Ghost,
    ButtonType.Soft
  ]);

  /**
   * Button boyutları listesi.
   */
  protected readonly buttonSizes = signal<Size[]>([
    Size.XSmall,
    Size.Small,
    Size.Medium,
    Size.Large,
    Size.XLarge
  ]);

  /**
   * Button renk varyantları listesi.
   */
  protected readonly buttonVariants = signal<ColorVariant[]>([
    ColorVariant.Primary,
    ColorVariant.Secondary,
    ColorVariant.Success,
    ColorVariant.Warning,
    ColorVariant.Danger,
    ColorVariant.Info,
    ColorVariant.Neutral
  ]);

  /**
   * Button click handler örneği.
   */
  handleButtonClick(): void {
    console.log('Button clicked!');
  }
}
