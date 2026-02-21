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
import { ModalData, ModalSize } from './modal.types';
import { MODAL_SERVICE } from './modal.token';
import { HeadingComponent, HeadingLevel, HeadingWeight } from '../heading/heading.component';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent, ButtonType } from '../button/button.component';
import { ColorVariant } from '../../common/enums/color-variant.enum';
import { Size } from '../../common/enums/size.enum';

/**
 * Modal Wrapper Component.
 * Renders the backdrop and the modal container.
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
      <!-- Backdrop -->
      <div class="nui-modal__backdrop" (click)="onBackdropClick()"></div>

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

        &__backdrop {
          @apply fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity duration-300;
        }

        &__panel {
          @apply relative flex max-h-[90vh] w-full transform flex-col overflow-hidden rounded-2xl bg-primary shadow-2xl transition-all;

          &--sm {
            @apply max-w-sm;
          }
          &--md {
            @apply max-w-lg;
          }
          &--lg {
            @apply max-w-4xl;
          }
          &--full {
            @apply m-4 h-full max-w-full;
          }
        }

        &__header {
          @apply flex items-center justify-between border-b border-subtle px-6 py-4;
        }

        &__content {
          @apply flex-1 overflow-y-auto p-6;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  /**
   * The modal configuration data.
   */
  readonly data = input.required<ModalData>({
    alias: 'data',
  });

  private modalService = inject(MODAL_SERVICE);
  HeadingLevel = HeadingLevel;
  HeadingWeight = HeadingWeight;
  ColorVariant = ColorVariant;
  ButtonType = ButtonType;
  Size = Size;

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

  /**
   * Gets the component content from the modal data.
   * Returns the content if it's a class/function (Component type).
   *
   * @returns Component type or null if content is a template
   */
  protected get componentContent(): Type<unknown> | null {
    const c = this.data().content;
    // Check if it is a class/function (Component)
    return typeof c === 'function' ? (c as Type<unknown>) : null;
  }

  /**
   * Gets the template content from the modal data.
   * Returns the content if it's a TemplateRef.
   *
   * @returns TemplateRef or null if content is a component
   */
  protected get templateContent(): TemplateRef<unknown> | null {
    const c = this.data().content;
    // Check if it is a TemplateRef
    return c instanceof TemplateRef ? c : null;
  }

  protected readonly sizeClasses = computed(() => {
    const size = this.data().options.size || ModalSize.Medium;
    switch (size) {
      case ModalSize.Small:
        return 'nui-modal__panel--sm';
      case ModalSize.Large:
        return 'nui-modal__panel--lg';
      case ModalSize.Full:
        return 'nui-modal__panel--full';
      case ModalSize.Medium:
      default:
        return 'nui-modal__panel--md';
    }
  });

  /**
   * Handles backdrop click to close the modal.
   * Respects the backdropClose option from modal configuration.
   */
  onBackdropClick(): void {
    if (this.data().options.backdropClose !== false) {
      this.close();
    }
  }

  /**
   * Handles ESC key press to close the modal.
   * Only closes if the modal is the top-most modal in the stack.
   * Respects the escClose option from modal configuration.
   */
  @HostListener('document:keydown.escape')
  onEscKey(): void {
    if (this.data().options.escClose !== false) {
      // Only the top-most modal in the stack should respond to ESC
      this.modalService.closeTopmost();
    }
  }

  /**
   * Closes the modal and resets body overflow when all modals are closed.
   */
  close(): void {
    this.modalService.close(this.data().id);
  }
}
