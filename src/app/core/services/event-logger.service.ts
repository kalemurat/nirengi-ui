import { Injectable, signal, computed } from '@angular/core';
import { IEventLog } from '../interfaces/showcase-config.interface';

/**
 * Event Logger Service.
 * Captures component events and displays them in a terminal-style console.
 *
 * ## Responsibilities
 * - Logging events with timestamps
 * - Maintaining event history
 * - Log clearing operations
 *
 * ## Usage
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
  /**
   * Computed signal for event logs.
   * Exposed as read-only externally.
   *
   * @returns Event log array (newest first)
   */
  readonly eventLogs = computed(() => this.logs());

  /**
   * Signal for event log records.
   * Kept with the newest log at the beginning.
   */
  private readonly logs = signal<IEventLog[]>([]);

  /**
   * Records a new event log.
   * Automatically generates a timestamp and a unique ID.
   *
   * @param componentId - Component ID (e.g., 'button')
   * @param eventName - Event name (e.g., 'onClick')
   * @param payload - Event payload (can be any value)
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

  /**
   * Clears all event logs.
   * Used when "Clear" button is clicked.
   */
  clearLogs(): void {
    this.logs.set([]);
  }

  /**
   * Retrieves the last N logs.
   * Prevents displaying too many logs for performance.
   *
   * @param count - Number of logs to display
   * @returns Last N logs
   */
  getRecentLogs(count: number): IEventLog[] {
    return this.logs().slice(0, count);
  }

  /**
   * Generates a unique log ID.
   * Combination of timestamp + random number.
   *
   * @returns Unique log ID
   */
  private generateLogId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sanitizes the event payload.
   * Makes it safe for circular references and large objects.
   *
   * @param payload - Raw payload
   * @returns Sanitized payload
   */
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
