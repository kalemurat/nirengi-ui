import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  viewChild,
  TemplateRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TableComponent,
  ITableColumn,
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
  TextboxComponent,
} from 'nirengi-ui-kit';
import { FormsModule } from '@angular/forms';

/**
 * Mock data interface for the demo table.
 */
interface IDemoData {
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
    FormsModule,
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

  /**
   * The category filter ID to simulating data changes.
   */
  readonly categoryId = input<string>('all');

  /**
   * Detail modal template reference.
   */
  readonly detailTemplate = viewChild<TemplateRef<IDemoData>>('detailTemplate');

  /**
   * Table columns definition.
   */
  readonly columns: ITableColumn[] = [
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
    const baseData: IDemoData[] = Array.from({ length: 50 }, (_, i) => {
      const id = i + 1;
      const roles = ['Admin', 'Editor', 'Viewer', 'Moderator', 'Guest'];
      const statuses = [true, false];
      const names = [
        'Alice Johnson',
        'Bob Smith',
        'Charlie Brown',
        'Diana Ross',
        'Edward Norton',
        'Frank Castle',
        'Grace Hopper',
        'Harry Potter',
        'Iris West',
        'Jack Ryan',
        'Kevin Hart',
        'Laura Croft',
        'Mike Ross',
        'Nancy Drew',
        'Oscar Wilde',
        'Peter Parker',
        'Quinn Fabray',
        'Rachel Green',
        'Steve Rogers',
        'Tony Stark',
        'Ursula K. Le Guin',
        'Victor Hugo',
        'Wanda Maximoff',
        'Xena Warrior',
        'Yennefer Vengerberg',
        'Zorro Mask',
        'Arthur Curry',
        'Barry Allen',
        'Clark Kent',
        'Bruce Wayne',
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
        joinDate: date,
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
    const statuses = Array.from(new Set(data.map((d) => d.status)));

    // Map to objects for select component
    return statuses.map((s) => ({
      label: s ? 'Active' : 'Passive',
      value: s,
    }));
  });

  private readonly modalService = inject(MODAL_SERVICE);

  /**
   * Handle status filter change.
   * @param selectedValues Array of selected status booleans
   * @param filterFn The filter function from the table template context
   */
  onStatusFilterChange(
    selectedValues: boolean[],
    filterFn: (field: string, value: unknown, matchMode: string) => void
  ): void {
    // If no selection or empty array, clear filter
    if (!selectedValues || selectedValues.length === 0) {
      filterFn('status', null, 'equals');
      return;
    }

    // Usage: Pass array of values, use matchMode 'in' (which is supported by TableComponent).
    filterFn('status', selectedValues, 'in');
  }

  /**
   * Handle name filter change.
   * @param event The input event
   * @param filterFn The filter function
   */
  onNameFilterChange(
    event: Event,
    filterFn: (field: string, value: unknown, matchMode: string) => void
  ): void {
    const val = (event.target as HTMLInputElement).value;
    filterFn('name', val, 'contains');
  }

  /**
   * Opens the detail modal for a specific item.
   * @param item The item to view.
   */
  openDetail(item: IDemoData): void {
    const tpl = this.detailTemplate();
    if (tpl) {
      this.modalService.open(tpl, {
        title: 'User Details',
        data: item,
        size: ModalSize.Medium,
      });
    }
  }

  /**
   * Deletes an item (Client-side simulation).
   * @param item - Item to delete
   */
  deleteItem(item: IDemoData): void {
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
