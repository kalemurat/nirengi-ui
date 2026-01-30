import { Component, input, computed, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Size } from '../../common/enums/size.enum';

/**
 * Breadcrumb öğesi arayüzü.
 * Her bir breadcrumb linki veya metni için gerekli özellikleri tanımlar.
 */
export interface BreadcrumbItem {
  /**
   * Gösterilecek metin.
   */
  label: string;

  /**
   * Yönlendirilecek route.
   * RouterLink direktifinin kabul ettiği formatta olmalı (string veya array).
   * Eğer tanımlanmazsa, öğe tıklanabilir olmaz (span olarak render edilir).
   */
  url?: string | any[];

  /**
   * URL fragment (#anchor).
   */
  fragment?: string;

  /**
   * URL query parametreleri.
   */
  queryParams?: any;

  /**
   * Öğenin aktif (disabled) olup olmadığını belirler.
   * True ise tıklanamaz ve disabled stilini alır.
   */
  disabled?: boolean;

  /**
   * Opsiyonel ikon sınıfı veya adı (ikon desteği eklenirse).
   */
  icon?: string;
}

/**
 * Modern breadcrumb (ekmek kırıntısı) bileşeni.
 * Kullanıcının uygulama içindeki konumunu gösterir ve hiyerarşik navigasyon sağlar.
 * Angular 20 signal-based API ve Tailwind + BEM metodolojisi kullanır.
 *
 * ## Özellikler
 * - ✅ Signal tabanlı input'lar
 * - ✅ OnPush change detection stratejisi
 * - ✅ Computed signals ile reaktif class binding
 * - ✅ Özelleştirilebilir ayırıcı (separator)
 * - ✅ RouterLink entegrasyonu
 * - ✅ Farklı boyut seçenekleri (sm, md, lg)
 * - ✅ Responsive tasarım uyumlu (overflow durumları için henüz logic yok ama CSS ile yönetilebilir)
 *
 * @example
 * // Basit kullanım
 * <nui-breadcrumb [items]="items"></nui-breadcrumb>
 *
 * @example
 * // Custom separator ile
 * <nui-breadcrumb [items]="items" separator=">"></nui-breadcrumb>
 *
 * @example
 * // Template separator ile
 * <ng-template #sepIcon><i class="icon-chevron-right"></i></ng-template>
 * <nui-breadcrumb [items]="items" [separator]="sepIcon"></nui-breadcrumb>
 *
 * @see https://v20.angular.dev/guide/signals
 * @see {@link Size}
 */
@Component({
  selector: 'nui-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  /**
   * Breadcrumb öğeleri listesi.
   * Navigasyon zincirini oluşturur.
   */
  readonly items = input.required<BreadcrumbItem[]>();

  /**
   * Öğeler arasındaki ayırıcı karakter veya template.
   * String (örn: '/', '>') veya TemplateRef olabilir.
   *
   * @default '/'
   */
  readonly separator = input<string | TemplateRef<any>>('/');

  /**
   * Bileşen boyutu.
   * Metin ve ikon boyutlarını etkiler.
   *
   * @default Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Ana container için CSS class'larını hesaplayan computed signal.
   */
  readonly containerClasses = computed(() => {
    const classes = ['nui-breadcrumb'];
    classes.push(`nui-breadcrumb--${this.size()}`);
    return classes.join(' ');
  });

  /**
   * Liste (ol) için CSS class'ları.
   */
  readonly listClasses = computed(() => {
    return 'nui-breadcrumb__list';
  });

  /**
   * Liste öğesi (li) için base class.
   */
  readonly itemClasses = computed(() => {
    const classes = ['nui-breadcrumb__item'];
    classes.push(`nui-breadcrumb__item--${this.size()}`);
    return classes.join(' ');
  });

  /**
   * Separator olup olmadığını kontrol eder.
   * TemplateRef olup olmadığını template içinde kontrol edeceğiz.
   */
  protected isTemplate(value: string | TemplateRef<any>): boolean {
    return value instanceof TemplateRef;
  }
}
