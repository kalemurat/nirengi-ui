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
 * Multi-line text input form control with label, hint, icon, auto-resize, and character count support.
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
  /** Unique ID auto-generated per instance; used to link label and textarea for accessibility. */
  readonly textareaId = `nui-textarea-${Math.random().toString(36).substr(2, 9)}`;

  readonly label = input<string>();

  readonly placeholder = input<string>('');

  /** Displayed below the textarea only when no error is present. */
  readonly hint = input<string>();

  /**
   * Component color variation.
   * @default ColorVariant.Neutral
   */
  readonly variant = input<ColorVariant>(ColorVariant.Neutral);

  /** Icon displayed in the top-left corner of the textarea. */
  readonly icon = input<IconName>();

  /** When true, the textarea is not editable but remains focusable and is not considered disabled. */
  readonly readonly = input<boolean>(false);

  /**
   * @default Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Determines the initial (minimum) height of the textarea.
   * @default 3
   */
  readonly rows = input<number>(3);

  /** When provided, a character counter ("current/max") is shown below the textarea. */
  readonly maxlength = input<number>();

  /**
   * When true, the textarea grows to fit its content automatically.
   * @default false
   */
  readonly autoResize = input<boolean>(false);

  /** Allows setting a value without a form control (uncontrolled / dumb mode). */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- intentional public API alias
  readonly valueInput = input<string | null>(null, { alias: 'value' });

  /** Allows disabling the textarea without a form control (uncontrolled / dumb mode). */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- intentional public API alias
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });

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

  readonly containerClasses = computed(
    () => `nui-textarea--${this.variant()} nui-textarea--${this.size()}`
  );

  protected readonly textareaClasses = computed(() => {
    return `nui-textarea__input--${this.size()}`;
  });

  protected readonly characterCount = computed(() => {
    const max = this.maxlength();
    if (!max) return undefined;

    const current = this.value()?.length || 0;
    return `${current}/${max}`;
  });

  protected readonly isOverLimit = computed(() => {
    const max = this.maxlength();
    if (!max) return false;

    const current = this.value()?.length || 0;
    return current > max;
  });

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

  private adjustHeight(textarea: HTMLTextAreaElement): void {
    // Reset height to auto to get scrollHeight
    textarea.style.height = 'auto';
    // Set height to scrollHeight
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
