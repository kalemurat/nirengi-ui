import { Directive, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

/**
 * Base class for ControlValueAccessor implementation.
 * Provides the core structure required for Angular form operations.
 * Offers signal-based state management.
 */
@Directive()
export abstract class ValueAccessorBase<T> implements ControlValueAccessor {
  /**
   * Component's disabled state.
   */
  readonly isDisabled = signal<boolean>(false);

  /**
   * Component's value state.
   */
  readonly value = signal<T | null>(null);

  /**
   * Callback to be triggered when the value changes.
   */
  protected onChange: (value: T | null) => void = () => {};

  /**
   * Callback to be triggered when the component is touched.
   */
  protected onTouched: () => void = () => {};

  /**
   * Communication from view to model.
   * Derived classes should call this method to update the value.
   */
  updateValue(value: T | null): void {
    if (this.isDisabled()) return;
    this.value.set(value);
    this.onChange(value);
  }

  /**
   * Should be called when the component is blurred.
   */
  markAsTouched(): void {
    if (this.isDisabled()) return;
    this.onTouched();
  }

  /**
   * Writes value from model to view (ControlValueAccessor)
   */
  writeValue(value: T | null): void {
    this.value.set(value);
  }

  /**
   * Register onChange callback (ControlValueAccessor)
   */
  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  /**
   * Register onTouched callback (ControlValueAccessor)
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Set disabled state (ControlValueAccessor)
   */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
