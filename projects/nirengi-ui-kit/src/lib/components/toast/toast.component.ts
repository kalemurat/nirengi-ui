import { Component, ChangeDetectionStrategy, input, output, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { ToastData, ToastVariant } from './toast.types';
import { IconName } from '../icon/icon.types';

/**
 * Toast notification component.
 * Displays a single toast message.
 *
 * @example
 * <nui-toast [data]="toastData" (onClose)="remove($event)" />
 */
@Component({
  selector: 'nui-toast',
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()" role="alert">
      <div class="nui-toast__icon">
        <nirengi-icon [name]="iconName()" size="20" />
      </div>
      <div class="nui-toast__content">
        <h4 class="nui-toast__title">{{ data().title }}</h4>
        @if (data().description) {
          <p class="nui-toast__description">{{ data().description }}</p>
        }
      </div>
      <button class="nui-toast__close" (click)="onClose.emit(data().id)" aria-label="Close">
        <nirengi-icon name="X" size="16" />
      </button>
    </div>
  `,
  styles: [
    `
      .nui-toast {
        @apply pointer-events-auto flex min-w-[320px] max-w-sm items-start gap-3 rounded-lg border border-transparent p-4 shadow-lg transition-all duration-300;

        &__content {
          @apply flex-1 pt-0.5;
        }

        &__title {
          @apply text-sm font-semibold leading-5 text-primary;
        }

        &__description {
          @apply mt-1 text-sm leading-relaxed text-secondary;
        }

        &__close {
          @apply -mr-2 -mt-1 rounded-md p-1 text-tertiary transition-colors hover:bg-neutral-900/5 hover:text-primary;
        }

        &--success {
          @apply border-success-300 bg-success-100 dark:border-success-800 dark:bg-success-900;
          .nui-toast__icon {
            @apply text-success-500 dark:text-success-400;
          }
          .nui-toast__title {
            @apply text-success-900 dark:text-success-100;
          }
          .nui-toast__description {
            @apply text-success-800 dark:text-success-300;
          }
          .nui-toast__close {
            @apply text-success-500 hover:bg-success-200/50 hover:text-success-700 dark:text-success-400 dark:hover:bg-success-800/50 dark:hover:text-success-200;
          }
        }

        &--error {
          @apply border-danger-300 bg-danger-100 dark:border-danger-800 dark:bg-danger-900;
          .nui-toast__icon {
            @apply text-danger-500 dark:text-danger-400;
          }
          .nui-toast__title {
            @apply text-danger-900 dark:text-danger-100;
          }
          .nui-toast__description {
            @apply text-danger-800 dark:text-danger-300;
          }
          .nui-toast__close {
            @apply text-danger-500 hover:bg-danger-200/50 hover:text-danger-700 dark:text-danger-400 dark:hover:bg-danger-800/50 dark:hover:text-danger-200;
          }
        }

        &--warning {
          @apply border-warning-300 bg-warning-100 dark:border-warning-800 dark:bg-warning-900;
          .nui-toast__icon {
            @apply text-warning-500 dark:text-warning-400;
          }
          .nui-toast__title {
            @apply text-warning-900 dark:text-warning-100;
          }
          .nui-toast__description {
            @apply text-warning-800 dark:text-warning-300;
          }
          .nui-toast__close {
            @apply text-warning-500 hover:bg-warning-200/50 hover:text-warning-700 dark:text-warning-400 dark:hover:bg-warning-800/50 dark:hover:text-warning-200;
          }
        }

        &--info {
          @apply border-info-300 bg-info-100 dark:border-info-800 dark:bg-info-900;
          .nui-toast__icon {
            @apply text-info-500 dark:text-info-400;
          }
          .nui-toast__title {
            @apply text-info-900 dark:text-info-100;
          }
          .nui-toast__description {
            @apply text-info-800 dark:text-info-300;
          }
          .nui-toast__close {
            @apply text-info-500 hover:bg-info-200/50 hover:text-info-700 dark:text-info-400 dark:hover:bg-info-800/50 dark:hover:text-info-200;
          }
        }
      }
    `,
  ],
})
export class ToastComponent {
  data = input.required<ToastData>();
  onClose = output<string>();

  iconName = computed<IconName>(() => {
    switch (this.data().variant) {
      case ToastVariant.Success:
        return 'Check';
      case ToastVariant.Error:
        return 'CircleAlert';
      case ToastVariant.Warning:
        return 'TriangleAlert';
      case ToastVariant.Info:
        return 'Info';
      default:
        return 'Info';
    }
  });

  containerClasses = computed(() => {
    // Note: Assuming 'nui-toast' prefix for BEM
    return `nui-toast nui-toast--${this.data().variant}`;
  });

  constructor() {
    effect((onCleanup) => {
      const duration = this.data().options.duration ?? 3000;
      if (duration > 0) {
        const timer = setTimeout(() => {
          this.onClose.emit(this.data().id);
        }, duration);
        onCleanup(() => clearTimeout(timer));
      }
    });
  }
}
