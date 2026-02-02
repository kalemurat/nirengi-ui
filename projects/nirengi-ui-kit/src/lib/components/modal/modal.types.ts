import { TemplateRef, Type, Injector, Signal } from '@angular/core';
import { IconName } from '../icon/icon.types';

export enum ModalSize {
  Small = 'sm',
  Medium = 'md',
  Large = 'lg',
  Full = 'full'
}

export interface ModalOptions {
  size?: ModalSize;
  title?: string;
  icon?: IconName;
  backdropClose?: boolean;
  escClose?: boolean;
  data?: any;
}

export interface ModalData {
  id: string;
  content: Type<any> | TemplateRef<any>;
  options: ModalOptions;
  injector?: Injector;
}

export interface IModalService {
  readonly modals: Signal<ModalData[]>;
  open<T>(content: Type<T> | TemplateRef<T>, options?: ModalOptions): any;
  close(id: string): void;
  closeAll(): void;
}
