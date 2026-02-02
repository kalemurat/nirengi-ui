import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab.component';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Tabs component'i.
 * Tab'ları dinamik olarak yönetir ve seçilen tab içeriğini gösterir.
 *
 * ## Özellikler
 * - ✅ Standalone ve OnPush
 * - ✅ Signal tabanlı
 * - ✅ BEM ve Tailwind stilleri
 * - ✅ Accessibility (ARIA)
 *
 * @example
 * <nui-tabs [variant]="ColorVariant.Primary">
 *   <nui-tab label="Genel">
 *     Genel ayarlar içeriği...
 *   </nui-tab>
 *   <nui-tab label="Gelişmiş">
 *     Gelişmiş ayarlar içeriği...
 *   </nui-tab>
 * </nui-tabs>
 */
@Component({
  selector: 'nui-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  /**
   * Tabs component rengi varyantı.
   * Aktif tab'ın vurgu rengini belirler.
   *
   * @default ColorVariant.Primary
   */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /**
   * Tabs component boyutu.
   * Header item'larının padding ve font boyutunu belirler.
   *
   * @default Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Tam genişlik modunu etkinleştirir.
   * Header item'ları eşit genişlikte dağılır.
   *
   * @default false
   */
  readonly fullWidth = input<boolean>(false);

  /**
   * Child tab component'leri.
   * Content projection ile gelen n-tab öğelerini yakalar.
   */
  readonly tabs = contentChildren(TabComponent);

  /**
   * Seçili tab index'i.
   * Varsayılan olarak 0 (ilk tab).
   */
  readonly activeIndex = signal<number>(0);

  /**
   * Tab seçimi yapar.
   * Disabled tab ise işlem yapmaz.
   *
   * @param index Seçilecek tab index'i
   */
  selectTab(index: number): void {
    const tab = this.tabs().at(index);
    if (tab && !tab.disabled()) {
      this.activeIndex.set(index);
    }
  }

  /**
   * Container CSS class'larını hesaplar.
   * Boyut, varyant ve fullWidth durumuna göre class listesi döner.
   */
  protected readonly containerClasses = computed(() => {
    const classes = ['nui-tabs'];

    // Size class
    classes.push(`nui-tabs--${this.size()}`);

    // Variant class
    classes.push(`nui-tabs--${this.variant()}`);

    // Full width class
    if (this.fullWidth()) {
      classes.push('nui-tabs--full-width');
    }

    return classes.join(' ');
  });
}
