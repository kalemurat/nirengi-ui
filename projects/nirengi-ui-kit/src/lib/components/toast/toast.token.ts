import { InjectionToken } from '@angular/core';
import { IToastService } from './toast.types';

export const TOAST = new InjectionToken<IToastService>('TOAST');
