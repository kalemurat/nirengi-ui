import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { ToastComponent } from '../toast/toast.component';
import { ToastContainerComponent } from '../toast/toast-container.component';
import { TOAST } from '../toast/toast.token';
import { ToastService } from '../toast/toast.service';
import { ToastData, ToastVariant } from '../toast/toast.types';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Demo component for Toast notifications.
 * Demonstrates the usage of ToastService via TOAST token.
 * Also provides a static preview for showcase.
 */
@Component({
  selector: 'nui-toast-demo',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ToastComponent, ToastContainerComponent],
  providers: [{ provide: TOAST, useExisting: ToastService }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-8">
      <!-- Container for floating toasts -->
      <nui-toast-container />

      <!-- Static Preview Section -->
      <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-6">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
          Static Preview
        </h3>
        <nui-toast [data]="previewData()" (onClose)="onPreviewClose()" />
      </div>

      <!-- Interactive Demo Section -->
      <div class="flex flex-col gap-6">
        <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-900">
          Interactive Demo
        </h3>

        <div class="flex flex-wrap gap-4">
          <nui-button
            [size]="Size.Small"
            [variant]="ColorVariant.Success"
            (clicked)="showSuccess()"
          >
            Success Toast
          </nui-button>

          <nui-button [size]="Size.Small" [variant]="ColorVariant.Danger" (clicked)="showError()">
            Error Toast
          </nui-button>

          <nui-button
            [size]="Size.Small"
            [variant]="ColorVariant.Warning"
            (clicked)="showWarning()"
          >
            Warning Toast
          </nui-button>

          <nui-button [size]="Size.Small" [variant]="ColorVariant.Info" (clicked)="showInfo()">
            Info Toast
          </nui-button>
        </div>

        <div class="flex flex-wrap gap-4">
          <nui-button
            [size]="Size.Small"
            [variant]="ColorVariant.Neutral"
            (clicked)="showLongToast()"
          >
            Long Duration (10s)
          </nui-button>

          <nui-button
            [size]="Size.Small"
            [variant]="ColorVariant.Secondary"
            (clicked)="showTopLeft()"
          >
            Top Left Position
          </nui-button>
        </div>
      </div>
    </div>
  `,
})
export class ToastDemoComponent {
  // Inputs for Showcase
  title = input<string>('Toast Title');
  description = input<string>('Toast Description');
  variant = input<ToastVariant>(ToastVariant.Success);

  // Expose enums to template
  readonly Size = Size;
  readonly ColorVariant = ColorVariant;

  private toast = inject(TOAST);

  previewData = computed<ToastData>(() => ({
    id: 'preview',
    title: this.title(),
    description: this.description(),
    variant: this.variant(),
    options: { duration: 0 }, // Disable auto-close for preview
  }));

  onPreviewClose() {
    // For preview, we might just ignore or maybe show a console log
    console.log('Preview toast closed clicked');
  }

  showSuccess() {
    this.toast.success({
      title: 'Success',
      description: 'Your changes have been saved successfully.',
    });
  }

  showError() {
    this.toast.error({
      title: 'Error Occurred',
      description: 'Failed to process your request. Please try again.',
    });
  }

  showWarning() {
    this.toast.warning({
      title: 'Attention Needed',
      description: 'Your subscription is about to expire.',
    });
  }

  showInfo() {
    this.toast.info({
      title: 'New Update',
      description: 'A new version of the application is available.',
    });
  }

  showLongToast() {
    this.toast.info({
      title: 'Long Toast',
      description: 'This toast will stay for 10 seconds.',
      options: { duration: 10000 },
    });
  }

  showTopLeft() {
    this.toast.success({
      title: 'Positioned Toast',
      description: 'This toast appears in the top-left corner.',
      options: { position: 'top-left' },
    });
  }
}
