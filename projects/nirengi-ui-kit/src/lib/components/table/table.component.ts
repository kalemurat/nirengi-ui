import {
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild, input,
    model, output, signal, TemplateRef,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';
import { Size } from '../../common/enums/size.enum';

export type FilterMatchMode = 'contains' | 'equals' | 'startsWith' | 'endsWith';
export type FilterMetadata = {
  value: any;
  matchMode: FilterMatchMode;
  type?: 'string' | 'number' | 'boolean';
};

export type TableColumn = {
  field: string;
  header: string;
  filterable?: boolean;
};

/**
 * Performans odaklı, esnek ve özelleştirilebilir veri tablosu bileşeni.
 * Filtreleme, sayfalama ve sanal kaydırma (virtual scrolling) özelliklerini destekler.
 *
 * ## Özellikler
 * - ✅ Standalone Component
 * - ✅ OnPush Change Detection
 * - ✅ Signal-based state management
 * - ✅ Sanal Kaydırma (Virtual Scroll) desteği (@angular/cdk/scrolling)
 * - ✅ Özelleştirilebilir Heading ve Row template'leri
 * - ✅ Sütun tabanlı otomatik render desteği (Simple Mode)
 * - ✅ Global ve Sütun bazlı filtreleme
 * - ✅ Debounce destekli filtreleme performans optimizasyonu
 *
 * @example
 * <nui-table [data]="users" [columns]="[{field: 'name', header: 'Name'}]" [virtualScroll]="true">
 * </nui-table>
 */
@Component({
  selector: 'nui-table',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent<T> {
  // Expose Size enum to template
  protected readonly Size = Size;

  // Inputs
  
  /**
   * Tabloda gösterilecek veri listesi.
   */
  data = input.required<T[]>();

  /**
   * Filtreleme işlemi için bekleme süresi (ms).
   * Performans için varsayılan olarak 300ms gecikme uygulanır.
   */
  filterDebounce = input<number>(300);

  /**
   * Sanal kaydırma özelliğini açar/kapatır.
   * Büyük veri setleri için `true` olması önerilir.
   * @default false
   */
  virtualScroll = input<boolean>(false);

  /**
   * Sanal kaydırma kullanıldığında her bir satırın yüksekliği (px).
   * @default 48
   */
  itemSize = input<number>(48);


  /**
   * Sanal kaydırma için viewport yüksekliği.
   * CSS değeri olarak (örn: '400px', '100%').
   * @default '400px'
   */
  scrollHeight = input<string>('400px');

  /**
   * Sayfalama özelliğini açar/kapatır.
   * `virtualScroll` aktif ise bu özellik devre dışı kalır.
   * @default true
   */
  pagination = input<boolean>(true);

  /**
   * Sayfa başına gösterilecek kayıt sayısı.
   * Two-way binding destekler.
   * @default 10
   */
  pageSize = model<number>(10);

  /**
   * Tablo boyutu.
   * 'xs' | 'sm' | 'md' | 'lg' | 'xl'
   * @default Size.Medium
   */
  size = input<Size>(Size.Medium);

  /**
   * Tablo yükleniyor durumunu gösterir.
   * True olduğunda tablo içeriği blur olur ve loading spinner gösterilir.
   * Pagination butonları disable olur.
   * @default false
   */
  loading = input<boolean>(false);

  /**
   * Sütun tanımları.
   * Eğer headTemplate/rowTemplate verilmezse bu tanımlara göre otomatik tablo oluşturulur.
   */
  columns = input<TableColumn[]>([]);

  /**
   * Toplam kayıt sayısı.
   * Eğer backend tarafında sayfalama yapılıyorsa bu değer verilmelidir.
   * Verilmezse `data.length` kullanılır.
   */
  totalRecords = input<number | undefined>(undefined);

  /**
   * Sayfa değişim eventi.
   * Backend tabanlı sayfalama için kullanılır.
   */
  pageChange = output<number | string>();

  /**
   * Global filtreleme için eşleşme modu.
   * @default 'contains'
   */
  globalFilterMatchMode = input<FilterMatchMode>('contains');

  // Templates via ContentChild (implicitly finding ng-templates with directives is cleaner but simple templates works too)
  // We expect user to use <ng-template nuiTableHead> and <ng-template nuiTableRow>
  // But since we can't easily export directives in same file without clutter, let's look for templates via strict inputs or directives.
  // The user requested "template", let's use Inputs for explicit template passing OR ContentChild for ease of use.
  // Let's support ContentChild with specific directives.

  /**
   * Global filtreleme input alanını gösterip/gizler.
   * @default false
   */
  showGlobalFilter = input<boolean>(false);

  /**
   * Sayfalama için sayfa boyutu seçenekleri.
   * @default [5, 10, 20, 50]
   */
  pageSizeOptions = input<number[]>([5, 10, 20, 50]);

  /**
   * Tablo başlık şablonu.
   * Kullanıcı bu template içine <th> elementleri ve filtre inputlarını eklemelidir.
   * Template context: { filter: (field, value, matchMode) => void }
   */
  headTemplate = contentChild<TemplateRef<any>>('headTemplate');

  /**
   * Tablo satır şablonu.
   * Kullanıcı bu template içine <td> elementlerini ve veri gösterimini eklemelidir.
   * Template context: { $implicit: item }
   */
  rowTemplate = contentChild<TemplateRef<any>>('rowTemplate');

  // State
  protected filtersState = signal<Record<string, FilterMetadata>>({}); // Protected for template if needed
  protected globalFilterState = signal<string>('');

  // Pagination State
  currentPage = signal<number>(1);

  // Filter Logic
  // We use debounce for the filter state to avoid heavy computations on every keystroke
  
  // Note: We need to combine global filter + column filters
  // And apply debounce.
  
  private currentFilters = computed(() => ({
    global: this.globalFilterState(),
    columns: this.filtersState(),
  }));

  // Debounced Filter Signal
  // We prefer using RxJS for debounce because signals are synchronous-glitch-free but don't have built-in time-based debounce easily without effects/timers.
  // Converting the computed signal to observable -> debounce -> back to signal.
  private filtersDebounced = toSignal(
    toObservable(this.currentFilters).pipe(
      debounceTime(this.filterDebounce())
    ),
    { initialValue: { global: '' as string, columns: {} as Record<string, FilterMetadata> } }
  );

  // Applied Data (Filtered)
  filteredData = computed(() => {
    const rawData = this.data();
    const filters = this.filtersDebounced();
    
    if (!filters) return rawData;

    let processed = [...rawData];

    // 1. Column Filters
    if (Object.keys(filters.columns).length > 0) {
      processed = processed.filter(item => {
        return Object.entries(filters.columns).every(([field, meta]) => {
          // Explicit cast or check
          const m = meta as FilterMetadata;
          if (m.value === null || m.value === undefined || m.value === '') return true;
          const itemValue = (item as any)[field];
          return this.matches(itemValue, m.value, m.matchMode);
        });
      });
    }

    // 2. Global Filter
    if (filters.global) {
      const mode = this.globalFilterMatchMode();
      processed = processed.filter(item => {
        // Naive global search: check all property values
        return Object.values(item as any).some(val => 
          this.matches(val, filters.global, mode)
        );
      });
    }

    // Reset pagination when filter changes
    // This is a side effect. Signal computed should be pure.
    // Ideally we reset page *when* filters change. 
    // We can do this in an effect or just reset current page if it exceeds bounds.
    return processed;
  });

  // Display Data (Paginated or Scrolled)
  viewData = computed(() => {
    const data = this.filteredData();
    // Safety check for empty or null
    if (!data) return [];

    if (this.virtualScroll()) {
      // If virtual scroll, we return all data (CDK handles the viewport)
      return data;
    }

    if (this.pagination()) {
      const page = this.currentPage();
      const size = this.pageSize();
      const start = (page - 1) * size;
      const end = start + size;
      
      // Auto-correct page if out of bounds
      // We can't update signal here, so we just handle the slice gracefully
      if (start >= data.length) {
         return []; 
      }
      return data.slice(start, end);
    }

    return data;
  });

  // Calculated Total Records
  // If totalRecords input is provided, use it. Otherwise calculate from filtered data.
  // We use a different name for internal computation to avoid conflict with input signal name if we strictly mapped it (but here input is `totalRecords`, computed is `_totalRecords` or we override).
  // Actually, let's rename the internal computed to avoid confusion.
  
  _totalRecords = computed(() => {
    const inputTotal = this.totalRecords();
    if (inputTotal !== undefined) {
      return inputTotal;
    }
    return this.filteredData()?.length ?? 0;
  });

  /**
   * Toplam sayfa sayısı.
   */
  totalPages = computed(() => {
    const total = this._totalRecords();
    const size = this.pageSize() || 10;
    if (total === 0) return 0;
    return Math.ceil(total / size);
  });

  /**
   * Gösterilen kayıt aralığı.
   */
  visibleRange = computed(() => {
    const total = this._totalRecords();
    if (total === 0) return { start: 0, end: 0 };
    
    const page = this.currentPage();
    const size = this.pageSize() || 10;
    const start = (page - 1) * size + 1;
    const end = Math.min(page * size, total);
    
    return { start, end };
  });

  /**
   * Sayfalama butonları.
   * Yuvarlak buton yapısı ve ... mantığı.
   */
  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | string)[] = []; // string for '...'

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      // Always show 1
      pages.push(1);

      if (current > 3) {
        pages.push('...'); 
      }

      // Logic for middle range
      // If current is near start: 1 2 3 4 5 ... 10
      // If current is near end: 1 ... 6 7 8 9 10
      // If current is in middle: 1 ... 4 5 6 ... 10
      
      let start = Math.max(2, current - 1);
      let end = Math.min(total - 1, current + 1);

      // Adjust if near start
      if (current <= 3) {
        end = 5;
        start = 2; // already pushed 1
      }
      // Adjust if near end
      else if (current >= total - 2) {
        start = total - 4;
        end = total - 1; // will push total later
      }

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < total) {
           pages.push(i);
        }
      }

      if (current < total - 2) {
        pages.push('...');
      }

      if (total > 1) {
        pages.push(total);
      }
    }
    
    // Clean up duplicates if any edge cases messed up (simple check)
    return [...new Set(pages)];
  });

  // ---- Public API for Templates ----

  /**
   * Sütun bazlı filtreleme uygular.
   * Template içinde kullanılır.
   * @param field Filtrelenecek alan adı
   * @param value Filtre değeri
   * @param matchMode Eşleşme modu (varsayılan: contains)
   */
  filter(field: string, value: any, matchMode: FilterMatchMode = 'contains') {
    this.filtersState.update((s: Record<string, FilterMetadata>) => ({
      ...s,
      [field]: { value, matchMode }
    }));
    // Reset page to 1 on filter trigger
    this.currentPage.set(1);
  }

  /**
   * Global filtreleme değeri değiştiğinde tetiklenir.
   * Backend tarafında filtreleme yapmak için kullanılabilir.
   */
  globalFilterChange = output<string>();

  /**
   * Global filtreleme uygular.
   * @param value Arama değeri
   */
  filterGlobal(value: string) {
    this.globalFilterState.set(value);
    this.currentPage.set(1);
    this.globalFilterChange.emit(value);
  }

  /**
   * Sayfa değiştirir.
   * @param page Yeni sayfa numarası
   */
  setPage(page: number | string) {
    if (typeof page === 'string') return; // Ellipsis handle

    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.pageChange.emit(page);
    }
  }

  /**
   * Sayfa boyutunu değiştirir.
   */
  onPageSizeChange(event: Event) {
    const val = Number((event.target as HTMLSelectElement).value);
    this.pageSize.set(val);
    this.currentPage.set(1);
    this.pageChange.emit(1); // Reset to p1
  }

  /**
   * Satır yüksekliği class'ı.
   */
  readonly rowHeightClass = computed(() => {
    switch (this.size()) {
      case Size.XSmall: return 'h-8 text-xs';
      case Size.Small: return 'h-10 text-sm';
      case Size.Medium: return 'h-12 text-base';
      case Size.Large: return 'h-16 text-lg';
      case Size.XLarge: return 'h-20 text-xl';
      default: return 'h-12 text-base';
    }
  });

  /**
   * Sayfalama butonu class'ı.
   */
  readonly paginationButtonClass = computed(() => {
    switch (this.size()) {
      case Size.XSmall: return 'w-6 h-6 text-xs';
      case Size.Small: return 'w-8 h-8 text-xs';
      case Size.Medium: return 'w-10 h-10 text-sm';
      case Size.Large: return 'w-12 h-12 text-base';
      case Size.XLarge: return 'w-14 h-14 text-lg';
      default: return 'w-10 h-10 text-sm';
    }
  });

  // Helpers
  readonly filterFn = this.filter.bind(this);

  private matches(value: any, filter: any, mode: FilterMatchMode): boolean {
    if (value === undefined || value === null) return false;
    const sValue = String(value).toLowerCase();
    const sFilter = String(filter).toLowerCase();

    switch (mode) {
      case 'contains': return sValue.includes(sFilter);
      case 'equals': return sValue === sFilter;
      case 'startsWith': return sValue.startsWith(sFilter);
      case 'endsWith': return sValue.endsWith(sFilter);
      default: return sValue.includes(sFilter);
    }
  }
}
