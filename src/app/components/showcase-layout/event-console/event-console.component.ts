import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventLoggerService } from '../../../core/services/event-logger.service';

/**
 * Event Console Component.
 * Displays component events in a terminal-style interface with timestamps.
 *
 * ## Features
 * - ✅ Terminal appearance (dark background, green text)
 * - ✅ Timestamp formatting
 * - ✅ JSON payload visualization
 * - ✅ Clear logs functionality
 *
 * @see {@link EventLoggerService}
 */
@Component({
  selector: 'app-event-console',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-console.component.html',
  styleUrl: './event-console.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventConsoleComponent {
  /**
   * Event logger service instance.
   * Provides event logging functionality.
   * Protected to allow derived fields to access it while maintaining encapsulation.
   */
  protected readonly eventLogger = inject(EventLoggerService);

  /**
   * Reactive signal for event logs.
   * Automatically updates when new events are logged.
   */
  protected readonly eventLogs = this.eventLogger.eventLogs;

  /**
   * Computed signal for recent logs with limit.
   * Returns the most recent 50 logs for performance optimization.
   */
  protected readonly maxLogs = computed(() => this.eventLogger.getRecentLogs(50));

  /**
   * Clears all logged events.
   * Invokes the event logger service to remove all event entries.
   */
  clearLogs(): void {
    this.eventLogger.clearLogs();
  }
}
