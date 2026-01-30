export enum ToastVariant {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning'
}

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
}

export interface ToastData {
  id: string;
  title: string;
  description: string;
  variant: ToastVariant;
  options: ToastOptions;
}

export interface IToastService {
  success(data: { title: string; description: string; options?: ToastOptions }): void;
  error(data: { title: string; description: string; options?: ToastOptions }): void;
  info(data: { title: string; description: string; options?: ToastOptions }): void;
  warning(data: { title: string; description: string; options?: ToastOptions }): void;
}
