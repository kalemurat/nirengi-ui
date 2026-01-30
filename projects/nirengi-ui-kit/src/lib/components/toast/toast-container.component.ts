import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { ToastComponent } from './toast.component';

/**
 * Toast container component.
 * Renders toast notifications in valid positions.
 * Should be placed once in the application root.
 */
@Component({
  selector: 'nui-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Top Right -->
    <div class="nui-toast-region nui-toast-region--top-right">
      @for (toast of topRight(); track toast.id) {
        <nui-toast [data]="toast" (onClose)="remove($event)" />
      }
    </div>

    <!-- Top Left -->
    <div class="nui-toast-region nui-toast-region--top-left">
      @for (toast of topLeft(); track toast.id) {
        <nui-toast [data]="toast" (onClose)="remove($event)" />
      }
    </div>

    <!-- Bottom Right -->
    <div class="nui-toast-region nui-toast-region--bottom-right">
      @for (toast of bottomRight(); track toast.id) {
        <nui-toast [data]="toast" (onClose)="remove($event)" />
      }
    </div>

    <!-- Bottom Left -->
    <div class="nui-toast-region nui-toast-region--bottom-left">
      @for (toast of bottomLeft(); track toast.id) {
        <nui-toast [data]="toast" (onClose)="remove($event)" />
      }
    </div>
  `,
  styles: [`
    .nui-toast-region {
      @apply fixed flex flex-col gap-3 p-4 pointer-events-none z-[9999];
      max-width: 100vw;
      width: auto;

      &--top-right { @apply top-0 right-0 items-end; }
      &--top-left { @apply top-0 left-0 items-start; }
      &--bottom-right { @apply bottom-0 right-0 items-end flex-col-reverse; }
      &--bottom-left { @apply bottom-0 left-0 items-start flex-col-reverse; }
    }
  `]
})
export class ToastContainerComponent {
  private service = inject(ToastService);

  topRight = computed(() => this.service.toasts().filter(t => t.options.position === 'top-right'));
  topLeft = computed(() => this.service.toasts().filter(t => t.options.position === 'top-left'));
  bottomRight = computed(() => this.service.toasts().filter(t => t.options.position === 'bottom-right'));
  bottomLeft = computed(() => this.service.toasts().filter(t => t.options.position === 'bottom-left'));

  remove(id: string): void {
    this.service.remove(id);
  }
}
