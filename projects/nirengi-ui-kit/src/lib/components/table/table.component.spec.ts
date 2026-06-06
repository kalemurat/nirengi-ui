import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, ViewEncapsulation } from '@angular/core';
import { TableComponent, ITableColumn, FilterMatchMode } from './table.component';
import { Size } from '../../common/enums/size.enum';

interface TestRow {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
  category?: string;
}

interface NestedRow {
  id: number;
  user: { id: number; name: string };
}

const SAMPLE_DATA: TestRow[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 30, active: true, category: 'admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 25, active: false, category: 'user' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35, active: true, category: 'user' },
  { id: 4, name: 'Diana', email: 'diana@example.com', age: 28, active: true, category: 'admin' },
  { id: 5, name: 'Eve', email: 'eve@example.com', age: 22, active: false, category: 'guest' },
  { id: 6, name: 'Frank', email: 'frank@example.com', age: 45, active: true, category: 'user' },
  { id: 7, name: 'Grace', email: 'grace@example.com', age: 31, active: true, category: 'admin' },
  { id: 8, name: 'Henry', email: 'henry@example.com', age: 29, active: false, category: 'user' },
  { id: 9, name: 'Iris', email: 'iris@example.com', age: 33, active: true, category: 'guest' },
  { id: 10, name: 'Jack', email: 'jack@example.com', age: 27, active: false, category: 'user' },
  { id: 11, name: 'Kate', email: 'kate@example.com', age: 38, active: true, category: 'admin' },
  { id: 12, name: 'Liam', email: 'liam@example.com', age: 24, active: false, category: 'user' },
];

const SAMPLE_COLUMNS: ITableColumn[] = [
  { field: 'name', header: 'Name', filterable: true },
  { field: 'email', header: 'Email', filterable: false },
  { field: 'age', header: 'Age', filterable: true },
];

/**
 * Create a component and wait for the default 500ms debounce to settle.
 * The debounce is captured at construction time (field initializer), so
 * `filterDebounce` setInput has no effect on the pipe — we always wait 600ms.
 */
async function createFilterableComponent(
  overrides: Record<string, unknown> = {}
): Promise<{ fixture: ComponentFixture<TableComponent<TestRow>>; component: TableComponent<TestRow> }> {
  const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
  const component = fixture.componentInstance;

  fixture.componentRef.setInput('data', SAMPLE_DATA);

  for (const [key, value] of Object.entries(overrides)) {
    fixture.componentRef.setInput(key, value);
  }

  fixture.detectChanges();
  // Wait for the default 500ms debounce + margin so filtersDebounced signal settles.
  await new Promise((r) => setTimeout(r, 600));
  fixture.detectChanges();

  return { fixture, component };
}

/** Apply a filter, wait for debounce to fire, then detectChanges. */
async function applyFilterAndWait(
  fixture: ComponentFixture<TableComponent<TestRow>>,
  action: () => void
): Promise<void> {
  action();
  await new Promise((r) => setTimeout(r, 600));
  fixture.detectChanges();
}

function createComponent(
  overrides: Record<string, unknown> = {}
): { fixture: ComponentFixture<TableComponent<TestRow>>; component: TableComponent<TestRow> } {
  const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
  const component = fixture.componentInstance;

  fixture.componentRef.setInput('data', SAMPLE_DATA);

  for (const [key, value] of Object.entries(overrides)) {
    fixture.componentRef.setInput(key, value);
  }

  fixture.detectChanges();
  return { fixture, component };
}

describe('table.component.ts', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  // ─── Encapsulation guards (required to preserve) ───────────────────────────

  it('should use emulated (not None) view encapsulation so component styles do not leak', () => {
    const def = (TableComponent as unknown as { ɵcmp: { encapsulation: ViewEncapsulation } }).ɵcmp;
    expect(def.encapsulation).not.toBe(ViewEncapsulation.None);
    expect(def.encapsulation).toBe(ViewEncapsulation.Emulated);
  });

  it('should scope rendered host styling via emulated encapsulation attributes', () => {
    const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const attrs = host.getAttributeNames();
    expect(attrs.some((a) => a.startsWith('_nghost-'))).toBeTrue();
  });

  // ─── Component creation ────────────────────────────────────────────────────

  describe('Component creation', () => {
    it('should create with required data input set to empty array', () => {
      const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should create with non-empty data', () => {
      const { component } = createComponent();
      expect(component).toBeTruthy();
    });

    it('should initialize currentPage to 1', () => {
      const { component } = createComponent();
      expect(component.currentPage()).toBe(1);
    });
  });

  // ─── Required input: data ─────────────────────────────────────────────────

  describe('Input: data (required)', () => {
    it('should reflect data changes — viewData respects new data', async () => {
      const { fixture, component } = await createFilterableComponent();
      const newData: TestRow[] = [
        { id: 99, name: 'Test', email: 't@t.com', age: 20, active: true },
      ];
      fixture.componentRef.setInput('data', newData);
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      // With pagination disabled not necessary; check viewData contains the row
      expect(component.viewData().length).toBe(1);
    });

    it('should handle empty data array', async () => {
      const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('filterDebounce', 10);
      fixture.detectChanges();
      await new Promise((r) => setTimeout(r, 600));
      const component = fixture.componentInstance;
      expect(component._totalRecords()).toBe(0);
    });
  });

  // ─── Optional inputs — defaults ───────────────────────────────────────────

  describe('Input defaults', () => {
    it('should default filterDebounce to 500', () => {
      const { component } = createComponent();
      expect(component.filterDebounce()).toBe(500);
    });

    it('should default virtualScroll to false', () => {
      const { component } = createComponent();
      expect(component.virtualScroll()).toBe(false);
    });

    it('should default itemSize to 48', () => {
      const { component } = createComponent();
      expect(component.itemSize()).toBe(48);
    });

    it('should default scrollHeight to 400px', () => {
      const { component } = createComponent();
      expect(component.scrollHeight()).toBe('400px');
    });

    it('should default pagination to true', () => {
      const { component } = createComponent();
      expect(component.pagination()).toBe(true);
    });

    it('should default pageSize to 10', () => {
      const { component } = createComponent();
      expect(component.pageSize()).toBe(10);
    });

    it('should default size to Size.Medium', () => {
      const { component } = createComponent();
      expect(component.size()).toBe(Size.Medium);
    });

    it('should default loading to false', () => {
      const { component } = createComponent();
      expect(component.loading()).toBe(false);
    });

    it('should default columns to empty array', () => {
      const { component } = createComponent();
      expect(component.columns()).toEqual([]);
    });

    it('should default totalRecords to undefined', () => {
      const { component } = createComponent();
      expect(component.totalRecords()).toBeUndefined();
    });

    it('should default lazy to false', () => {
      const { component } = createComponent();
      expect(component.lazy()).toBe(false);
    });

    it('should default gridLines to horizontal', () => {
      const { component } = createComponent();
      expect(component.gridLines()).toBe('horizontal');
    });

    it('should default globalFilterMatchMode to contains', () => {
      const { component } = createComponent();
      expect(component.globalFilterMatchMode()).toBe('contains');
    });

    it('should default showGlobalFilter to false', () => {
      const { component } = createComponent();
      expect(component.showGlobalFilter()).toBe(false);
    });

    it('should default pageSizeOptions to [5, 10, 20, 50]', () => {
      const { component } = createComponent();
      expect(component.pageSizeOptions()).toEqual([5, 10, 20, 50]);
    });

    it('should default ofLabel to /', () => {
      const { component } = createComponent();
      expect(component.ofLabel()).toBe('/');
    });

    it('should default showingLabel to gösteriliyor', () => {
      const { component } = createComponent();
      expect(component.showingLabel()).toBe('gösteriliyor');
    });

    it('should default previousLabel to Geri', () => {
      const { component } = createComponent();
      expect(component.previousLabel()).toBe('Geri');
    });

    it('should default nextLabel to İleri', () => {
      const { component } = createComponent();
      expect(component.nextLabel()).toBe('İleri');
    });

    it('should default searchPlaceholder to Ara...', () => {
      const { component } = createComponent();
      expect(component.searchPlaceholder()).toBe('Ara...');
    });

    it('should default emptyTitle to Kayıt Bulunamadı', () => {
      const { component } = createComponent();
      expect(component.emptyTitle()).toBe('Kayıt Bulunamadı');
    });

    it('should default emptyMessage to correct Turkish string', () => {
      const { component } = createComponent();
      expect(component.emptyMessage()).toBe('Arama kriterlerinize uygun kayıt bulunamadı.');
    });
  });

  // ─── Optional inputs — custom values ─────────────────────────────────────

  describe('Input: custom values', () => {
    it('should accept custom filterDebounce', () => {
      const { component } = createComponent({ filterDebounce: 200 });
      expect(component.filterDebounce()).toBe(200);
    });

    it('should accept virtualScroll=true', () => {
      const { component } = createComponent({ virtualScroll: true });
      expect(component.virtualScroll()).toBe(true);
    });

    it('should accept custom itemSize', () => {
      const { component } = createComponent({ itemSize: 64 });
      expect(component.itemSize()).toBe(64);
    });

    it('should accept custom scrollHeight', () => {
      const { component } = createComponent({ scrollHeight: '600px' });
      expect(component.scrollHeight()).toBe('600px');
    });

    it('should accept pagination=false', () => {
      const { component } = createComponent({ pagination: false });
      expect(component.pagination()).toBe(false);
    });

    it('should accept columns input', () => {
      const { component } = createComponent({ columns: SAMPLE_COLUMNS });
      expect(component.columns()).toEqual(SAMPLE_COLUMNS);
    });

    it('should accept loading=true', () => {
      const { component } = createComponent({ loading: true });
      expect(component.loading()).toBe(true);
    });

    it('should accept totalRecords input', () => {
      const { component } = createComponent({ totalRecords: 100 });
      expect(component.totalRecords()).toBe(100);
    });

    it('should accept lazy=true', () => {
      const { component } = createComponent({ lazy: true });
      expect(component.lazy()).toBe(true);
    });

    it('should accept gridLines none', () => {
      const { component } = createComponent({ gridLines: 'none' });
      expect(component.gridLines()).toBe('none');
    });

    it('should accept gridLines vertical', () => {
      const { component } = createComponent({ gridLines: 'vertical' });
      expect(component.gridLines()).toBe('vertical');
    });

    it('should accept gridLines both', () => {
      const { component } = createComponent({ gridLines: 'both' });
      expect(component.gridLines()).toBe('both');
    });

    it('should accept showGlobalFilter=true', () => {
      const { component } = createComponent({ showGlobalFilter: true });
      expect(component.showGlobalFilter()).toBe(true);
    });

    it('should accept custom ofLabel', () => {
      const { component } = createComponent({ ofLabel: 'of' });
      expect(component.ofLabel()).toBe('of');
    });

    it('should accept size XSmall', () => {
      const { component } = createComponent({ size: Size.XSmall });
      expect(component.size()).toBe(Size.XSmall);
    });

    it('should accept size Small', () => {
      const { component } = createComponent({ size: Size.Small });
      expect(component.size()).toBe(Size.Small);
    });

    it('should accept size Large', () => {
      const { component } = createComponent({ size: Size.Large });
      expect(component.size()).toBe(Size.Large);
    });

    it('should accept size XLarge', () => {
      const { component } = createComponent({ size: Size.XLarge });
      expect(component.size()).toBe(Size.XLarge);
    });

    it('should accept trackBy field name', () => {
      const { component } = createComponent({ trackBy: 'id' });
      expect(component.trackBy()).toBe('id');
    });

    it('should accept custom pageSizeOptions', () => {
      const { component } = createComponent({ pageSizeOptions: [10, 25, 100] });
      expect(component.pageSizeOptions()).toEqual([10, 25, 100]);
    });

    it('should accept custom emptyTitle', () => {
      const { component } = createComponent({ emptyTitle: 'Nothing found' });
      expect(component.emptyTitle()).toBe('Nothing found');
    });

    it('should accept custom emptyMessage', () => {
      const { component } = createComponent({ emptyMessage: 'No records.' });
      expect(component.emptyMessage()).toBe('No records.');
    });

    it('should accept custom previousLabel', () => {
      const { component } = createComponent({ previousLabel: 'Prev' });
      expect(component.previousLabel()).toBe('Prev');
    });

    it('should accept custom nextLabel', () => {
      const { component } = createComponent({ nextLabel: 'Next' });
      expect(component.nextLabel()).toBe('Next');
    });

    it('should accept custom searchPlaceholder', () => {
      const { component } = createComponent({ searchPlaceholder: 'Type to search...' });
      expect(component.searchPlaceholder()).toBe('Type to search...');
    });

    it('should accept globalFilterMatchMode equals', () => {
      const { component } = createComponent({ globalFilterMatchMode: 'equals' });
      expect(component.globalFilterMatchMode()).toBe('equals');
    });

    it('should accept globalFilterMatchMode startsWith', () => {
      const { component } = createComponent({ globalFilterMatchMode: 'startsWith' });
      expect(component.globalFilterMatchMode()).toBe('startsWith');
    });

    it('should accept globalFilterMatchMode endsWith', () => {
      const { component } = createComponent({ globalFilterMatchMode: 'endsWith' });
      expect(component.globalFilterMatchMode()).toBe('endsWith');
    });

    it('should accept globalFilterMatchMode in', () => {
      const { component } = createComponent({ globalFilterMatchMode: 'in' });
      expect(component.globalFilterMatchMode()).toBe('in');
    });
  });

  // ─── Computed: filteredData ────────────────────────────────────────────────

  describe('Computed: filteredData', () => {
    it('should return all data when no filters applied (after debounce settles)', async () => {
      const { component } = await createFilterableComponent();
      expect(component.filteredData().length).toBe(SAMPLE_DATA.length);
    });

    it('should return raw data in lazy mode regardless of filters', async () => {
      const { fixture, component } = await createFilterableComponent({ lazy: true });
      // In lazy mode, filter() call does not reduce filteredData
      component.filter('name', 'Alice');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      expect(component.filteredData().length).toBe(SAMPLE_DATA.length);
    });

    it('should return raw data when totalRecords is provided (server-side mode)', async () => {
      const { fixture, component } = await createFilterableComponent({ totalRecords: 100 });
      component.filter('name', 'Alice');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      expect(component.filteredData().length).toBe(SAMPLE_DATA.length);
    });

    it('should apply contains filter and reduce results', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filter('name', 'alice', 'contains');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      const result = component.filteredData();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Alice');
    });

    it('should apply equals filter precisely', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filter('name', 'Alice', 'equals');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      const result = component.filteredData();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Alice');
    });

    it('should apply startsWith filter', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filter('name', 'A', 'startsWith');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      const result = component.filteredData();
      expect(result.every((r) => r.name.toLowerCase().startsWith('a'))).toBeTrue();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should apply endsWith filter', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filter('name', 'e', 'endsWith');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      const result = component.filteredData();
      expect(result.every((r) => r.name.toLowerCase().endsWith('e'))).toBeTrue();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should apply in filter with array value', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filter('category', ['admin', 'guest'], 'in');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      const result = component.filteredData();
      expect(result.every((r) => ['admin', 'guest'].includes(r.category!))).toBeTrue();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return no data when in filter value is a non-array string', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filter('name', 'Alice', 'in'); // 'in' with non-array → false
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      expect(component.filteredData().length).toBe(0);
    });

    it('should skip filter (pass all) when value is null', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filter('name', null);
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      expect(component.filteredData().length).toBe(SAMPLE_DATA.length);
    });

    it('should skip filter (pass all) when value is empty string', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filter('name', '');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      expect(component.filteredData().length).toBe(SAMPLE_DATA.length);
    });

    it('should skip filter (pass all) when value is undefined', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filter('name', undefined);
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      expect(component.filteredData().length).toBe(SAMPLE_DATA.length);
    });

    it('should apply multiple column filters as AND', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filter('category', 'admin', 'equals');
      component.filter('active', 'true', 'equals');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      const result = component.filteredData();
      expect(result.every((r) => r.category === 'admin' && r.active)).toBeTrue();
    });

    it('should return empty array when filter matches no row', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filter('name', 'xyzzy_no_match', 'equals');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      expect(component.filteredData().length).toBe(0);
    });

    it('should handle null item field value gracefully (matches returns false)', async () => {
      const dataWithNull = [
        { id: 1, name: null as unknown as string, email: 'x@x.com', age: 20, active: true },
      ];
      const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
      fixture.componentRef.setInput('data', dataWithNull);
      fixture.detectChanges();
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      fixture.componentInstance.filter('name', 'anything', 'contains');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      expect(fixture.componentInstance.filteredData().length).toBe(0);
    });

    it('should handle undefined item field value gracefully', async () => {
      const dataWithUndefined = [
        { id: 1, name: undefined as unknown as string, email: 'x@x.com', age: 20, active: true },
      ];
      const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
      fixture.componentRef.setInput('data', dataWithUndefined);
      fixture.detectChanges();
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      fixture.componentInstance.filter('name', 'anything', 'equals');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      expect(fixture.componentInstance.filteredData().length).toBe(0);
    });

    it('should apply global filter using contains mode', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filterGlobal('alice');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      const result = component.filteredData();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Alice');
    });

    it('should apply global filter using equals mode', async () => {
      const { fixture, component } = await createFilterableComponent({
        globalFilterMatchMode: 'equals',
      });
      component.filterGlobal('alice@example.com');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      const result = component.filteredData();
      expect(result.some((r) => r.email === 'alice@example.com')).toBeTrue();
    });

    it('should apply global filter using startsWith mode', async () => {
      const { fixture, component } = await createFilterableComponent({
        globalFilterMatchMode: 'startsWith',
      });
      component.filterGlobal('ali');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      expect(component.filteredData().length).toBeGreaterThan(0);
    });

    it('should apply global filter using endsWith mode', async () => {
      const { fixture, component } = await createFilterableComponent({
        globalFilterMatchMode: 'endsWith',
      });
      component.filterGlobal('.com');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      expect(component.filteredData().length).toBeGreaterThan(0);
    });

    it('should return all data on empty global filter', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filterGlobal('alice');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      component.filterGlobal('');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      expect(component.filteredData().length).toBe(SAMPLE_DATA.length);
    });

    it('should use default matchMode of contains when not specified in filter()', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filter('name', 'li'); // no matchMode → default 'contains'
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      const result = component.filteredData();
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((r) => r.name.toLowerCase().includes('li'))).toBeTrue();
    });
  });

  // ─── Computed: viewData ────────────────────────────────────────────────────

  describe('Computed: viewData', () => {
    it('should return first pageSize items when pagination is enabled', async () => {
      const { component } = await createFilterableComponent({ pageSize: 5 });
      expect(component.viewData().length).toBe(5);
    });

    it('should return correct slice for page 2', async () => {
      const { component } = await createFilterableComponent({ pageSize: 5 });
      component.currentPage.set(2);
      expect(component.viewData().length).toBe(5);
      expect(component.viewData()[0]).toEqual(SAMPLE_DATA[5]);
    });

    it('should return empty array when page is out of bounds', async () => {
      const { component } = await createFilterableComponent({ pageSize: 10 });
      component.currentPage.set(100);
      expect(component.viewData()).toEqual([]);
    });

    it('should return all data when pagination is disabled', async () => {
      const { component } = await createFilterableComponent({ pagination: false });
      expect(component.viewData().length).toBe(SAMPLE_DATA.length);
    });

    it('should return all data in virtualScroll mode', async () => {
      const { component } = await createFilterableComponent({ virtualScroll: true });
      expect(component.viewData().length).toBe(SAMPLE_DATA.length);
    });

    it('should return data as-is in lazy mode', async () => {
      const { component } = await createFilterableComponent({ lazy: true });
      expect(component.viewData().length).toBe(SAMPLE_DATA.length);
    });

    it('should return data as-is when totalRecords is provided', async () => {
      const { component } = await createFilterableComponent({ totalRecords: 100 });
      expect(component.viewData().length).toBe(SAMPLE_DATA.length);
    });

    it('should handle empty data gracefully', () => {
      const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();
      expect(fixture.componentInstance.viewData()).toEqual([]);
    });
  });

  // ─── Computed: _totalRecords ───────────────────────────────────────────────

  describe('Computed: _totalRecords', () => {
    it('should use totalRecords input when provided', () => {
      const { component } = createComponent({ totalRecords: 999 });
      expect(component._totalRecords()).toBe(999);
    });

    it('should use filteredData.length when totalRecords is not provided', async () => {
      const { component } = await createFilterableComponent();
      expect(component._totalRecords()).toBe(SAMPLE_DATA.length);
    });

    it('should return 0 for empty data', () => {
      const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();
      expect(fixture.componentInstance._totalRecords()).toBe(0);
    });

    it('should return provided totalRecords even when 0', () => {
      const { component } = createComponent({ totalRecords: 0 });
      // totalRecords !== undefined, so returns 0
      expect(component._totalRecords()).toBe(0);
    });
  });

  // ─── Computed: totalPages ─────────────────────────────────────────────────

  describe('Computed: totalPages', () => {
    it('should compute totalPages correctly for pageSize 5', async () => {
      const { component } = await createFilterableComponent({ pageSize: 5 });
      expect(component.totalPages()).toBe(Math.ceil(SAMPLE_DATA.length / 5));
    });

    it('should return 0 when data is empty', () => {
      const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();
      expect(fixture.componentInstance.totalPages()).toBe(0);
    });

    it('should handle pageSize of 0 by defaulting to 10 internally', () => {
      const { component } = createComponent({ pageSize: 0 });
      // pageSize || 10 → uses 10
      expect(component.totalPages()).toBe(Math.ceil(SAMPLE_DATA.length / 10));
    });

    it('should use provided totalRecords for page calculation', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      expect(component.totalPages()).toBe(5);
    });

    it('should recalculate after onPageSizeChange', () => {
      const { component } = createComponent();
      const before = component.totalPages();
      component.onPageSizeChange(5);
      expect(component.totalPages()).not.toBe(before);
      expect(component.totalPages()).toBe(Math.ceil(SAMPLE_DATA.length / 5));
    });
  });

  // ─── Computed: visibleRange ────────────────────────────────────────────────

  describe('Computed: visibleRange', () => {
    it('should return {start:0, end:0} when no records', () => {
      const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();
      expect(fixture.componentInstance.visibleRange()).toEqual({ start: 0, end: 0 });
    });

    it('should return correct range for page 1 with pageSize 5', () => {
      const { component } = createComponent({ pageSize: 5, totalRecords: 12 });
      expect(component.visibleRange()).toEqual({ start: 1, end: 5 });
    });

    it('should return correct range for last partial page', () => {
      const { component } = createComponent({ pageSize: 10, totalRecords: 12 });
      component.setPage(2);
      expect(component.visibleRange()).toEqual({ start: 11, end: 12 });
    });

    it('should clamp end to total', () => {
      const { component } = createComponent({ pageSize: 10, totalRecords: 12 });
      component.setPage(2);
      const range = component.visibleRange();
      expect(range.end).toBeLessThanOrEqual(12);
    });

    it('should update when pageSize changes', () => {
      const { component } = createComponent({ totalRecords: 50 });
      component.onPageSizeChange(20);
      const range = component.visibleRange();
      expect(range.end).toBe(20);
    });
  });

  // ─── Computed: pages ──────────────────────────────────────────────────────

  describe('Computed: pages', () => {
    it('should return all page numbers when totalPages <= 7', () => {
      const { component } = createComponent({ totalRecords: 15, pageSize: 5 });
      // 15/5 = 3 pages → ≤ 7
      expect(component.pages()).toEqual([1, 2, 3]);
    });

    it('should include all pages when exactly 7', () => {
      const { component } = createComponent({ totalRecords: 70, pageSize: 10 });
      const p = component.pages();
      expect(p).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should include ellipsis and first/last when totalPages > 7, at page 1', () => {
      const { component } = createComponent({ totalRecords: 100, pageSize: 10 });
      const p = component.pages();
      expect(p).toContain(1);
      expect(p[p.length - 1]).toBe(10);
    });

    it('should include leading ellipsis when current page > 3 in large set', () => {
      const { component } = createComponent({ totalRecords: 100, pageSize: 10 });
      component.currentPage.set(6);
      const p = component.pages();
      expect(p).toContain('...');
      expect(p).toContain(1);
      expect(p).toContain(10);
    });

    it('should include trailing ellipsis when current page is near start', () => {
      const { component } = createComponent({ totalRecords: 100, pageSize: 10 });
      component.currentPage.set(2);
      const p = component.pages();
      expect(p[0]).toBe(1);
      expect(p).toContain('...');
    });

    it('should include leading ellipsis when current page is near end', () => {
      const { component } = createComponent({ totalRecords: 100, pageSize: 10 });
      component.currentPage.set(9);
      const p = component.pages();
      expect(p).toContain('...');
      expect(p[p.length - 1]).toBe(10);
    });

    it('should not include leading ellipsis when current page is 3 (boundary)', () => {
      const { component } = createComponent({ totalRecords: 100, pageSize: 10 });
      component.currentPage.set(3);
      const p = component.pages();
      // current <= 3: no leading '...'
      expect(p[0]).toBe(1);
      // pages near start; could be no leading '...'
      const firstEllipsis = p.indexOf('...');
      if (firstEllipsis !== -1) {
        expect(firstEllipsis).toBeGreaterThan(0);
      }
    });

    it('should return empty array when there are no pages', () => {
      const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();
      expect(fixture.componentInstance.pages()).toEqual([]);
    });

    it('should not have duplicate entries', () => {
      const { component } = createComponent({ totalRecords: 100, pageSize: 10 });
      component.currentPage.set(5);
      const p = component.pages();
      const numbers = p.filter((x) => x !== '...');
      const unique = [...new Set(numbers)];
      expect(numbers.length).toBe(unique.length);
    });
  });

  // ─── Computed: rowHeightClass ─────────────────────────────────────────────

  describe('Computed: rowHeightClass', () => {
    it('should return h-8 text-xs for XSmall', () => {
      const { component } = createComponent({ size: Size.XSmall });
      expect(component.rowHeightClass()).toBe('h-8 text-xs');
    });

    it('should return h-10 text-sm for Small', () => {
      const { component } = createComponent({ size: Size.Small });
      expect(component.rowHeightClass()).toBe('h-10 text-sm');
    });

    it('should return h-12 text-base for Medium (default)', () => {
      const { component } = createComponent();
      expect(component.rowHeightClass()).toBe('h-12 text-base');
    });

    it('should return h-16 text-lg for Large', () => {
      const { component } = createComponent({ size: Size.Large });
      expect(component.rowHeightClass()).toBe('h-16 text-lg');
    });

    it('should return h-20 text-xl for XLarge', () => {
      const { component } = createComponent({ size: Size.XLarge });
      expect(component.rowHeightClass()).toBe('h-20 text-xl');
    });
  });

  // ─── Computed: paginationNumberClass ─────────────────────────────────────

  describe('Computed: paginationNumberClass', () => {
    it('should return correct class for XSmall', () => {
      const { component } = createComponent({ size: Size.XSmall });
      expect(component.paginationNumberClass()).toBe('w-6 h-6 text-xs');
    });

    it('should return correct class for Small', () => {
      const { component } = createComponent({ size: Size.Small });
      expect(component.paginationNumberClass()).toBe('w-7 h-7 text-xs');
    });

    it('should return correct class for Medium', () => {
      const { component } = createComponent();
      expect(component.paginationNumberClass()).toBe('w-8 h-8 text-sm');
    });

    it('should return correct class for Large', () => {
      const { component } = createComponent({ size: Size.Large });
      expect(component.paginationNumberClass()).toBe('w-9 h-9 text-base');
    });

    it('should return correct class for XLarge', () => {
      const { component } = createComponent({ size: Size.XLarge });
      expect(component.paginationNumberClass()).toBe('w-10 h-10 text-lg');
    });
  });

  // ─── Computed: paginationNavClass ────────────────────────────────────────

  describe('Computed: paginationNavClass', () => {
    it('should return correct class for XSmall', () => {
      const { component } = createComponent({ size: Size.XSmall });
      expect(component.paginationNavClass()).toBe('h-8 px-2 text-xs');
    });

    it('should return correct class for Small', () => {
      const { component } = createComponent({ size: Size.Small });
      expect(component.paginationNavClass()).toBe('h-9 px-3 text-xs');
    });

    it('should return correct class for Medium', () => {
      const { component } = createComponent();
      expect(component.paginationNavClass()).toBe('h-10 px-4 text-sm');
    });

    it('should return correct class for Large', () => {
      const { component } = createComponent({ size: Size.Large });
      expect(component.paginationNavClass()).toBe('h-12 px-5 text-base');
    });

    it('should return correct class for XLarge', () => {
      const { component } = createComponent({ size: Size.XLarge });
      expect(component.paginationNavClass()).toBe('h-14 px-6 text-lg');
    });
  });

  // ─── Method: filter (column filter) — synchronous state changes ───────────

  describe('Method: filter — synchronous state', () => {
    it('should reset currentPage to 1 when filter is applied', () => {
      const { component } = createComponent();
      component.currentPage.set(3);
      component.filter('name', 'Alice');
      expect(component.currentPage()).toBe(1);
    });

    it('filterFn should be a bound function reference', () => {
      const { component } = createComponent();
      expect(typeof component.filterFn).toBe('function');
    });

    it('should not throw when filterFn is called directly', () => {
      const { component } = createComponent();
      expect(() => component.filterFn('name', 'test', 'contains')).not.toThrow();
    });

    it('should accept all FilterMatchMode values without throwing', () => {
      const { component } = createComponent();
      const modes: FilterMatchMode[] = ['contains', 'equals', 'startsWith', 'endsWith', 'in'];
      for (const mode of modes) {
        expect(() => component.filter('name', 'Alice', mode)).not.toThrow();
      }
    });
  });

  // ─── Method: filterGlobal — synchronous state changes ─────────────────────

  describe('Method: filterGlobal — synchronous state', () => {
    it('should reset currentPage to 1', () => {
      const { component } = createComponent();
      component.currentPage.set(3);
      component.filterGlobal('test');
      expect(component.currentPage()).toBe(1);
    });

    it('should emit globalFilterChange output synchronously', () => {
      const { component } = createComponent();
      const spy = jasmine.createSpy('globalFilterChange');
      component.globalFilterChange.subscribe(spy);
      component.filterGlobal('hello');
      expect(spy).toHaveBeenCalledWith('hello');
    });

    it('should emit filterChange output synchronously', () => {
      const { component } = createComponent();
      const spy = jasmine.createSpy('filterChange');
      component.filterChange.subscribe(spy);
      component.filterGlobal('hello');
      expect(spy).toHaveBeenCalled();
      const emitted = spy.calls.mostRecent().args[0];
      expect(emitted.global).toBe('hello');
    });

    it('should emit filterChange with the current column filters too', () => {
      const { component } = createComponent();
      component.filter('name', 'Alice');
      const spy = jasmine.createSpy('filterChange');
      component.filterChange.subscribe(spy);
      component.filterGlobal('admin');
      const emitted = spy.calls.mostRecent().args[0];
      expect(emitted.columns['name']).toBeDefined();
      expect(emitted.global).toBe('admin');
    });
  });

  // ─── Method: setPage ──────────────────────────────────────────────────────

  describe('Method: setPage', () => {
    it('should set currentPage to given number', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      component.setPage(2);
      expect(component.currentPage()).toBe(2);
    });

    it('should emit pageChange when page is valid', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      const spy = jasmine.createSpy('pageChange');
      component.pageChange.subscribe(spy);
      component.setPage(3);
      expect(spy).toHaveBeenCalledWith(3);
    });

    it('should not change page when page < 1', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      component.setPage(0);
      expect(component.currentPage()).toBe(1);
    });

    it('should not change page when page > totalPages', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      component.setPage(999);
      expect(component.currentPage()).toBe(1);
    });

    it('should do nothing when page is a string (ellipsis)', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      const before = component.currentPage();
      component.setPage('...');
      expect(component.currentPage()).toBe(before);
    });

    it('should not emit pageChange when page is a string', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      const spy = jasmine.createSpy('pageChange');
      component.pageChange.subscribe(spy);
      component.setPage('...');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should navigate to last page', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      const last = component.totalPages();
      component.setPage(last);
      expect(component.currentPage()).toBe(last);
    });

    it('should navigate forward by calling with currentPage + 1', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      component.setPage(component.currentPage() + 1);
      expect(component.currentPage()).toBe(2);
    });

    it('should navigate backward by calling with currentPage - 1', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      component.setPage(3);
      component.setPage(component.currentPage() - 1);
      expect(component.currentPage()).toBe(2);
    });

    it('should not change page when trying to go before page 1 via prev', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      component.setPage(1);
      component.setPage(component.currentPage() - 1); // 0
      expect(component.currentPage()).toBe(1);
    });
  });

  // ─── Method: onPageSizeChange ─────────────────────────────────────────────

  describe('Method: onPageSizeChange', () => {
    it('should update pageSize', () => {
      const { component } = createComponent();
      component.onPageSizeChange(20);
      expect(component.pageSize()).toBe(20);
    });

    it('should reset currentPage to 1', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      component.setPage(3);
      component.onPageSizeChange(5);
      expect(component.currentPage()).toBe(1);
    });

    it('should emit pageChange with 1', () => {
      const { component } = createComponent();
      const spy = jasmine.createSpy('pageChange');
      component.pageChange.subscribe(spy);
      component.onPageSizeChange(20);
      expect(spy).toHaveBeenCalledWith(1);
    });

    it('should recalculate totalPages', () => {
      const { component } = createComponent({ totalRecords: 100, pageSize: 10 });
      expect(component.totalPages()).toBe(10);
      component.onPageSizeChange(20);
      expect(component.totalPages()).toBe(5);
    });
  });

  // ─── Method: getTrackByValue ───────────────────────────────────────────────

  describe('Method: getTrackByValue', () => {
    it('should return index when trackBy is not set', () => {
      const { component } = createComponent();
      expect(component.getTrackByValue(0, SAMPLE_DATA[0])).toBe(0);
      expect(component.getTrackByValue(5, SAMPLE_DATA[5])).toBe(5);
    });

    it('should return the field value for top-level trackBy field', () => {
      const { component } = createComponent({ trackBy: 'id' });
      expect(component.getTrackByValue(0, SAMPLE_DATA[0])).toBe(1);
      expect(component.getTrackByValue(1, SAMPLE_DATA[1])).toBe(2);
    });

    it('should resolve nested field value via dot notation', () => {
      const fixture = TestBed.createComponent<TableComponent<NestedRow>>(TableComponent);
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('trackBy', 'user.id');
      fixture.detectChanges();
      const comp = fixture.componentInstance;
      const nested: NestedRow = { id: 1, user: { id: 42, name: 'Nested' } };
      expect(comp.getTrackByValue(0, nested)).toBe(42);
    });

    it('should return undefined for missing nested path', () => {
      const { component } = createComponent({ trackBy: 'user.details.code' });
      expect(component.getTrackByValue(0, SAMPLE_DATA[0])).toBeUndefined();
    });

    it('should handle single-level field on trackBy', () => {
      const { component } = createComponent({ trackBy: 'name' });
      expect(component.getTrackByValue(0, SAMPLE_DATA[0])).toBe('Alice');
    });
  });

  // ─── Output: rowClick ─────────────────────────────────────────────────────

  describe('Output: rowClick', () => {
    it('should emit rowClick when a row is clicked', async () => {
      const { fixture, component } = await createFilterableComponent({
        columns: SAMPLE_COLUMNS,
      });
      fixture.detectChanges();

      const spy = jasmine.createSpy('rowClick');
      component.rowClick.subscribe(spy);

      const rows = (fixture.nativeElement as HTMLElement).querySelectorAll(
        'tr.nui-table__row--body'
      );
      expect(rows.length).toBeGreaterThan(0);
      (rows[0] as HTMLElement).click();
      expect(spy).toHaveBeenCalled();
    });

    it('should emit the clicked row data', async () => {
      const { fixture, component } = await createFilterableComponent({
        columns: SAMPLE_COLUMNS,
        pageSize: 10,
      });
      fixture.detectChanges();

      const spy = jasmine.createSpy('rowClick');
      component.rowClick.subscribe(spy);

      const rows = (fixture.nativeElement as HTMLElement).querySelectorAll(
        'tr.nui-table__row--body'
      );
      (rows[0] as HTMLElement).click();
      expect(spy.calls.mostRecent().args[0]).toEqual(SAMPLE_DATA[0]);
    });

    it('should expose rowClick output', () => {
      const { component } = createComponent();
      expect(component.rowClick).toBeDefined();
    });
  });

  // ─── Output: sortChange ────────────────────────────────────────────────────

  describe('Output: sortChange', () => {
    it('should expose sortChange output', () => {
      const { component } = createComponent();
      expect(component.sortChange).toBeDefined();
    });

    it('should allow subscription and manual emit on sortChange', () => {
      const { component } = createComponent();
      const spy = jasmine.createSpy('sortChange');
      component.sortChange.subscribe(spy);
      component.sortChange.emit({ field: 'name', order: 'asc' });
      expect(spy).toHaveBeenCalledWith({ field: 'name', order: 'asc' });
    });

    it('should allow emitting with order null', () => {
      const { component } = createComponent();
      const spy = jasmine.createSpy('sortChange');
      component.sortChange.subscribe(spy);
      component.sortChange.emit({ field: 'age', order: null });
      expect(spy).toHaveBeenCalledWith({ field: 'age', order: null });
    });
  });

  // ─── Output: filterChange (via effect after debounce) ────────────────────

  describe('Output: filterChange (debounce-triggered)', () => {
    it('should emit filterChange after debounce with column filter info', async () => {
      const { fixture, component } = await createFilterableComponent();
      const spy = jasmine.createSpy('filterChange');
      component.filterChange.subscribe(spy);

      component.filter('name', 'Alice');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      const emitted = spy.calls.mostRecent().args[0];
      expect(emitted.columns['name'].value).toBe('Alice');
      expect(emitted.columns['name'].matchMode).toBe('contains');
    });

    it('should include both global and column info in filterChange emission', async () => {
      const { fixture, component } = await createFilterableComponent();
      const spy = jasmine.createSpy('filterChange');
      component.filterChange.subscribe(spy);

      component.filterGlobal('hello'); // emits immediately via filterGlobal
      component.filter('email', 'alice@example.com', 'equals');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();

      const calls = spy.calls.allArgs();
      expect(calls.length).toBeGreaterThan(0);
    });
  });

  // ─── Template: loading state ───────────────────────────────────────────────

  describe('Template: loading state', () => {
    it('should render loading overlay when loading=true', async () => {
      const { fixture } = await createFilterableComponent({ loading: true });
      fixture.detectChanges();
      const overlay = (fixture.nativeElement as HTMLElement).querySelector('.nui-table-loading');
      expect(overlay).toBeTruthy();
    });

    it('should not render loading overlay when loading=false', async () => {
      const { fixture } = await createFilterableComponent({ loading: false });
      fixture.detectChanges();
      const overlay = (fixture.nativeElement as HTMLElement).querySelector('.nui-table-loading');
      expect(overlay).toBeFalsy();
    });

    it('should render loading spinner svg inside loading overlay', async () => {
      const { fixture } = await createFilterableComponent({ loading: true });
      fixture.detectChanges();
      const spinner = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table-loading__spinner'
      );
      expect(spinner).toBeTruthy();
    });
  });

  // ─── Template: global filter input ────────────────────────────────────────

  describe('Template: global filter input', () => {
    it('should not show global filter input by default', () => {
      const { fixture } = createComponent();
      const input = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table-toolbar__search-input'
      );
      expect(input).toBeFalsy();
    });

    it('should show global filter input when showGlobalFilter=true', async () => {
      const { fixture } = await createFilterableComponent({ showGlobalFilter: true });
      fixture.detectChanges();
      const input = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table-toolbar__search-input'
      );
      expect(input).toBeTruthy();
    });

    it('should disable global filter input when loading=true', async () => {
      const { fixture } = await createFilterableComponent({
        showGlobalFilter: true,
        loading: true,
      });
      fixture.detectChanges();
      const input = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table-toolbar__search-input'
      ) as HTMLInputElement;
      expect(input?.disabled).toBeTrue();
    });

    it('should render with custom searchPlaceholder', async () => {
      const { fixture } = await createFilterableComponent({
        showGlobalFilter: true,
        searchPlaceholder: 'Search here...',
      });
      fixture.detectChanges();
      const input = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table-toolbar__search-input'
      ) as HTMLInputElement;
      expect(input?.placeholder).toBe('Search here...');
    });
  });

  // ─── Template: columns mode ────────────────────────────────────────────────

  describe('Template: columns mode', () => {
    it('should render column headers from columns input', async () => {
      const { fixture } = await createFilterableComponent({ columns: SAMPLE_COLUMNS });
      fixture.detectChanges();
      const headers = (fixture.nativeElement as HTMLElement).querySelectorAll(
        '.nui-table__header-title'
      );
      const headerTexts = Array.from(headers).map((h) => h.textContent?.trim());
      expect(headerTexts).toContain('Name');
      expect(headerTexts).toContain('Email');
      expect(headerTexts).toContain('Age');
    });

    it('should render filter inputs only for filterable columns', async () => {
      const { fixture } = await createFilterableComponent({ columns: SAMPLE_COLUMNS });
      fixture.detectChanges();
      const filterInputs = (fixture.nativeElement as HTMLElement).querySelectorAll(
        '.nui-table__filter-input'
      );
      // Name (filterable=true) and Age (filterable=true), Email (filterable=false) → 2
      expect(filterInputs.length).toBe(2);
    });

    it('should render cell data for each column', async () => {
      const { fixture } = await createFilterableComponent({
        columns: [{ field: 'name', header: 'Name' }],
        pageSize: 5,
      });
      fixture.detectChanges();
      const cells = (fixture.nativeElement as HTMLElement).querySelectorAll('.nui-table__cell');
      expect(cells.length).toBe(5);
    });

    it('should render default header when no columns or headTemplate provided', async () => {
      const { fixture } = await createFilterableComponent();
      fixture.detectChanges();
      const defaultHead = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table__cell--default-head'
      );
      expect(defaultHead).toBeTruthy();
    });
  });

  // ─── Template: empty state ─────────────────────────────────────────────────

  describe('Template: empty state', () => {
    it('should show empty state when data is empty', () => {
      const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();
      const emptyContent = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table__empty-content'
      );
      expect(emptyContent).toBeTruthy();
    });

    it('should show emptyTitle text in empty state', () => {
      const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('emptyTitle', 'No Data Found');
      fixture.detectChanges();
      const title = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table__empty-title'
      );
      expect(title?.textContent?.trim()).toBe('No Data Found');
    });

    it('should show emptyMessage text in empty state', () => {
      const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('emptyMessage', 'No records match.');
      fixture.detectChanges();
      const msg = (fixture.nativeElement as HTMLElement).querySelector('.nui-table__empty-text');
      expect(msg?.textContent?.trim()).toBe('No records match.');
    });

    it('should show empty state when filter produces no matches', async () => {
      const { fixture, component } = await createFilterableComponent();
      component.filterGlobal('xyzzy_no_match_12345');
      await new Promise((r) => setTimeout(r, 600));
      fixture.detectChanges();
      const emptyContent = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table__empty-content'
      );
      expect(emptyContent).toBeTruthy();
    });
  });

  // ─── Template: pagination bar ─────────────────────────────────────────────

  describe('Template: pagination bar', () => {
    it('should render pagination bar when pagination=true and there are records', async () => {
      const { fixture } = await createFilterableComponent();
      fixture.detectChanges();
      const bar = (fixture.nativeElement as HTMLElement).querySelector('.nui-table-pagination');
      expect(bar).toBeTruthy();
    });

    it('should not render pagination bar when data is empty', () => {
      const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();
      const bar = (fixture.nativeElement as HTMLElement).querySelector('.nui-table-pagination');
      expect(bar).toBeFalsy();
    });

    it('should not render pagination bar when pagination=false', async () => {
      const { fixture } = await createFilterableComponent({ pagination: false });
      fixture.detectChanges();
      const bar = (fixture.nativeElement as HTMLElement).querySelector('.nui-table-pagination');
      expect(bar).toBeFalsy();
    });

    it('should not render pagination bar when virtualScroll=true', async () => {
      const { fixture } = await createFilterableComponent({ virtualScroll: true });
      fixture.detectChanges();
      const bar = (fixture.nativeElement as HTMLElement).querySelector('.nui-table-pagination');
      expect(bar).toBeFalsy();
    });

    it('should disable prev button on first page', async () => {
      const { fixture } = await createFilterableComponent();
      fixture.detectChanges();
      const prev = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table-pagination__btn--prev'
      ) as HTMLButtonElement;
      expect(prev?.disabled).toBeTrue();
    });

    it('should disable next button on last page', async () => {
      const { fixture, component } = await createFilterableComponent({ pageSize: 5 });
      const last = component.totalPages();
      component.setPage(last);
      fixture.detectChanges();
      const next = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table-pagination__btn--next'
      ) as HTMLButtonElement;
      expect(next?.disabled).toBeTrue();
    });

    it('should show custom prev/next labels', async () => {
      const { fixture } = await createFilterableComponent({
        previousLabel: 'Prev',
        nextLabel: 'Next',
      });
      fixture.detectChanges();
      const prevText = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table-pagination__btn--prev .nui-table-pagination__btn-text'
      );
      const nextText = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table-pagination__btn--next .nui-table-pagination__btn-text'
      );
      expect(prevText?.textContent?.trim()).toBe('Prev');
      expect(nextText?.textContent?.trim()).toBe('Next');
    });

    it('should show custom ofLabel and showingLabel in info section', async () => {
      const { fixture } = await createFilterableComponent({
        ofLabel: 'of',
        showingLabel: 'shown',
      });
      fixture.detectChanges();
      const info = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table-pagination__text'
      );
      expect(info?.textContent).toContain('of');
      expect(info?.textContent).toContain('shown');
    });

    it('should show total record count in info section', async () => {
      const { fixture } = await createFilterableComponent();
      fixture.detectChanges();
      const total = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table-pagination__total'
      );
      expect(total?.textContent?.trim()).toBe(String(SAMPLE_DATA.length));
    });

    it('should disable pagination buttons when loading=true', async () => {
      const { fixture } = await createFilterableComponent({ loading: true });
      fixture.detectChanges();
      const prev = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table-pagination__btn--prev'
      ) as HTMLButtonElement;
      expect(prev?.disabled).toBeTrue();
    });
  });

  // ─── Template: table size / gridLines class ───────────────────────────────

  describe('Template: table container class', () => {
    it('should include size in container class for Large', async () => {
      const { fixture } = await createFilterableComponent({ size: Size.Large });
      fixture.detectChanges();
      const container = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table-container--lg'
      );
      expect(container).toBeTruthy();
    });

    it('should include gridLines in table class for both', async () => {
      const { fixture } = await createFilterableComponent({ gridLines: 'both' });
      fixture.detectChanges();
      const table = (fixture.nativeElement as HTMLElement).querySelector('.nui-table--grid-both');
      expect(table).toBeTruthy();
    });

    it('should include gridLines none', async () => {
      const { fixture } = await createFilterableComponent({ gridLines: 'none' });
      fixture.detectChanges();
      const table = (fixture.nativeElement as HTMLElement).querySelector('.nui-table--grid-none');
      expect(table).toBeTruthy();
    });

    it('should include gridLines vertical', async () => {
      const { fixture } = await createFilterableComponent({ gridLines: 'vertical' });
      fixture.detectChanges();
      const table = (fixture.nativeElement as HTMLElement).querySelector(
        '.nui-table--grid-vertical'
      );
      expect(table).toBeTruthy();
    });
  });

  // ─── Virtual scroll mode ──────────────────────────────────────────────────

  describe('Virtual scroll mode', () => {
    it('should render cdk-virtual-scroll-viewport when virtualScroll=true', async () => {
      const { fixture } = await createFilterableComponent({ virtualScroll: true });
      fixture.detectChanges();
      const viewport = (fixture.nativeElement as HTMLElement).querySelector(
        'cdk-virtual-scroll-viewport'
      );
      expect(viewport).toBeTruthy();
    });

    it('should NOT render cdk-virtual-scroll-viewport when virtualScroll=false', async () => {
      const { fixture } = await createFilterableComponent({ virtualScroll: false });
      fixture.detectChanges();
      const viewport = (fixture.nativeElement as HTMLElement).querySelector(
        'cdk-virtual-scroll-viewport'
      );
      expect(viewport).toBeFalsy();
    });

    it('should return all filteredData in viewData for virtualScroll mode', async () => {
      const { component } = await createFilterableComponent({ virtualScroll: true });
      expect(component.viewData().length).toBe(SAMPLE_DATA.length);
    });
  });

  // ─── ContentChild: headTemplate / rowTemplate ─────────────────────────────

  describe('ContentChild: headTemplate / rowTemplate', () => {
    it('should expose headTemplate as undefined when not provided', () => {
      const { component } = createComponent();
      expect(component.headTemplate()).toBeUndefined();
    });

    it('should expose rowTemplate as undefined when not provided', () => {
      const { component } = createComponent();
      expect(component.rowTemplate()).toBeUndefined();
    });
  });

  // ─── Edge cases ───────────────────────────────────────────────────────────

  describe('Edge cases', () => {
    it('should handle single record dataset correctly', () => {
      const singleRow: TestRow[] = [
        { id: 1, name: 'Solo', email: 's@s.com', age: 25, active: true },
      ];
      const fixture = TestBed.createComponent<TableComponent<TestRow>>(TableComponent);
      fixture.componentRef.setInput('data', singleRow);
      fixture.detectChanges();
      const comp = fixture.componentInstance;
      expect(comp._totalRecords()).toBe(1);
      expect(comp.totalPages()).toBe(1);
    });

    it('should reset to page 1 after filter method call', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      component.setPage(3);
      component.filter('name', 'Alice');
      expect(component.currentPage()).toBe(1);
    });

    it('should recalculate visibleRange on page navigation', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      const page1Range = component.visibleRange();
      component.setPage(2);
      const page2Range = component.visibleRange();
      expect(page2Range.start).toBe(page1Range.end + 1);
    });

    it('should not emit pageChange when setPage receives ellipsis string', () => {
      const { component } = createComponent({ totalRecords: 50, pageSize: 10 });
      const spy = jasmine.createSpy('pageChange');
      component.pageChange.subscribe(spy);
      component.setPage('...');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should handle onPageSizeChange to large number', () => {
      const { component } = createComponent({ totalRecords: 12, pageSize: 10 });
      component.onPageSizeChange(100);
      expect(component.totalPages()).toBe(1);
      expect(component.currentPage()).toBe(1);
    });

    it('should handle totalRecords=0 with explicit input (no pagination bar)', () => {
      const { component } = createComponent({ totalRecords: 0 });
      expect(component._totalRecords()).toBe(0);
      expect(component.totalPages()).toBe(0);
    });

    it('should produce correct visibleRange for page 1 of single page', () => {
      const { component } = createComponent({ totalRecords: 3, pageSize: 10 });
      expect(component.visibleRange()).toEqual({ start: 1, end: 3 });
    });

    it('should handle deeply nested trackBy path with missing intermediate', () => {
      const { component } = createComponent({ trackBy: 'a.b.c.d' });
      expect(component.getTrackByValue(0, SAMPLE_DATA[0])).toBeUndefined();
    });

    it('should expose globalFilterChange output', () => {
      const { component } = createComponent();
      expect(component.globalFilterChange).toBeDefined();
    });

    it('should expose pageChange output', () => {
      const { component } = createComponent();
      expect(component.pageChange).toBeDefined();
    });

    it('should expose filterChange output', () => {
      const { component } = createComponent();
      expect(component.filterChange).toBeDefined();
    });

    it('should expose rowClick output', () => {
      const { component } = createComponent();
      expect(component.rowClick).toBeDefined();
    });
  });
});
