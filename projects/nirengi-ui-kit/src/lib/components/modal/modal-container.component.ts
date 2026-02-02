import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MODAL_SERVICE } from './modal.token';
import { ModalComponent } from './modal.component';

/**
 * Modal Container.
 * Place this once in app root (e.g. app.component.html) to enable Modals.
 * Iterates over active modals and renders them.
 */
@Component({
  selector: 'nui-modal-container',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    @for (modal of modals(); track modal.id) {
      <nui-modal [data]="modal" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalContainerComponent {
  private service = inject(MODAL_SERVICE);

  readonly modals = this.service.modals;
}
