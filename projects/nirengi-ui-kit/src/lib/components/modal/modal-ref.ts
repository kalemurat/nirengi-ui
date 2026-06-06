import { Signal, signal } from '@angular/core';

/**
 * Reference to an open modal instance.
 * Provides APIs to close the modal and observe its result.
 */
export class ModalRef<T = unknown> {
  private readonly _afterClosed = signal<T | undefined>(undefined);
  private _resolve!: (value: T | undefined) => void;

  readonly afterClosedPromise = new Promise<T | undefined>((resolve) => {
    this._resolve = resolve;
  });

  constructor(
    readonly id: string,
    private readonly closeCallback: (id: string, result?: T) => void
  ) {}

  close(result?: T): void {
    this.closeCallback(this.id, result);
    this._afterClosed.set(result);
    this._resolve(result);
  }

  /** Prefer `afterClosedPromise` for flow control; use this for UI binding. */
  get afterClosed(): Signal<T | undefined> {
    return this._afterClosed.asReadonly();
  }
}
