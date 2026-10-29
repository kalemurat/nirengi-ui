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
import { DEFAULT_SELECT_INTL, ISelectIntl, SELECT_INTL } from './select-intl.token';

/**
 * Select/Dropdown component with single/multiple selection, search, and custom item templates.
 *
 * Built-in texts (clear/remove button names, search placeholder, empty-result message) are
 * English by default and overridable through {@link SELECT_INTL}.
 *
 * @see {@link IconComponent}
 * @see {@link ValueAccessorBase}
 * @see {@link SELECT_INTL}
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

  /**
   * Id of the visible label element.
   * The trigger is a `div` (not a labelable element), so `<label for>` has no effect on it
   * and the accessible name is wired via `aria-labelledby` instead — per the WAI-ARIA APG
   * select-only combobox pattern. The search input reuses the same id so the combobox keeps
   * one stable accessible name in both modes.
   */
  readonly labelId = `${this.inputId}-label`;

  /** Id of the popup listbox, referenced by the combobox element's `aria-controls`. */
  readonly listboxId = `${this.inputId}-listbox`;

  /** Id of the in-dropdown search input, satisfying the "form field needs an id" requirement. */
  readonly searchInputId = `${this.inputId}-search`;

  /** Id of the hint / warning / success text, referenced by the combobox's `aria-describedby`. */
  readonly messageId = `${this.inputId}-message`;

  /** Built-in texts: {@link DEFAULT_SELECT_INTL} merged with any {@link SELECT_INTL} override. */
  protected readonly intl: ISelectIntl = {
    ...DEFAULT_SELECT_INTL,
    ...inject(SELECT_INTL, { optional: true }),
  };

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

  /**
   * Displayed below the component in a warning state (yellow border).
   * This is the select's validation-message slot, so a non-empty value also sets
   * `aria-invalid="true"` on the combobox (WCAG technique ARIA21).
   */
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

  /**
   * Index of the option currently referenced by `aria-activedescendant`.
   * `-1` means no option is active. DOM focus stays on the combobox element while this
   * moves (see `searchIsCombobox`), per the WAI-ARIA APG combobox pattern.
   */
  readonly activeIndex = signal<number>(-1);

  /** Auto-focused when the dropdown opens with `searchable` enabled. */
  readonly searchInputElement = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  /** Receives focus back when the listbox closes via keyboard or option selection. */
  readonly triggerElement = viewChild<ElementRef<HTMLElement>>('triggerElement');

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

  /**
   * Value for the active combobox element's `aria-activedescendant`.
   * Null unless the popup is open with a valid active option, since the attribute
   * must only reference an element that actually exists in the DOM.
   */
  readonly activeDescendantId = computed(() => {
    if (!this.isOpen()) return null;
    const index = this.activeIndex();
    if (index < 0 || index >= this.filteredOptions().length) return null;
    return this.getOptionId(index);
  });

  /**
   * Which element plays the `combobox` role depends on where DOM focus actually lives.
   *
   * `aria-activedescendant` is only honoured on the element that holds DOM focus — the
   * WAI-ARIA spec keeps DOM focus "on the container element or on an input element that
   * controls the container element" and reports the referenced option as focused from
   * there. So the role and the attribute must sit on whatever is focused, or a screen
   * reader announces nothing while arrowing through options.
   *
   * - `searchable()` = true: opening auto-focuses the search input, so that input is the
   *   combobox (WAI-ARIA APG editable/autocomplete-list combobox: the `input` carries
   *   `role="combobox"` and `aria-activedescendant` while DOM focus remains on it).
   * - `searchable()` = false: there is no search input, focus stays on the trigger, so the
   *   trigger is the combobox (WAI-ARIA APG select-only combobox).
   */
  readonly searchIsCombobox = computed(() => this.searchable() && this.isOpen());

  /**
   * Value for the combobox's `aria-describedby`: the id of the hint / warning / success text
   * when one is rendered (only one is shown at a time), so assistive technology announces it
   * together with the field (WCAG technique ARIA21). Null when no text is shown, so the
   * attribute never references a missing element.
   */
  readonly describedBy = computed(() =>
    this.success() || this.warning() || this.hint() ? this.messageId : null
  );

  /**
   * Value for the combobox's `aria-invalid`. `true` only while a warning (the validation
   * message) is shown; otherwise the attribute is omitted, since `aria-invalid="false"` is
   * the same as leaving it out. A success message takes precedence, mirroring the template.
   */
  readonly ariaInvalid = computed(() => (!this.success() && this.warning() ? true : null));

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

    // Keep the aria-activedescendant option in view. Options never receive DOM focus
    // (it stays on the combobox — the search input when searchable, otherwise the
    // trigger), so the browser does not scroll them into view on its own.
    effect(() => {
      const activeId = this.activeDescendantId();
      if (!activeId) return;
      setTimeout(() => {
        const el = document.getElementById(activeId);
        // Guarded: scrollIntoView is absent in some non-browser/test DOM implementations,
        // and scrolling is a progressive enhancement — it must never break the component.
        el?.scrollIntoView?.({ block: 'nearest' });
      });
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

  /** Stable per-option element id, referenced by `aria-activedescendant`. */
  getOptionId(index: number): string {
    return `${this.inputId}-option-${index}`;
  }

  /** No-op when disabled. */
  toggleDropdown(): void {
    if (this.isDisabled()) return;

    // Calculate width before opening
    if (!this.isOpen() && this.appendToBody()) {
      this.updateTriggerWidth();
    }

    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      // Start navigation from the current selection, or the first option when nothing is selected.
      this.activeIndex.set(this.indexOfSelected());
    } else {
      this.onTouched();
      this.searchTerm.set('');
      this.activeIndex.set(-1);
    }
  }

  /** Index of the first selected option within the filtered list, or 0 when none matches. */
  private indexOfSelected(): number {
    const index = this.filteredOptions().findIndex((opt) => this.isSelected(opt));
    return index > -1 ? index : 0;
  }

  /**
   * Combobox keyboard handling per the WAI-ARIA APG combobox pattern. Shared by the trigger
   * and (via `onSearchKeydown`) the search input, so both modes behave identically.
   *
   * DOM focus never moves onto an option: it stays on whichever element is currently the
   * combobox, and the active option is conveyed via `aria-activedescendant`.
   */
  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggleDropdown();
        } else {
          this.moveActive(1);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggleDropdown();
        } else {
          this.moveActive(-1);
        }
        break;

      case 'Home':
        if (this.isOpen()) {
          event.preventDefault();
          this.activeIndex.set(0);
        }
        break;

      case 'End':
        if (this.isOpen()) {
          event.preventDefault();
          this.activeIndex.set(this.filteredOptions().length - 1);
        }
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.isOpen()) {
          this.selectActiveOption();
        } else {
          this.toggleDropdown();
        }
        break;

      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.close(true);
        }
        break;

      case 'Tab':
        // Tab moves focus away: close without blocking the natural focus move. Focus is put
        // back on the trigger first so the default Tab action continues from the trigger's
        // position, not from the portalled search input at the end of <body>.
        this.close(true);
        break;
    }
  }

  /** Moves the active option by `delta`, wrapping around the ends. */
  private moveActive(delta: number): void {
    const count = this.filteredOptions().length;
    if (count === 0) {
      this.activeIndex.set(-1);
      return;
    }
    const current = this.activeIndex();
    const next = current < 0 ? (delta > 0 ? 0 : count - 1) : (current + delta + count) % count;
    this.activeIndex.set(next);
  }

  /** Commits the option currently referenced by `aria-activedescendant`. */
  private selectActiveOption(): void {
    const option = this.filteredOptions()[this.activeIndex()];
    if (option === undefined) return;
    this.selectOption(option);
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

  /**
   * Closes the listbox.
   *
   * @param restoreFocus Moves DOM focus back to the trigger. Used for Escape, Tab and option
   * selection, mirroring the WAI-ARIA APG select-only combobox ("Closes the listbox. Sets
   * visual focus on the combobox."). Without it, closing in searchable mode removes the
   * focused search input and focus falls to `<body>`. Outside/backdrop clicks pass `false`
   * so focus is not pulled away from wherever the user clicked.
   */
  close(restoreFocus = false): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.onTouched();
      this.searchTerm.set('');
      this.activeIndex.set(-1);
      if (restoreFocus) {
        this.triggerElement()?.nativeElement.focus();
      }
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
      this.close(true);
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
    // The filtered list just changed; re-anchor the active option so
    // aria-activedescendant never points past the end of the new list.
    this.activeIndex.set(this.filteredOptions().length > 0 ? 0 : -1);
  }

  /**
   * Keyboard handling while focus is inside the search input, which is the combobox in
   * searchable mode. Only keys that drive the listbox are delegated; text-editing keys are
   * left to the input so it behaves like a normal textbox:
   * - Space types a space instead of selecting.
   * - Home/End move the caret within the query rather than jumping the option list, per the
   *   APG editable combobox (they are listbox-navigation keys only when focus is elsewhere).
   */
  onSearchKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
      case 'Escape':
      case 'Tab':
        this.onTriggerKeydown(event);
        break;
    }
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
