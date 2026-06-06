import { Injectable, signal, computed } from '@angular/core';
import { IEventLog } from '../interfaces/showcase-config.interface';

/**
 * @example
 * ```typescript
 * // Component-level provide
 * providers: [EventLoggerService]
 *
 * // Log event
 * this.eventLogger.logEvent('button', 'onClick', { x: 100, y: 200 });
 *
 * // Read logs
 * const logs = this.eventLogger.eventLogs();
 * ```
 *
 * @see {@link IEventLog}
 */
@Injectable()
export class EventLoggerService {
  /** Exposed as read-only computed; newest log first. */
  readonly eventLogs = computed(() => this.logs());

  /** Newest log is always at index 0. */
  private readonly logs = signal<IEventLog[]>([]);

  /**
   * @example
   * ```typescript
   * // Button click event
   * this.eventLogger.logEvent('button', 'onClick', mouseEvent);
   *
   * // Select change event
   * this.eventLogger.logEvent('select', 'onChange', { value: 'istanbul' });
   * ```
   */
  logEvent(componentId: string, eventName: string, payload: unknown): void {
    const log: IEventLog = {
      id: this.generateLogId(),
      timestamp: new Date(),
      componentId,
      eventName,
      payload: this.sanitizePayload(payload),
    };

    // Add newest log to the top
    this.logs.update((current) => [log, ...current]);
  }

  clearLogs(): void {
    this.logs.set([]);
  }

  /** Prevents displaying too many logs for performance. */
  getRecentLogs(count: number): IEventLog[] {
    return this.logs().slice(0, count);
  }

  private generateLogId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /** Guards against circular references and oversized DOM event objects. */
  private sanitizePayload(payload: unknown): unknown {
    // Take only important info for DOM events like MouseEvent, KeyboardEvent
    if (payload instanceof Event) {
      const target = payload.target as HTMLElement | null;
      return {
        type: payload.type,
        target: target?.tagName || 'unknown',
        timestamp: payload.timeStamp,
      };
    }

    // Deep clone for other objects (protected against circular reference)
    try {
      return JSON.parse(JSON.stringify(payload));
    } catch {
      return String(payload);
    }
  }
}
