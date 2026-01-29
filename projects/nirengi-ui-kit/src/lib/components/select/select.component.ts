import {
  Component,
  input,
  signal,
  computed,
  contentChild,
  TemplateRef,
  ElementRef,
  HostListener,
  inject,
  ChangeDetectionStrategy,
  forwardRef,
  viewChild,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from '../../common/base/value-accessor.base';
import { IconComponent } from '../icon/icon.component';
import { Size } from '../../common/enums/size.enum';

/**
 * Modern Seçim/Dropdown bileşeni.
 * Tekli/çoklu seçim, arama ve özel öğe şablonlarını destekler.
 *
 * ## Özellikler
 * - ✅ ControlValueAccessor desteği (Form entegrasyonu)
 * - ✅ Tekli ve Çoklu seçim
 * - ✅ Aranabilir seçenekler
 * - ✅ Özel öğe şablonu (template) desteği
 * - ✅ OnPush change detection stratejisi
 * - ✅ Signal tabanlı reaktif durum yönetimi
 * - ✅ Boyutlandırma desteği (xs, sm, md, lg, xl)
 *
 * @see {@link IconComponent} - Kullanılan ikon bileşeni
 * @see {@link ValueAccessorBase} - Form altyapısı
 * 
 * @example
 * <!-- Temel Kullanım -->
 * <nui-select 
 *   [options]="users" 
 *   bindLabel="name" 
 *   bindValue="id" 
 *   [(ngModel)]="selectedUserId"
 *   placeholder="Kullanıcı Seçiniz"
 * />
 *
 * @example
 * <!-- Özelleştirilmiş Kullanım -->
 * <nui-select [options]="items" [searchable]="true" [multiple]="true" size="lg">
 *   <ng-template #itemTemplate let-item>
 *     <div class="flex items-center gap-2">
 *       <img [src]="item.avatar" class="w-6 h-6 rounded-full" />
 *       <span>{{ item.name }}</span>
 *       <span class="text-xs text-gray-500">({{ item.role }})</span>
 *     </div>
 *   </ng-template>
 * </nui-select>
 */
@Component({
  selector: 'nui-select',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent extends ValueAccessorBase<any> {
  private elementRef = inject(ElementRef);

  /**
   * Erişilebilirlik için benzersiz kimlik.
   * Rastgele oluşturulur ancak SSR uyumluluğu için hydrasyon sırasında dikkat edilmelidir.
   */
  readonly inputId = `nui-select-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Gösterilecek seçeneklerin listesi.
   * Herhangi bir tipte nesne veya ilkel değer dizisi olabilir.
   */
  readonly options = input.required<any[]>();

  /**
   * Etiket (görünen metin) için kullanılacak nesne özelliği.
   * Eğer sağlanmazsa, seçeneğin kendisi etiket olarak kullanılır.
   * @example 'name', 'title'
   */
  readonly bindLabel = input<string>();

  /**
   * Değer (value) için kullanılacak nesne özelliği.
   * Eğer sağlanmazsa, seçenek nesnesinin kendisi değer olarak kullanılır.
   * @example 'id', 'uuid'
   */
  readonly bindValue = input<string>();

  /**
   * Çoklu seçime izin verilir mi?
   * Varsayılan: false
   */
  readonly multiple = input<boolean>(false);

  /**
   * Dropdown içinde arama kutusu gösterilir mi?
   * Varsayılan: false
   */
  readonly searchable = input<boolean>(false);

  /**
   * Tekli seçimde temizleme butonunu aktif eder.
   * Varsayılan: true
   */
  readonly clearable = input<boolean>(true);

  /**
   * Bileşen etiketi.
   * Input üzerinde görüntülenir.
   */
  readonly label = input<string>();

  /**
   * Seçim yapılmadığında gösterilecek yer tutucu metin.
   * Varsayılan: 'Seçiniz...'
   */
  readonly placeholder = input<string>('Seçiniz...');

  /**
   * Yardımcı ipucu metni.
   * Bileşenin altında küçük puntolarla gösterilir.
   */
  readonly hint = input<string>();

  /**
   * Hata mesajı metni.
   * Bileşen hata durumundayken (kırmızı çerçeve) altında gösterilir.
   */
  readonly error = input<string>();

  /**
   * Başarı mesajı metni.
   * Bileşen başarı durumundayken (yeşil çerçeve) altında gösterilir.
   */
  readonly success = input<string>();

  /**
   * Uyarı mesajı metni.
   * Bileşen uyarı durumundayken (sarı çerçeve) altında gösterilir.
   */
  readonly warning = input<string>();

  /**
   * Bileşen boyutu.
   * Size enum değerlerini alır (xs, sm, md, lg, xl).
   * Varsayılan: Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Seçeneklerin render edilmesi için özel şablon.
   * Input olarak geçilebilir veya içerikten (content projection) alınabilir.
   */
  readonly itemTemplateInput = input<TemplateRef<any> | null>(null, { alias: 'itemTemplate' });
  
  /**
   * İçerik çocuklarından (ContentChild) alınan şablon referansı.
   * Kullanım: <nui-select> <ng-template ...> </nui-select>
   */
  readonly contentItemTemplate = contentChild<TemplateRef<any>>('itemTemplate');

  /**
   * İç durum: Dropdown açık mı?
   */
  readonly isOpen = signal<boolean>(false);

  /**
   * İç durum: Mevcut arama terimi.
   */
  readonly searchTerm = signal<string>('');

  /**
   * Arama input elementine erişim sağlar.
   * Dropdown açıldığında otomatik odaklanmak için kullanılır.
   */
  readonly searchInputElement = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  /**
   * Template binding için devre dışı bırakma girişi.
   * Form kontrolünün disabled durumu ile senkronize çalışır.
   */
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

  protected readonly Size = Size;

  constructor() {
    super();
    
    // Auto focus search input when opened
    effect(() => {
      if (this.isOpen() && this.searchable()) {
        setTimeout(() => {
          this.searchInputElement()?.nativeElement.focus();
        });
      }
    });

    // Close dropdown when disabled changes to true
    effect(() => {
      if (this.isDisabled()) {
        this.isOpen.set(false);
      }
    });

    // Sync disabled input with ValueAccessor base
    effect(() => {
      this.setDisabledState(this.disabledInput());
    });
  }

  /**
   * Computed: Aktif öğe şablonu.
   * Öncelik sırası: Input > Content Child > Varsayılan (HTML içinde).
   */
  readonly itemTemplate = computed(() => this.itemTemplateInput() || this.contentItemTemplate() || null);

  /**
   * Computed: Arama terimine göre filtrelenmiş seçenekler.
   */
  readonly filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allOptions = this.options();

    if (!term) return allOptions;

    return allOptions.filter(opt => {
      const label = this.getLabel(opt).toString().toLowerCase();
      return label.includes(term);
    });
  });

  /**
   * Computed: Seçili öğelerin tam nesne halleri.
   * `value` sinyali (sadece ID tutuyor olabilir) ile seçenek nesneleri arasında köprü kurar.
   */
  readonly selectedItems = computed(() => {
    const rawVal = this.value();
    if (rawVal === null || rawVal === undefined) return [];

    const opts = this.options();
    const bindVal = this.bindValue();

    // Değere göre seçeneği bulma yardımcısı
    const findOption = (val: any) => {
      if (!bindVal) return val; // Değer nesnenin kendisidir
      return opts.find(o => o[bindVal] === val);
    };

    if (this.multiple()) {
      if (!Array.isArray(rawVal)) return [];
      return rawVal.map(v => findOption(v)).filter(Boolean);
    } else {
      const opt = findOption(rawVal);
      return opt ? [opt] : [];
    }
  });

  /**
   * Computed: İkon boyutu.
   * Bileşen boyutuna göre dinamik olarak hesaplanır.
   */
  readonly iconSize = computed(() => {
    switch (this.size()) {
      case Size.XSmall: return 14;
      case Size.Small: return 16;
      case Size.Medium: return 18;
      case Size.Large: return 20;
      case Size.XLarge: return 24;
      default: return 18;
    }
  });

  /**
   * Seçili bir değer olup olmadığını kontrol eder.
   * @returns Değer varsa true, yoksa false döner.
   */
  hasValue(): boolean {
    const val = this.value();
    if (Array.isArray(val)) return val.length > 0;
    return val !== null && val !== undefined;
  }

  /**
   * Dropdown görünürlüğünü değiştirir (Aç/Kapa).
   * Disabled durumundaysa işlem yapmaz.
   */
  toggleDropdown(): void {
    if (this.isDisabled()) return;
    this.isOpen.update(v => !v);
    if (!this.isOpen()) {
      this.onTouched();
      this.searchTerm.set('');
    }
  }

  /**
   * Dışarı tıklama durumunda dropdown'ı kapatır.
   * @param event Tıklama olayı
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  /**
   * Dropdown'ı kapatır ve durumu temizler.
   */
  close(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.onTouched();
      this.searchTerm.set('');
    }
  }

  /**
   * Bir seçenek için görüntüleme etiketini döndürür.
   * @param option Seçenek nesnesi veya değeri
   * @returns Görüntülenecek metin
   */
  getLabel(option: any): string {
    if (!option) return '';
    const labelProp = this.bindLabel();
    if (labelProp && typeof option === 'object') {
      return option[labelProp] || '';
    }
    return String(option);
  }

  /**
   * Bir seçeneğin değerini döndürür (karşılaştırma için).
   * @param option Seçenek nesnesi
   * @returns Seçeneğin değeri (veya bindValue yoksa kendisi)
   */
  getValue(option: any): any {
    const valueProp = this.bindValue();
    if (valueProp && typeof option === 'object') {
      return option[valueProp];
    }
    return option;
  }

  /**
   * Seçeneğin seçili olup olmadığını kontrol eder.
   * @param option Kontrol edilecek seçenek
   * @returns Seçiliyse true
   */
  isSelected(option: any): boolean {
    const current = this.value();
    const optVal = this.getValue(option);

    if (this.multiple()) {
      return Array.isArray(current) && current.includes(optVal);
    }
    return current === optVal;
  }

  /**
   * Seçenek seçimini işler.
   * Tekli seçimde dropdown'ı kapatır, çoklu seçimde değeri array'e ekler/çıkarır.
   * @param option Seçilen seçenek
   */
  selectOption(option: any): void {
    const optVal = this.getValue(option);
    
    if (this.multiple()) {
      const current = (this.value() as any[]) || [];
      const index = current.indexOf(optVal);
      
      let newVal;
      if (index > -1) {
        newVal = current.filter(v => v !== optVal);
      } else {
        newVal = [...current, optVal];
      }
      this.updateValue(newVal);
      // Don't close on multiple selection (common UX, maybe optional?)
      // User didn't specify, but usually multi-select keeps open.
    } else {
      this.updateValue(optVal);
      this.close();
    }
  }

  /**
   * Öğe silme yardımcısı (Chip üzerinden silme).
   * @param item Silinecek öğe
   * @param event Olay nesnesi
   */
  removeItem(item: any, event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    
    const optVal = this.getValue(item);
    const current = (this.value() as any[]) || [];
    const newVal = current.filter(v => v !== optVal);
    this.updateValue(newVal);
  }

  /**
   * Arama terimini günceller.
   * @param event Input olayı
   */
  onSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchTerm.set(val);
  }

  /**
   * Değeri temizler (Tekli seçim için).
   * @param event Olay nesnesi
   */
  clearValue(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    this.updateValue(null);
  }

  /**
   * Liste performansı için TrackBy fonksiyonu.
   */
  trackByFn(index: number, item: any): any {
    return this.getValue(item) || index;
  }
}
