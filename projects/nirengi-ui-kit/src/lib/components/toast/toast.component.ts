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
          @apply text-sm font-semibold leading-5 text-gray-900;
        }

        &__description {
          @apply mt-1 text-sm leading-relaxed text-gray-500;
        }

        &__close {
          @apply -mr-2 -mt-1 rounded-md p-1 text-gray-400 transition-colors hover:bg-black/5 hover:text-gray-600;
        }

        &--success {
          @apply border-green-300 bg-green-100 dark:border-green-800 dark:bg-green-900;
          .nui-toast__icon {
            @apply text-green-500 dark:text-green-400;
          }
          .nui-toast__title {
            @apply text-green-900 dark:text-green-100;
          }
          .nui-toast__description {
            @apply text-green-800 dark:text-green-300;
          }
          .nui-toast__close {
            @apply text-green-500 hover:bg-green-200/50 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-800/50 dark:hover:text-green-200;
          }
        }

        &--error {
          @apply border-red-300 bg-red-100 dark:border-red-800 dark:bg-red-900;
          .nui-toast__icon {
            @apply text-red-500 dark:text-red-400;
          }
          .nui-toast__title {
            @apply text-red-900 dark:text-red-100;
          }
          .nui-toast__description {
            @apply text-red-800 dark:text-red-300;
          }
          .nui-toast__close {
            @apply text-red-500 hover:bg-red-200/50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-800/50 dark:hover:text-red-200;
          }
        }

        &--warning {
          @apply border-yellow-300 bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-900;
          .nui-toast__icon {
            @apply text-yellow-500 dark:text-yellow-400;
          }
          .nui-toast__title {
            @apply text-yellow-900 dark:text-yellow-100;
          }
          .nui-toast__description {
            @apply text-yellow-800 dark:text-yellow-300;
          }
          .nui-toast__close {
            @apply text-yellow-500 hover:bg-yellow-200/50 hover:text-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-800/50 dark:hover:text-yellow-200;
          }
        }

        &--info {
          @apply border-blue-300 bg-blue-100 dark:border-blue-800 dark:bg-blue-900;
          .nui-toast__icon {
            @apply text-blue-500 dark:text-blue-400;
          }
          .nui-toast__title {
            @apply text-blue-900 dark:text-blue-100;
          }
          .nui-toast__description {
            @apply text-blue-800 dark:text-blue-300;
          }
          .nui-toast__close {
            @apply text-blue-500 hover:bg-blue-200/50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-800/50 dark:hover:text-blue-200;
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
