import { Injectable, Injector, signal, TemplateRef, Type } from '@angular/core';
import { IModalService, ModalData, ModalOptions, ModalSize } from './modal.types';
import { ModalRef } from './modal-ref';
import { MODAL_DATA, MODAL_REF } from './modal.token';

/**
 * Service for managing modal instances and their stacking behavior.
 */
@Injectable({
  providedIn: 'root',
})
export class ModalService implements IModalService {
  readonly modals = signal<ModalData[]>([]);
  private readonly modalStackCount = signal(0);

  constructor(private injector: Injector) {}

  /**
   * Opens a new modal with the specified content and options.
   *
   * @template T Data type passed to the modal content
   * @param content Component type or template to render inside the modal
   * @param options Modal configuration options
   * @returns Reference to the opened modal
   */
  open<T>(content: Type<T> | TemplateRef<T>, options?: ModalOptions): ModalRef<T> {
    const id = crypto.randomUUID();
    const modalOptions: ModalOptions = {
      size: ModalSize.Medium,
      backdropClose: true,
      escClose: true,
      ...options,
    };

    const modalRef = new ModalRef<T>(id, (modalId, result) => {
      // Logic to run when close is called on the Ref
      this.remove(modalId);
    });

    // Create injector if content is a component
    let componentInjector: Injector | undefined;
    if (typeof content === 'function') {
      componentInjector = Injector.create({
        parent: this.injector,
        providers: [
          { provide: MODAL_REF, useValue: modalRef },
          { provide: MODAL_DATA, useValue: modalOptions.data },
        ],
      });
    }

    const modalData: ModalData = {
      id,
      content,
      options: modalOptions,
      injector: componentInjector,
    };

    this.modals.update((current) => [...current, modalData]);

    return modalRef;
  }

  /**
   * Closes a modal by its unique identifier.
   *
   * @param id Unique modal identifier
   */
  close(id: string): void {
    this.remove(id);
  }

  /**
   * Closes the top-most modal in the stack.
   * Ensures that in multi-modal scenarios, only the topmost modal responds to ESC key.
   */
  closeTopmost(): void {
    const current = this.modals();
    if (current.length > 0) {
      const topmostId = current[current.length - 1].id;
      this.close(topmostId);
    }
  }

  /**
   * Closes all open modals and clears the stack.
   */
  closeAll(): void {
    this.modals.set([]);
  }

  private remove(id: string): void {
    this.modals.update((current) => current.filter((m) => m.id !== id));
  }
}
