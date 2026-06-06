import {
  Component,
  input,
  ChangeDetectionStrategy,
  computed,
  inject,
  HostListener,
  Type,
  TemplateRef,
  effect,
} from '@angular/core';
import { CommonModule, NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { IModalData, ModalSize } from './modal.types';
import { MODAL_SERVICE } from './modal.token';
import { HeadingComponent, HeadingLevel, HeadingWeight } from '../heading/heading.component';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent, ButtonType } from '../button/button.component';
import { ColorVariant } from '../../common/enums/color-variant.enum';
import { Size } from '../../common/enums/size.enum';

/**
 * Handles closing via backdrop click or ESC key.
 *
 * @example
 * <nui-modal [data]="modalData" />
 */
@Component({
  selector: 'nui-modal',
  standalone: true,
  imports: [
    CommonModule,
    NgComponentOutlet,
    NgTemplateOutlet,
    HeadingComponent,
    IconComponent,
    ButtonComponent,
  ],
  template: `
    <div class="nui-modal" [attr.role]="'dialog'" [attr.aria-modal]="true">
      <!-- Backdrop: decorative click target; keyboard users dismiss via the ESC key (handled on the host). -->
      <div class="nui-modal__backdrop" aria-hidden="true" (click)="onBackdropClick()"></div>

      <!-- Modal Panel -->
      <div [class]="'nui-modal__panel ' + sizeClasses()">
        <!-- Header if title or icon exists -->
        @if (data().options.title || data().options.icon) {
          <div class="nui-modal__header">
            <div class="flex items-center gap-3">
              @if (data().options.icon) {
                <nui-icon [name]="data().options.icon!" class="text-tertiary" />
              }
              @if (data().options.title) {
                <nui-heading
                  [level]="HeadingLevel.H3"
                  [weight]="HeadingWeight.Semibold"
                  [text]="data().options.title!"
                ></nui-heading>
              }
            </div>

            <nui-button
              [kind]="ButtonType.Ghost"
              [variant]="ColorVariant.Neutral"
              [size]="Size.Small"
              (clicked)="close()"
            >
              <nui-icon name="X" size="18" />
            </nui-button>
          </div>
        }

        <!-- Dynamic Content -->
        <div class="nui-modal__content">
          <ng-container
            *ngComponentOutlet="componentContent; injector: data().injector"
          ></ng-container>
          <ng-container
            [ngTemplateOutlet]="templateContent"
            [ngTemplateOutletContext]="{ $implicit: data().options.data, modalRef: null }"
          ></ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .nui-modal {
        @apply fixed inset-0 z-[50] flex items-center justify-center overflow-y-auto overflow-x-hidden p-4;
      }

      .nui-modal__backdrop {
        @apply fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity duration-300;
      }

      .nui-modal__panel {
        @apply relative flex max-h-[90vh] w-full transform flex-col overflow-hidden rounded-2xl bg-primary shadow-2xl transition-all;
      }

      .nui-modal__panel.sm {
        @apply max-w-sm;
      }

      .nui-modal__panel.md {
        @apply max-w-lg;
      }

      .nui-modal__panel.lg {
        @apply max-w-4xl;
      }

      .nui-modal__panel.full {
        @apply m-4 h-full max-w-full;
      }

      .nui-modal__header {
        @apply flex items-center justify-between border-b border-subtle px-6 py-4;
      }

      .nui-modal__content {
        @apply flex-1 overflow-y-auto p-6;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  readonly data = input.required<IModalData>();

  private modalService = inject(MODAL_SERVICE);
  HeadingLevel = HeadingLevel;
  HeadingWeight = HeadingWeight;
  ColorVariant = ColorVariant;
  ButtonType = ButtonType;
  Size = Size;

  protected readonly sizeClasses = computed(() => {
    const size = this.data().options.size || ModalSize.Medium;
    switch (size) {
      case ModalSize.Small:
        return 'sm';
      case ModalSize.Large:
        return 'lg';
      case ModalSize.Full:
        return 'full';
      case ModalSize.Medium:
      default:
        return 'md';
    }
  });

  constructor() {
    // Manage body scroll lock based on modal stack count
    effect(() => {
      const modalCount = this.modalService.modals().length;
      if (modalCount > 0) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  protected get componentContent(): Type<unknown> | null {
    const c = this.data().content;
    // Check if it is a class/function (Component)
    return typeof c === 'function' ? (c as Type<unknown>) : null;
  }

  protected get templateContent(): TemplateRef<unknown> | null {
    const c = this.data().content;
    // Check if it is a TemplateRef
    return c instanceof TemplateRef ? c : null;
  }

  onBackdropClick(): void {
    if (this.data().options.backdropClose !== false) {
      this.close();
    }
  }

  /** Only closes if this is the top-most modal in the stack. */
  @HostListener('document:keydown.escape')
  onEscKey(): void {
    if (this.data().options.escClose !== false) {
      // Only the top-most modal in the stack should respond to ESC
      this.modalService.closeTopmost();
    }
  }

  close(): void {
    this.modalService.close(this.data().id);
  }
}
