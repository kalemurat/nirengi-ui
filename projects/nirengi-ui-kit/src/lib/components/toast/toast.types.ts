export enum ToastVariant {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface IToastOptions {
  duration?: number;
  position?: ToastPosition;
}

export interface IToastData {
  id: string;
  title: string;
  description: string;
  variant: ToastVariant;
  options: IToastOptions;
}

export interface IToastService {
  success(data: { title: string; description: string; options?: IToastOptions }): void;
  error(data: { title: string; description: string; options?: IToastOptions }): void;
  info(data: { title: string; description: string; options?: IToastOptions }): void;
  warning(data: { title: string; description: string; options?: IToastOptions }): void;
}
