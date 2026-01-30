import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, TemplateRef } from '@angular/core';

/**
 * Liste öğeleri için genel `id` arayüzü.
 * Öğelerin verimli bir şekilde izlenmesini (track) sağlar.
 */
export interface ListItem {
  id: string | number;
  [key: string]: any;
}

/**
 * Özelleştirilebilir şablon kullanarak öğe koleksiyonunu render eden liste bileşeni.
 * TemplateRef aracılığıyla içerik projeksiyonunu destekleyerek öğe içeriğinin tamamen özelleştirilmesine olanak tanır.
 *
 * ## Özellikler
 * - ✅ OnPush change detection stratejisi
 * - ✅ Signal tabanlı input'lar
 * - ✅ Özel öğe şablonu desteği
 * - ✅ BEM stil desteği
 * - ✅ `id` kullanarak TrackBy optimizasyonu
 *
 * @example
 * <nui-list [items]="users" [itemTemplate]="userTemplate" />
 *
 * <ng-template #userTemplate let-user>
 *   <div class="user-row">
 *     <img [src]="user.avatar" />
 *     <span>{{ user.name }}</span>
 *   </div>
 * </ng-template>
 */
@Component({
  selector: 'nui-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent<T extends ListItem> {
  /**
   * Gösterilecek öğelerin koleksiyonu.
   * Her öğe benzersiz bir `id` özelliğine sahip OLMALIDIR.
   */
  items = input.required<T[]>();

  /**
   * Her bir öğeyi render etmek için kullanılacak şablon.
   * Eğer sağlanmazsa, varsayılan bir şablon kullanılır.
   * Şablon içeriği, `let-item` ile öğeye erişim sağlar.
   */
  itemTemplate = input<TemplateRef<any>>();

  /**
   * Liste konteynerı (ul) için isteğe bağlı özel CSS sınıfı.
   * Düzen ayarlamaları için kullanışlıdır (örn. 'flex flex-col gap-2').
   */
  listClass = input<string>('');

  /**
   * Liste konteynerı için hesaplanmış sınıflar.
   * Temel BEM sınıfı ile özel sınıfları birleştirir.
   */
  protected readonly containerClasses = computed(() => {
    return `nui-list ${this.listClass()}`.trim();
  });
}
