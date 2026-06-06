import { Directive, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

/** Signal-based ControlValueAccessor base; exposes `isDisabled` and `value` signals for derived form components. */
@Directive()
export abstract class ValueAccessorBase<T> implements ControlValueAccessor {
  readonly isDisabled = signal<boolean>(false);

  readonly value = signal<T | null>(null);

  protected onChange: (value: T | null) => void = () => {
    /* no-op until registerOnChange is called by the forms API */
  };

  protected onTouched: () => void = () => {
    /* no-op until registerOnTouched is called by the forms API */
  };

  /** Call from derived classes to propagate a user-driven value change; does not emit while disabled. */
  updateValue(value: T | null): void {
    if (this.isDisabled()) return;
    this.value.set(value);
    this.onChange(value);
  }

  /** Call from derived classes when the control loses focus; does not emit while disabled. */
  markAsTouched(): void {
    if (this.isDisabled()) return;
    this.onTouched();
  }

  writeValue(value: T | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
