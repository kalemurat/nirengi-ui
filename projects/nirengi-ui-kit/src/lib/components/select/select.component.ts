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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { ValueAccessorBase } from '../../common/base/value-accessor.base';
import { IconComponent } from '../icon/icon.component';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Select/Dropdown component with single/multiple selection, search, and custom item templates.
 *
 * @see {@link IconComponent}
 * @see {@link ValueAccessorBase}
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent extends ValueAccessorBase<unknown> {
  private elementRef = inject(ElementRef);

  /**
   * Unique ID for accessibility.
   * Randomly generated, but care must be taken during hydration for SSR compatibility.
   */
  readonly inputId = `nui-select-${Math.random().toString(36).substr(2, 9)}`;

  readonly options = input.required<unknown[]>();

  /**
   * Object property used for display text. If omitted, the option itself is used as the label.
   * @example 'name', 'title'
   */
  readonly bindLabel = input<string>();

  /**
   * Object property used as the bound value. If omitted, the option object itself is used.
   * @example 'id', 'uuid'
   */
  readonly bindValue = input<string>();

  /** @default false */
  readonly multiple = input<boolean>(false);

  /** @default false */
  readonly searchable = input<boolean>(false);

  /** @default true */
  readonly clearable = input<boolean>(true);

  readonly label = input<string>();

  /** @default 'Select...' */
  readonly placeholder = input<string>('Select...');

  readonly hint = input<string>();

  /** Displayed below the component in a success state (green border). */
  readonly success = input<string>();

  /** Displayed below the component in a warning state (yellow border). */
  readonly warning = input<string>();

  /** @default Size.Medium */
  readonly size = input<Size>(Size.Medium);

  /**
   * @default ColorVariant.Secondary
   * @see ColorVariant
   */
  readonly variant = input<ColorVariant>(ColorVariant.Secondary);

  // eslint-disable-next-line @angular-eslint/no-input-rename -- intentional public API alias
  readonly itemTemplateInput = input<TemplateRef<unknown> | null>(null, { alias: 'itemTemplate' });

  /** Custom item template via content projection: `<ng-template #itemTemplate let-item>`. */
  readonly contentItemTemplate = contentChild<TemplateRef<unknown>>('itemTemplate');

  readonly isOpen = signal<boolean>(false);

  readonly searchTerm = signal<string>('');

  /** Auto-focused when the dropdown opens with `searchable` enabled. */
  readonly searchInputElement = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  /** Kept in sync with the form control's disabled state via `setDisabledState`. */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- intentional public API alias
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

  /**
   * Appends the dropdown menu to the document body.
   * Required when used within containers that have `overflow: hidden`.
   */
  readonly appendToBody = input<boolean>(true);

  protected readonly Size = Size;
  protected readonly ColorVariant = ColorVariant;

  readonly triggerWidth = signal<number | null>(null);

  readonly containerClasses = computed(() => {
    return `nui-select--${this.variant()} nui-select--${this.size()}`;
  });

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

  /** Priority: input binding > content child > template default. */
  readonly itemTemplate = computed(
    () => this.itemTemplateInput() || this.contentItemTemplate() || null
  );

  readonly filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allOptions = this.options();

    if (!term) return allOptions;

    return allOptions.filter((opt) => {
      const label = this.getLabel(opt).toString().toLowerCase();
      return label.includes(term);
    });
  });

  /** Bridges between the `value` signal (which may hold only IDs) and full option objects. */
  readonly selectedItems = computed(() => {
    const rawVal = this.value();
    if (rawVal === null || rawVal === undefined) return [];

    const opts = this.options();
    const bindVal = this.bindValue();

    // Helper to find an option by its value
    const findOption = (val: unknown) => {
      if (!bindVal) return val; // Value is the object itself
      return opts.find((o) => (o as Record<string, unknown>)[bindVal] === val);
    };

    if (this.multiple()) {
      if (!Array.isArray(rawVal)) return [];
      return (rawVal as unknown[]).map((v) => findOption(v)).filter(Boolean);
    } else {
      const opt = findOption(rawVal);
      return opt ? [opt] : [];
    }
  });

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

  hasValue(): boolean {
    const val = this.value();
    if (Array.isArray(val)) return val.length > 0;
    return val !== null && val !== undefined;
  }

  /** No-op when disabled. */
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

  private updateTriggerWidth() {
    const rect = this.elementRef.nativeElement
      .querySelector('.nui-select__trigger')
      ?.getBoundingClientRect();
    if (rect) {
      this.triggerWidth.set(rect.width);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  close(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.onTouched();
      this.searchTerm.set('');
    }
  }

  getLabel(option: unknown): string {
    if (!option) return '';
    const labelProp = this.bindLabel();
    if (labelProp && typeof option === 'object') {
      return String((option as Record<string, unknown>)[labelProp] ?? '');
    }
    return String(option);
  }

  /** Returns the option itself when `bindValue` is not set. */
  getValue(option: unknown): unknown {
    const valueProp = this.bindValue();
    if (valueProp && typeof option === 'object' && option !== null) {
      return (option as Record<string, unknown>)[valueProp];
    }
    return option;
  }

  isSelected(option: unknown): boolean {
    const current = this.value();
    const optVal = this.getValue(option);

    if (this.multiple()) {
      return Array.isArray(current) && (current as unknown[]).includes(optVal);
    }
    return current === optVal;
  }

  /** Closes the dropdown in single mode; toggles the value in multiple mode. */
  selectOption(option: unknown): void {
    const optVal = this.getValue(option);

    if (this.multiple()) {
      const current = (this.value() as unknown[]) || [];
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

  removeItem(item: unknown, event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;

    const optVal = this.getValue(item);
    const current = (this.value() as unknown[]) || [];
    const newVal = current.filter((v) => v !== optVal);
    this.updateValue(newVal);
  }

  onSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchTerm.set(val);
  }

  clearValue(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    this.updateValue(this.multiple() ? [] : null);
  }

  trackByFn(index: number, item: unknown): unknown {
    return this.getValue(item) ?? index;
  }
}
