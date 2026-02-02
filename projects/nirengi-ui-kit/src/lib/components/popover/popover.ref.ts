import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable } from 'rxjs';

/**
 * Popover içinde açılan component'e inject edilen referans nesnesi.
 * Popover'ı kapatmak veya veri döndürmek için kullanılır.
 */
export class PopoverRef<T = any, R = any> {
  private readonly _afterClosed = new Subject<R | undefined>();
  private readonly _events = new Subject<{ key: string; data: any }>();

  constructor(
    private overlayRef: OverlayRef,
    public config: { data?: T } = {}
  ) {}

  /**
   * Popover'ı kapatır.
   * @param result Opsiyonel olarak geriye döndürülecek sonuç
   */
  close(result?: R): void {
    this._afterClosed.next(result);
    this._afterClosed.complete();
    this._events.complete();
    this.overlayRef.dispose();
  }

  /**
   * Popover kapandığında tetiklenen observable.
   */
  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }

  /**
   * Component'ten parent'a event göndermek için kullanılır.
   * @param key Event adı/anahtarı
   * @param data Event verisi
   */
  emit(key: string, data?: any): void {
    this._events.next({ key, data });
  }

  /**
   * Component'ten gelen eventleri dinleyen observable.
   */
  get events$(): Observable<{ key: string; data: any }> {
    return this._events.asObservable();
  }
}
