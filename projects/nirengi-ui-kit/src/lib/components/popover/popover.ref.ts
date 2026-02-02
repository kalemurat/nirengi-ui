import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable } from 'rxjs';

/**
 * Reference object injected into the component opened within a popover.
 * Used to close the popover or return data.
 */
export class PopoverRef<T = any, R = any> {
  private readonly _afterClosed = new Subject<R | undefined>();
  private readonly _events = new Subject<{ key: string; data: any }>();

  constructor(
    private overlayRef: OverlayRef,
    public config: { data?: T } = {}
  ) {}

  /**
   * Closes the popover.
   * @param result Optional result to be returned
   */
  close(result?: R): void {
    this._afterClosed.next(result);
    this._afterClosed.complete();
    this._events.complete();
    this.overlayRef.dispose();
  }

  /**
   * Observable triggered when the popover is closed.
   */
  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }

  /**
   * Used to send events from the component to the parent.
   * @param key Event name/key
   * @param data Event data
   */
  emit(key: string, data?: any): void {
    this._events.next({ key, data });
  }

  /**
   * Observable listening to events from the component.
   */
  get events$(): Observable<{ key: string; data: any }> {
    return this._events.asObservable();
  }
}

