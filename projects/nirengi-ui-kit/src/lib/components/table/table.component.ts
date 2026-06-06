import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  input,
  model,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '../select/select.component';
import { Size } from '../../common/enums/size.enum';

export type FilterMatchMode = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'in';
export interface IFilterMetadata {
  value: unknown;
  matchMode: FilterMatchMode;
  type?: 'string' | 'number' | 'boolean';
}

export interface ITableColumn {
  field: string;
  header: string;
  filterable?: boolean;
}

/**
 * Performance-oriented data table with filtering, pagination, and virtual scrolling.
 *
 * @example
 * <nui-table [data]="users" [columns]="[{field: 'name', header: 'Name'}]" [virtualScroll]="true">
 * </nui-table>
 */
@Component({
  selector: 'nui-table',
  standalone: true,
  imports: [CommonModule, ScrollingModule, FormsModule, SelectComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> {
  // Inputs

  data = input.required<T[]>();

  /** Debounce delay for filter input (ms). Applied for performance. @default 500 */
  filterDebounce = input<number>(500);

  /**
   * Recommended to be `true` for large data sets.
   * @default false
   */
  virtualScroll = input<boolean>(false);

  /** @default 48 */
  itemSize = input<number>(48);

  /**
   * CSS height of the virtual-scroll viewport (e.g. `'400px'`, `'100%'`).
   * @default '400px'
   */
  scrollHeight = input<string>('400px');

  /**
   * Disabled automatically when `virtualScroll` is active.
   * @default true
   */
  pagination = input<boolean>(true);

  /** @default 10 */
  pageSize = model<number>(10);

  /** @default Size.Medium */
  size = input<Size>(Size.Medium);

  /**
   * When true, table content is blurred, a loading spinner is shown, and pagination is disabled.
   * @default false
   */
  loading = input<boolean>(false);

  /** When no `headTemplate`/`rowTemplate` is provided, the table renders automatically from these definitions. */
  columns = input<ITableColumn[]>([]);

  /**
   * Required for server-side pagination; falls back to `data.length` when omitted.
   */
  totalRecords = input<number | undefined>(undefined);

  /**
   * When true, internal filtering, sorting, and pagination are disabled (server-side mode).
   * @default false
   */
  lazy = input<boolean>(false);

  /**
   * Table grid (line) appearance.
   * - 'none': No lines
   * - 'horizontal': Only horizontal lines
   * - 'vertical': Only vertical lines
   * - 'both': Both horizontal and vertical lines
   * @default 'horizontal'
   */
  gridLines = input<'none' | 'horizontal' | 'vertical' | 'both'>('horizontal');

  /**
   * String property path for row identity (like Angular's `trackBy` but field-name based).
   * Supports nested paths (e.g. `'user.id'`). Falls back to array index when omitted.
   *
   * @example
   * <nui-table trackBy="id" ... />
   * <nui-table trackBy="category.code" ... />
   */
  readonly trackBy = input<string>();

  /**
   * Matching mode for global filtering.
   * @default 'contains'
   */
  globalFilterMatchMode = input<FilterMatchMode>('contains');

  /**
   * Shows/hides the global filtering input field.
   * @default false
   */
  showGlobalFilter = input<boolean>(false);

  /**
   * Page size options for pagination.
   * @default [5, 10, 20, 50]
   */
  pageSizeOptions = input<number[]>([5, 10, 20, 50]);

  /**
   * Label for 'of' in pagination (e.g., '1-10 / 100').
   * @default '/'
   */
  ofLabel = input<string>('/');

  /**
   * Label for 'showing' in pagination.
   * @default 'gösteriliyor'
   */
  showingLabel = input<string>('gösteriliyor');

  /**
   * Label for screen readers on 'Previous' button.
   * @default 'Geri'
   */
  previousLabel = input<string>('Geri');

  /**
   * Label for screen readers on 'Next' button.
   * @default 'İleri'
   */
  nextLabel = input<string>('İleri');

  /**
   * Placeholder for the global search input.
   * @default 'Ara...'
   */
  searchPlaceholder = input<string>('Ara...');

  /**
   * Title displayed when no records are found.
   * @default 'Kayıt Bulunamadı'
   */
  emptyTitle = input<string>('Kayıt Bulunamadı');

  /**
   * Message displayed when no records are found.
   * @default 'Arama kriterlerinize uygun kayıt bulunamadı.'
   */
  emptyMessage = input<string>('Arama kriterlerinize uygun kayıt bulunamadı.');

  // Outputs

  /** Emitted on page change; use for server-side pagination. */
  pageChange = output<number | string>();

  /** Emitted when the global filter value changes; use for server-side filtering. */
  globalFilterChange = output<string>();

  /** Returns all active filters (global + column) as an object. */
  filterChange = output<{ global: string; columns: Record<string, IFilterMetadata> }>();

  rowClick = output<T>();

  sortChange = output<{ field: string; order: 'asc' | 'desc' | null }>();

  // Content Children

  /**
   * Add `<th>` elements and filter inputs inside this template.
   * Template context: `{ filter: (field, value, matchMode) => void }`
   */
  headTemplate = contentChild<TemplateRef<unknown>>('headTemplate');

  /**
   * Add `<td>` elements inside this template.
   * Template context: `{ $implicit: item }`
   */
  rowTemplate = contentChild<TemplateRef<unknown>>('rowTemplate');

  // Public Properties

  currentPage = signal<number>(1);
  readonly filterFn = this.filter.bind(this);

  // Public Computed

  // Applied Data (Filtered)
  filteredData = computed(() => {
    const rawData = this.data();
    const filters = this.filtersDebounced();

    // If lazy mode or server-side paging is active, don't filter locally
    if (this.lazy() || this.totalRecords() !== undefined) {
      return rawData;
    }

    if (!filters) return rawData;

    let processed = [...rawData];

    // 1. Column Filters
    if (Object.keys(filters.columns).length > 0) {
      processed = processed.filter((item) => {
        return Object.entries(filters.columns).every(([field, meta]) => {
          // Explicit cast or check
          const m = meta as IFilterMetadata;
          if (m.value === null || m.value === undefined || m.value === '') return true;
          const itemValue = (item as Record<string, unknown>)[field];
          return this.matches(itemValue, m.value, m.matchMode);
        });
      });
    }

    // 2. Global Filter
    if (filters.global) {
      const mode = this.globalFilterMatchMode();
      processed = processed.filter((item) => {
        // Naive global search: check all property values
        return Object.values(item as Record<string, unknown>).some((val) =>
          this.matches(val, filters.global, mode)
        );
      });
    }

    return processed;
  });

  // Display Data (Paginated or Scrolled)
  viewData = computed(() => {
    const data = this.filteredData();
    // Safety check for empty or null
    if (!data) return [];

    // If lazy mode or server-side paging is active, the data is already paginated by the server
    if (this.lazy() || this.totalRecords() !== undefined) {
      return data;
    }

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
      if (start >= data.length) {
        return [];
      }
      return data.slice(start, end);
    }

    return data;
  });

  _totalRecords = computed(() => {
    const inputTotal = this.totalRecords();
    if (inputTotal !== undefined) {
      return inputTotal;
    }
    return this.filteredData()?.length ?? 0;
  });

  totalPages = computed(() => {
    const total = this._totalRecords();
    const size = this.pageSize() || 10;
    if (total === 0) return 0;
    return Math.ceil(total / size);
  });

  visibleRange = computed(() => {
    const total = this._totalRecords();
    if (total === 0) return { start: 0, end: 0 };

    const page = this.currentPage();
    const size = this.pageSize() || 10;
    const start = (page - 1) * size + 1;
    const end = Math.min(page * size, total);

    return { start, end };
  });

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

  readonly rowHeightClass = computed(() => {
    switch (this.size()) {
      case Size.XSmall:
        return 'h-8 text-xs';
      case Size.Small:
        return 'h-10 text-sm';
      case Size.Medium:
        return 'h-12 text-base';
      case Size.Large:
        return 'h-16 text-lg';
      case Size.XLarge:
        return 'h-20 text-xl';
      default:
        return 'h-12 text-base';
    }
  });

  /** Pagination CSS class for number buttons. */
  readonly paginationNumberClass = computed(() => {
    switch (this.size()) {
      case Size.XSmall:
        return 'w-6 h-6 text-xs';
      case Size.Small:
        return 'w-7 h-7 text-xs';
      case Size.Medium:
        return 'w-8 h-8 text-sm';
      case Size.Large:
        return 'w-9 h-9 text-base';
      case Size.XLarge:
        return 'w-10 h-10 text-lg';
      default:
        return 'w-8 h-8 text-sm';
    }
  });

  /** Pagination CSS class for Prev/Next navigation buttons. */
  readonly paginationNavClass = computed(() => {
    switch (this.size()) {
      case Size.XSmall:
        return 'h-8 px-2 text-xs';
      case Size.Small:
        return 'h-9 px-3 text-xs';
      case Size.Medium:
        return 'h-10 px-4 text-sm';
      case Size.Large:
        return 'h-12 px-5 text-base';
      case Size.XLarge:
        return 'h-14 px-6 text-lg';
      default:
        return 'h-10 px-4 text-sm';
    }
  });

  // Protected Properties

  // Expose Size enum to template
  protected readonly Size = Size;

  // State
  protected filtersState = signal<Record<string, IFilterMetadata>>({}); // Protected for template if needed
  protected globalFilterState = signal<string>('');

  // Private Properties

  // Filter Logic
  private currentFilters = computed(() => ({
    global: this.globalFilterState(),
    columns: this.filtersState(),
  }));

  // Debounced Filter Signal
  private filtersDebounced = toSignal(
    toObservable(this.currentFilters).pipe(debounceTime(this.filterDebounce())),
    { initialValue: { global: '' as string, columns: {} as Record<string, IFilterMetadata> } }
  );

  constructor() {
    // Emit filterChange event after debounce
    effect(() => {
      const debouncedFilters = this.filtersDebounced();
      if (debouncedFilters) {
        this.filterChange.emit(debouncedFilters);
      }
    });
  }

  // Methods

  getTrackByValue(index: number, item: T): unknown {
    const key = this.trackBy();
    if (!key) return index;

    // Nested property resolution (e.g. 'user.details.id')
    return key
      .split('.')
      .reduce((acc: unknown, prop: string) => (acc as Record<string, unknown>)?.[prop], item);
  }

  /** `filterChange` is emitted automatically after debounce via effect, not on every call. */
  filter(field: string, value: unknown, matchMode: FilterMatchMode = 'contains'): void {
    this.filtersState.update((s: Record<string, IFilterMetadata>) => ({
      ...s,
      [field]: { value, matchMode },
    }));
    // Reset page to 1 on filter trigger
    this.currentPage.set(1);
    // Note: filterChange.emit() is handled by effect after debounce
  }

  filterGlobal(value: string) {
    this.globalFilterState.set(value);
    this.currentPage.set(1);
    this.globalFilterChange.emit(value);
    this.filterChange.emit(this.currentFilters());
  }

  setPage(page: number | string) {
    if (typeof page === 'string') return; // Ellipsis handle

    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.pageChange.emit(page);
    }
  }

  /** Resets current page to 1 and emits `pageChange`. */
  onPageSizeChange(value: number) {
    this.pageSize.set(value);
    this.currentPage.set(1);
    this.pageChange.emit(1); // Reset to p1
  }

  private matches(value: unknown, filter: unknown, mode: FilterMatchMode): boolean {
    if (value === undefined || value === null) return false;
    const sValue = String(value).toLowerCase();
    const sFilter = String(filter).toLowerCase();

    switch (mode) {
      case 'contains':
        return sValue.includes(sFilter);
      case 'equals':
        return sValue === sFilter;
      case 'startsWith':
        return sValue.startsWith(sFilter);
      case 'endsWith':
        return sValue.endsWith(sFilter);
      case 'in':
        // Check if filter is array and includes the value
        if (Array.isArray(filter)) {
          // We need raw comparison for booleans/numbers inside array, or stringified
          return filter.some((f) => String(f).toLowerCase() === sValue);
        }
        return false;
      default:
        return sValue.includes(sFilter);
    }
  }
}
