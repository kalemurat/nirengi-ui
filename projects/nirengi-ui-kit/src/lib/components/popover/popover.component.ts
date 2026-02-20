import { Component, ChangeDetectionStrategy, input, Type, computed, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverPosition } from './popover.types';
import { PopoverRef } from './popover.ref';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'nirengi-popover',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div [class]="containerClasses()">
      <button class="popover__close" (click)="closePopover()" title="Kapat">
        <nui-icon name="X" [size]="16"></nui-icon>
      </button>
      <div class="popover__content">
        <ng-container
          *ngComponentOutlet="content(); injector: injector(); inputs: componentInputs()"
        ></ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .popover {
        /* Base popover style */
        @apply z-50 min-w-[200px] scale-95 rounded-lg border border-default bg-primary p-4 opacity-0 shadow-xl transition-all duration-200;

        /* Visibility control */
        &--visible {
          @apply scale-100 opacity-100;
        }

        /* Content area */
        &__content {
          @apply flex flex-col;
        }

        /* Close button */
        &__close {
          @apply absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md text-secondary transition-colors hover:bg-secondary-50 hover:text-primary;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent {
  /** Content component to be displayed. */
  readonly content = input.required<Type<any>>();

  /** Inputs to be passed to the content component. */
  readonly componentInputs = input<Record<string, unknown>>({});

  /** Injector for the content component. */
  readonly injector = input<Injector>();

  /** Popover position. */
  readonly position = input<PopoverPosition>(PopoverPosition.Bottom);

  /** Visibility state. */
  readonly visible = input<boolean>(false);

  /** Computed signal for the container classes. */
  readonly containerClasses = computed(() => {
    const baseClass = 'popover';
    const positionClass = `popover--${this.position()}`;
    const visibleClass = this.visible() ? 'popover--visible' : '';

    return `${baseClass} ${positionClass} ${visibleClass}`;
  });

  /** Closes the popover by getting PopoverRef from the injector. */
  closePopover(): void {
    const ref = this.injector()?.get(PopoverRef, null);
    if (ref) {
      ref.close();
    }
  }
}
