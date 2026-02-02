import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  model,
  output,
  signal,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '../select/select.component';
import { Size } from '../../common/enums/size.enum';

export type FilterMatchMode = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'in';
export interface FilterMetadata {
  value: any;
  matchMode: FilterMatchMode;
  type?: 'string' | 'number' | 'boolean';
}

export interface TableColumn {
  field: string;
  header: string;
  filterable?: boolean;
}

/**
 * Performance-oriented, flexible, and customizable data table component.
 * Supports filtering, pagination, and virtual scrolling features.
 *
 * ## Features
 * - ✅ Standalone Component
 * - ✅ OnPush Change Detection
 * - ✅ Signal-based state management
 * - ✅ Virtual Scrolling support (@angular/cdk/scrolling)
 * - ✅ Customizable Heading and Row templates
 * - ✅ Column-based automatic rendering support (Simple Mode)
 * - ✅ Global and Column-based filtering
 * - ✅ Debounce supported filtering performance optimization
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
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent<T> {
  // Inputs

  /**
   * Data list to be displayed in the table.
   */
  data = input.required<T[]>();

  /**
   * Waiting time for filtering process (ms).
   * For performance, a default delay of 300ms is applied.
   */
  filterDebounce = input<number>(300);

  /**
   * Enables/disables the virtual scrolling feature.
   * Recommended to be `true` for large data sets.
   * @default false
   */
  virtualScroll = input<boolean>(false);

  /**
   * Height of each row when virtual scrolling is used (px).
   * @default 48
   */
  itemSize = input<number>(48);

  /**
   * Viewport height for virtual scrolling.
   * As a CSS value (e.g., '400px', '100%').
   * @default '400px'
   */
  scrollHeight = input<string>('400px');

  /**
   * Enables/disables the pagination feature.
   * If `virtualScroll` is active, this feature is disabled.
   * @default true
   */
  pagination = input<boolean>(true);

  /**
   * Number of records to be shown per page.
   * Supports two-way binding.
   * @default 10
   */
  pageSize = model<number>(10);

  /**
   * Table size.
   * 'xs' | 'sm' | 'md' | 'lg' | 'xl'
   * @default Size.Medium
   */
  size = input<Size>(Size.Medium);

  /**
   * Shows the table loading state.
   * When true, table content is blurred and a loading spinner is shown.
   * Pagination buttons are disabled.
   * @default false
   */
  loading = input<boolean>(false);

  /**
   * Column definitions.
   * If headTemplate/rowTemplate is not provided, the table is automatically created according to these definitions.
   */
  columns = input<TableColumn[]>([]);

  /**
   * Total number of records.
   * If pagination is done on the backend, this value must be provided.
   * If not provided, `data.length` is used.
   */
  totalRecords = input<number | undefined>(undefined);

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
   * The name of the property (field) used to uniquely identify rows.
   * Works similarly to Angular's `trackBy` logic, but takes a string path instead of a function.
   * Supports nested data paths (e.g., 'user.id').
   * If not provided, array index is used.
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

  // Outputs

  /**
   * Page change event.
   * Used for backend-based pagination.
   */
  pageChange = output<number | string>();

  /**
   * Triggered when the number of records per page (pageSize) changes.
   */
  pageSizeChange = output<number>();

  /**
   * Triggered when the global filtering value changes.
   * Can be used for filtering on the backend.
   */
  globalFilterChange = output<string>();

  /**
   * Triggered when filtering values (global or column-based) change.
   * Returns all active filters as an object.
   */
  filterChange = output<{ global: string; columns: Record<string, FilterMetadata> }>();

  /**
   * Triggered when a row is clicked.
   */
  rowClick = output<T>();

  /**
   * Triggered when column sorting changes.
   */
  sortChange = output<{ field: string; order: 'asc' | 'desc' | null }>();

  // Content Children

  /**
   * Table header template.
   * The user should add <th> elements and filter inputs inside this template.
   * Template context: { filter: (field, value, matchMode) => void }
   */
  headTemplate = contentChild<TemplateRef<any>>('headTemplate');

  /**
   * Table row template.
   * The user should add <td> elements and data display inside this template.
   * Template context: { $implicit: item }
   */
  rowTemplate = contentChild<TemplateRef<any>>('rowTemplate');

  // Public Properties

  currentPage = signal<number>(1);
  readonly filterFn = this.filter.bind(this);

  // Public Computed

  // Applied Data (Filtered)
  filteredData = computed(() => {
    const rawData = this.data();
    const filters = this.filtersDebounced();

    if (!filters) return rawData;

    let processed = [...rawData];

    // 1. Column Filters
    if (Object.keys(filters.columns).length > 0) {
      processed = processed.filter((item) => {
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
      processed = processed.filter((item) => {
        // Naive global search: check all property values
        return Object.values(item as any).some((val) => this.matches(val, filters.global, mode));
      });
    }

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

  /**
   * Total number of pages.
   */
  totalPages = computed(() => {
    const total = this._totalRecords();
    const size = this.pageSize() || 10;
    if (total === 0) return 0;
    return Math.ceil(total / size);
  });

  /**
   * Displayed record range.
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
   * Pagination buttons.
   * Circular button structure and '...' logic.
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

  /**
   * Row height class.
   */
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

  /**
   * Pagination button class.
   */
  readonly paginationButtonClass = computed(() => {
    switch (this.size()) {
      case Size.XSmall:
        return 'w-6 h-6 text-xs';
      case Size.Small:
        return 'w-8 h-8 text-xs';
      case Size.Medium:
        return 'w-10 h-10 text-sm';
      case Size.Large:
        return 'w-12 h-12 text-base';
      case Size.XLarge:
        return 'w-14 h-14 text-lg';
      default:
        return 'w-10 h-10 text-sm';
    }
  });

  // Protected Properties

  // Expose Size enum to template
  protected readonly Size = Size;

  // State
  protected filtersState = signal<Record<string, FilterMetadata>>({}); // Protected for template if needed
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
    { initialValue: { global: '' as string, columns: {} as Record<string, FilterMetadata> } }
  );

  // Methods

  /**
   * Calculates the tracking value for the template loop.
   * If trackBy is provided, it returns the property value of the relevant row, otherwise it returns the index.
   *
   * @param index Loop index number
   * @param item Row data
   */
  getTrackByValue(index: number, item: any): any {
    const key = this.trackBy();
    if (!key) return index;

    // Nested property resolution (e.g. 'user.details.id')
    return key.split('.').reduce((obj: any, prop: string) => obj && obj[prop], item);
  }

  /**
   * Applies column-based filtering.
   * Used within the template.
   * @param field Field name to filter
   * @param value Filter value
   * @param matchMode Matching mode (default: contains)
   */
  filter(field: string, value: any, matchMode: FilterMatchMode = 'contains') {
    this.filtersState.update((s: Record<string, FilterMetadata>) => ({
      ...s,
      [field]: { value, matchMode },
    }));
    // Reset page to 1 on filter trigger
    this.currentPage.set(1);
    this.filterChange.emit(this.currentFilters());
  }

  /**
   * Applies global filtering.
   * @param value Search value
   */
  filterGlobal(value: string) {
    this.globalFilterState.set(value);
    this.currentPage.set(1);
    this.globalFilterChange.emit(value);
    this.filterChange.emit(this.currentFilters());
  }

  /**
   * Changes the page.
   * @param page New page number
   */
  setPage(page: number | string) {
    if (typeof page === 'string') return; // Ellipsis handle

    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.pageChange.emit(page);
    }
  }

  /**
   * Changes the page size.
   */
  onPageSizeChange(value: number) {
    this.pageSize.set(value);
    this.currentPage.set(1);
    this.pageChange.emit(1); // Reset to p1
    this.pageSizeChange.emit(value);
  }

  private matches(value: any, filter: any, mode: FilterMatchMode): boolean {
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

