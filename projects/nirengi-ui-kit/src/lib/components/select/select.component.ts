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
  effect,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { ValueAccessorBase } from '../../common/base/value-accessor.base';
import { IconComponent } from '../icon/icon.component';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Modern Select/Dropdown component.
 * Supports single/multiple selection, searching, and custom item templates.
 *
 * ## Features
 * - ✅ ControlValueAccessor support (Form integration)
 * - ✅ Single and Multiple selection
 * - ✅ Searchable options
 * - ✅ Custom item template support
 * - ✅ OnPush change detection strategy
 * - ✅ Signal-based reactive state management
 * - ✅ Sizing support (xs, sm, md, lg, xl)
 *
 * @see {@link IconComponent} - Used icon component
 * @see {@link ValueAccessorBase} - Form infrastructure
 *
 * @example
 * <!-- Basic Usage -->
 * <nui-select
 *   [options]="users"
 *   bindLabel="name"
 *   bindValue="id"
 *   [(ngModel)]="selectedUserId"
 *   placeholder="Select User"
 * />
 *
 * @example
 * <!-- Customized Usage -->
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
  imports: [CommonModule, FormsModule, IconComponent, OverlayModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent extends ValueAccessorBase<any> {
  private elementRef = inject(ElementRef);

  /**
   * Unique ID for accessibility.
   * Randomly generated, but care must be taken during hydration for SSR compatibility.
   */
  readonly inputId = `nui-select-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * List of options to be displayed.
   * Can be an array of objects of any type or primitive values.
   */
  readonly options = input.required<any[]>();

  /**
   * Object property to be used for the label (display text).
   * If not provided, the option itself is used as the label.
   * @example 'name', 'title'
   */
  readonly bindLabel = input<string>();

  /**
   * Object property to be used for the value.
   * If not provided, the option object itself is used as the value.
   * @example 'id', 'uuid'
   */
  readonly bindValue = input<string>();

  /**
   * Whether multiple selection is allowed.
   * Default: false
   */
  readonly multiple = input<boolean>(false);

  /**
   * Whether a search box is shown within the dropdown.
   * Default: false
   */
  readonly searchable = input<boolean>(false);

  /**
   * Enables the clear button in single selection mode.
   * Default: true
   */
  readonly clearable = input<boolean>(true);

  /**
   * Component label.
   * Displayed above the input.
   */
  readonly label = input<string>();

  /**
   * Placeholder text to be displayed when no selection is made.
   * Default: 'Select...'
   */
  readonly placeholder = input<string>('Select...');

  /**
   * Helper hint text.
   * Displayed in small font below the component.
   */
  readonly hint = input<string>();

  /**
   * Success message text.
   * Displayed below the component when in a success state (green border).
   */
  readonly success = input<string>();

  /**
   * Warning message text.
   * Displayed below the component when in a warning state (yellow border).
   */
  readonly warning = input<string>();

  /**
   * Component size.
   * Accepts Size enum values (xs, sm, md, lg, xl).
   * Default: Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Color variant.
   * Accepts `ColorVariant` enum values to be used in component style and BEM modifier classes.
   * Default: `ColorVariant.Primary`
   *
   * @see ColorVariant
   */
  readonly variant = input<ColorVariant>(ColorVariant.Secondary);

  /**
   * Custom template for rendering options.
   * Can be passed as an input or received from content projection.
   */
  readonly itemTemplateInput = input<TemplateRef<any> | null>(null, { alias: 'itemTemplate' });

  /**
   * Template reference received from content children (ContentChild).
   * Usage: <nui-select> <ng-template ...> </nui-select>
   */
  readonly contentItemTemplate = contentChild<TemplateRef<any>>('itemTemplate');

  /**
   * Internal state: Is the dropdown open?
   */
  readonly isOpen = signal<boolean>(false);

  /**
   * Internal state: Current search term.
   */
  readonly searchTerm = signal<string>('');

  /**
   * Provides access to the search input element.
   * Used to automatically focus when the dropdown opens.
   */
  readonly searchInputElement = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  /**
   * Disable input for template binding.
   * Works in sync with the form control's disabled state.
   */
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

  /**
   * Appends the dropdown menu to the document body.
   * Required when used within containers that have `overflow: hidden`.
   */
  readonly appendToBody = input<boolean>(true);

  protected readonly Size = Size;
  protected readonly ColorVariant = ColorVariant;

  /**
   * Holds the trigger width (for Overlay).
   */
  readonly triggerWidth = signal<number | null>(null);

  /**
   * Computed: Container classes including variant and size.
   */
  readonly containerClasses = computed(() => {
    return `nui-select--${this.variant()} nui-select--${this.size()}`;
  });

  /**
   * Computed: Trigger classes for size.
   */
  readonly triggerClasses = computed(() => {
    return `nui-select__trigger--${this.size()}`;
  });

  /**
   * Overlay panel classes.
   * Necessary to maintain styles when appended to body.
   */
  readonly overlayPanelClasses = computed(() => {
    return [
      'nui-select', // Needed to match SCSS structure .nui-select .child
      'nui-select-overlay', // Global styles support
      `nui-select--${this.size()}`,
      `nui-select--${this.variant()}`,
    ];
  });

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
   * Computed: Active item template.
   * Priority order: Input > Content Child > Default (defined in HTML).
   */
  readonly itemTemplate = computed(
    () => this.itemTemplateInput() || this.contentItemTemplate() || null
  );

  /**
   * Computed: Options filtered by the search term.
   */
  readonly filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allOptions = this.options();

    if (!term) return allOptions;

    return allOptions.filter((opt) => {
      const label = this.getLabel(opt).toString().toLowerCase();
      return label.includes(term);
    });
  });

  /**
   * Computed: Full object forms of the selected items.
   * Bridges between the `value` signal (which might only hold IDs) and option objects.
   */
  readonly selectedItems = computed(() => {
    const rawVal = this.value();
    if (rawVal === null || rawVal === undefined) return [];

    const opts = this.options();
    const bindVal = this.bindValue();

    // Helper to find an option by its value
    const findOption = (val: any) => {
      if (!bindVal) return val; // Value is the object itself
      return opts.find((o) => o[bindVal] === val);
    };

    if (this.multiple()) {
      if (!Array.isArray(rawVal)) return [];
      return rawVal.map((v) => findOption(v)).filter(Boolean);
    } else {
      const opt = findOption(rawVal);
      return opt ? [opt] : [];
    }
  });

  /**
   * Computed: Icon size.
   * Dynamically calculated based on component size.
   */
  readonly iconSize = computed(() => {
    switch (this.size()) {
      case Size.XSmall:
        return 14;
      case Size.Small:
        return 16;
      case Size.Medium:
        return 18;
      case Size.Large:
        return 20;
      case Size.XLarge:
        return 24;
      default:
        return 18;
    }
  });

  /**
   * Checks if there is a selected value.
   * @returns true if value exists, false otherwise.
   */
  hasValue(): boolean {
    const val = this.value();
    if (Array.isArray(val)) return val.length > 0;
    return val !== null && val !== undefined;
  }

  /**
   * Toggles dropdown visibility (Open/Close).
   * Does nothing if disabled.
   */
  toggleDropdown(): void {
    if (this.isDisabled()) return;

    // Calculate width before opening
    if (!this.isOpen() && this.appendToBody()) {
      this.updateTriggerWidth();
    }

    this.isOpen.update((v) => !v);
    if (!this.isOpen()) {
      this.onTouched();
      this.searchTerm.set('');
    }
  }

  /**
   * Updates the trigger width.
   */
  private updateTriggerWidth() {
    const rect = this.elementRef.nativeElement
      .querySelector('.nui-select__trigger')
      ?.getBoundingClientRect();
    if (rect) {
      this.triggerWidth.set(rect.width);
    }
  }

  /**
   * Closes the dropdown when clicking outside.
   * @param event Click event
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  /**
   * Closes the dropdown and clears the state.
   */
  close(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.onTouched();
      this.searchTerm.set('');
    }
  }

  /**
   * Returns the display label for an option.
   * @param option Option object or value
   * @returns Text to be displayed
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
   * Returns the value of an option (for comparison).
   * @param option Option object
   * @returns Option's value (or itself if no bindValue)
   */
  getValue(option: any): any {
    const valueProp = this.bindValue();
    if (valueProp && typeof option === 'object') {
      return option[valueProp];
    }
    return option;
  }

  /**
   * Checks if an option is selected.
   * @param option Option to check
   * @returns true if selected
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
   * Handles option selection.
   * Closes the dropdown in single selection mode, adds/removes the value in multiple selection mode.
   * @param option Selected option
   */
  selectOption(option: any): void {
    const optVal = this.getValue(option);

    if (this.multiple()) {
      const current = (this.value() as any[]) || [];
      const index = current.indexOf(optVal);

      let newVal;
      if (index > -1) {
        newVal = current.filter((v) => v !== optVal);
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
   * Item removal helper (removal via chip).
   * @param item Item to be removed
   * @param event Event object
   */
  removeItem(item: any, event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;

    const optVal = this.getValue(item);
    const current = (this.value() as any[]) || [];
    const newVal = current.filter((v) => v !== optVal);
    this.updateValue(newVal);
  }

  /**
   * Updates the search term.
   * @param event Input event
   */
  onSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchTerm.set(val);
  }

  /**
   * Clears the value (for single selection).
   * @param event Event object
   */
  clearValue(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    this.updateValue(this.multiple() ? [] : null);
  }

  /**
   * TrackBy function for list performance.
   */
  trackByFn(index: number, item: any): any {
    return this.getValue(item) || index;
  }
}
