import { Injectable, signal } from '@angular/core';
import { IToastService, IToastData, IToastOptions, ToastVariant } from './toast.types';

@Injectable({
  providedIn: 'root',
})
export class ToastService implements IToastService {
  readonly toasts = signal<IToastData[]>([]);

  success(data: { title: string; description: string; options?: IToastOptions }): void {
    this.show(data, ToastVariant.Success);
  }

  error(data: { title: string; description: string; options?: IToastOptions }): void {
    this.show(data, ToastVariant.Error);
  }

  info(data: { title: string; description: string; options?: IToastOptions }): void {
    this.show(data, ToastVariant.Info);
  }

  warning(data: { title: string; description: string; options?: IToastOptions }): void {
    this.show(data, ToastVariant.Warning);
  }

  remove(id: string): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }

  private show(
    data: { title: string; description: string; options?: IToastOptions },
    variant: ToastVariant
  ): void {
    const id = crypto.randomUUID();
    const options = {
      duration: 3000,
      position: 'top-right' as const,
      ...data.options,
    };

    const newToast: IToastData = {
      id,
      title: data.title,
      description: data.description,
      variant,
      options,
    };

    this.toasts.update((current) => [...current, newToast]);
  }
}
