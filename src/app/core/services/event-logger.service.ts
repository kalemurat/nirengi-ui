import { Injectable, signal, computed } from '@angular/core';
import { EventLog } from '../interfaces/showcase-config.interface';

/**
 * Event Logger Servisi.
 * Component event'lerini yakalar ve terminal-style console'da gösterir.
 * 
 * ## Sorumluluklar
 * - Event'lerin timestamp ile loglanması
 * - Event geçmişinin tutulması
 * - Log temizleme işlemleri
 * 
 * ## Kullanım
 * ```typescript
 * // Component-level provide
 * providers: [EventLoggerService]
 * 
 * // Event logla
 * this.eventLogger.logEvent('button', 'onClick', { x: 100, y: 200 });
 * 
 * // Logları oku
 * const logs = this.eventLogger.eventLogs();
 * ```
 * 
 * @see {@link EventLog}
 */
@Injectable()
export class EventLoggerService {
  /**
   * Event log kayıtları signal'i.
   * En yeni log en başta olacak şekilde tutulur.
   */
  private readonly logs = signal<EventLog[]>([]);

  /**
   * Event loglarının computed signal'i.
   * Dışarıya sadece okunabilir olarak expose edilir.
   * 
   * @returns Event log array (en yeni en başta)
   */
  readonly eventLogs = computed(() => this.logs());

  /**
   * Yeni bir event logu kaydeder.
   * Otomatik olarak timestamp ve unique ID üretilir.
   * 
   * @param componentId - Component ID (örn: 'button')
   * @param eventName - Event adı (örn: 'onClick')
   * @param payload - Event payload (herhangi bir değer olabilir)
   * 
   * @example
   * ```typescript
   * // Button click event
   * this.eventLogger.logEvent('button', 'onClick', mouseEvent);
   * 
   * // Select change event
   * this.eventLogger.logEvent('select', 'onChange', { value: 'istanbul' });
   * ```
   */
  logEvent(componentId: string, eventName: string, payload: any): void {
    const log: EventLog = {
      id: this.generateLogId(),
      timestamp: new Date(),
      componentId,
      eventName,
      payload: this.sanitizePayload(payload)
    };

    // En yeni log başa ekle
    this.logs.update(current => [log, ...current]);
  }

  /**
   * Tüm event loglarını temizler.
   * "Clear" butonu tıklandığında kullanılır.
   */
  clearLogs(): void {
    this.logs.set([]);
  }

  /**
   * Son N adet logu getirir.
   * Performance için çok fazla log gösterilmesini önler.
   * 
   * @param count - Gösterilecek log sayısı
   * @returns Son N adet log
   */
  getRecentLogs(count: number): EventLog[] {
    return this.logs().slice(0, count);
  }

  /**
   * Unique log ID üretir.
   * Timestamp + random number kombinasyonu.
   * 
   * @returns Unique log ID
   */
  private generateLogId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Event payload'ını sanitize eder.
   * Circular reference ve çok büyük objeler için güvenli hale getirir.
   * 
   * @param payload - Ham payload
   * @returns Sanitize edilmiş payload
   */
  private sanitizePayload(payload: any): any {
    // MouseEvent, KeyboardEvent gibi DOM event'leri için sadece önemli bilgileri al
    if (payload instanceof Event) {
      const target = payload.target as HTMLElement | null;
      return {
        type: payload.type,
        target: target?.tagName || 'unknown',
        timestamp: payload.timeStamp
      };
    }

    // Diğer objeler için deep clone (circular reference korumalı)
    try {
      return JSON.parse(JSON.stringify(payload));
    } catch {
      return String(payload);
    }
  }
}
