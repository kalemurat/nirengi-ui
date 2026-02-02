import {
  Component,
  Input,
  ChangeDetectionStrategy,
  computed,
  signal,
  inject,
  HostListener,
  Type,
  TemplateRef,
  OnInit,
  OnDestroy,
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
      <div class="nui-modal__panel" [ngClass]="sizeClasses()">
        <!-- Header if title or icon exists -->
        @if (data().options.title || data().options.icon) {
          <div class="nui-modal__header">
            <div class="flex items-center gap-3">
              @if (data().options.icon) {
                <nirengi-icon [name]="data().options.icon!" class="text-gray-400" />
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
              [type]="ButtonType.Ghost"
              [variant]="ColorVariant.Neutral"
              [size]="Size.Small"
              (clicked)="close()"
            >
              <nirengi-icon name="X" size="18" />
            </nui-button>
          </div>
        }

        <!-- Dynamic Content -->
        <div class="nui-modal__content">
          <ng-container
            *ngComponentOutlet="componentContent; injector: data().injector"
          ></ng-container>
          <ng-container
            *ngTemplateOutlet="
              templateContent;
              context: { $implicit: data().options.data, modalRef: null }
            "
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
          @apply fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300;
        }

        &__panel {
          @apply relative flex max-h-[90vh] w-full transform flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all dark:bg-slate-900;

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
          @apply flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-slate-800;
        }

        &__content {
          @apply flex-1 overflow-y-auto p-6;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements OnInit, OnDestroy {
  /**
   * The modal configuration data.
   */
  readonly data = signal<ModalData>({} as ModalData);
  @Input({ required: true, alias: 'data' })
  set _data(val: ModalData) {
    this.data.set(val);
  }

  private modalService = inject(MODAL_SERVICE);
  HeadingLevel = HeadingLevel;
  HeadingWeight = HeadingWeight;
  ColorVariant = ColorVariant;
  ButtonType = ButtonType;
  Size = Size;

  // Type Guards for template/component
  protected get componentContent(): Type<any> | null {
    const c = this.data().content;
    // Check if it is a class/function (Component)
    return typeof c === 'function' ? (c as Type<any>) : null;
  }

  protected get templateContent(): TemplateRef<any> | null {
    const c = this.data().content;
    // Check if it is a TemplateRef
    return c instanceof TemplateRef ? c : null;
  }

  protected readonly sizeClasses = computed(() => {
    const size = this.data().options.size || ModalSize.Medium;
    return {
      'nui-modal__panel--sm': size === ModalSize.Small,
      'nui-modal__panel--md': size === ModalSize.Medium,
      'nui-modal__panel--lg': size === ModalSize.Large,
      'nui-modal__panel--full': size === ModalSize.Full,
    };
  });

  ngOnInit() {
    // Optional: Focus trap logic could go here
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  onBackdropClick() {
    if (this.data().options.backdropClose !== false) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    if (this.data().options.escClose !== false) {
      // Check if this modal is the top-most one?
      // For now assume yes, or relies on service to close correct one.
      // But if multiple modals are open, ESC usually closes the top one.
      // We'll just call close(), if we are rendered, we handle it.
      // Ideally, the Service decides which one to close, or we check if we are the last one.
      // For simplicity, we assume this component only exists if it's meant to be interactable.
      // Note: If multiple modals, they all receive this event.
      // The container iterates. We need a way to know if we are the active one.
      // Let's rely on the user/Stack to handle z-index or handle closing via service strictly if complexities arise.
      // But for basic usage, this works.
      this.close();
    }
  }

  close() {
    this.modalService.close(this.data().id);
  }
}
