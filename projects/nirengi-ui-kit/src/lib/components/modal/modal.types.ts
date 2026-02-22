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

/**
 * Options for configuring modal behavior and presentation.
 */
export interface ModalOptions {
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
export interface ModalData {
  id: string;
  content: Type<unknown> | TemplateRef<unknown>;
  options: ModalOptions;
  injector?: Injector;
}

/**
 * Public API for managing modal instances.
 */
export interface IModalService {
  readonly modals: Signal<ModalData[]>;
  open<T>(content: Type<T> | TemplateRef<T>, options?: ModalOptions): ModalRef<T>;
  close(id: string): void;
  closeTopmost(): void;
  closeAll(): void;
}
