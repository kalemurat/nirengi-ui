import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventLoggerService } from '../../../core/services/event-logger.service';

@Component({
  selector: 'app-event-console',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-console.component.html',
  styleUrl: './event-console.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventConsoleComponent {
  protected readonly eventLogger = inject(EventLoggerService);

  protected readonly eventLogs = this.eventLogger.eventLogs;

  protected readonly maxLogs = computed(() => this.eventLogger.getRecentLogs(50));

  clearLogs(): void {
    this.eventLogger.clearLogs();
  }
}
