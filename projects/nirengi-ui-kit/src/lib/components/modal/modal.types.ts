import { TemplateRef, Type, Injector, Signal } from '@angular/core';
import { IconName } from '../icon/icon.types';
import { ModalRef } from './modal-ref';

/**
 * Available modal sizes used by the design system.
 */
export enum ModalSize {
  Small = 'sm',
  Medium = 'md',
  Large = 'lg',
  Full = 'full',
}

export interface IModalOptions {
  size?: ModalSize;
  title?: string;
  icon?: IconName;
  backdropClose?: boolean;
  escClose?: boolean;
  data?: unknown;
}

/**
 * Internal representation of a rendered modal instance.
 */
export interface IModalData {
  id: string;
  content: Type<unknown> | TemplateRef<unknown>;
  options: IModalOptions;
  injector?: Injector;
}

export interface IModalService {
  readonly modals: Signal<IModalData[]>;
  open<T>(content: Type<T> | TemplateRef<T>, options?: IModalOptions): ModalRef<T>;
  close(id: string): void;
  closeTopmost(): void;
  closeAll(): void;
}
