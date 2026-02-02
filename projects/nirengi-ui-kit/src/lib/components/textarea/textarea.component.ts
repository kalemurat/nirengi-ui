import {
    Component,
    input,
    forwardRef,
    computed,
    effect,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { ValueAccessorBase } from '../../common/base/value-accessor.base';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../icon/icon.types';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Modern textarea component.
 * Component used for multi-line text input.
 *
 * ## Features
 * - ✅ Signal-based ControlValueAccessor (NG_VALUE_ACCESSOR)
 * - ✅ OnPush change detection strategy
 * - ✅ Computed signals for class binding
 * - ✅ Label, Hint, and Error message support
 * - ✅ Icon support
 * - ✅ Size variations (xs, sm, md, lg, xl)
 * - ✅ Disabled and readonly states
 * - ✅ Auto-resize feature
 * - ✅ Character count support (maxlength)
 * - ✅ Tailwind + BEM styling
 *
 * @example
 * <nui-textarea
 *   label="Description"
 *   placeholder="Enter details"
 *   [formControl]="descCtrl"
 * />
 *
 * @example
 * <nui-textarea
 *   label="Comment"
 *   icon="MessageSquare"
 *   [rows]="5"
 *   [maxlength]="500"
 *   error="Comment is too long"
 * />
 *
 * @see {@link ValueAccessorBase} - Base class for form controls
 * @see https://v20.angular.dev/api/forms/ControlValueAccessor
 */
@Component({
  selector: 'nui-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent extends ValueAccessorBase<string> {
  /**
   * Unique ID for accessibility.
   * Automatically generated for each textarea instance.
   */
  readonly textareaId = `nui-textarea-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Label text.
   * Displayed above the textarea.
   */
  readonly label = input<string>();

  /**
   * Placeholder text.
   * Displayed when the textarea is empty.
   */
  readonly placeholder = input<string>('');

  /**
   * Helper hint text.
   * Displayed below the textarea (if there is no error).
   */
  readonly hint = input<string>();

  /**
   * Component color variation.
   * @default ColorVariant.Neutral
   */
  readonly variant = input<ColorVariant>(ColorVariant.Neutral);

  /**
   * Icon name.
   * Displayed in the top-left corner of the textarea.
   */
  readonly icon = input<IconName>();

  /**
   * Readonly state.
   * If true, the textarea is not editable but is not disabled.
   */
  readonly readonly = input<boolean>(false);

  /**
   * Component size.
   * Affects text size and padding.
   * @default Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Number of textarea rows.
   * Determines the minimum height.
   * @default 3
   */
  readonly rows = input<number>(3);

  /**
   * Maximum character count.
   * If provided, a character counter is displayed.
   */
  readonly maxlength = input<number>();

  /**
   * Auto-resize feature.
   * If true, the height is automatically adjusted based on the content.
   * @default false
   */
  readonly autoResize = input<boolean>(false);

  /**
   * Textarea value (dumb mode).
   * Can be assigned a value without using form control.
   */
  readonly valueInput = input<string | null>(null, { alias: 'value' });

  /**
   * Disabled state (dumb mode).
   * Can be disabled without using form control.
   */
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

  constructor() {
    super();

    // Sync value input
    effect(() => {
      const val = this.valueInput();
      if (val !== null) {
        this.writeValue(val);
      }
    });

    // Sync disabled input
    effect(() => {
      this.setDisabledState(this.disabledInput());
    });
  }

  /**
   * Computed signal that calculates the icon size based on the component size.
   * Automatically updated when size changes.
   *
   * @returns Icon pixel size
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
   * Computed signal to calculate CSS classes for the container element.
   * Follows variant changes.
   */
  readonly containerClasses = computed(
    () => `nui-textarea--${this.variant()} nui-textarea--${this.size()}`
  );

  /**
   * Computed signal to calculate CSS classes for the textarea.
   * Reactively follows size changes.
   *
   * @returns Size-based CSS class string
   */
  protected readonly textareaClasses = computed(() => {
    return `nui-textarea__input--${this.size()}`;
  });

  /**
   * Computed signal to calculate the character counter text.
   * If maxlength exists, it is displayed in the "current/maximum" format.
   *
   * @returns Character counter text or undefined
   */
  protected readonly characterCount = computed(() => {
    const max = this.maxlength();
    if (!max) return undefined;

    const current = this.value()?.length || 0;
    return `${current}/${max}`;
  });

  /**
   * Computed signal that checks if the character limit has been exceeded.
   * If true, the character counter is displayed in red.
   *
   * @returns true if limit exceeded, false otherwise
   */
  protected readonly isOverLimit = computed(() => {
    const max = this.maxlength();
    if (!max) return false;

    const current = this.value()?.length || 0;
    return current > max;
  });

  /**
   * Input event handler.
   * Triggered when the user types in the textarea.
   * Adjusts the height if auto-resize is active.
   *
   * @param event - Input event
   */
  onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;

    // Update value
    this.updateValue(value);

    // Auto resize if enabled
    if (this.autoResize()) {
      this.adjustHeight(textarea);
    }
  }

  /**
   * Adjusts the textarea height based on the content.
   * Used for the auto-resize feature.
   *
   * @param textarea - HTML textarea element
   */
  private adjustHeight(textarea: HTMLTextAreaElement): void {
    // Reset height to auto to get scrollHeight
    textarea.style.height = 'auto';
    // Set height to scrollHeight
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
