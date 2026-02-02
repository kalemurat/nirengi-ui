import { ChangeDetectionStrategy, Component, computed, input, viewChild, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    TableComponent,
    TableColumn,
    BadgeComponent,
    ButtonComponent,
    Size,
    ColorVariant,
    ButtonType,
    BadgeType,
    BadgeShape,
    MODAL_SERVICE,
    ModalSize,
    SelectComponent,
    TextboxComponent
} from 'nirengi-ui-kit';
import { FormsModule } from '@angular/forms';

/**
 * Mock data interface for the demo table.
 */
interface DemoData {
  id: number;
  name: string;
  role: string;
  status: boolean;
  joinDate: string;
}

/**
 * Demo 1 component showcasing a table with mock data, actions, and modal integration.
 * Designed to demonstrate the capabilities of nirengi-ui-kit components.
 */
@Component({
  selector: 'app-demo-1',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    BadgeComponent,
    ButtonComponent,
    SelectComponent,
    TextboxComponent,
    FormsModule
  ],
  templateUrl: './demo-1.component.html',
  styleUrl: './demo-1.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Demo1Component {
  // Expose Enums to template
  readonly Size = Size;
  readonly ColorVariant = ColorVariant;
  readonly ButtonType = ButtonType;
  readonly BadgeType = BadgeType;
  readonly BadgeShape = BadgeShape;

  private modalService = inject(MODAL_SERVICE);

  /**
   * The category filter ID to simulating data changes.
   */
  readonly categoryId = input<string>('all');

  /**
   * Detail modal template reference.
   */
  readonly detailTemplate = viewChild<TemplateRef<any>>('detailTemplate');

  /**
   * Table columns definition.
   */
  readonly columns: TableColumn[] = [
    { field: 'name', header: 'Name', filterable: true },
    { field: 'role', header: 'Role', filterable: true },
    { field: 'status', header: 'Status' },
    { field: 'joinDate', header: 'Join Date' },
    { field: 'actions', header: 'Actions' },
  ];

  /**
   * Mock data generation based on category input.
   */
  readonly tableData = computed(() => {
    const cat = this.categoryId();
    // Simulate data changes based on category
    // Generate 50 items for better pagination demo
    const baseData: DemoData[] = Array.from({ length: 50 }, (_, i) => {
      const id = i + 1;
      const roles = ['Admin', 'Editor', 'Viewer', 'Moderator', 'Guest'];
      const statuses = [true, false];
      const names = [
        'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Ross', 'Edward Norton',
        'Frank Castle', 'Grace Hopper', 'Harry Potter', 'Iris West', 'Jack Ryan',
        'Kevin Hart', 'Laura Croft', 'Mike Ross', 'Nancy Drew', 'Oscar Wilde',
        'Peter Parker', 'Quinn Fabray', 'Rachel Green', 'Steve Rogers', 'Tony Stark',
        'Ursula K. Le Guin', 'Victor Hugo', 'Wanda Maximoff', 'Xena Warrior', 'Yennefer Vengerberg',
        'Zorro Mask', 'Arthur Curry', 'Barry Allen', 'Clark Kent', 'Bruce Wayne'
      ];
      
      const randomName = names[i % names.length];
      const randomRole = roles[i % roles.length];
      const randomStatus = statuses[i % statuses.length];
      const date = new Date(2023, i % 12, (i % 28) + 1).toISOString().split('T')[0];

      return {
        id,
        name: `${randomName} ${Math.floor(i / names.length) + 1}`, // Ensure uniqueness
        role: randomRole,
        status: randomStatus,
        joinDate: date
      };
    });

    if (cat === 'users') return baseData;
    if (cat === 'settings') return baseData.slice(0, 5); // Show fewer for settings
    if (cat === 'reports') return [...baseData].reverse(); // Just reverse for variety
    
    return baseData;
  });

  /**
   * Status filter options derived from table data.
   */
  readonly statusOptions = computed(() => {
    // Get unique status values
    const data = this.tableData();
    const statuses = Array.from(new Set(data.map(d => d.status)));
    
    // Map to objects for select component
    return statuses.map(s => ({
      label: s ? 'Active' : 'Passive',
      value: s
    }));
  });

  /**
   * Handle status filter change.
   * @param selectedValues Array of selected status booleans
   * @param filterFn The filter function from the table template context
   */
  onStatusFilterChange(selectedValues: boolean[], filterFn: (field: string, value: any, matchMode: string) => void): void {
    // If no selection or empty array, clear filter
    if (!selectedValues || selectedValues.length === 0) {
      filterFn('status', null, 'equals');
      return;
    }
    
    // For single boolean it's 'equals', but for multi-select we need a custom logic.
    // However, the standard table filter simple implementation might only support single value check in 'equals' mode.
    // If the table 'matches' function supports arrays or if we need a custom match mode, we would need to check table component capability.
    // Reviewing TableComponent code:
    // It checks: if (m.value === null ...) ... return this.matches(itemValue, m.value, m.matchMode);
    // matches() -> equals: sValue === sFilter.
    // It implies standard table only supports single value match for now unless we extend it or specific mode 'in'.
    // BUT, the user asked for a multi-select filter.
    // The table component has simplistic filter logic: 'contains', 'equals', 'startsWith', 'endsWith'.
    // It does NOT appear to have 'in' or array support in the viewed code (Step 12).
    //
    // WORKAROUND:
    // Since we cannot easily modify the TableComponent's core logic right now without potentially breaking things or going out of scope,
    // we might need to filter manually or trick it.
    // BUT the requirement is specifically to add this filter to the column.
    // If I pass an array to 'equals', `String(value).toLowerCase() === String(filter).toLowerCase()` will fail for array vs boolean.
    //
    // Wait, the TableComponent source (Step 12) line 225: `return this.matches(itemValue, m.value, m.matchMode);`
    // And `matches` (line 469):
    // `const sValue = String(value).toLowerCase();`
    // `const sFilter = String(filter).toLowerCase();`
    //
    // This confirms standard TableComponent DOES NOT support multi-select filtering out of the box with current `matches` implementation.
    //
    // To strictly fulfill the user request "tablonun status kısmını tablo verilerini tekrarsız birer defa gösteren bir filtre ekleyebilir misin? status kısmında da multi selectbox olacak şekilde yapabilirsin filtreyi",
    // I really SHOULD update the TableComponent to support an 'in' matchMode or handle array values in filter.
    //
    // Let's modify TableComponent (it's in the kit) to support 'in' matchMode or Array checking.
    // I will first implement the usage in Demo1Component assuming support, then update TableComponent.
    
    // Usage: Pass array of values, use matchMode 'in' (which I will add).
    filterFn('status', selectedValues, 'in');
  }

  /**
   * Handle name filter change.
   * @param event The input event
   * @param filterFn The filter function
   */
  onNameFilterChange(event: Event, filterFn: (field: string, value: any, matchMode: string) => void): void {
      const val = (event.target as HTMLInputElement).value;
      filterFn('name', val, 'contains');
  }

  /**
   * Opens the detail modal for a specific item.
   * @param item The item to view.
   */
  openDetail(item: DemoData): void {
    const tpl = this.detailTemplate();
    if (tpl) {
      this.modalService.open(tpl, {
        title: 'User Details',
        data: item,
        size: ModalSize.Medium
      });
    }
  }

  /**
   * Deletes an item (Client-side simulation).
   * @param item - Item to delete
   */
  deleteItem(item: DemoData): void {
     console.log('Delete item:', item);
  }

  /**
   * Closes the detail modal.
   * Note: This method is used in the template for the 'Close' button.
   * It calls closeAll or close specific id if tracked.
   */
  closeDialog(): void {
    this.modalService.closeAll();
  }
}
