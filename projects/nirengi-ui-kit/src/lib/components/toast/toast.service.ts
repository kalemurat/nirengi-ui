import { Injectable, signal } from '@angular/core';
import { IToastService, ToastData, ToastOptions, ToastVariant } from './toast.types';

@Injectable({
  providedIn: 'root',
})
export class ToastService implements IToastService {
  /**
   * Active toasts signal.
   */
  readonly toasts = signal<ToastData[]>([]);

  success(data: { title: string; description: string; options?: ToastOptions }): void {
    this.show(data, ToastVariant.Success);
  }

  error(data: { title: string; description: string; options?: ToastOptions }): void {
    this.show(data, ToastVariant.Error);
  }

  info(data: { title: string; description: string; options?: ToastOptions }): void {
    this.show(data, ToastVariant.Info);
  }

  warning(data: { title: string; description: string; options?: ToastOptions }): void {
    this.show(data, ToastVariant.Warning);
  }

  /**
   * Removes a toast by ID.
   * @param id The toast ID to remove
   */
  remove(id: string): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }

  private show(
    data: { title: string; description: string; options?: ToastOptions },
    variant: ToastVariant
  ): void {
    const id = crypto.randomUUID();
    const options = {
      duration: 3000,
      position: 'top-right' as const,
      ...data.options,
    };

    const newToast: ToastData = {
      id,
      title: data.title,
      description: data.description,
      variant,
      options,
    };

    this.toasts.update((current) => [...current, newToast]);
  }
}
