import { InjectionToken, inject } from '@angular/core';
import { IModalService } from './modal.types';
import { ModalRef } from './modal-ref';
import { ModalService } from './modal.service';

export const MODAL_SERVICE = new InjectionToken<IModalService>('MODAL_SERVICE', {
  providedIn: 'root',
  factory: () => inject(ModalService),
});
export const MODAL_DATA = new InjectionToken<any>('MODAL_DATA');
export const MODAL_REF = new InjectionToken<ModalRef>('MODAL_REF');
