import { Signal, signal } from '@angular/core';

export class ModalRef<T = any> {
  private readonly _afterClosed = signal<T | undefined>(undefined);
  private _resolve!: (value: T | undefined) => void;

  /**
   * Promise that resolves when the modal is closed.
   */
  readonly afterClosedPromise = new Promise<T | undefined>((resolve) => {
    this._resolve = resolve;
  });

  constructor(
    readonly id: string,
    private readonly closeCallback: (id: string, result?: T) => void
  ) {}

  /**
   * Close the modal with an optional result.
   * @param result Result to pass back
   */
  close(result?: T): void {
    this.closeCallback(this.id, result);
    this._afterClosed.set(result);
    this._resolve(result);
  }

  /**
   * Signal that emits the result when the modal is closed.
   * Useful for binding values in the UI, but use afterClosedPromise for flow control.
   */
  get afterClosed(): Signal<T | undefined> {
    return this._afterClosed.asReadonly();
  }
}
