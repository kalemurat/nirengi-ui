import { Directive, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

/**
 * ControlValueAccessor implementasyonu için base class.
 * Angular form işlemleri için gerekli temel yapıyı sağlar.
 * Signal tabanlı state yönetimi sunar.
 */
@Directive()
export abstract class ValueAccessorBase<T> implements ControlValueAccessor {
  /**
   * Component'in disabled durumu.
   */
  readonly isDisabled = signal<boolean>(false);

  /**
   * Component'in value durumu.
   */
  readonly value = signal<T | null>(null);

  /**
   * Value değiştiğinde tetiklenecek callback.
   */
  protected onChange: (value: T | null) => void = () => {};

  /**
   * Component touch olduğunda tetiklenecek callback.
   */
  protected onTouched: () => void = () => {};

  /**
   * View'dan model'e değer iletilmesi.
   * Alt sınıflar bu metodu çağırarak değeri güncellemeli.
   */
  updateValue(value: T | null): void {
    if (this.isDisabled()) return;
    this.value.set(value);
    this.onChange(value);
  }

  /**
   * Component blur olduğunda çağrılmalı.
   */
  markAsTouched(): void {
    if (this.isDisabled()) return;
    this.onTouched();
  }

  /**
   * Model'den view'a değer yazılması (ControlValueAccessor)
   */
  writeValue(value: T | null): void {
    this.value.set(value);
  }

  /**
   * Register onChange (ControlValueAccessor)
   */
  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  /**
   * Register onTouched (ControlValueAccessor)
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
