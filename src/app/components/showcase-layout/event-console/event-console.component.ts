import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventLoggerService } from '../../../core/services/event-logger.service';

/**
 * Event Console Component.
 * Terminal-style event logger UI.
 * Component event'lerini timestamp ile gösterir.
 * 
 * ## Özellikler
 * - ✅ Terminal görünüm (siyah background, yeşil text)
 * - ✅ Timestamp format
 * - ✅ JSON payload gösterimi
 * - ✅ Clear logs özelliği
 * 
 * @see {@link EventLoggerService}
 */
@Component({
  selector: 'app-event-console',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-console.component.html',
  styleUrl: './event-console.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventConsoleComponent {
  /**
   * Event logger servisini inject eder.
   */
  private readonly eventLogger = inject(EventLoggerService);

  /**
   * Event loglarının computed signal'i.
   * Service'den otomatik olarak güncellenir.
   */
  protected readonly eventLogs = this.eventLogger.eventLogs;

  /**
   * Gösterilecek maksimum log sayısı.
   * Performance için sınırlandırılır.
   */
  protected readonly maxLogs = computed(() => 
    this.eventLogger.getRecentLogs(50)
  );

  /**
   * Tüm logları temizler.
   */
  clearLogs(): void {
    this.eventLogger.clearLogs();
  }
}
